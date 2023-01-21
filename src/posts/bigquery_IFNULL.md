---
display: home
title: 'BigQueryで欠損値補完を実施する'
description: BigQueryで欠損値補完を実施します
date: 2023-1-21
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - Python
  - BigQuery
  - GCP
  - GoogleBigQuery
---
BigQueryで欠損値補完を実施します
<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## データの作成

```SQL
SELECT 
  col1,
  col2,
  col3,
  IFNULL(col1,col2) as f
FROM test.null_sample
```

| Row | col1 | col2 | col3 | f |
| - | - | - | - | - |
| 1 | null | b | c | b |
| 2 | null | null | c | null |
| 3 | a | b | c | a |
| 4 | a | b | null | a |
| 5 | a | null | null | a |


## 参考サイト
[BigQueryで値がNULLだったら別のカラム値を使う方法](https://itips.krsw.biz/bigquery-how-to-use-alternative-column-value-in-case-of-null/#st-toc-h-2)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">