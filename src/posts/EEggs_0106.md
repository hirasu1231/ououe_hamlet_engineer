---
display: home
title: 'foliumで特定座標の位置を把握する'
description: foliumで特定座標の位置を把握します
date: 2022-6-1
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - 小ネタ
  - Python
  - pandas
---
foliumで特定座標の位置を把握します。

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ライブラリのインストール
```python
!pip install folium
```

## 架空データの作成
```python
import folium

# 東京タワー (lat, lon) = (35.658584, 139.7454316)
lat, lon = 35.658584, 139.7454316

# 地図オブジェクト作成
map = folium.Map(location=[lat, lon], zoom_start=18)
# 地図表示
map
```

![](/image/tokyo_tower_folium.png)


## まとめ
foliumで特定座標の位置を把握しました。

## 参考サイト
<!-- [pandasのdatetimeをdateに変換したい](https://teratail.com/questions/132333) -->


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


