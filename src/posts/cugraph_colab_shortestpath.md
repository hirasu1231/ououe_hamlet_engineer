---
display: home
title: 'Google Colaboratory + cuGraphで最短経路探索を実装する'
description: Google Colaboratory + cuGraphで最短経路探索を実装します．
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
Google Colaboratory + cuGraphで最短経路探索を実装します．

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

## condaのインストール
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

### インストールの実行
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

### cuGraphのインストール
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


## 最短経路探索

### データの用意
```python
!!git clone https://github.com/python3f/cugraph-learn.git
```

### ネットワークの描画

```python
import matplotlib.pyplot as plt
import networkx as nx
import numpy as np

# データの読み込み
csv = 'cugraph-learn/data/min2d.csv'
data = cudf.read_csv(csv, names=['src', 'dst', 'wt'], dtype=['int32', 'int32', 'float32'])

# 12個の頂点と、ランダムに引いた辺を持つグラフを定義
G = nx.Graph()
G.add_nodes_from(list(set(data["src"].values.tolist())))
for i in range(len(G.nodes)):
  G.add_edge(data["src"][i], data["dst"][i])

# 座標を指定せずに描写する
nx.draw_networkx(G, node_color="c")
plt.show()
```

![](/image/min2d.png)


### 最短経路探索

```python
# START
import time
import cudf
import cupy
import cugraph

csv = 'cugraph-learn/data/min2d.csv'
data = cudf.read_csv(csv, names=['source', 'destination', 'weight'], dtype=['int32', 'int32', 'float32'])

G = cugraph.Graph()
G.from_cudf_edgelist(data, source='source', destination='destination', edge_attr='weight')

# ODノード
org = 3
dest = 5

start = time.time()
# 最短経路探索
dist = cugraph.sssp(G, org)
path = [dest]
while dest != -1:
   dest = int(dist[dist['vertex']==dest]['predecessor'].values[0])
   path.append(dest)

# reverse the list and print
print(path[::-1][1:])

elapsed_time = time.time() - start
print ("elapsed_time:{0}".format(elapsed_time) + "[sec]")
# [3, 2, 1, 5]
# [create_linkvol] elapsed_time:0.034224510192871094[sec]
```

## まとめ
Google Colaboratory + cuGraphで最短経路探索を実装しました．

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


