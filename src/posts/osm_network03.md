---
display: home
title: '平面交差の考慮と計算コストの節約のために、OpenStreetMapから東北地方の道路リンクを交差点基準で分解する'
description: 平面交差の考慮と計算コストの節約のために、OpenStreetMapから東北地方の道路リンクを交差点基準で分解します。
date: 2023-3-29
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
平面交差の考慮と計算コストの節約のために、OpenStreetMapから東北地方の道路リンクを交差点基準で分解します。


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
# 0~1000行を抽出(短時間で確認したいので)
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

## 座標の抽出とカウント
各座標が各リンクで何回出現するかをカウントします。

```python
# LINESTRINGを整理
geometry = gdf2["geometry"].astype(str).apply(lambda x: x.replace("LINESTRING (", "").replace(")", ""))
# 座標リストに整形
lonlats = geometry.apply(lambda x: x.split(", "))

# osm_id, fclass, init_lon, init_lat, term_lon, term_lat, length 
latlon_list = []
for i,lonlat in enumerate(lonlats):
    # print(gdf2["osm_id"][i], gdf2["fclass"][i])
    for j in range(len(lonlat)):
        point = lonlat[j].split(" ")
        # リンクの格納
        latlon_list.append([point[1], point[0], 1])
        
# データフレームの作成
df_latlons = pd.DataFrame(latlon_list, columns=["lat","lon", "count"])
# 緯度経度ごとにカウント
df_latlons = df_latlons.groupby(["lat","lon"]).count().reset_index()
df_latlons.head()
```

| lat | lon | count |
| - | - | - |
| 36.8940682 | 140.7881092 | 1 |
| 36.8941365 | 140.7879983 | 1 |
| 36.894186 | 140.7878967 | 1 |
| 36.8942832 | 140.7876019 | 1 |
| 36.8946206 | 140.7863557 | 1 |


## 平面交差基準でリンクを分解
下記のような分割で、平面交差基準でリンクを分解します。
```
data ─┬── ノードが2つ 　── そのまま格納
      └── ノードが2つ以上  ─┬─ 中間点で交差ノードがない 　── そのまま格納
                        └── 中間点で交差ノードがある 　── 交差ノードで分解
```

### 交差ノードの抽出

```python
# 交差ノードの抽出とリスト化
cross_latlons = df_latlons[df_latlons["count"]>1].reset_index(drop=True)
cross_list = [f"{cross_latlons['lon'][i]} {cross_latlons['lat'][i]}" for i in range(len(cross_latlons))]
```

### LINESTRINGの分解

```python
# LINESTRINGを整理
geometry = gdf2["geometry"].astype(str).apply(lambda x: x.replace("LINESTRING (", "").replace(")", ""))
# 座標リストに整形
lonlats = geometry.apply(lambda x: x.split(", "))
```

### リンクの分解

```python
def append_link_list(geometry):
    # 始点終点の座標
    _prev = geometry[0].split(" ")
    _next = geometry[-1].split(" ")
    # linestringの整形
    points = str(geometry).replace("'","").replace("[","").replace("]","")
    # links_listに追加
    links_list.append([gdf["osm_id"][i], gdf["fclass"][i],
                       _prev[1], _prev[0], _next[1], _next[0], 1,
                       f"LINESTRING ({points})"])
```

```python
# リンクの分解
# osm_id, fclass, init_lon, init_lat, term_lon, term_lat, 
# length , raw, geometry
links_list = []
f = 0
for i,lonlat in enumerate(lonlats):
    f += 1
    # 2点間リンク or 中間点で交差箇所があるかないか
    if len(set(lonlat[1:-1])&set(cross_list))==0:
        _prev = lonlat[0].split(" ")
        _next = lonlat[-1].split(" ")
        links_list.append([gdf2["osm_id"][i], gdf2["fclass"][i],
                           _prev[1], _prev[0], _next[1], _next[0], 0,
                           gdf2["geometry"].astype(str)[i]])
    # 中間点で交差箇所がある
    else:
        # geometrys = []
        geometry = [lonlat[0]]
        for point in lonlat[1:-1]:
            # 逐次追加
            geometry.append(point)
            # 交差地点か否か
            if point in cross_list:
                # geometrys.append(geometry) # 追加
                append_link_list(geometry) # 追加
                # 交差箇所から再スタート
                geometry = [point]
        # 終点
        geometry.append(lonlat[-1])
        append_link_list(geometry) # 追加
        # geometrys.append(geometry)

# データフレームの作成
osm_links = pd.DataFrame(links_list, columns=["osm_id", "fclass", "init_lat", "init_lon", 
                                              "term_lat", "term_lon", "raw", "geometry"])
osm_links.head(2)
```

| osm_id | fclass | init_lat | init_lon | term_lat | term_lon | raw | geometry |
| - | - | - | - | - | - | - | - |
| 20264905 | motorway | 38.8040228 | 141.0941549 | 38.8378983 | 141.0989473 | 0 | LINESTRING (141.0941549 38.8040228, 141.094536... |
| 22787759 | primary | 38.2722395 | 140.8690382 | 38.2688936 | 140.8700114 | 0 | LINESTRING (140.8690382 38.2722395, 140.869062... |

## リンク長の算出

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

def make_lengths(osm_links):
    # LINESTRINGを整理
    geometry = osm_links["geometry"].astype(str).apply(lambda x: x.replace("LINESTRING (", "").replace(")", ""))
    # 座標リストに整形
    latlons = geometry.apply(lambda x: x.split(", "))
    # リンク長の算出
    lengths = latlons.apply(lambda x: link_length(x))
    
    return lengths

# リンク長の算出
osm_links["length"] = make_lengths(osm_links)
osm_links.head(2)
```

| osm_id | fclass | init_lat | init_lon | term_lat | term_lon | raw | geometry | length |
| - | - | - | - | - | - | - | - |
| 20264905 | motorway | 38.8040228 | 141.0941549 | 38.8378983 | 141.0989473 | 0 | LINESTRING (141.0941549 38.8040228, 141.094536... | 3.944538 |
| 22787759 | primary | 38.2722395 | 140.8690382 | 38.2688936 | 140.8700114 | 0 | LINESTRING (140.8690382 38.2722395, 140.869062... | 0.381072 |


## リンク情報の整理
OSMには交通流の上り下りがないので、上り下りの要素を追記する。

追記方法は下記に示す。
- 上り下り(順流・逆流)のIDを付与
- 始点終点ノードIDとリンクIDを付与

### 上り下り(順流・逆流)のIDを付与

```python
# 新規DF(順流)
osm_links_0 = osm_links.copy()
# 方向のID
osm_links_0["vec"] = "0"
```

```python
# 新規DF(逆流)
osm_links_1 = osm_links.copy()

# 始点の緯度経度
osm_links_1["init_lat"] = osm_links["term_lat"] 
osm_links_1["init_lon"] = osm_links["term_lon"]
# 終点の緯度経度
osm_links_1["term_lat"] = osm_links["init_lat"]
osm_links_1["term_lon"] = osm_links["init_lon"]

# 方向のID
osm_links_1["vec"] = "1"
```

```python
# 縦に結合
osm_links_vec = pd.concat([osm_links_0, osm_links_1], axis=0)
```

### 始点終点ノードIDとリンクIDを付与
緯度経度からMD5ハッシュ値に変換して、始点終点ノードを示すIDと、osm_idの代わりとなるリンクIDを付与します。

リンクIDは、違う道路が重なるように配置されていることもあるので、osm_id,geometry,vecごとに付与します。


```python
# # 始点のノードID(MD5ハッシュ値)
dat_init = osm_links_vec["init_lon"].astype(str) + osm_links_vec["init_lat"].astype(str)
osm_links_vec["init_node"] = dat_init.apply(lambda x: hashlib.md5(x.encode()).hexdigest())

# 終点ノードのノードID(MD5ハッシュ値)
dat_term = osm_links_vec["term_lon"].astype(str) + osm_links_vec["term_lat"].astype(str)
osm_links_vec["term_node"] = dat_term.apply(lambda x: hashlib.md5(x.encode()).hexdigest())

# リンクID(MD5ハッシュ値)
dat_link = osm_links_vec["osm_id"] + osm_links_vec["geometry"] + osm_links_vec["vec"]
osm_links_vec["link_id"] = dat_link.apply(lambda x: hashlib.md5(x.encode()).hexdigest())

# 確認
print(len(osm_links_vec), len(set(osm_links_vec["link_id"].tolist()))) #2300 2300
osm_links_vec.head(2)
```

| osm_id | fclass | init_lat | init_lon | term_lat | term_lon | raw | geometry | length | vec | init_node | term_node | link_id |
| - | - | - | - | - | - | - | - | - | - | - | - | - |
| 20264905 | motorway | 38.8040228 | 141.0941549 | 38.8378983 | 141.0989473 | 0 | LINESTRING (141.0941549 38.8040228, 141.094536... | 3.944538 | 0 | 8240949eec7aa3e5b5a8e1f51360a602 | 91299405649127a0303c3ef39b5974db | e3571ca226da1b9fb9a7ff2bfe77c562 |
| 22787759 | primary | 38.2722395 | 140.8690382 | 38.2688936 | 140.8700114 | 0 | LINESTRING (140.8690382 38.2722395, 140.869062... | 0.381072 | 0 | fa83c41314133d91cda8a3baa10ec944 | 06996e1cc8fbea04d0036bdbed2fca3b | 8c86d9213130e00cb864a3a05b67e9fc |

## CSVの出力

```python
# CSVの出力
osm_links_vec.to_csv("./data/sample_network.csv", index=False)
```

## QGISで投影

### リンクの分解
福島県四ツ倉駅周辺において、平面交差を基準に分解したOpenStreetMapを投影した画像とGoogleMapの画像を下記に示す。


![](/image/yotukura_osm03.png)

![](/image/yotukura_gmap.png)

上画像のように、平面交差を基準にリンクを分解できている。

### ノードIDの整合性
一応、ハッシュで付与したIDの整合も確認します。OKだった。

**前々回の記事で作成**

![](/image/hashid_osm01.png)

**前回の記事で作成**

![](/image/hashid_osm02.png)


**本記事で作成**

![](/image/hashid_osm03.png)


## まとめ
本記事では、平面交差の考慮と計算コストの節約のために、OpenStreetMapから東北地方の道路リンクを交差点基準で分解しました。


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


