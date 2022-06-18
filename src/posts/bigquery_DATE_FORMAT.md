---
display: home
title: 'BigQueryでUTC(米国標準時）からJST(日本標準時）へ変更する'
description: igQueryでUTC(米国標準時）からJST(日本標準時）へ変更します
date: 2022-6-21
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - SQL
tags:
  - Python
  - BigQuery
  - GCP
  - GoogleBigQuery
---
igQueryでUTC(米国標準時）からJST(日本標準時）へ変更します
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

## 表示をJST(日本標準時）へ変更
```SQL
SELECT
  user_id,
  last_date,
  -- 表示をJST(日本標準時）へ変更
  FORMAT_TIMESTAMP('%Y-%m-%d %H:%M:%S', last_date, 'Asia/Tokyo') AS JST
FROM 
  (
  SELECT
    user_id,
    CAST(last_date AS TIMESTAMP) AS last_date,
    CAST(p_date AS TIMESTAMP) AS p_date
  FROM
    test1.purchase_log
  );
```

| user_id | last_date | JST |
| - | - | - | - |
| A | 2016-01-30 00:00:00 UTC | 2016-01-30 09:00:00 |
| A | 2017-12-30 00:00:00 UTC | 2017-12-30 09:00:00 |
| B | 2016-10-31 00:00:00 UTC | 2016-10-31 09:00:00 |
| B | 2017-06-30 00:00:00 UTC | 2017-06-30 09:00:00 |

## 参考サイト
[【SQL】BigQueryで日付型を扱う](https://qiita.com/minami_cograph/items/ccccf37bf25f95cba120)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">