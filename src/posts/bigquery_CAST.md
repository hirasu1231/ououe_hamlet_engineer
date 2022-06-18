---
display: home
title: 'BigQueryで型変更する'
description: BigQueryで型変更します
date: 2022-6-20
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - SQL
  - Python
  - BigQuery
  - GCP
  - GoogleBigQuery
---
BigQueryで型変更します
<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## 型変更

```SQL
SELECT 
  -- ARRAY:ARRAY型
  -- 
  CAST(value as FLOAT64) 
FROM
  tablename
```

| 型名_SQL | 型名 | 
| - | - |
| ARRAY | ARRAY型 |
| BIGNUMERIC | 小数部分のある正確な数値 |
| BOOL | {0, 1} |
| BYTES | 2バイト数列 |
| DATE | 日付 |
| DATETIME | 時間付き日付('2019-05-02 12:48:35') |
| FLOAT64 | 小数点 |
| INT64 | 整数 |
| INTERVAL | 時間隔(interval '1 hour' * int '3' = interval '03:00') |
| NUMERIC | 数値(小数点前までは131072桁、小数点以降は16383桁) |
| STRING | 文字列 |
| STRUCT | 構造型 |
| TIME | 時刻型('HH:MM:SS') |
| TIMESTAMP | 国別時間付き日付('2019-05-02 12:48:35' UTC) |

### DATETIME型とTIMESTAMP型の違い

| DATETIME型 | TIMESTAMP型 |
| - | - |
| '1000-01-01 00:00:00' ～ '9999-12-31 23:59:59' | '1970-01-01 00:00:01' UTC ～ '2038-01-19 03:14:07' UTC |

### STRUCT | 構造型 例
![](STRUCT.png)

```SQL
SELECT
  user_id,
  event_params.key,
FROM
  sample_table
```


## 文字列をBIGNUMERICに変換

```SQL
SELECT PARSE_BIGNUMERIC("123.45") AS parsed

+--------+
| parsed |
+--------+
| 123.45 |
+--------+

SELECT PARSE_BIGNUMERIC("  -  12.34 ") as parsed;

+--------+
| parsed |
+--------+
| -12.34 |
+--------+

SELECT PARSE_BIGNUMERIC("12.34e-1-") as parsed;

+--------+
| parsed |
+--------+
| -1.234 |
+--------+

SELECT PARSE_BIGNUMERIC(".1234  ") as parsed;

+--------+
| parsed |
+--------+
| 0.1234 |
+--------+
```

## 文字列をNUMERICに変換

```SQL
-- This example shows how a string with a decimal point is parsed.
SELECT PARSE_NUMERIC("123.45") AS parsed

+--------+
| parsed |
+--------+
| 123.45 |
+--------+

-- This example shows how a string with an exponent is parsed.
SELECT PARSE_NUMERIC("12.34E27") as parsed

+-------------------------------+
| parsed                        |
+-------------------------------+
| 12340000000000000000000000000 |
+-------------------------------+

-- This example shows the rounding when digits after the decimal point exceeds 9.
SELECT PARSE_NUMERIC("1.0123456789") as parsed

+-------------+
| parsed      |
+-------------+
| 1.012345679 |
+-------------+
```


## SAFE_CAST
エラーとなる場合はNULLで出力される

```SQL
SELECT SAFE_CAST("apple" AS INT64) AS not_a_number;

+--------------+
| not_a_number |
+--------------+
| NULL         |
+--------------+
```

### その他の変換関数

| 変換関数 | 型変換の前 | 型変換の後 |
| - | - | - |
| ARRAY_TO_STRING | ARRAY | STRING |
| BOOL | JSON | BOOL |
| DATE | さまざまなデータ型 | DATE |
| DATETIME | さまざまなデータ型 | DATETIME |
| FLOAT64 | JSON | FLOAT64 |
| FROM_BASE32 | STRING | BYTES |
| FROM_BASE64 | STRING | BYTES |
| FROM_HEX | STRING | BYTES |
| INT64 | JSON | INT64 |
| PARSE_DATE | STRING | DATE |
| PARSE_DATETIME | STRING | DATETIME |
| PARSE_JSON | STRING | JSON |
| PARSE_TIME | STRING | TIME |
| PARSE_TIMESTAMP | STRING | TIMESTAMP |
| SAFE_CONVERT_BYTES_TO_STRING | BYTES | STRING |
| STRING | TIMESTAMP | STRING |
| STRING | JSON | STRING |
| TIME | さまざまなデータ型 | TIME |
| TIMESTAMP | さまざまなデータ型 | TIMESTAMP |
| TO_BASE32 | BYTES | STRING |
| TO_BASE64 | BYTES | STRING |
| TO_HEX | BYTES | STRING |
| TO_JSON | すべてのデータ型 | JSON |
| TO_JSON_STRING | すべてのデータ型。 | STRING |


## 参考サイト
[関数、演算子、条件 ](https://cloud.google.com/bigquery/docs/reference/standard-sql/functions-and-operators#casting)

[BigQueryでカラム（列）の型変換を行う方法](https://qiita.com/h1rok1tanaka/items/43ddf91913628c99a5c0)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">