---
display: home
title: '[小ネタ]date型の加算を実行する'
description: date型の加算を実行します。
date: 2022-5-4
image: https://www.hamlet-engineer.com/image/Python.png
categories: 
  - Python
tags:
  - 小ネタ
  - Python
  - date
---
date型の加算を実行します。

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## date型の加算
```python
import datetime

# datetimeの生成
dt = datetime.datetime(2018, 2, 1, 9, 15, 30)

# 日にち加算
dt = dt + datetime.timedelta(days=1)

# 時刻加算
hp = random.randint(1, 10)
dt = dt + datetime.timedelta(hours=1)

# 分加算
dt = dt + datetime.timedelta(minutes=1)
```

## まとめ
date型の加算を実行しました．

## 参考サイト
[日付の加算 減算 timedelta](https://python.civic-apps.com/timedelta/)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


