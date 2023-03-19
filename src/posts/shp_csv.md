---
display: home
title: 'H26_商業統計より,shpファイルとcsvを連携させる'
description: H26_商業統計より,shpファイルとcsvを連携させます．
date: 2023-4-3
image: https://www.hamlet-engineer.com/image/syogyo_gis.png
categories: 
  - Python
tags:
  - 小ネタ
  - Python
  - GCP
  - GoogleBigQuery
---
H26_商業統計より,shpファイルとcsvを連携させます．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## H26_商業統計のフォーマット

![](/image/syogyo_format.png) 

## 商業統計の加工

### データの読み込み
カラムは適当に振ります．
```python
import pandas as pd

# 仮カラム名
columns = []
for i in range(1, 97):
    columns.append(f"c{i}")

# csvの読み込み
df = pd.read_csv('./data/shp_csv/H26_03_500m市区町村.csv', names=columns)
```

### 仙台市の抽出
仙台市の抽出 + メッシュコードの整形 + 小売売上の整数化を実行します．
```python
# 宮城県：4
dfh = df[df['c4']==4]
# 仙台市：04101〜04105
df_city = dfh[(dfh['c11']<=105)|(dfh['c13']<=105)|(dfh['c15']<=105)|(dfh['c17']<=105)]
# KEY_CODE(メッシュ)c5~c8
df_city['KEY_CODE'] = df_city['c5'].astype(str) + \
                      df_city['c6'].astype(str).str.zfill(2) + \
                      df_city['c7'].astype(str).str.zfill(2) + \
                      df_city['c8'].astype(str)
# 0埋め
df_city = df_city.replace(['X', '-'], '0')

# データ型変更
df_city['c24'] = df_city['c24'].astype(int) #小売売上
```

![](/image/syogyo_format.png) 

## 境界データ
境界データは1次メッシュ：5740をダウンロードし，shpファイルに情報を結合させます．
```python
# -*- coding: utf-8 -*-
import pandas as pd
import geopandas
from shapely.ops import cascaded_union
from shapely.geometry import Point, Polygon

#  shpファイルの読み込み
input_geodf = geopandas.read_file("./data/shp_csv/HDDSWH5740/MESH05740.shp")

# 1次メッシュ：5740
df_city_5740 = df_city[df_city['c5']==5740]

# 地形データ
geometry = []
mids = df_city_5740['KEY_CODE'].tolist()
for mid in mids:
    mdf = input_geodf[input_geodf['KEY_CODE']==mid].reset_index(drop=True)
    geometry.append(mdf['geometry'][0])
    
# GeoDataFrameを作成
geo_df = geopandas.GeoDataFrame(df_city_5740, geometry=geometry)
# Shapeファイルの出力
geo_df.to_file(driver='ESRI Shapefile', filename="./data/shp_csv/syogyo_sendai_mesh.shp")
```

## QGISに投影
仙台駅周辺のみ年間8000(千万円)以上でした．(赤色着色)

![](/image/syogyo_gis.png) 

## まとめ
H26_商業統計より,shpファイルとcsvを連携させました．

## 参考サイト
[平成26年商業統計メッシュデータ・ダウンロード](https://www.meti.go.jp/statistics/tyo/syougyo/mesh/download.html)

[e-stat 境界データ](https://www.e-stat.go.jp/gis/statmap-search?type=2)

[e-stat 境界データ 5739〜6243](https://www.e-stat.go.jp/gis/statmap-search?page=7&type=2&aggregateUnitForBoundary=H&coordsys=1&format=shape)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


