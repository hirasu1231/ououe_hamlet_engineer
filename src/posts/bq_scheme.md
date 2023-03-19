---
display: home
title: 'BigQueryのカラム設定を簡単に'
description: BigQueryのカラム設定を簡単にします
date: 2023-4-8
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - Python
  - GIS
  - kepler
  - Colabratry
---
BigQueryのカラム設定を簡単にします

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## latlonを抽出
```python
import pandas as pd

df = pd.read_csv("./data.csv")
for c in df.columns:
  print(f"{c}:STRING,")
```
aa:STRING,
bb:STRING,
cc:STRING,
dd:STRING,

上記をコピーして，JSON形式に切り替えて貼り付ける

## まとめ
BigQueryのカラム設定を簡単にしました。

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">