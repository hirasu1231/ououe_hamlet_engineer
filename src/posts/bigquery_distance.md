---
display: home
title: 'BigQueryで2拠点間の距離を算出する'
description: BigQueryで2拠点間の距離を算出します
date: 2022-7-22
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - Python
  - GIS
  - BigQuery
  - GCP
  - GoogleBigQuery
---

BigQueryで2拠点間の距離を算出します

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]



## ライブラリのインストール


```python
!pip install --upgrade pandas-gbq 'google-cloud-bigquery[bqstorage,pandas]'
```

## テーブルの作成

### データフレームの作成
仮のデータを作成します。


```python
import pandas as pd

# データフレームの作成
df = pd.DataFrame(data=[['仙台駅', 38.26063926000281, 140.8822763620918],
                        ['青葉城', 38.252377384994105, 140.85612549176253],
                        ['榴岡公園', 38.26066273495602, 140.89707530354525],
                        ['ラーメン二郎仙台店', 38.26181864469619, 140.8662996759938]],
                  columns=['name', 'lat', 'lon'])

display(df)
```


### BigQueryと接続


```python
from google.cloud import bigquery

# keyとなるjsonファイルを読み込み
KEY_PATH = '****.json'

bq_client = bigquery.Client.from_service_account_json(KEY_PATH)
```

### データセットの生成¶


```python
# データセットの生成
dataset_id = 'sample_data'
bq_client.create_dataset(dataset_id)

for ds in bq_client.list_datasets():
    print(ds.dataset_id)
```


### テーブルの作成


```python
# データ型の確認
df_columns = df.dtypes
df_columns = pd.DataFrame(df_columns).reset_index()
df_columns = df_columns.rename(columns={'index': 'columns', 0: 'type'})
```


```python
# スキーマ
schema = []
for i in range(len(df_columns)):
    column = df_columns['columns'][i]
    dtype = str(df_columns['type'][i]).replace('datetime64[ns]', 'DATETIME')\
                                      .replace('int64', 'INTEGER')\
                                      .replace('object', 'STRING')
    schema.append(bigquery.SchemaField(column, dtype, mode="NULLABLE"))
```


```python
# table_idを生成（形式 : project_name.dataset_id.table_name）
dataset = bq_client.get_dataset(dataset_id)
table_id = '%s.%s.spot_table' % (dataset.project, dataset.dataset_id)

# テーブル生成
table = bigquery.Table(table_id, schema=schema)
bq_client.create_table(table)
```

### pandasからデータを投入
pandasのDataFrameからそのままデータを投入する


```python
# Tableを取得
table = bigquery.Table(table_id, schema=schema)

# DataFrameを投入
bq_client.insert_rows_from_dataframe(table, df)
```


### テーブルの確認


```python
import pandas as pd

query = f'''SELECT * 
            FROM {table_id}'''

# strベースのクエリと、project_idが必要
df_gbq = pd.read_gbq(query, table_id.split(".")[0])
display(df_gbq)
```

| name | lat | lon |
| - | - | - |
| 仙台駅 | 38.260639 | 140.882276 |
| 青葉城 | 38.252377 | 140.856125 |
| 榴岡公園 | 38.260663 | 140.897075 |
| ラーメン二郎仙台店 | 38.261819 | 140.866300 |

## BigQueryで各拠点間の組み合わせを作成
「CROSS JOIN」より、BigQueryで各拠点間の組み合わせを作成します。


```python
import pandas as pd

query = f'''
        WITH t1 AS (
            SELECT
            t0.name AS o_name, t0.lat AS o_lat, t0.lon AS o_lon
            FROM 
                {table_id} AS t0 
        ),
        t2 AS (
            SELECT
            t0.name AS d_name, t0.lat AS d_lat, t0.lon AS d_lon
            FROM 
                {table_id} AS t0 
        )
        SELECT
            *
        FROM 
            t1 
        CROSS JOIN t2'''

# strベースのクエリと、project_idが必要
df_gbq = pd.read_gbq(query, table_id.split(".")[0])
display(df_gbq)
```

| o_name | o_lat | o_lon | d_name | d_lat | d_lon |
| - | - | - | - | - | - |
| 榴岡公園 | 38.260663 | 140.897075 | 榴岡公園 | 38.260663 | 140.897075 |
| 榴岡公園 | 38.260663 | 140.897075 | 仙台駅 | 38.260639 | 140.882276 |
| 榴岡公園 | 38.260663 | 140.897075 | ラーメン二郎仙台店 | 38.261819 | 140.866300 |
| 榴岡公園 | 38.260663 | 140.897075 | 青葉城 | 38.252377 | 140.856125 |

## BigQueryで2拠点間距離を算出
「st_distance」より、BigQueryで2拠点間距離(m)を算出します。


```python
import pandas as pd

query = f'''
        WITH t1 AS (
            SELECT
            t0.name AS o_name, t0.lat AS o_lat, t0.lon AS o_lon
            FROM 
                {table_id} AS t0 
        ),
        t2 AS (
            SELECT
            t0.name AS d_name, t0.lat AS d_lat, t0.lon AS d_lon
            FROM 
                {table_id} AS t0 
        )
        SELECT
            *, 
            st_distance(
                st_geogpoint(o_lon, o_lat),
                st_geogpoint(d_lon, d_lat)
            ) as distance
        FROM (
            SELECT
                *
            FROM 
                t1 
            CROSS JOIN t2)'''

# strベースのクエリと、project_idが必要
df_gbq = pd.read_gbq(query, table_id.split(".")[0])
display(df_gbq)
```


| o_name | o_lat | o_lon | d_name | d_lat | d_lon | distance |
| - | - | - | - | - | - | - |
| ラーメン二郎仙台店 | 38.261819 | 140.866300 | ラーメン二郎仙台店 | 38.261819 | 140.866300 | 0.000000 |
| ラーメン二郎仙台店 | 38.261819 | 140.866300 | 青葉城 | 38.252377 | 140.856125 | 1375.247245 |
| ラーメン二郎仙台店 | 38.261819 | 140.866300 | 仙台駅 | 38.260639 | 140.882276 | 1401.073901 |
| ラーメン二郎仙台店 | 38.261819 | 140.866300 | 榴岡公園 | 38.260663 | 140.897075 | 2690.088942 |


## 参考サイト
[BigQueryで２点間の距離を計算する](https://qiita.com/shouta-dev/items/f7797665e325da35daf1)

[BigQuery クエリ構文](https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax?hl=ja)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">