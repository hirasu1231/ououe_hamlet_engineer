---
display: home
title: 'Python(psycopg2) + PostgreSQLで特定の地物と重なる地物を抽出する(POLYGON)'
description: Python(psycopg2) + PostgreSQLで特定の地物と重なる地物を抽出します(POLYGON)
date: 2023-1-26
image: https://www.hamlet-engineer.com/image/miyagi_osm.png
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
Python(psycopg2) + PostgreSQLで特定の地物と重なる地物を抽出します(POLYGON)


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

## ライブラリのインポート

```python
import os
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
from shapely.ops import unary_union

import psycopg2
from shapely import wkt
from sqlalchemy import create_engine
from geoalchemy2 import Geometry, WKTElement
```


## OSMのDB作成

```python
# osmデータのshpファイル読込
osm_gdf = gpd.read_file("./data/osm/tohoku/gis_osm_roads_free_1.shp")
# WKTに変換
osm_gdf['geometry'] = osm_gdf['geometry'].apply(lambda x: WKTElement(x.wkt, srid=4326))

# DBのURL
DATABASE_URL='postgresql://postgre:postgre@workspace-postgres-1:5432/postgres'

# テーブル作成のDB起動
engine = create_engine(DATABASE_URL)
# テーブル作成 if_exists='replace' or 'append'
osm_gdf.to_sql('osm',con=engine,if_exists='replace',index=None,
               dtype={'geometry': Geometry(geometry_type='LINESTRING', srid= 4326)})
```

## 境界データのDB作成(最大面積のPOLYGON)
MULTIPOLYGONからPOLYGONへ分解し、最大面積のPOLYGONを抽出します。

```python
# 境界データのshpファイル読込
pref_gdf = gpd.read_file("./data/R2_boundary/04_miyagi/04_miyagi.shp")

# 境界データをmerge
bound = gpd.GeoSeries(unary_union(pref_gdf.geometry))
bound.crs = "epsg:4326"

# MULTIPOLYGONからPOLYGONへ分解
bound_df = bound.explode().reset_index()
bound_df = bound_df.rename(columns={0: "geom"})
# 面積の算出
bound_df["area"] = bound_df["geom"].area
# 面積でソート
bound_df = bound_df.sort_values('area', ascending=False).reset_index(drop=True)
# 宮城県でデータフレーム作成
pgsl_miyagi = pd.DataFrame([["miyagi", bound_df["geom"][0]]], columns=["pref", "geometry"])

# WKTに変換
pgsl_miyagi['geometry'] = pgsl_miyagi['geometry'].apply(lambda x: WKTElement(x.wkt, srid=4326))

# DBのURL
DATABASE_URL='postgresql://postgre:postgre@workspace-postgres-1:5432/postgres'

# テーブル作成のDB起動
engine = create_engine(DATABASE_URL)
# テーブル作成 if_exists='replace' or 'append'
pgsl_miyagi.to_sql('pref_miyagi',con=engine,if_exists='replace',index=None,
                 dtype={'geometry': Geometry(geometry_type='POLYGON', srid= 4326)})

```

## POLYGON内の道路を抽出
[PostGISを使う: データ管理とクエリ](http://postgres.cn/docs/postgis-2.3/using_postgis_dbmanagement.html#idp33886320)

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
query = """
        SELECT 
            t1.osm_id, t1.code, t1.fclass, t1.name, 
            ST_AsText(t1.geometry) AS geometry,
            ST_Intersects(t1.geometry, t2.geometry)
        FROM 
            public.osm AS t1,
            public.pref_miyagi AS t2
        WHERE 
            t2.pref='miyagi' AND 
            ST_Intersects(t1.geometry, t2.geometry);"""

df = pd.read_sql(query, con=conn)

# dbとカーソルを閉じる
conn.close()

display(df.head())
```

| osm_id | code | fclass | name | geometry | st_intersects |
| - | - | - | - | - | - |
| 15450378 | 5121 | unclassified | None | LINESTRING(140.6271628 37.9942567,140.627269 3... | True |
| 115450383 | 5121 | unclassified | None | LINESTRING(140.6130333 37.991994,140.6131692 3... | True |
| 115450398 | 5121 | unclassified | None | LINESTRING(140.621601 37.990825,140.6218304 37... | True |
| 115450693 | 5122 | residential | None | LINESTRING(140.6343659 37.994537,140.6347219 3... | True |
| 115450727 | 5121 | unclassified | None | LINESTRING(140.6315763 37.9931608,140.6327262 ... | True |

## shpファイルで出力
※時間がかかる

```python
# geopandasに変換
df_shp = df.copy()
geometry = df_shp["geometry"].apply(wkt.loads)
df_shp.drop('geometry', axis=1, inplace=True)
geo_df = gpd.GeoDataFrame(df_shp, geometry=geometry)

#Shape出力
!mkdir -p ./data/shp_dir
geo_df.to_file(driver='ESRI Shapefile', filename="./data/shp_dir/miyagi_osm.shp")
```

![](/image/miyagi_osm.png)


## まとめ
Python(psycopg2) + PostgreSQLで特定の地物と重なる地物を抽出しました(POLYGON)

## 参考サイト
[The Shapely User Manual](https://shapely.readthedocs.io/en/stable/manual.html)<br>
[PostGISを使う: データ管理とクエリ](http://postgres.cn/docs/postgis-2.3/using_postgis_dbmanagement.html#idp33886320)<br>
[geopandasを使ってShapeファイルを作成しよう！ ~Airbnbのデータを可視化してみよう~](https://www.gis-py.com/entry/geopandas_shape)<br>
[pandas-drop](https://note.nkmk.me/python-pandas-drop/)<br>
[TypeError: Input geometry column must contain valid geometry objects](https://gis.stackexchange.com/questions/327197/typeerror-input-geometry-column-must-contain-valid-geometry-objects)<br>
[PostGISを使う: データ管理とクエリ](http://postgres.cn/docs/postgis-2.3/using_postgis_dbmanagement.html#idp33886320)



<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


