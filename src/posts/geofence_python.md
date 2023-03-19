---
display: home
title: '半径2kmのジオフェンスで地物抽出'
description: 半径2kmのジオフェンスで地物抽出します
date: 2023-4-5
image: https://www.hamlet-engineer.com/image/geofence_python.png
categories: 
  - Python
tags:
  - Python
  - GIS
  - kepler
  - Colabratry
---
半径2kmのジオフェンスで地物抽出します

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ライブラリのインポート

```python
import base64
import pandas as pd
import numpy as np

from shapely import wkt
from shapely.geometry import Point

try:
  import geopandas as gpd
  import leafmap.kepler as leafmap
  from keplergl import KeplerGl
except ImportError:
  !pip install geopandas
  import geopandas as gpd
  !pip install keplergl
  !pip install git+https://github.com/giswqs/leafmap.git
  import leafmap.kepler as leafmap
  from keplergl import KeplerGl
```

## データの読み込み
[国勢調査](https://www.e-stat.go.jp/gis/statmap-search?page=1&type=1&toukeiCode=00200521&toukeiYear=2020&aggregateUnit=A&serveyId=A002005212020&statsId=T001081)からデータをダウンロードして，GeoPandasで読み込む．

```python
import glob

paths = glob.glob("./data/*/*.shp")

gdf_pop = pd.DataFrame()
for path in paths:
  # 駅データの読み込み
  gdf_pop_wk = gpd.read_file(path)
  gdf_pop = pd.concat([gdf_pop, gdf_pop_wk],axis=0)
  gdf_pop.head(2)

# 人口密度
gdf_pop["PDE"] = gdf_pop["JINKO"]/gdf_pop["AREA"] 
```

## 駅周辺を抽出(半径1km)

下記のサイトから、鉄道データをダウンロードします。

そして、下記のコードで読み込みます。
[駅拠点](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N02-v3_0.html)

### データの読み込み

```python
# 新幹線駅の読み込み
df_station_geo = pd.read_csv("./data/station.csv")
# geometryに変換
df_station_geo["geometry"] = df_station_geo["geometry"].apply(wkt.loads)
df_station_geo.head(2)
```

### 2kmのジオフェンス(円)を作成

```python
def circle(center, meter):
  local_azimuthal_projection = "+proj=aeqd +R=6371000 +units=m +lat_0={} +lon_0={}".format(
      lat, lon
  )
  wgs84_to_aeqd = partial(
      pyproj.transform,
      pyproj.Proj("+proj=longlat +datum=WGS84 +no_defs"),
      pyproj.Proj(local_azimuthal_projection),
  )
  aeqd_to_wgs84 = partial(
      pyproj.transform,
      pyproj.Proj(local_azimuthal_projection),
      pyproj.Proj("+proj=longlat +datum=WGS84 +no_defs"),
  )

  point_transformed = transform(wgs84_to_aeqd, center)
  buffer = point_transformed.buffer(meter)
  # Get the polygon with lat lon coordinates
  circle_poly = transform(aeqd_to_wgs84, buffer)
  return circle_poly

df_station_geo["geometry"] = df_station_geo["geometry"].apply(lambda x: circle(x, 2000))
df_station_geo.head(2)
```

## ジオフェンス内のデータを抽出
```python
df_plot = pd.DataFrame()
for i in range(len(df_station_geo)):
  # 境界データ
  bound = df_station_geo["geometry"][i]

  # ジオフェンスに含まれるか
  geometry = gdf_pop["geometry"].centroid
  _bool = geometry.within(bound)
  tmp_gdf = gdf_pop[_bool]
  # plot用のデータフレーム
  df_plot = pd.concat([df_plot, tmp_gdf],axis=0)

# 重複削除
df_plot = df_plot.drop_duplicates()
df_plot.head()
```

### keplerで描画

```python
# データを描画
df_station_geo_wk = df_station_geo.copy()
df_plot_wk = df_plot.copy()
df_station_geo_wk["geometry"] = df_station_geo_wk["geometry"].astype(str)
# df_plot_wk["geometry"] = df_plot_wk["geometry"].astype(str)
map1 = KeplerGl(height=600)
map1.add_data(data=df_plot_wk, name='df_plot')
map1.add_data(data=df_station_geo_wk, name='df_station_geo')
map1
```

![](/image/geofence_python.png)

## まとめ
半径2kmのジオフェンスで地物抽出しました。

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">