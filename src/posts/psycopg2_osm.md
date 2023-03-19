---
display: home
title: 'Python(psycopg2) + PostgreSQLでosmを入出力する'
description: Python(psycopg2) + PostgreSQLでosmを入出力します．
date: 2023-4-1
image: https://www.hamlet-engineer.com/image/postgres.png
categories: 
  - Python
tags:
  - memo
  - Python
  - PostgreSQL
  - psycopg2
  - SQL
  - OpenStreetMap
---
Python(psycopg2) + PostgreSQLでosmを入出力します．


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


## OSMの読み込み
geometry(地物情報)はそのままPostgreSQLに格納できないので、WKTに変換します。

```python
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
from shapely.ops import unary_union

# osmデータのshpファイル読込
osm_gdf = gpd.read_file("./data/osm/tohoku/gis_osm_roads_free_1.shp")

# 0~10行を抽出
gdf1 = osm_gdf[0:10]
# WKTに変換
gdf1['geometry'] = gdf1['geometry'].apply(lambda x: WKTElement(x.wkt, srid=4326))
display(gdf1.head(2))
```

## PostgreSQLに格納
```python
import os
import psycopg2
from sqlalchemy import create_engine
from geoalchemy2 import Geometry, WKTElement

# DBのURL
DATABASE_URL='postgresql://postgre:postgre@workspace-postgres-1:5432/postgres'

# テーブル作成のDB起動
engine = create_engine(DATABASE_URL)
# テーブル作成 if_exists='replace' or 'append'
gdf1.to_sql('osm',con=engine,if_exists='replace',index=None,
               dtype={'geometry': Geometry(geometry_type='LINESTRING', srid= 4326)})

```

## PostgreSQLから出力
そのままだと、下記のようにWKTのままで出力します。
```python
import os
import psycopg2
import pandas as pd

# DATABASE_URL
DATABASE_URL='postgresql://postgre:postgre@workspace-postgres-1:5432/postgres'

# postgresの接続
conn = psycopg2.connect(DATABASE_URL)
conn.autocommit = True # 操作の重複を防ぐ(databaseの操作)呪文

# テーブル名一覧を取得するSQL
query = """SELECT geometry FROM public.osm;"""
df = pd.read_sql(query, con=conn)

# dbとカーソルを閉じる
conn.close()

display(df.head(2))
# 0102000020E6100000270000004308235103A36140829E...
# 0102000020E6100000050000009F4CED56609C614090B1...
```

酔って、下記のようにWKTからテキストに変換して出力します。
```python
import os
import psycopg2
import pandas as pd

# DATABASE_URL
DATABASE_URL='postgresql://postgre:postgre@workspace-postgres-1:5432/postgres'

# postgresの接続
conn = psycopg2.connect(DATABASE_URL)
# conn.autocommit = True # 操作の重複を防ぐ(databaseの操作)呪文
# cur = conn.cursor()

# テーブル名一覧を取得するSQL
query = """SELECT ST_AsText(geometry) FROM public.osm;"""
df = pd.read_sql(query, con=conn)

# dbとカーソルを閉じる
conn.close()

display(df.head(2))
# LINESTRING(141.0941549 38.8040228,141.0945369 ...
# LINESTRING(140.8867602 38.3035443,140.8866131 ...
```


## まとめ
Python(psycopg2) + PostgreSQLでosmを入出力しました．

## 参考サイト



<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


