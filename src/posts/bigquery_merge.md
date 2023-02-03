---
display: home
title: 'BigQueryで2つのテーブルを結合する'
description: BigQueryで2つのテーブルを結合します
date: 2023-2-3
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - Python
  - BigQuery
  - GCP
  - GoogleBigQuery
---
BigQueryで2つのテーブルを結合します
<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## テーブル
**item.item_table1**

| id | item | prime |
| - | - | - |
| 1 | A | 100 |
| 2 | B | 200 |
| 3 | C | 300 |


**item.item_table2**

| id | item | prime |
| - | - | - |
| 1 | A | 100 |
| 2 | B | 200 |
| 4 | D | 400 |


**item.item_table3**

| id | class |
| - | - |
| 1 | A_class |
| 2 | B_class |


## 縦に結合
```SQL
-- 結果を結合したものを、重複ありで返します
SELECT
    * 
FROM
  item.item_table1 
UNION ALL 
SELECT
    * 
FROM
  item.item_table2;
```

| id | item | prime |
| - | - | - |
| 1 | A | 100 |
| 2 | B | 200 |
| 3 | C | 300 |
| 1 | A | 100 |
| 2 | B | 200 |
| 4 | D | 400 |

```SQL
-- 結果を結合したものを、重複なしで返します
SELECT
    * 
FROM
  item.item_table1 
UNION DISTINCT 
SELECT
    * 
FROM
  item.item_table2
ORDER BY
  user_id
  , item
  , price;
```

| id | item | prime |
| - | - | - |
| 1 | A | 100 |
| 2 | B | 200 |
| 3 | C | 300 |
| 4 | D | 400 |

## 条件付きの結合(横)
```SQL
-- idが一致するものを横に結合
-- t2にないidがt1にある場合は除去される
SELECT
    t1.*,
    t3.class
FROM
  item.item_table1 AS t1
INNER JOIN
  item.item_table3 AS t3
ON 
    t1.id = t3.id
```

| id | item | prime | class |
| - | - | - | - |
| 1 | A | 100 | A_class |
| 2 | B | 200 | B_class |

## 条件付きの結合(横&null補正)
```SQL
-- idが一致するものを横に結合
-- t2にないidがある場合は、null値で補完
SELECT
    t1.*,
    t3.class
FROM
  item.item_table1 AS t1
LEFT JOIN
  item.item_table3 AS t3
ON 
    t1.id = t3.id
```

| id | item | prime | class |
| - | - | - | - |
| 1 | A | 100 | A_class |
| 2 | B | 200 | B_class |
| 3 | C | 300 | null |


## 参考サイト
[【BigQuery】集合演算子(UNION…)まとめ](https://qiita.com/tatsuhiko_kawabe/items/2537c562c6d99f83e37b)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">