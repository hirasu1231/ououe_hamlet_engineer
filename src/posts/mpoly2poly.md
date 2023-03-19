---
display: home
title: 'Python(psycopg2) + PostgreSQLで地物の統合とMULTIPOLYGONをPOLYGONで分解する'
description: Python(psycopg2) + PostgreSQLで地物の統合とMULTIPOLYGONをPOLYGONで分解します．
date: 2023-3-26
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - memo
  - Python
  - PostgreSQL
  - psycopg2
  - SQL
  - Shapely
  - OpenStreetMap
  - kowaza0708
---
Python(psycopg2) + PostgreSQLで地物の統合とMULTIPOLYGONをPOLYGONで分解します．


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
!pip install geopandas
!pip install shapely
!pip install geoalchemy2
```

```python
!sudo apt-get update
!sudo apt-get -y install libpq-dev gcc
!pip install psycopg2
```


## データの読み込み

```python
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
from shapely.ops import unary_union
from geoalchemy2 import Geometry, WKTElement

# osmデータのshpファイル読込
osm_gdf = gpd.read_file("./data/osm/tohoku/gis_osm_roads_free_1.shp",)
display(osm_gdf.head())

# 境界データのshpファイル読込
pref_gdf = gpd.read_file("./data/R2_boundary/04_miyagi/04_miyagi.shp")
# display(pref_gdf.head(2))

# 境界データをmerge
bound = gpd.GeoSeries(unary_union(pref_gdf.geometry))
bound.crs = "epsg:4326"
```

## MULTIPOLYGONからPOLYGONへ分解

```python
# MULTIPOLYGONからPOLYGONへ分解
bound_df = bound.explode().reset_index()
bound_df = bound_df.rename(columns={0: "geom"})
# 面積の算出
bound_df["area"] = bound_df["geom"].area
# 面積でソート
bound_df = bound_df.sort_values('area', ascending=False).reset_index(drop=True)
# 宮城県でデータフレーム作成
df_miyagi = pd.DataFrame([["miyagi", bound_df["geom"][0]]], columns=["pref", "geometry"])
df_miyagi
# 	miyagi	POLYGON ((140.59554456828445 37.90688193252195...
```

## PostgreSQLに格納

```python
import os
import psycopg2
from sqlalchemy import create_engine
from geoalchemy2 import Geometry, WKTElement

# WKTに変換
df_miyagi['geometry'] = df_miyagi['geometry'].apply(lambda x: WKTElement(x.wkt, srid=4326))

# DBのURL
DATABASE_URL='postgresql://postgre:postgre@workspace-postgres-1:5432/postgres'

# テーブル作成のDB起動
engine = create_engine(DATABASE_URL)
# テーブル作成 if_exists='replace' or 'append'
df_miyagi.to_sql('pref_miyagi',con=engine,if_exists='replace',index=None,
                 dtype={'geometry': Geometry(geometry_type='POLYGON', srid= 4326)})
```

## PostgreSQLから出力
そのままだと、下記のようにWKTのままで出力します。

酔って、下記のようにWKTからテキストに変換して出力します。
```python
import os
import psycopg2
import pandas as pd

# DATABASE_URL='postgresql://postgre:postgre@localhost:5432/postgres'
DATABASE_URL='postgresql://postgre:postgre@workspace-postgres-1:5432/postgres'

# postgresの接続
conn = psycopg2.connect(DATABASE_URL)
# conn.autocommit = True # 操作の重複を防ぐ(databaseの操作)呪文
# cur = conn.cursor()

# テーブル名一覧を取得するSQL
query = """SELECT pref, ST_AsText(geometry) FROM public.pref_miyagi;"""
df = pd.read_sql(query, con=conn)

# dbとカーソルを閉じる
conn.close()

display(df.head(2))
# pref	st_astext
# miyagi	POLYGON((140.59554456828445 37.906881932521955...
```


## まとめ
Python(psycopg2) + PostgreSQLで地物の統合とMULTIPOLYGONをPOLYGONで分解しました．

## 参考サイト
[Convert Geopandas Multipolygon to Polygon](https://stackoverflow.com/questions/68861184/convert-geopandas-multipolygon-to-polygon)

[convert Postgres geometry format to WKT](https://stackoverflow.com/questions/49905207/convert-postgres-geometry-format-to-wkt)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


