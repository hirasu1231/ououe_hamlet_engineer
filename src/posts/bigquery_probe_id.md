---
display: home
title: 'BigQueryでプローブデータの来訪順を考慮した滞在スポットごとにIDを振る'
description: BigQueryでプローブデータの来訪順を考慮した滞在スポットごとにIDを振ります．
date: 2023-2-3
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - Python
  - プローブデータ
  - GCP
  - GoogleBigQuery
---
igQueryでプローブデータの来訪順を考慮した滞在スポットごとにIDを振ります．

注意:かなりゴリ押しでIDを振りました。他に良い手法があればご教授ください。
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

## 架空の行動履歴データの作成
仮のデータを作成します。


```python
import random
import datetime
import pandas as pd

# 重複なしランダム発生
def rand_ints_nodup(a, b, k):
    ns = []
    while len(ns) < k:
        n = random.randint(a, b)
        if not n in ns:
            ns.append(n)
    return ns

# 架空の行動履歴作成
def make_probe(_list, s, e):
    for _id in range(s, e):
        # 立ち寄りスポット数
        spot_num = random.randint(1, 5)
        # 立ち寄りスポットリスト
        spot_list = rand_ints_nodup(1, 5, spot_num)
        # 日付
        dt = datetime.datetime(2018, 2, 1, 9, 15, 30)
        # 日にち加算
        dp = random.randint(1, 20)
        dt = dt + datetime.timedelta(days=dp)
        date = str(dt).split('-')[1] + str(dt).split('-')[2].split(' ')[0]
        # 時刻加算
        hp = random.randint(1, 10)
        dt = dt + datetime.timedelta(hours=hp)

        for spot in spot_list:
            tflag = 0
            n = random.randint(0, 10)
            while n > tflag:
                tflag += 1
                mims = random.randint(1, 5)
                dt = dt + datetime.timedelta(minutes=mims)
                _list.append([date, _id+1, dt, f'spot_{spot}'])
    return _list

# 行動履歴作成
probe_list = []
probe_list = make_probe(probe_list, 0, 400)
probe_list = make_probe(probe_list, 30, 140)

# データフレーム化
df = pd.DataFrame(probe_list, columns=['date', 'id', 'time', 'spot'])
display(df)
```

## テーブルの作成

### BigQueryと接続


```python
from google.cloud import bigquery

# keyとなるjsonファイルを読み込み
KEY_PATH = '＊＊＊＊＊＊.json'
# KEY_PATH = '****.json'

bq_client = bigquery.Client.from_service_account_json(KEY_PATH)
```

### データセットの生成

```python
# データセットの生成
dataset_id = 'sample_data'
try:
    bq_client.create_dataset(dataset_id)
except:
    print("Existed")

for ds in bq_client.list_datasets():
    print(ds.dataset_id)
```


### テーブルの作成とdfの格納

```python
from google.cloud import bigquery
import time 
# pandasからBQスキーマを作成
def bq_mkschema(schema_df):
    # データ型の確認
    df_columns = schema_df.dtypes
    df_columns = pd.DataFrame(df_columns).reset_index()
    df_columns = df_columns.rename(columns={'index': 'columns', 0: 'type'})
    # スキーマ作成
    schema = []
    for i in range(len(df_columns)):
        column = df_columns['columns'][i]
        dtype = str(df_columns['type'][i]).replace('datetime64[ns]', 'DATETIME')\
                                          .replace('int64', 'INTEGER')\
                                          .replace('INT64', 'INTEGER')\
                                          .replace('object', 'STRING')
        schema.append(bigquery.SchemaField(column, dtype, mode="NULLABLE"))
    
    return schema

# BQでテーブルの存在確認
def exist_tabel(exist_table_name):
    return table_name in [table.table_id for table in bq_client.list_tables(dataset=dataset_id)]
    

# BQでテーブル情報作成
def bq_table_info(table_name, table_schema):
    # テーブル名
    dataset = bq_client.get_dataset(dataset_id)
    table_id = '%s.%s.%s' % (dataset.project, dataset.dataset_id, table_name)
    
    # テーブル情報
    table_info = bigquery.Table(table_id, schema=table_schema)
    # テーブル生成
    if not exist_tabel(table_name):
        bq_client.create_table(table_info)
    return table_info

# pandasからBQに格納
def bq_insert_pandas(insert_df, insert_table_name):
    # スキーマ作成
    insert_schema = bq_mkschema(insert_df)
    # テーブル情報取得
    insert_table_info = bq_table_info(insert_table_name, insert_schema)
    while not exist_tabel(insert_table_name):
        continue
    # DataFrameを投入
    bq_client.insert_rows_from_dataframe(insert_table_info, insert_df)
    
# pandasからBQに格納
def bq_update_pandas(update_df, update_table_name):
    # テーブル削除
    dataset = bq_client.get_dataset(dataset_id)
    table = dataset.table(update_table_name)
    bq_client.delete_table(table)
    time.sleep(10)
    # スキーマ作成
    update_schema = bq_mkschema(update_df)
    # テーブル情報取得
    update_table_info = bq_table_info(update_table_name, update_schema)
    while not exist_tabel(update_table_name):
        continue
    # DataFrameを投入
    bq_client.insert_rows_from_dataframe(update_table_info, update_df)
```


```python
# pandasからBQに格納
bq_insert_pandas(df, "probe_table")
```

### テーブルの確認

```python
import pandas as pd

# テーブル名
table_name = "probe_table"
dataset = bq_client.get_dataset(dataset_id)
table_id = '%s.%s.%s' % (dataset.project, dataset.dataset_id, table_name)
# クエリ
query = f'''SELECT * 
            FROM {table_id}'''

# strベースのクエリと、project_idが必要
df_gbq = pd.read_gbq(query, table_id.split(".")[0])
display(df_gbq)
```

| date | id | time | spot |
| - | - | - | - |
| 0206 | 1 | 2018-02-06 15:18:30 | spot_4 |
| 0206 | 1 | 2018-02-06 15:20:30 | spot_4 |

## 来訪順を考慮した滞在スポットごとにID配布
ID配布の工程を下記に示します。

1. 各行に次の行動データを追加(LAG/LEAD関数)
2. 次の行動より、滞在する(stay) or 移動する(move)　を明示
3. 行動ID(behavior_id)を配布する
4. 行動ID(behavior_id)ごとに集計

### 各行に次の行動データを追加(LAG/LEAD関数)
- LAG(column, 1):1行分くり下げる
- LEAD(column, 1):1行分くり上げる

#### クエリの実行

```python
import pandas as pd

# テーブル名
table_name = "probe_table"
dataset = bq_client.get_dataset(dataset_id)
table_id = '%s.%s.%s' % (dataset.project, dataset.dataset_id, table_name)

query = f'''
        SELECT 
            * ,
            LEAD(time, 1) OVER (PARTITION BY date, id ORDER BY id, time) AS next_time,
            LEAD(spot, 1) OVER (PARTITION BY date, id ORDER BY id, time) AS next_spot
        FROM 
            {table_id}
        ORDER BY date, id, time
        '''

# strベースのクエリと、project_idが必要
df_lag = pd.read_gbq(query, table_id.split(".")[0])
display(df_lag)
```

| date | id | time | spot | next_time | next_spot |
| - | - | - | - | - | - |
| 0202 | 26 | 2018-02-02 15:19:30 | spot_1 | 2018-02-02 15:23:30 | spot_1 |
| 0202 | 26 | 2018-02-02 15:23:30 | spot_1 | 2018-02-02 15:24:30 | spot_1 |

#### データ型の確認と変更
Int64ではエラーが出るので、int64に変更します


```python
# Int64 -> int64
df_lag["id"] = df_lag["id"].astype('int')
display(df_lag.dtypes)

# date                 object
# id                    int64
# time         datetime64[ns]
# spot                 object
# next_time    datetime64[ns]
# next_spot            object
# dtype: object
```

#### BQに格納
下記のコードで新たにテーブルを作成します。


```python
# pandasからBQに格納
bq_insert_pandas(df_lag, "prep_table")
```


### 次の行動より、滞在する(stay) or 移動する(move)　を明示

#### クエリの実行

```python
import pandas as pd

# テーブル名
table_name = "prep_table"
dataset = bq_client.get_dataset(dataset_id)
table_id = '%s.%s.%s' % (dataset.project, dataset.dataset_id, table_name)

query = f'''
        SELECT 
            *,
        CASE 
            WHEN spot=next_spot THEN 1
            ELSE 0
            END
        AS stay_flag,
        FROM 
            {table_id}
        WHERE 
            next_time is not null 
        ORDER BY date, id, time
        '''

# strベースのクエリと、project_idが必要
df_behavior = pd.read_gbq(query, table_id.split(".")[0])
display(df_behavior)
```


| date | id | time | spot | next_time | next_spot | stay_flag |
| - | - | - | - | - | - | - |
| 0202 | 26 | 2018-02-02 15:19:30 | spot_1 | 2018-02-02 15:23:30 | spot_1 | 1 |
| 0202 | 26 | 2018-02-02 15:23:30 | spot_1 | 2018-02-02 15:24:30 | spot_1 | 1 |

#### データ型の確認と変更
Int64ではエラーが出るので、int64に変更します


```python
# Int64 -> int64
df_behavior["id"] = df_behavior["id"].astype('int')
df_behavior["stay_flag"] = df_behavior["stay_flag"].astype('int')
display(df_behavior.dtypes)

# date                 object
# id                    int64
# time         datetime64[ns]
# spot                 object
# next_time    datetime64[ns]
# next_spot            object
# stay_flag             int64
# dtype: object
```


#### BQに格納
下記のコードで新たにテーブルを作成します。


```python
# pandasからBQに格納(アップデート)
bq_update_pandas(df_behavior, "prep_table")
```


```python
# テーブル名
table_name = "prep_table"
dataset = bq_client.get_dataset(dataset_id)
table_id = '%s.%s.%s' % (dataset.project, dataset.dataset_id, table_name)
# クエリ
query = f'''SELECT * 
            FROM {table_id}
            LIMIT 5'''

# strベースのクエリと、project_idが必要
df_gbq = pd.read_gbq(query, table_id.split(".")[0])
display(df_gbq)
```

### 行動ID(behavior_id)を配布する
滞在、移動に切り替わるたびに、振り直されるIDを追記します。

#### 移動データの行に移動時の仮ID(m_vid)を配布
別spotへ移動する行に、日別のIDごとに10単位で移動時の仮ID(m_vid)を追記します。


```python
# テーブル名
table_name = "prep_table"
dataset = bq_client.get_dataset(dataset_id)
table_id = '%s.%s.%s' % (dataset.project, dataset.dataset_id, table_name)
# クエリ
query = f'''
    SELECT 
        *,
        ROW_NUMBER() OVER(PARTITION BY date, id ORDER BY time, id)*10 m_vid
    FROM 
        {table_id}
    WHERE 
        stay_flag=0
    ORDER BY date, id, time
    '''

# strベースのクエリと、project_idが必要
df_gbq = pd.read_gbq(query, table_id.split(".")[0])
display(df_gbq)
```

| date | id | time | spot | next_time | next_spot | stay_flag | m_vid |
| - | - | - | - | - | - | - | - |
| 0202 | 26 | 2018-02-02 15:34:30 | spot_1 | 2018-02-02 15:36:30 | spot_2 | 0 | 10 |
| 0202 | 26 | 2018-02-02 16:08:30 | spot_2 | 2018-02-02 16:12:30 | spot_4 | 0 | 20 |
| 0202 | 51 | 2018-02-02 13:28:30 | spot_5 | 2018-02-02 13:32:30 | spot_1 | 0 | 10 |

#### 滞在データの行に滞在時の仮ID(s_vid)を配布
別spotへ移動する行に、日別のIDごとに10単位で滞在時の仮ID(s_vid)を追記します。


```python
# テーブル名
table_name = "prep_table"
dataset = bq_client.get_dataset(dataset_id)
table_id = '%s.%s.%s' % (dataset.project, dataset.dataset_id, table_name)
# クエリ
query = f'''
    SELECT 
        *,
        CASE WHEN stay_flag=1 THEN 5 ELSE 0 END AS s_vid,
    FROM 
        {table_id}
    ORDER BY date, id, time
    '''

# strベースのクエリと、project_idが必要
df_gbq = pd.read_gbq(query, table_id.split(".")[0])
display(df_gbq)
```


| date | id | time | spot | next_time | next_spot | stay_flag | s_vid |
| - | - | - | - | - | - | - | - |
| 0202 | 26 | 2018-02-02 15:19:30 | spot_1 | 2018-02-02 15:23:30 | spot_1 | 1 | 5 |
| 0202 | 26 | 2018-02-02 15:23:30 | spot_1 | 2018-02-02 15:24:30 | spot_1 | 1 | 5 |
| 0202 | 26 | 2018-02-02 15:24:30 | spot_1 | 2018-02-02 15:25:30 | spot_1 | 1 | 5 |

#### 移動/滞在時の仮ID(m_vid/s_vid)のテーブルを結合
移動/滞在時の仮ID(m_vid/s_vid)のテーブルを「LEFT JOIN」で結合させます。


```python
# テーブル名
table_name = "prep_table"
dataset = bq_client.get_dataset(dataset_id)
table_id = '%s.%s.%s' % (dataset.project, dataset.dataset_id, table_name)

# クエリ
query = f'''
    WITH t1 AS(
    SELECT 
        *,
        ROW_NUMBER() OVER(PARTITION BY date, id ORDER BY time, id)*10 m_vid
    FROM 
        {table_id}
    WHERE 
        stay_flag=0
    ORDER BY date, id, time),
    t2 AS(
    SELECT 
        *,
        CASE WHEN stay_flag=1 THEN 5 ELSE 0 END AS s_vid,
    FROM 
        {table_id}
    ORDER BY date, id, time)
    SELECT 
        t2.*,
        t1.m_vid
    FROM 
        t2 
    LEFT JOIN 
        t1 
    ON 
        t2.time = t1.time AND 
        t2.id = t1.id AND 
        t2.spot = t1.spot
    ORDER BY t2.date, t2.id, t2.time
    '''

# strベースのクエリと、project_idが必要
df_gbq = pd.read_gbq(query, table_id.split(".")[0])
display(df_gbq)
```

| date | id | time | spot | next_time | next_spot | stay_flag | s_vid | m_vid |
| - | - | - | - | - | - | - | - | - |
| 0202 | 26 | 2018-02-02 15:19:30 | spot_1 | 2018-02-02 15:23:30 | spot_1 | 1 | 5 | <NA> |
| 0202 | 26 | 2018-02-02 15:23:30 | spot_1 | 2018-02-02 15:24:30 | spot_1 | 1 | 5 | <NA> |
| 0202 | 26 | 2018-02-02 15:24:30 | spot_1 | 2018-02-02 15:25:30 | spot_1 | 1 | 5 | <NA> |

#### 結合後のm_vidをNULL補完_1
結合後のm_vidをFirst_VALUE()でNULL補完します。
```python
# NULL, NULL, NULL, 10, NULL, 20, NULL
#   10,   10,   10, 10,   20, 20, NULL
```


```python
# テーブル名
table_name = "prep_table"
dataset = bq_client.get_dataset(dataset_id)
table_id = '%s.%s.%s' % (dataset.project, dataset.dataset_id, table_name)

# クエリ
query = f'''
    WITH t1 AS(
    SELECT 
        *,
        ROW_NUMBER() OVER(PARTITION BY date, id ORDER BY time, id)*10 m_vid
    FROM 
        {table_id}
    WHERE 
        stay_flag=0
    ORDER BY date, id, time),
    t2 AS(
    SELECT 
        *,
        CASE WHEN stay_flag=1 THEN 5 ELSE 0 END AS s_vid,
    FROM 
        {table_id}
    ORDER BY date, id, time)
    SELECT 
        t2.*,
        t1.m_vid,
        First_VALUE(t1.m_vid IGNORE NULLS) OVER ( 
            PARTITION BY t2.date,t2.id
            ORDER BY t2.time, t2.id, t2.next_time 
            ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) As FV_num,
        First_VALUE(t1.m_vid IGNORE NULLS) OVER (
            PARTITION BY t2.date,t2.id
            ORDER BY t2.time, t2.id, t2.next_time 
            ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) - t2.s_vid As behavior_id
    FROM 
        t2 LEFT JOIN t1 
        ON t2.time = t1.time AND 
        t2.id = t1.id AND 
        t2.spot = t1.spot
    ORDER BY t2.date, t2.id, t2.time
    '''

# strベースのクエリと、project_idが必要
df_gbq = pd.read_gbq(query, table_id.split(".")[0])
display(df_gbq)
```

| date | id | time | spot | next_time | next_spot | stay_flag | s_vid | m_vid | FV_num | behavior_id |
| - | - | - | - | - | - | - | - | - | - | - |
| 0202 | 26 | 2018-02-02 15:19:30 | spot_1 | 2018-02-02 15:23:30 | spot_1 | 1 | 5 | <NA> | 10 | 5 |
| 0202 | 26 | 2018-02-02 15:23:30 | spot_1 | 2018-02-02 15:24:30 | spot_1 | 1 | 5 | <NA> | 10 | 5 |
| 0202 | 26 | 2018-02-02 15:24:30 | spot_1 | 2018-02-02 15:25:30 | spot_1 | 1 | 5 | <NA> | 10 | 5 |

#### 結合後のm_vidをNULL補完_2
最終滞在spotのm_vidのNULLは補完出来ていないので、IFNULL()でします。(最終滞在spotでは9999とする)
```python
#   10,   10,   10, 10,   20, 20, NULL
#   10,   10,   10, 10,   20, 20, 9999
```


```python
# テーブル名
table_name = "prep_table"
dataset = bq_client.get_dataset(dataset_id)
table_id = '%s.%s.%s' % (dataset.project, dataset.dataset_id, table_name)

# クエリ
query = f'''
    WITH t1 AS(
    SELECT 
        *,
        ROW_NUMBER() OVER(PARTITION BY date, id ORDER BY time, id)*10 m_vid
    FROM 
        {table_id}
    WHERE 
        stay_flag=0
    ORDER BY date, id, time),
    t2 AS(
    SELECT 
        *,
        CASE WHEN stay_flag=1 THEN 5 ELSE 0 END AS s_vid,
    FROM 
        {table_id}
    ORDER BY date, id, time)
    SELECT 
        t3.date,
        t3.id, 
        t3.time, 
        t3.spot, 
        t3.next_time, 
        t3.next_spot, 
        t3.stay_flag, 
        IFNULL(t3.behavior_id, 9999) AS behavior_id
    FROM 
        (SELECT 
            t2.*,
            t1.m_vid,
            First_VALUE(t1.m_vid IGNORE NULLS) OVER ( 
                PARTITION BY t2.date,t2.id
                ORDER BY t2.time, t2.id, t2.next_time 
                ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) As FV_num,
            First_VALUE(t1.m_vid IGNORE NULLS) OVER (
                PARTITION BY t2.date,t2.id
                ORDER BY t2.time, t2.id, t2.next_time 
                ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) - t2.s_vid AS behavior_id
        FROM 
            t2 
        LEFT JOIN 
            t1 
        ON 
            t2.time = t1.time AND 
            t2.id = t1.id AND 
            t2.spot = t1.spot
        ORDER BY t2.date, t2.id, t2.time) AS t3
    '''

# strベースのクエリと、project_idが必要
df_gbq = pd.read_gbq(query, table_id.split(".")[0])
display(df_gbq)
```

| date | id | time | spot | next_time | next_spot | stay_flag | behavior_id |
| - | - | - | - | - | - | - | - |
| 0202 | 26 | 2018-02-02 15:19:30 | spot_1 | 2018-02-02 15:23:30 | spot_1 | 1 | 5 |
| 0202 | 26 | 2018-02-02 15:23:30 | spot_1 | 2018-02-02 15:24:30 | spot_1 | 1 | 5 |
| 0221 | 376 | 2018-02-21 13:36:30 | spot_1 | 2018-02-21 13:41:30 | spot_1 | 1 | 9999 |
| 0221 | 376 | 2018-02-21 13:41:30 | spot_1 | 2018-02-21 13:43:30 | spot_1 | 1 | 9999 |

#### データ型の確認と変更
Int64ではエラーが出るので、int64に変更します


```python
# display(df_gbq.dtypes)
# Int64 -> int64
df_gbq["id"] = df_gbq["id"].astype('int')
df_gbq["stay_flag"] = df_gbq["stay_flag"].astype('int')
df_gbq["behavior_id"] = df_gbq["behavior_id"].astype('int')
display(df_gbq.dtypes)

# date                   object
# id                      int64
# time           datetime64[ns]
# spot                   object
# next_time      datetime64[ns]
# next_spot              object
# stay_flag               int64
# behavior_id             int64
# dtype: object
```


#### BQに格納
下記のコードで新たにテーブルを作成します。


```python
# pandasからBQに格納(アップデート)
bq_update_pandas(df_gbq, "prep_table")
```

```python
# テーブル名
table_name = "prep_table"
dataset = bq_client.get_dataset(dataset_id)
table_id = '%s.%s.%s' % (dataset.project, dataset.dataset_id, table_name)
# クエリ
query = f'''SELECT * 
            FROM {table_id}
            LIMIT 10'''

# strベースのクエリと、project_idが必要
df_gbq = pd.read_gbq(query, table_id.split(".")[0])
display(df_gbq)
```


| date | id | time | spot | next_time | next_spot | stay_flag | behavior_id |
| - | - | - | - | - | - | - | - |
| 0202 | 26 | 2018-02-02 15:19:30 | spot_1 | 2018-02-02 15:23:30 | spot_1 | 1 | 5 |
| 0202 | 26 | 2018-02-02 15:23:30 | spot_1 | 2018-02-02 15:24:30 | spot_1 | 1 | 5 |
| 0202 | 26 | 2018-02-02 15:33:30 | spot_1 | 2018-02-02 15:34:30 | spot_1 | 1 | 5 |
| 0202 | 26 | 2018-02-02 15:34:30 | spot_1 | 2018-02-02 15:36:30 | spot_2 | 0 | 10 |
| 0202 | 26 | 2018-02-02 15:36:30 | spot_2 | 2018-02-02 15:41:30 | spot_2 | 1 | 15 |

### 行動ID(behavior_id)ごとに集計
spotにいつから,いつまで滞在・移動していたかを、行動ID(behavior_id)ごとに集計します。

```python
# テーブル名
table_name = "prep_table"
dataset = bq_client.get_dataset(dataset_id)
table_id = '%s.%s.%s' % (dataset.project, dataset.dataset_id, table_name)

# クエリ
query = f'''
    SELECT 
        date,　id,
        spot, MIN(time) AS in_time,
        next_spot, MAX(next_time) AS out_time,
        stay_flag, behavior_id
    FROM 
        {table_id}
    GROUP BY date,　id, behavior_id, spot, next_spot, stay_flag
    ORDER BY in_time,　id
    '''

# strベースのクエリと、project_idが必要
df_gbq = pd.read_gbq(query, table_id.split(".")[0])
# display(df_gbq)

# データの確認
df_gbq[(df_gbq["date"]=="0202")&(df_gbq["id"]==26)]
```


| date | id | spot | in_time | next_spot | out_time | stay_flag | behavior_id |
| - | - | - | - | - | - | - | - |
| 0202 | 26 | spot_1 | 2018-02-02 15:19:30 | spot_1 | 2018-02-02 15:34:30 | 1 | 5 |
| 0202 | 26 | spot_1 | 2018-02-02 15:34:30 | spot_2 | 2018-02-02 15:36:30 | 0 | 10 |
| 0202 | 26 | spot_2 | 2018-02-02 15:36:30 | spot_2 | 2018-02-02 16:08:30 | 1 | 15 |
| 0202 | 26 | spot_2 | 2018-02-02 16:08:30 | spot_4 | 2018-02-02 16:12:30 | 0 | 20 |
| 0202 | 26 | spot_4 | 2018-02-02 16:12:30 | spot_4 | 2018-02-02 16:47:30 | 1 | 9999 |

#### データ型の確認と変更
Int64ではエラーが出るので、int64に変更します


```python
# display(df_gbq.dtypes)
# Int64 -> int64
df_gbq["id"] = df_gbq["id"].astype('int')
df_gbq["stay_flag"] = df_gbq["stay_flag"].astype('int')
df_gbq["behavior_id"] = df_gbq["behavior_id"].astype('int')
display(df_gbq.dtypes)

# date                   object
# id                      int64
# spot                   object
# in_time        datetime64[ns]
# next_spot              object
# out_time       datetime64[ns]
# stay_flag               int64
# behavior_id             int64
# dtype: object
```


#### BQに格納
下記のコードで新たにテーブルを作成します。

```python
# pandasからBQに格納(アップデート)
bq_update_pandas(df_gbq, "prep_table")
```


```python
# テーブル名
table_name = "prep_table"
dataset = bq_client.get_dataset(dataset_id)
table_id = '%s.%s.%s' % (dataset.project, dataset.dataset_id, table_name)
# クエリ
query = f'''SELECT * 
            FROM {table_id}'''

# strベースのクエリと、project_idが必要
df_gbq = pd.read_gbq(query, table_id.split(".")[0])
# データの確認
df_gbq[(df_gbq["date"]=="0202")&(df_gbq["id"]==26)]
```

## 参考サイト
[PythonでBigQueryの操作](https://blog.imind.jp/entry/2019/12/08/025818)

[BigQuery ↔ Pandas間で読み込み/書き込み](https://qiita.com/komiya_____/items/8fd900006bbb2ebeb8b8)

[[BigQuery] BigQueryのPython用APIの使い方 -テーブル作成編-](https://qiita.com/Hyperion13fleet/items/0e00f4070f623dacf92b)

[Google BigQueryでLEFTJOINしたい](https://qiita.com/toyotomihideyoshi/items/b44f66adaa5f02bfe449)

[連番を振るROW_NUMBER関数を解説](https://style.potepan.com/articles/23566.html)

[時間のギャップを埋めて欠損値を補完する](https://docs.microsoft.com/ja-jp/azure/azure-sql-edge/imputing-missing-values)

[BigQueryである条件を満たす直近の行を抽出するSQL](https://zenn.dev/justice_vsbr/articles/780235b4a4bd5d)

[【図解】SQLでJOINを使う方法（OUTER・LEFT・RIGHT）](https://gotto50105010.hatenablog.com/entry/2018/12/21/233915)

[分析関数（ウインドウ関数）をわかりやすく説明してみた](https://qiita.com/tlokweng/items/fc13dc30cc1aa28231c5)

[ナビゲーション関数 FIRST_VALUE](https://cloud.google.com/bigquery/docs/reference/standard-sql/navigation_functions)

[Pandas で欠損値を含む整数型を扱う](https://qiita.com/hoto17296/items/b6c90db4b9bcdb7b6d78)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">