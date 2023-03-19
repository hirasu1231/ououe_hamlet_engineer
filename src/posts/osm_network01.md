---
display: home
title: 'OpenStreetMapから東北地方の道路データを整理する'
description: OpenStreetMapから東北地方の道路データを整理します。
date: 2023-3-28
image: https://www.hamlet-engineer.com/image/osm.png
categories: 
  - Python
tags:
  - Python
  - PostgreSQL
  - psycopg2
  - SQL
  - Shapely
  - OpenStreetMap
---
OpenStreetMapから東北地方の道路データを整理します。


<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ファイル構成
```
project_dir
├── /data
│   ├── /R2_boundary/04_miyagi/04_miyagi.shp
│   ├── /osm/tohoku/gis_osm_roads_free_1.shp
│   └── (省略)
└── merge_bound.ipynb <- 実行用ノートブック
```

## ライブラリのインストール

```python
!pip install keplergl
!pip install geopandas
!pip install sodapy
!jupyter labextension install @jupyter-widgets/jupyterlab-manager keplergl-jupyter

!pip install geopy
!pip install simpledbf
```


## OSMの読み込み

```python
import pandas as pd
from simpledbf import Dbf5
import geopandas as gpd
from keplergl import KeplerGl
import base64
from geopy.distance import geodesic
import hashlib

# # DBFの読み込み
# dbf = Dbf5('"./data/osm/tohoku/gis_osm_roads_free_1.dbf')
# df = dbf.to_dataframe()

# shpファイル読込
gdf = gpd.read_file("./data/osm/tohoku/gis_osm_roads_free_1.shp")

gdf.head()
```

| osm_id | code | fclass | name | ref | oneway | maxspeed | layer | bridge | tunnel | geometry |
| - | - | - | - | - | - | - | - | - | - | - |
| 20264905 | 5111 | motorway | 東北自動車道 | E4 | F | 100 | 0 | F | F | LINESTRING (141.09415 38.80402, 141.09454 38.8... |
| 22762217 | 5121 | unclassified | None | None | B | 0 | 0 | F | F | LINESTRING (140.88676 38.30354, 140.88661 38.3... |
| 22762218 | 5122 | residential | None | None | B | 0 | 0 | F | F | LINESTRING (140.88614 38.30239, 140.88638 38.3... |



## 道路種別の選定
[OSM fclass](https://wiki.openstreetmap.org/wiki/JA:Key:highway)を参考に、道路種別の選定します。

- footway：歩道
- living_street：生活道路
- motorway:自専道
- motorway_link:自専道(ランプ)
- pedestrian:歩道
- primary:主要地方道
- residential:居住地域内道路
- secondary:都道府県道
- service:私道
- steps:階段
- tertiary:市町村道
- tertiary_link:市町村道(ランプ)
- track:農道・林道,
- track_grade1:1級_農道・林道,
- track_grade4:4級_農道・林道,
- track_grade5:5級_農道・林道,
- trunk:国道
- trunk_link:国道(ランプ)

```python
# 道路酒別を抽出
gdf2 = gdf[gdf["fclass"].isin(["motorway", "motorway_link", 
                               "primary", "secondary",
                               "tertiary", "tertiary_link",
                               "living_street",
                               "trunk", "trunk_link"])]
# 0~10行を抽出(短時間で確認したいので)
gdf2 = gdf2[0:1000].reset_index(drop=True)
gdf2.head(2)
```

## Keplerで確認

```python
# データの読み込み
map1 = KeplerGl(height=400)
map1.add_data(data=gdf2, name='data1')

# htmlで表記
orig_html = str(map1._repr_html_(),'utf-8')
b64d_html = base64.b64encode(orig_html.encode('utf-8')).decode('utf-8')
framed_html = f'<iframe src="data:text/html;base64,{b64d_html}" style="width:95%; height: 600px">'

import IPython
IPython.display.HTML(framed_html)
```

![](/image/kepler_osm.png)

## リンク長の算出
LINESTRINGからリンク長を算出します

```python
# リンク長の算出
def link_length(latlons):
    dis = 0
    for i in range(len(latlons)-1):
        _prev = latlons[i].split(" ")
        _next = latlons[i+1].split(" ")
        # 逐次加算
        dis += geodesic((_prev[1], _prev[0]), (_next[1], _next[0])).km

    return dis

# LINESTRINGを整理
geometry = gdf2["geometry"].astype(str).apply(lambda x: x.replace("LINESTRING (", "").replace(")", ""))
# 座標リストに整形
latlons = geometry.apply(lambda x: x.split(", "))
# リンク長の算出
gdf2["length"] = latlons.apply(lambda x: link_length(x))
gdf2.head(2)
```

| osm_id | code | fclass | name | ref | oneway | maxspeed | layer | bridge | tunnel | geometry | length |
| - | - | - | - | - | - | - | - | - | - | - | - |
| 20264905 | 5111 | motorway | 東北自動車道 | E4 | F | 100 | 0 | F | F | LINESTRING (141.0941549000000066 38.8040227999... | 3.944538 |
| 22787759 | 5113 | primary | 県道22号仙台泉線（勾当台通り） | 22 | B | 60 | 0 | F | F | LINESTRING (140.8690382000000056 38.2722394999... | 0.381072 |


## リンクの始点終点座標の整理
OSMには交通流の上り下りがないので、上り下りの要素を追記します。

一通の道路も存在するはずだが、一旦考慮しないものとします。
​
追記方法は下記に示す。
- 始点終点座標を抽出
- 上り下り(順流・逆流)のIDを付与
- 始点終点ノードにIDを付与


### 始点終点座標を抽出

```python
# 始点の緯度経度を抽出
init_lon = geometry.apply(lambda x: x.split(", ")[0].split(" ")[0])
init_lat = geometry.apply(lambda x: x.split(", ")[0].split(" ")[-1])
# 終点の緯度経度を抽出
term_lon = geometry.apply(lambda x: x.split(", ")[-1].split(" ")[0])
term_lat = geometry.apply(lambda x: x.split(", ")[-1].split(" ")[-1])
```


### 上り下り(順流・逆流)のIDを付与

```python
# 新規DF(順流)
gdf3_0 = gdf2.copy()
gdf3_0 = gdf3_0[["osm_id", "code", "fclass", "name", "geometry"]]

# 始点の緯度経度
gdf3_0["init_lon"] = init_lon
gdf3_0["init_lat"] = init_lat
# 終点の緯度経度
gdf3_0["term_lon"] = term_lon
gdf3_0["term_lat"] = term_lat
# 交通流の方向
gdf3_0["vec"] = "0"
```

```python
# 新規DF(逆流)
gdf3_1 = gdf2.copy()
gdf3_1 = gdf3_1[["osm_id", "code", "fclass", "name", "geometry"]]

# 始点の緯度経度
gdf3_1["init_lon"] = term_lon
gdf3_1["init_lat"] = term_lat
# 終点の緯度経度
gdf3_1["term_lon"] = init_lon
gdf3_1["term_lat"] = init_lat
# 交通流の方向
gdf3_1["vec"] = "1"
```

```python
# 縦に結合
gdf3 = pd.concat([gdf3_0, gdf3_1], axis=0)
```

### 始点終点ノードにIDを付与
緯度経度からMD5ハッシュ値に変換して、座標を統一する

```python
# # 始点のノードID(MD5ハッシュ値)
dat = gdf3["init_lon"].astype(str)+gdf3["init_lat"].astype(str)
gdf3["init_node"] = dat.apply(lambda x: hashlib.md5(x.encode()).hexdigest())

# 終点ノードのノードID(MD5ハッシュ値)
dat = gdf3["term_lon"].astype(str)+gdf3["term_lat"].astype(str)
gdf3["term_node"] = dat.apply(lambda x: hashlib.md5(x.encode()).hexdigest())

# 確認
gdf3.head(2)
```

| osm_id | code | fclass | name | geometry | init_lon | init_lat | term_lon | term_lat | vec | init_node | term_node |
| - | - | - | - | - | - | - | - | - | - | - | - |
| 20264905 | 5111 | motorway | 東北自動車道 | LINESTRING (141.09415 38.80402, 141.09454 38.8... | 141.0941549 | 38.8040228 | 141.0989473 | 38.8378983 | 0 | 8240949eec7aa3e5b5a8e1f51360a602 | 91299405649127a0303c3ef39b5974db |
| 22787759 | 5113 | primary | 県道22号仙台泉線（勾当台通り） | LINESTRING (140.86904 38.27224, 140.86906 38.2... | 140.8690382 | 38.2722395 | 140.8700114 | 38.2688936 | 0 | fa83c41314133d91cda8a3baa10ec944 | 06996e1cc8fbea04d0036bdbed2fca3b |

## CSVの出力

```python
# csvで保存
gdf3.to_csv("./data/sample_network.csv", index=False)
```

## QGISで投影
福島県四ツ倉駅周辺において、OpenStreetMapを投影した画像とGoogleMapの画像を下記に示す。


![](/image/yotukura_osm01.png)

![](/image/yotukura_gmap.png)

上画像のように、OpenStreetMapでは平面交差していても分割しないリンクが存在する。

次記事では、上記のリンクへの対応(足掻き)について、記述する。


## まとめ
OpenStreetMapから東北地方の道路データを整理しました。

次記事では、平面交差していても分割しないリンクへの対応(足掻き)について、記述する。

## 参考サイト
[【PythonでGIS】GeoPandasまとめ](https://qiita.com/c60evaporator/items/ac6a6d66a20520f129e6)<br>
[Kepler.glをJupyterNotebook上で扱ってみた](https://lonlat.info/kepler-jupyternotebook/)<br>
[緯度経度から距離を算出するPythonのライブラリ ― GeoPy](https://h-memo.com/python-geopy-distance/)<br>
[【Pythonプログラミング】データのハッシュ化と実行速度検証](https://www.simpletraveler.jp/2020/04/16/python-programming-hash/)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


