---
display: home
title: 'BigQueryでwhile文を使用する'
description: BigQueryでwhile文を使用します．
date: 2022-3-29
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - Python
  - BigQuery
---
BigQueryでwhile文を使用します．

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
while文を使って、SQLの繰り返し処理を実施します。
1. dateのリスト作成
2. dateごとのidリストを作成
3. idとリストを条件にテーブル出力(出力1)
4. 出力1をLAGで1行ずつずらす
5. 次の移動先と移動時間を1行に格納
6. 別のテーブルに追加 <-未実装

```python
query = '''
-- 出力テーブル
-- date, id, o_time, o_spot, d_time, d_spot

-- 変数の宣言
-- ids という配列を作ってループを回します
DECLARE ids ARRAY<INT64>;
-- ids で使う引数（デフォルト値＝1)
DECLARE x INT64 DEFAULT 1;

-- got_dates という配列を作ってループを回します
DECLARE got_dates ARRAY<DATE>;
-- got_dates で使う引数（デフォルト値＝1)
DECLARE y INT64 DEFAULT 1;

-- 変数への代入
SET got_dates = (
  SELECT 
    ARRAY_AGG(got_date) as got_date_list
  FROM 
    (SELECT DISTINCT(DATE(o_time)) AS got_date FROM probe ORDER BY got_date)
);

-- ループ処理
-- array_length(ids) DO
-- date毎
WHILE y <= 1 DO 
  -- 変数への代入
  SET x = 1;

  SET ids = (
    SELECT ARRAY_AGG(id) as list 
    FROM 
    (SELECT DISTINCT(id)
      FROM probe
      WHERE DATE(o_time)=got_dates[ORDINAL(y)]
      ORDER BY id)
  );

  -- id毎
  -- array_length(ids) DO
  WHILE x <= 2 DO
    SELECT 
      date, id, o_time, o_spot,
      LAG(o_time, -1) OVER(order by o_time) as d_time, 
      LAG(o_spot, -1) OVER(order by o_time) as d_spot
    FROM 
    (
    -- mac_addrsのX番目の値を取り出す
    SELECT
        DATE(o_time) AS got_date, id, o_time, o_spot
    FROM
      probe
    WHERE 
      id=ids[ORDINAL(x)] AND DATE(otime)=got_dates[ORDINAL(y)]
    ORDER BY o_time
    )
    ORDER BY o_time;

    SET x = x + 1;
  END WHILE;
  SET y = y + 1;
END WHILE;
'''
```

## まとめ
PandasでPostgreSQLを操作しました．

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


