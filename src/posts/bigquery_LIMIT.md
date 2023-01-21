---
display: home
title: 'BigQueryで最初の5行を出力する'
description: BigQueryで最初の5行を出力します
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
BigQueryで最初の5行を出力します
<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## 最初の4行

```SQL
SELECT 
  *
FROM 
  user 
LIMIT 4;
```

## 最初の4行から3行分

```SQL
SELECT 
  *
FROM 
  user 
LIMIT 3
OFFSET 4;
```

select * from user limit 3 offset 4;



## 参考サイト
[取得するデータの数と開始位置を指定(LIMIT句, OFFSET句)](https://www.dbonline.jp/sqlite/select/index10.html)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">