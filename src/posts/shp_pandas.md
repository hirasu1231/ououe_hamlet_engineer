---
display: home
title: 'shpファイルをPandas風に読み込む'
description: shpファイルをPandas風に読み込みます．
date: 2022-8-3
image: https://www.hamlet-engineer.com/image/shp.png
categories: 
  - Python
tags:
  - memo
  - Python
  - GIS
  - Pandas
  - shp
  - kowaza0708
---
shpファイルをPandas風に読み込みます．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ライブラリのインストール

```python
!pip install geopandas
```

## shpの読み込み
下記のコードでshpファイルを読み込みます。

```python
import pandas as pd
import geopandas as gpd

# shpファイルの読込み
gdf = gpd.read_file("*******.shp")

gdf.head()
```


## まとめ
shpファイルをPandas風に読み込みました．

## 参考サイト


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


