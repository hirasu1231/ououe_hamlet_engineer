---
display: home
title: '国勢調査の小地域を町名でまとめる'
description: 国勢調査の小地域を町名でまとめます。
date: 2023-4-8
image: https://www.hamlet-engineer.com/image/osm.png
categories: 
  - Python
tags:
  - Python
  - Pandas
  - visualization
  - 国勢調査
---
国勢調査の小地域を町名でまとめます。

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ライブラリのインポート
```
!pip install -U matplotlib
```

```python
import warnings
warnings.simplefilter('ignore')

import numpy as np
import pandas as pd
from shapely import wkt
from shapely.geometry import Point

try:
  import geopandas as gpd
  from geoalchemy2 import Geometry, WKTElement
  
  from shapely import wkt
  from shapely.ops import unary_union
  from shapely.geometry import MultiPolygon, Polygon
except:
  !pip install geopandas
  !pip install geoalchemy2
  import geopandas as gpd
  from geoalchemy2 import Geometry, WKTElement
```

## データの読み込み
下記のコードでデータを読み込みます。
```python
# 国勢調査の小地域
df_sjinko = gpd.read_file("./data/R2_JINKO_SMALL/r2ka13.shp")
df_sjinko["CITY"] = df_sjinko["CITY"].astype(int)
# df_sjinko = df_sjinko[(df_sjinko["CITY"]<200)&(df_sjinko["KEY_CODE"]!="13")]
df_sjinko = df_sjinko.reset_index(drop=True)
df_sjinko.tail(2)
```

## KEYCODEの整理
```python
# S_NAMEがNoneでない
df_sjinko = df_sjinko[~df_sjinko["S_NAME"].isnull()].reset_index(drop=True)
df_sjinko["geof_code"] = df_sjinko["KEY_CODE"].apply(lambda x: x[:-1])
df_sjinko.head(2)
```

## 町名を接頭文字で抽出
町名を接頭文字で抽出します。
```python
# keycodeリスト
key = df_sjinko["geof_code"].drop_duplicates().tolist()
len(key)

# 町名を接頭文字で抽出
df_sjinko["geof_name"] = ""
for key in key:
  A = df_sjinko[df_sjinko["geof_code"]==key]["S_NAME"].tolist()

  prefix = []
  for x in zip(*A):  # リストAをUnpackingしてzip()に渡します。
      if len(set(x)) == 1:
          prefix.append(x[0])
      else:
          break
  df_sjinko.loc[df_sjinko["geof_code"]==key, "geof_name"] = "".join(prefix)
```


## 町名ごとに人口と世帯を合計
町名ごとに人口と世帯を合計します。
```python
# データフレームの整形
df = df_sjinko.groupby(["PREF", "CITY", "PREF_NAME", "CITY_NAME", "geof_code", "geof_name"]).sum()[["JINKO", "SETAI"]].reset_index()
df.head(2)
```
|PREF|CITY|PREF_NAME|CITY_NAME|geof_code|geof_name|JINKO|SETAI|
|:----|:----|:----|:----|:----|:----|:----|:----|
|13|101|東京都|千代田区|1310100100|丸の内|10|10|
|13|101|東京都|千代田区|1310100200|大手町|2|2|

## 町名ごとにgeometryを統合
町名ごとにgeometryを統合します。
```python
# GeoDataFrameを作成
geometry = df_sjinko_23sec['geometry'] #.apply(wkt.loads)
gdf_extract = gpd.GeoDataFrame(df_sjinko_23sec[["geof_code"]], geometry=geometry)

# labelで結合
gdf_custom = gdf_extract.dissolve(by='geof_code', aggfunc='sum')
gdf_custom = gdf_custom.reset_index()
# MULTIPOLYGONをPOLYGONに変換
gdf_custom = gdf_custom.explode().reset_index(drop=True)
# POLYGONの空洞(hole)を埋める
gdf_custom['geometry'] = gdf_custom['geometry'].apply(lambda p: Polygon(p.exterior))
# labelで再結合
gdf_custom = gdf_custom.dissolve(by='geof_code', aggfunc='sum')
```

## csvで保存
``` python
# データフレームを統合
gdf_out = pd.merge(df, gdf_custom, on="geof_code")
gdf_out.to_csv("./data/jinko_small_merge.csv", index=False)
```

## まとめ
国勢調査の小地域を町名でまとめました。


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">