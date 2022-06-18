---
display: home
title: 'BigQueryでODを示すプローブデータを生成する'
description: BigQueryでODを示すプローブデータを生成します．
date: 2022-6-24
image: https://www.hamlet-engineer.com/image/postgres.png
categories: 
  - Python
tags:
  - Python
  - BigQuery
---
BigQueryでODを示すプローブデータを生成します．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## 架空の行動履歴データの作成

```python
import random
import datetime
import pandas as pd

# 重複なしランダム発生
def rand_ints_nodup(a, b, k):
    ns = []
    while len(ns) < k:
        n = random.randint(a, b)
        if not n in ns:
            ns.append(n)
    return ns

# 架空の行動履歴作成
def make_probe(_list, s, e):
    for _id in range(s, e):
        # 立ち寄りスポット数
        spot_num = random.randint(1, 5)
        # 立ち寄りスポットリスト
        spot_list = rand_ints_nodup(1, 5, spot_num)

        # 日付
        dt = datetime.datetime(2018, 2, 1, 9, 15, 30)
        # 日にち加算
        dp = random.randint(1, 20)
        dt = dt + datetime.timedelta(days=dp)
        date = str(dt).split('-')[1] + str(dt).split('-')[2].split(' ')[0]
        # 時刻加算
        hp = random.randint(1, 10)
        dt = dt + datetime.timedelta(hours=hp)

        for spot in spot_list:
            dt = dt + datetime.timedelta(minutes=1)
            _list.append([date, _id+1, dt, f'spot_{spot}'])
    return _list

# 行動履歴作成
probe_list = []
probe_list = make_probe(probe_list, 0, 400)
probe_list = make_probe(probe_list, 30, 140)

# データフレーム化
df = pd.DataFrame(probe_list, columns=['date', 'id', 'o_time', 'o_spot'])
df.head()

# index date	id	o_time	o_spot
# 0	0211	1	2018-02-11 18:16:30	spot_1
# 1	0211	1	2018-02-11 18:17:30	spot_2
```

## OD行動履歴データの生成
LAGを使ってOD行動履歴を作成します。
- LAG(カラム, 1) : カラムで1行ずらす
- OVER (PARTITION BY date, id): 「date, id」ごとにずらす
- OVER (ORDER BY id, o_time) : 「id, o_time」ごとにソートした上でずらす

```python
query = '''
SELECT 
    * ,
    LAG(o_time, 1) OVER (PARTITION BY date, id ORDER BY id, o_time) AS d_time,
    LAG(o_spot, 1) OVER (PARTITION BY date, id ORDER BY id, o_time) AS d_spot
FROM 
    probe
ORDER BY date, id o_time
'''
```

## まとめ
BigQueryでODを示すプローブデータを生成しました

## 参考サイト
[【BigQuery】LAG関数，LEAD関数の使い方](https://qiita.com/kota_fujimura/items/cff732bb9acb47510a03)

[BigQuery ScriptingでPythonっぽいループ処理をしてみた](https://qiita.com/CraveOwl/items/5ffcf5edac238b165bbb)



<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


