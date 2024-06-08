---
display: home
title: 'keplerでアーチプロットを実施'
description: keplerでアーチプロットを実施します
date: 2024-6-7
image: https://www.hamlet-engineer.com/image/kepler_arch.png
categories: 
  - Python
tags:
  - Python
  - GIS
  - kepler
  - Colabratry
---
keplerでアーチプロットを実施します

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
import random
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
下記のページで作成したデータフレームを使用します。

## 駅の緯度経度を抽出
下記のコードで駅の緯度経度を抽出します。

```python
# geometryに変換
# gdf_station_shinkansen["geometry"] = gdf_station_shinkansen["geometry"].apply(wkt.loads)
# latlonを抽出
gdf_station_shinkansen["lat"] = gdf_station_shinkansen["geometry"].apply(lambda row: row.y)
gdf_station_shinkansen["lon"] = gdf_station_shinkansen["geometry"].apply(lambda row: row.x)
gdf_station_shinkansen.head(2)

# N02_001	N02_002	N02_003	N02_004	N02_005	geometry	lat	lon
# 11	1	九州新幹線	九州旅客鉄道	出水	POINT (130.35838 32.08959)	32.089587	130.358378
# 11	1	九州新幹線	九州旅客鉄道	新八代	POINT (130.63503 32.51759)	32.517586	130.635033
```

## トリップ数の追記
下記のコードでトリップ数をテキトーに追記します。
```python
# Oの座標情報を追加
df_init = gdf_station_shinkansen[["N02_005", "lat", "lon"]].rename(columns={"N02_005":"init_station", "lon":"init_lon", "lat":"init_lat"})
df_init = df_init.reset_index(drop=True)
display(df_init.head(2))
# init_station	init_lat	init_lon
# 出水	32.089587	130.358378
# 新八代	32.517586	130.635033

# Dの座標情報を追加
df_term = gdf_station_shinkansen[["N02_005", "lat", "lon"]].rename(columns={"N02_005":"term_station", "lon":"term_lon", "lat":"term_lat"})
df_term = df_term.sample(frac=1).reset_index(drop=True)
display(df_term.head(2))
# term_station	term_lat	term_lon
# 三島	35.126710	138.909690
# 静岡	34.971706	138.389599

# ODで結合
df_merge = pd.concat([df_init, df_term], axis=1)
# トリップ数
df_merge["val"] = [random.randint(30, 100) for i in range(len(df_merge))]
display(df_merge.head(2))
# init_station	init_lat	init_lon	term_station	term_lat	term_lon	val
# 出水	32.089587	130.358378	三島	35.126710	138.909690	71
# 新八代	32.517586	130.635033	静岡	34.971706	138.389599	85
```


### keplerで描画 

```python
# データを描画
map1 = KeplerGl(height=600)
map1.add_data(data=gdf_station_shinkansen, name='shinkansen')
map1.add_data(data=df_merge, name='trip_data')
map1
```

![](./image/kepler_arch.png)

## まとめ
keplerでアーチプロットを実施しました。

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">