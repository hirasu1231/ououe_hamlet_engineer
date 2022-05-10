---
display: home
title: 'pandasでdatetimeをdateに変換する'
description: pandasでdatetimeをdateに変換します。
date: 2022-5-6
image: https://www.hamlet-engineer.com/image/Python.png
categories: 
  - Python
tags:
  - Python
  - date
  - 小ネタ
---
pandasでdatetimeをdateに変換します。

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## 架空データの作成
```python
import datetime
import pandas as pd

# 架空のリスト作成
def make_probe(_list, s, e):
    for _id in range(s, e):
        # 日付
        dt = datetime.datetime(2018, 2, 1, 9, 15, 30)
        _list.append([_id+1, dt])
    return _list

# リスト作成
probe_list = []
probe_list = make_probe(probe_list, 0, 4)

# データフレーム化
df = pd.DataFrame(probe_list, columns=['id', 'datetime'])
df.head()
```

| id | datetime | 
| ---- | ---- |
| 1 | 2018-02-01 09:15:30 | 
| 2 | 2018-02-01 09:15:30 | 
| 3 | 2018-02-01 09:15:30 | 
| 4 | 2018-02-01 09:15:30 | 

## date型の加算
```python
# datetimeをdateに変換
df['date'] = df['datetime'].dt.date
df.head()
```

| id | datetime | date |
| ---- | ---- | ---- |
| 1 | 2018-02-01 09:15:30 | 2018-02-01 |
| 2 | 2018-02-01 09:15:30 | 2018-02-01 |
| 3 | 2018-02-01 09:15:30 | 2018-02-01 |
| 4 | 2018-02-01 09:15:30 | 2018-02-01 |

## まとめ
pandasでdatetimeをdateに変換しました．

## 参考サイト
[pandasのdatetimeをdateに変換したい](https://teratail.com/questions/132333)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


