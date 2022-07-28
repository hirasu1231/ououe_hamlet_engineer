---
display: home
title: 'Pythonで地物の最大最小座標の枠に入る地物を抽出する'
description: Pythonで地物の最大最小座標の枠に入る地物を抽出します．
date: 2022-8-2
image: https://www.hamlet-engineer.com/image/shp.png
categories: 
  - Python
tags:
  - memo
  - Python
  - Shapely
  - Pandas
  - kowaza0708
---
Pythonで地物の最大最小座標の枠に入る地物を抽出します．

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

## 地物の最大最小座標に入るか判定
地物の最大最小座標に入るか判定します．

```python
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
from shapely.ops import unary_union

# osmデータのshpファイル読込
osm_gdf = gpd.read_file("./data/osm/tohoku/gis_osm_roads_free_1.shp")
display(osm_gdf.head())

# 境界データのshpファイル読込
pref_gdf = gpd.read_file("./data/R2_boundary/04_miyagi/04_miyagi.shp")
# display(pref_gdf.head(2))

# 境界データをmerge
bound = gpd.GeoSeries(unary_union(pref_gdf.geometry))
bound.crs = "epsg:4326"

# 境界データの最大最小座標
# minx, miny, maxx, maxy
bminx, bminy, bmaxx, bmaxy = bound.bounds.values[0]
# print(bminx, bminy, bmaxx, bmaxy)

# LINESTRINGの最大最小座標
osm_bounds = osm_gdf.bounds
osm_gdf_concat = pd.concat([osm_gdf, osm_bounds], axis=1)

# 境界データの最大最小座標に入るか判定
xbool = osm_gdf_concat["minx"].apply(lambda x: (x > bminx) & (x < bmaxx))
ybool = osm_gdf_concat["miny"].apply(lambda y: (y > bminy) & (y < bmaxy))
pref_minmax_gdf = osm_gdf_concat[xbool&ybool]

# 行数の確認
print(len(osm_gdf_concat), len(pref_minmax_gdf))
# 1028288 262077
```


## まとめ
Pythonで地物の最大最小座標の枠に入る地物を抽出しました。

## 参考サイト


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


