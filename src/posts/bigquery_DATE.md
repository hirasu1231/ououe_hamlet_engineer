---
display: home
title: 'BigQueryで日付型の足し算・引き算を使う'
description: BigQueryで日付型の加減を使います
date: 2022-7-20
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - Python
  - BigQuery
  - GCP
  - GoogleBigQuery
---
BigQueryで日付型の加減を使います
<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## データの作成


```SQL
WITH purchase_log AS (
  SELECT 'A' AS user_id, '2016-01-30' as last_date, '2016-01-30' as p_date, 'メロン' AS item UNION ALL
  SELECT 'A', 2017-12-30, 2016-01-30, '白菜' UNION ALL
  SELECT 'B', 2016-10-31, 2016-01-30, 'りんご' UNION ALL
  SELECT 'B', 2017-06-30, 2016-01-30, 'りんご' 
)
SELECT  * FROM purchase_log;
```

| user_id | last_date | p_date | item |
| - | - | - | - |
| A | 2016-01-30 | 2017-12-30 | メロン |
| A | 2017-12-30 | 2017-12-31 | 白菜 |
| B | 2016-10-31 | 2017-08-31 | りんご |
| B | 2017-06-30 | 2018-01-31 | りんご |


## 足し算・引き算
```SQL
SELECT
  user_id,
  last_date,
  -- 足し算
  DATE_ADD(last_date,INTERVAL 10 day ) AS ld_plu,
  -- 引き算
  DATE_SUB(last_date,INTERVAL 10 day) AS ld_minus
FROM
  test1.purchase_log;
```

| user_id | last_date | ld_plu | ld_minus |
| - | - | - | - |
| A | 2016-01-30 | 2016-02-09 | 2016-01-20 |
| A | 2017-12-30 | 2017-01-09 | 2017-12-20 |
| B | 2016-10-31 | 2016-11-10 | 2016-10-21 |
| B | 2017-06-30 | 2017-07-10 | 2017-06-20 |

TIMESTAMP_DIFF(usedate, lead1_usedate, DAY)*-1 AS diff_day,

## 日付型どうしの引き算

```SQL
SELECT
  user_id,
  last_date,
  p_date,
  -- 日付型どうしの引き算
  -- YEAR, MONTH, DAY
  DATE_DIFF(p_date,last_date, DAY) AS date
FROM
  test1.purchase_log;
```

| user_id | last_date | p_date | date |
| - | - | - | - |
| A | 2016-01-30 | 2017-12-30 | 700 |
| A | 2017-12-30 | 2017-12-31 | 1 |
| B | 2016-10-31 | 2017-08-31 | 304 |
| B | 2017-06-30 | 2018-01-31 | 215 |

## 時刻型どうしの引き算
```SQL
SELECT
  user_id,
  last_date,
  p_date,
  -- 時刻型の足し算
  TIMESTAMP_ADD(last_date, INTERVAL 10 day)AS after,
  -- 時刻型の引き算
  TIMESTAMP_SUB(last_date, INTERVAL 10 day)AS before,
  -- 時刻型どうしの引き算
  -- DAY, HOUR, MINUTE, SECOND
  TIMESTAMP_DIFF(p_date,last_date, DAY) AS Diff
FROM 
  (
  SELECT
    user_id,
    CAST(last_date AS TIMESTAMP) AS last_date,
    CAST(p_date AS TIMESTAMP) AS p_date
  FROM
    test1.purchase_log
  ) AS a;
```

| user_id | last_date | p_date | after | before | Diff |
| - | - | - | - |
| A | 2016-01-30 00:00:00 UTC | 2017-12-30 00:00:00 UTC | 2016-02-09 00:00:00 UTC | 2016-01-20 00:00:00 UTC | 700 |
| A | 2017-12-30 00:00:00 UTC | 2017-12-31 00:00:00 UTC | 2017-01-09 00:00:00 UTC | 2017-12-20 00:00:00 UTC | 1 |
| B | 2016-10-31 00:00:00 UTC | 2017-08-31 00:00:00 UTC | 2016-11-10 00:00:00 UTC | 2016-10-21 00:00:00 UTC | 304 |
| B | 2017-06-30 00:00:00 UTC | 2018-01-31 00:00:00 UTC | 2017-07-10 00:00:00 UTC | 2017-06-20 00:00:00 UTC | 215 |

## 参考サイト
[【SQL】BigQueryで日付型を扱う](https://qiita.com/minami_cograph/items/ccccf37bf25f95cba120)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">