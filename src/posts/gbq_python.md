---
display: home
title: 'PythonでBig Queryを操作する'
description: PythonでBig Queryを操作します．
date: 2022-2-15
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - BigQuery
tags:
  - Python
  - BigQuery
  - GCP
  - GoogleBigQuery
---
PythonでBig Queryを操作します．

<!-- https://www.hamlet-engineer.com -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ライブラリのインストール
下記のコードでライブラリをインストールします．
```python
!pip install pandas-gbq
!pip install -U pyarrow
!pip install --upgrade pandas-gbq 'google-cloud-bigquery[bqstorage,pandas]'
```

## BigQueryと接続
下記のコードでPandasとBig Queryを接続させます.
```python
from google.cloud import bigquery

# keyとなるjsonファイルを読み込み
KEY_PATH = '****.json'
bq_client = bigquery.Client.from_service_account_json(KEY_PATH)
```

## データセットの生成
下記のコードでBig Queryのデータセットを生成します.
```python
# データセットの生成
dataset_id = '*****'
bq_client.create_dataset(dataset_id)

# データセットのリストを出力
for ds in bq_client.list_datasets():
    print(ds.dataset_id)
```

## テーブルの作成

### データの読み込み
下記のコードでBigQueryに入れるデータフレームを作成します.

```python
import glob
import pandas as pd

# csvの読み込み
path = "****.csv"
df = pd.read_csv(path)
```

## スキーマの作成
下記のコードでBigQueryに入れるデータの設定をまとめたスキーマを作成します．

```python
# データ型の確認
df_columns = df.dtypes
df_columns = pd.DataFrame(df_columns).reset_index()
df_columns = df_columns.rename(columns={'index': 'columns', 0: 'type'})

# スキーマ
schema = []
for i in range(len(df_columns)):
    column = df_columns['columns'][i]
    dtype = str(df_columns['type'][i]).replace('datetime64[ns]', 'DATETIME')\
                                      .replace('int64', 'INTEGER')\
                                      .replace('float64', 'FLOAT')\
                                      .replace('object', 'STRING')
    schema.append(bigquery.SchemaField(column, dtype, mode="NULLABLE"))
display(schema)

# [SchemaField('******', 'DATETIME', 'NULLABLE', None, (), None),
#  SchemaField('******', 'STRING', 'NULLABLE', None, (), None),
#  SchemaField('******', 'INTEGER', 'NULLABLE', None, (), None),
#  SchemaField('******', 'FLOAT', 'NULLABLE', None, (), None)]
```

## テーブルの作成
下記のコードでBigQueryのテーブルを作成します.

```python
# table_idを生成（形式 : project_name.dataset_id.table_name）
table_name = '*****'
dataset = bq_client.get_dataset(dataset_id)
table_id = '%s.%s.%s' % (dataset.project, dataset.dataset_id, table_name)

# テーブル生成
table = bigquery.Table(table_id, schema=schema)
bq_client.create_table(table)
```

## pandasからのデータの投入
pandasのDataFrameからそのままデータを投入します．

```python
# Tableを取得
table = bigquery.Table(table_id, schema=schema)

# DataFrameを投入
bq_client.insert_rows_from_dataframe(table, df)
```

## テーブルの削除
下記のコードでテーブルを削除します.

```python
# テーブルの削除
table = dataset.table(table_name)
bq_client.delete_table(table)
```


## まとめ
PythonでBig Queryを操作させました．

## 参考サイト
[PythonでBigQueryの操作](https://blog.imind.jp/entry/2019/12/08/025818)

[BigQuery ↔ Pandas間で読み込み/書き込み](https://qiita.com/komiya_____/items/8fd900006bbb2ebeb8b8)

[[BigQuery] BigQueryのPython用APIの使い方 -テーブル作成編-](https://qiita.com/Hyperion13fleet/items/0e00f4070f623dacf92b)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


