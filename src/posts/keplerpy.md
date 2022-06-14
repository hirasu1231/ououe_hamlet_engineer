---
display: home
title: 'Kepler.glをJupyterNotebook上で扱ってみた'
description: Kepler.glをJupyterNotebook上で扱ってみます
date: 2022-2-16
image: https://www.hamlet-engineer.com/image/kepler.png
categories: 
  - Python
tags:
  - Python
  - GIS
  - Kepler
---
Kepler.glをJupyterNotebook上で扱ってみます.

<!-- https://www.hamlet-engineer.com -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ライブラリのインストール
下記のコードでライブラリをインストールします．
```python
!pip install keplergl
!pip install geopandas
!pip install sodapy
!jupyter labextension install @jupyter-widgets/jupyterlab-manager keplergl-jupyter
```

## サンプルデータのダウンロード
[加古川市_公用車走行データ](https://www.geospatial.jp/ckan/dataset/kakogawacity-car-data)より、2017年のcsvデータをダウンロードします。

## コードの実行
下記のコードでデータを読み込みます．
```python
from keplergl import KeplerGl
import pandas as pd
import base64

df = pd.read_csv('../kakogawa_probe_2017/probe_kaisen081_2017.csv.csv',
                 header = None ,
                 names=['car_id', 'record_time','lat','lon'])
```

下記のコードでkeplerを表示します．

HTMLが出力されるので，jupyterで読み込みます．
```python
# データの読み込み
map1 = KeplerGl(height=400)
map1.add_data(data=df, name='data1')

# htmlで表記
orig_html = str(map1._repr_html_(),'utf-8')
b64d_html = base64.b64encode(orig_html.encode('utf-8')).decode('utf-8')
framed_html = f'<iframe src="data:text/html;base64,{b64d_html}" style="width:95%; height: 600px">'

import IPython
IPython.display.HTML(framed_html)
```

![](/image/kepler.png)

## まとめ
Kepler.glをJupyterNotebook上で扱ってみました．

## 参考サイト
[Kepler.glをJupyterNotebook上で扱ってみた](https://lonlat.info/kepler-jupyternotebook/)

[bindings/kepler.gl-jupyter](https://github.com/keplergl/kepler.gl/blob/master/bindings/kepler.gl-jupyter/README.md)

[Using Kepler.GL in Jupyter](https://qiita.com/nailbiter/items/6de340139e07de57de44)

[kepler.gl for Jupyter User Guide](https://docs.kepler.gl/docs/keplergl-jupyter#add_data)

[加古川市_公用車走行データ](https://www.geospatial.jp/ckan/dataset/kakogawacity-car-data)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


