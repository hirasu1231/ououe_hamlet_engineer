---
display: home
title: '架空の行動履歴データでChordDiagram(弦グラフ)を作成する(前半)'
description: 架空の行動履歴データでChordDiagram(弦グラフ)を作成します．ここでは，架空の行動履歴データを作成します．
date: 2022-3-09
image: https://www.hamlet-engineer.com/image/ChordDiagram.png
categories: 
  - Python
tags:
  - Python
  - matplotlib
  - ChordDiagram
  - Visualization
---
架空の行動履歴データでChordDiagram(弦グラフ)を作成します．ここでは，架空の行動履歴データを作成します．

<!-- https://www.hamlet-engineer.com -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## 架空の行動履歴データの作成
下記のコードで架空の行動履歴データを作成します．
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
        # 時刻加算
        hp = random.randint(1, 10)
        dt = dt + datetime.timedelta(hours=hp)

        for spot in spot_list:
            dt = dt + datetime.timedelta(minutes=1)
            _list.append([_id+1, dt, f'spot_{spot}'])
    return _list

# 行動履歴作成
probe_list = []
probe_list = make_probe(probe_list, 0, 400)
probe_list = make_probe(probe_list, 30, 140)

# データフレーム化
df = pd.DataFrame(probe_list, columns=['id', 'datetime', 'spot'])
df.head()
```

## 行動履歴データの加工
ChordDiagram(弦グラフ)の作成には，OD表(クロス集計)をする必要があるため，行動履歴データの加工します．

```python
# 日付を抽出
df1 = df.copy()
df1['date'] = df1['datetime'].dt.date

# 出発時間のカラム名に変更
df1 = df1.rename(columns={'datetime':'o_time'})
df1 = df1.rename(columns={'spot':'o_spot'})
df1.head()
```

| id  | o_time | o_spot              | date   | 
| --- | ------ | ------------------- | ------ | 
| 0   | 1      | 2018-02-10 19:16:30 | spot_5 | 2018-02-10 | 
| 1   | 1      | 2018-02-10 19:17:30 | spot_4 | 2018-02-10 | 
| 2   | 1      | 2018-02-10 19:18:30 | spot_1 | 2018-02-10 | 
| 3   | 1      | 2018-02-10 19:19:30 | spot_2 | 2018-02-10 | 
| 4   | 2      | 2018-02-19 16:16:30 | spot_4 | 2018-02-19 | 

```python
import time

# dateリスト作成
dates = list(set(df1['date'].tolist()))
time.sleep(2)
dates.sort()

flag=0
for date in dates:
    # 日付のIDを抽出
    df_date = df1[df1['date']==date]
    ids = list(set(df_date['id'].tolist()))

    # ID毎
    for _id in ids:
        df_date_id = df_date[df_date['id']==_id]
        df_date_id = df_date_id.sort_values('o_time', ascending=False)
        df_date_id = df_date_id.reset_index(drop=True)
        
        # d_**
        df_date_id['d_time'] = df_date_id['o_time'][1:].tolist() + df_date_id['o_time'][-1:].tolist()
        df_date_id['d_spot'] = df_date_id['o_spot'][1:].tolist() + df_date_id['o_spot'][-1:].tolist()
        
        if not flag:
            df_merge = df_date_id
            flag = 1
        else:
            df_merge = pd.concat([df_merge, df_date_id])
            
df_merge.head()
```

| id  | o_time | o_spot | date | d_time | d_spot | 
| --- | --- | --- | --- | --- | --- | 
| 0   | 399 | 2018-02-02 18:16:30 | spot_1 | 2018-02-02 | 2018-02-02 18:16:30 | spot_1 | 
| 0   | 147 | 2018-02-02 15:19:30 | spot_4 | 2018-02-02 | 2018-02-02 15:18:30 | spot_3 | 
| 1   | 147 | 2018-02-02 15:18:30 | spot_3 | 2018-02-02 | 2018-02-02 15:17:30 | spot_2 | 
| 2   | 147 | 2018-02-02 15:17:30 | spot_2 | 2018-02-02 | 2018-02-02 15:16:30 | spot_1 | 
| 3   | 147 | 2018-02-02 15:16:30 | spot_1 | 2018-02-02 | 2018-02-02 15:16:30 | spot_1 | 


## OD表の作成

### 重複削除
今回は架空行動履歴データなので，重複削除で雑にクレンジングします．
```python
# 重複削除
df_merge2 = df_merge[['id', 'o_spot', 'd_spot']].drop_duplicates()
df_merge2.head()
```

### クロス集計
下記のコードでクロス集計します．
```python
# クロス集計
df_crosstab = pd.crosstab(df_merge2['o_spot'], df_merge2['d_spot'])
df_crosstab
```
| d_spot/<br>o_spot | spot_1 | spot_2 | spot_3 | spot_4 | spot_5 | 
| ------ | ------ | ------ | ------ | ------ | ------ | 
| spot_1 | 87 | 49 | 58 | 44 | 53 | 
| spot_2 | 69 | 96 | 43 | 48 | 49 | 
| spot_3 | 48 | 59 | 94 | 58 | 47 | 
| spot_4 | 55 | 51 | 53 | 97 | 51 | 
| spot_5 | 34 | 54 | 51 | 60 | 104 | 

## まとめ
架空の行動履歴データでChordDiagram(弦グラフ)を作成するために,架空の行動履歴データを作成しました．

## 参考サイト
[Pythonで重複のない乱数を生成する方法を現役エンジニアが解説【初心者向け】](https://techacademy.jp/magazine/21160)

[Pythonのdatetimeで日付や時間と文字列を変換](https://note.nkmk.me/python-datetime-usage/)

[日付の加算 減算 timedelta](https://python.civic-apps.com/timedelta/)

[pandasのdatetimeをdateに変換したい](https://teratail.com/questions/132333)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


