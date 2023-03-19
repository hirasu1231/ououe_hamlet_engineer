---
display: home
title: 'Pandasのデータフレームからgeometryを追記してshpファイルで出力する'
description: Pandasのデータフレームからgeometryを追記してshpファイルで出力します．
date: 2023-3-30
image: https://www.hamlet-engineer.com/image/osm.png
categories: 
  - Python
tags:
  - memo
  - Python
  - Pandas
  - GIS
  - kowaza0708
---
Pandasのデータフレームからgeometryを追記してshpファイルで出力します．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## shpで出力
データフレームに地物情報を追記して、shpファイルで出力します。

```python
import pandas as pd
import geopandas as gpd

# 仮想データ
geodata = pd.DataFrame(
    [
        ["sendai", 140.87194, 38.26889],
        ["morioka", 141.1525, 39.70361],
        ["aomori", 140.74, 40.82444],
        ["akita", 140.1025, 39.71861],
        ["yamagata",140.36333, 38.24056],
        ["fukushima", 140.46778, 37.75]
    ],
    columns=["city", "Longitude", "Latitude"],
)

# geometryの追加
data_gdf = gpd.GeoDataFrame(
    geodata, geometry=gpd.points_from_xy(geodata["Longitude"], geodata["Latitude"])
)
# 描画
data_gdf.plot()

# shpファイルに出力
data_gdf.to_file("./data/pref_city.shp")
```

![](/image/pref_city.png)

## まとめ
Pandasのデータフレームからgeometryを追記してshpファイルで出力しました．

## 参考サイト
[県庁所在地 緯度経度](https://www.benricho.org/chimei/latlng_data.html)

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


