---
display: home
title: 'Pythonで地物のポリゴン(境界データ)を統合する'
description: Pythonで地物のポリゴン(境界データ)を統合します．
date: 2023-2-12
image: https://www.hamlet-engineer.com/image/union_miyagi.png
categories: 
  - Python
tags:
  - memo
  - Python
  - NetworkX
  - Pandas
---
Pythonで地物のポリゴン(境界データ)を統合します．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ファイル構成

```
project_dir
├── /data
│   ├── /R2_boundary/04_miyagi/04_miyagi.shp
│   └── (省略)
└── merge_bound.ipynb <- 実行用ノートブック
```

## ポリゴン(境界データ)の統合
ポリゴン(境界データ)を統合します．

```python
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
from shapely.ops import unary_union

# 境界データのshpファイル読込
pref_gdf = gpd.read_file("./data/R2_boundary/04_miyagi/04_miyagi.shp")

fig = plt.figure()
ax  = fig.add_subplot()
# 境界データをmerge
bound = gpd.GeoSeries(unary_union(pref_gdf.geometry))

# 描画
bound.plot(ax=ax, color='none', edgecolor='b', linewidth=1)
plt.show()

# 出力
bound["pref"] = "miyagi"
```

![](/image/union_miyagi.png)

## まとめ
Pythonで地物のポリゴン(境界データ)を統合しました．

## 参考サイト


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

