---
display: home
title: 'BigQueryでWIH句を使用する'
description: BigQueryでWIH句を使用します．
date: 2022-3-31
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - Python
  - BigQuery
---
BigQueryでWIH句を使用します．

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

## 行動履歴データの加工
WIH句を使って、下記の処理を実施します。
1. 条件1〜3で各々の出力を整理する

```python
query = '''
WITH 
    t1 AS
    (SELECT 
        COUNT(id) AS CNT_id1, COUNT(DISTINCT id) AS CNTD_id1
    FROM
        probe
    WHERE
        条件1),
    t2 AS
    (SELECT 
        COUNT(id) AS CNT_id2, COUNT(DISTINCT id) AS CNTD_id2
    FROM
        probe
    WHERE
        条件2),
    t3 AS
    (SELECT 
        COUNT(id) AS CNT_id3, COUNT(DISTINCT id) AS CNTD_id3
    FROM
        probe
    WHERE
        条件3)
SELECT 
    t1.CNT_id1, t1.CNTD_id1, t2.CNTD_id2, t3.CNTD_id3
FROM
    t1,t2,t3
'''
```

## まとめ
BigQueryでWIH句を使用しました．

## 参考サイト
[pandas で sqlite3 の読み書き](https://qiita.com/ekzemplaro/items/8dbf65cad62511854053)

[【 コピペでOK】９割の機能を網羅！PytonからPostgreSQLを扱うクラスを作ってみました。](https://resanaplaza.com/2021/09/15/%E3%80%90-%E3%82%B3%E3%83%94%E3%83%9A%E3%81%A7ok%E3%80%91%EF%BC%99%E5%89%B2%E3%81%AE%E6%A9%9F%E8%83%BD%E3%82%92%E7%B6%B2%E7%BE%85%EF%BC%81pyton%E3%81%8B%E3%82%89postgresql%E3%82%92%E6%89%B1%E3%81%86/)

[PandasのDataFrameでPostgreSQLに読み書きする方法](https://tanuhack.com/pandas-postgres-readto/#PostgreSQL-3)

[BigQuery ScriptingでPythonっぽいループ処理をしてみた](https://qiita.com/CraveOwl/items/5ffcf5edac238b165bbb)



<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


