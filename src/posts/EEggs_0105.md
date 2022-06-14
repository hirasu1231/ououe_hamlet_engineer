---
display: home
title: 'pandasのクロス集計を実行する'
description: pandasのクロス集計を実行します
date: 2022-5-20
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - memo
  - Python
  - pandas
---
pandasのクロス集計を実行します。

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## 架空データの作成
```python
import random
import datetime
import pandas as pd

# 架空の行動履歴作成
def make_probe(_list, s, e):
    for _id in range(s, e):
        # 立ち寄りスポット数
        spot_num = random.randint(1, 5)
        for i in range(spot_num):
            spot1 = random.randint(1, 5)
            spot2 = random.randint(1, 5)
            _list.append([_id+1, f'spot_{spot1}', f'spot_{spot2}'])
    return _list

# 行動履歴作成
probe_list = []
probe_list = make_probe(probe_list, 0, 400)

# データフレーム化
df = pd.DataFrame(probe_list, columns=['id', 'o_spot', 'd_spot'])
df.head()
```

|  | id | o_spot | d_spot |
| ---- | ---- | ---- | ---- |
| 0 | 1 | spot_5 | spot_2 |
| 1 | 1 | spot_3 | spot_3 |
| 2 | 1 | spot_3 | spot_2 |
| 3 | 1 | spot_3 | spot_1 |
| 4 | 2 | spot_5 | spot_1 |


## pandasのクロス集計
```python
# クロス集計
df_crosstab = pd.crosstab(df['o_spot'], df['d_spot'])
df_crosstab
```

| o_spot/d_spot | spot_1 | spot_2 | spot_3 | spot_4 | spot_5 |
| ---- | ---- | ---- | ---- | ---- | ---- |
| spot_1 | 53 | 54 | 53 | 44 | 40
| spot_2 | 54 | 48 | 40 | 44 | 55
| spot_3 | 37 | 38 | 57 | 48 | 56
| spot_4 | 47 | 42 | 42 | 62 | 40
| spot_5 | 53 | 50 | 64 | 44 | 45


## まとめ
pandasのクロス集計を実行しました。

## 参考サイト
<!-- [pandasのdatetimeをdateに変換したい](https://teratail.com/questions/132333) -->


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


