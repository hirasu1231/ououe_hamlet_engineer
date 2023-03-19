---
display: home
title: 'SQLで地物に重なるデータを操作'
description: SQLで地物に重なるデータを操作します
date: 2023-4-6
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - Python
  - GIS
  - kepler
  - Colabratry
---
SQLで地物に重なるデータを操作します

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## latlonを抽出
```SQL
-- ST_INTERSECTS():地物の重なりで抽出
-- ST_GEOGPOINT():pointデータを作成
-- ST_GEOGFROMTEX():テキストをgeometry型に変換
SELECT 
  t1.*, 
  t2.*
FROM 
  move as t1
LEFT JOIN
  zone as t2
ON 
  ST_INTERSECTS(
    ST_GEOGPOINT(
      CAST(t1.lon as FLOAT64), 
      CAST(t1.lat as FLOAT64)
    ),
    ST_GEOGFROMTEXT(t2.geometry, make_valid => TRUE)
```

## まとめ
SQLで地物に重なるデータを操作しました。

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">