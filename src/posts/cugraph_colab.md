---
display: home
title: 'Google ColaboratoryでNetwoksXのGPU適用版であるcuGraphを実装する'
description: Google ColaboratoryでNetwoksXのGPU適用版であるcuGraphを実装します．
date: 2023-3-21
image: https://www.hamlet-engineer.com/image/cugraph.jpeg
categories: 
  - Python
tags:
  - memo
  - Python
  - NetworkX
  - Pandas
  - cuGraph
  - Colaboratory
  - GoogleColaboratory
---
Google ColaboratoryでNetwoksXのGPU適用版であるcuGraphを実装します．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## GPUの確認
「Tesla T4, P4, or P100」であれば、OKです。

```python
!nvidia-smi
```

## cuGraphのインストール
複雑なライブラリですので、いくつかの段階に分かれています。

### 環境の確認
下記のコードで、インストールできる環境か確認します。
```python
!pip install pynvml
!git clone https://github.com/rapidsai/rapidsai-csp-utils.git
!python rapidsai-csp-utils/colab/env-check.py
# ***********************************************************************
# Woo! Your instance has the right kind of GPU, a Tesla T4!
# ***********************************************************************
```

### gccのアップデート
下記のコードで、gccをアップデートします。

ただし、実行後にセッションをクラッシュさせますので、次のセルはまだ実行しないでください。
```python
!bash rapidsai-csp-utils/colab/update_gcc.sh
import os
os._exit(00)
# ***********************************************************************
# Woo! Your instance has the right kind of GPU, a Tesla T4!
# ***********************************************************************
```

### condaのインストール
下記のコードで、condaをインストールします。

ただし、実行後にセッションを再起動させますので、次のセルはまだ実行しないでください。
```python
import condacolab
condacolab.install()
#  Restarting kernel...
```

下記のコードで、condaを確認します。
```python
# condaの確認
import condacolab
condacolab.check()
# Everything looks OK!
```

### インストールの実行
下記のコードで、cuGraphなどのインストールを実行します。

ただし、20分以上かかります。

```python
!python rapidsai-csp-utils/colab/install_rapids.py stable
import os
os.environ['NUMBAPRO_NVVM'] = '/usr/local/cuda/nvvm/lib64/libnvvm.so'
os.environ['NUMBAPRO_LIBDEVICE'] = '/usr/local/cuda/nvvm/libdevice/'
os.environ['CONDA_PREFIX'] = '/usr/local'

# 追記(2022/7/13)
!pip install cffi==1.15.1
```


## 速度比較

### データの用意
```python
!git clone https://github.com/rapidsai/cugraph.git cugraph_test
%cd ./cugraph_test/notebooks/cugraph_benchmarks/
!sh ./dataPrep.sh
```

### 実行の前処理
```python
import gc
import time
import rmm
import cugraph
import cudf

# NetworkX libraries
import networkx as nx
from scipy.io import mmread

try: 
    import matplotlib
except ModuleNotFoundError:
    os.system('pip install matplotlib')

import matplotlib.pyplot as plt; plt.rcdefaults()
import numpy as np
```

```python
# データ集
data = {
    'preferentialAttachment' : './data/preferentialAttachment.mtx',
    'caidaRouterLevel'       : './data/caidaRouterLevel.mtx',
    'coAuthorsDBLP'          : './data/coAuthorsDBLP.mtx',
    'dblp'                   : './data/dblp-2010.mtx',
    'citationCiteseer'       : './data/citationCiteseer.mtx',
    'coPapersDBLP'           : './data/coPapersDBLP.mtx',
    'coPapersCiteseer'       : './data/coPapersCiteseer.mtx',
    'as-Skitter'             : './data/as-Skitter.mtx'
}
```

```python
# 読み込み
def read_mtx_file(mm_file):
    print('Reading ' + str(mm_file) + '...')
    M = mmread(mm_file).asfptype()
     
    return M

# cugraphでの処理
def cugraph_call(M):
    gdf = cudf.DataFrame()
    gdf['src'] = M.row
    gdf['dst'] = M.col
    
    print('\tcuGraph Solving... ')
    
    t1 = time.time()
        
    # cugraph Pagerank Call
    G = cugraph.DiGraph()
    G.from_cudf_edgelist(gdf, source='src', destination='dst', renumber=False)
    
    df = cugraph.bfs(G, 1)
    t2 = time.time() - t1
    
    return t2

# networkxの処理
def networkx_call(M):
    nnz_per_row = {r: 0 for r in range(M.get_shape()[0])}
    for nnz in range(M.getnnz()):
        nnz_per_row[M.row[nnz]] = 1 + nnz_per_row[M.row[nnz]]
    for nnz in range(M.getnnz()):
        M.data[nnz] = 1.0/float(nnz_per_row[M.row[nnz]])

    M = M.tocsr()
    if M is None:
        raise TypeError('Could not read the input graph')
    if M.shape[0] != M.shape[1]:
        raise TypeError('Shape is not square')

    # should be autosorted, but check just to make sure
    if not M.has_sorted_indices:
        print('sort_indices ... ')
        M.sort_indices()

    z = {k: 1.0/M.shape[0] for k in range(M.shape[0])}
        
    print('\tNetworkX Solving... ')
        
    # start timer
    t1 = time.time()
    
    Gnx = nx.DiGraph(M)

    pr = nx.bfs_edges(Gnx, 1)
    
    t2 = time.time() - t1

    return t2
```

### 速度比較の実行
速度比較より、cuGraphの方が早いことがわかる。
```python
# arrays to capture performance gains
perf_nx = []
names = []
time_cu = []
time_nx = []

# do a simple pass just to get all the libraries initiallized
v = './data/preferentialAttachment.mtx'
M = read_mtx_file(v)
trapids = cugraph_call(M)
del M

for k,v in data.items():
    gc.collect()

    # Saved the file Name
    names.append(k)
    
    # read the data
    M = read_mtx_file(v)
    
    
    # call cuGraph - this will be the baseline
    trapids = cugraph_call(M)
    
    # Now call NetworkX
    tn = networkx_call(M)
    speedUp = (tn / trapids)
    perf_nx.append(speedUp)
    time_cu.append(trapids)
    time_nx.append(tn)
    del M
    
    print("\tcuGraph (" + str(trapids) + ")  Nx (" + str(tn) + ")" )

# Reading ./data/preferentialAttachment.mtx...
# 	cuGraph Solving... 
# Reading ./data/preferentialAttachment.mtx...
# 	cuGraph Solving... 
# 	NetworkX Solving... 
# 	cuGraph (0.1193091869354248)  Nx (6.346121072769165)
# Reading ./data/caidaRouterLevel.mtx...
# 	cuGraph Solving... 
# 	NetworkX Solving... 
# 	cuGraph (0.2835068702697754)  Nx (8.1973876953125)
# Reading ./data/coAuthorsDBLP.mtx...
# 	cuGraph Solving... 
# 	NetworkX Solving... 
# 	cuGraph (0.393646240234375)  Nx (12.876920938491821)
# Reading ./data/dblp-2010.mtx...
# 	cuGraph Solving... 
# 	NetworkX Solving... 
# 	cuGraph (0.38054418563842773)  Nx (9.99734354019165)
# Reading ./data/citationCiteseer.mtx...
# 	cuGraph Solving... 
# 	NetworkX Solving... 
# 	cuGraph (0.35051751136779785)  Nx (15.769287109375)
```




## まとめ
Google ColaboratoryでNetwoksXのGPU適用版であるcuGraphを実装しました．

## 参考サイト
[rapidsai/cugraph](https://github.com/rapidsai/cugraph)<br>
[rapidsai-community/rapidsai-csp-utils](https://github.com/rapidsai-community/rapidsai-csp-utils)<br>
[python3f/cugraph-learn.ipynb](https://colab.research.google.com/drive/1UX18VehsMOMvv-1_Xo4uYUmqAs7STW5E?usp=sharing)<br>
[rapids-colab.ipynb - Colaboratory](https://colab.research.google.com/drive/1rY7Ln6rEE1pOlfSHCYOVaqt8OvDO35J0)<br>
[NVIDIAのRAPIDSでcuML, cuDF, cuGraphを試してみる](https://qiita.com/hironobukawaguchi3/items/7c65ed93cec2ed97d60d)<br>
[cugraph.Graph.from_cudf_edgelist](https://docs.rapids.ai/api/cugraph/stable/api_docs/api/cugraph.Graph.from_cudf_edgelist.html)<br>
[cugraph.sssp](https://docs.rapids.ai/api/cugraph/nightly/api_docs/api/cugraph.sssp.html)<br>
[Graph Algorithms on Steroids for data Scientists with cuGraph](https://towardsdatascience.com/4-graph-algorithms-on-steroids-for-data-scientists-with-cugraph-43d784de8d0e)<br>
[NetworkXのグラフを可視化するときに頂点の座標を指定する](https://analytics-note.xyz/graph-theory/networkx-draw-pos/)<br>
[cuGraph でページランクを計算したら爆速だった](https://acro-engineer.hatenablog.com/entry/2021/05/21/120000)<br>

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


