---
display: home
title: 'データ可視化ライブラリ Altairを使ってみる(時系列データ編)'
description: 時系列データでのデータ可視化ライブラリ Altair を使ってみる．
date: 2021-09-22
image: https://www.hamlet-engineer.com/image/Altair_logo.jpeg
categories: 
  - Python
tags:
  - Python
  - jupyter
  - Altair
---
<!-- https://www.hamlet-engineer.com -->
時系列データでのデータ可視化ライブラリ Altair を使ってみる．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

## モジュールのインストール

```python
!pip3 install altair
!pip3 install altair_saver
```

## 時系列デモデータの作成
可視化するためにでもデータを作成します．


```python
import numpy as np
import pandas as pd
import datetime

np.random.seed(1) # 乱数の固定

goods_list = ['商品A','商品B','商品C'] # 調査対象の商品
sex_list = ['男','女']

t = [] # 時刻リスト
g = [] # 商品リスト
a = [] # 年齢リスト
s = [] # 性別リスト

# 2000 年の元日からの 1 年間でシミュレーションを行う。
time = datetime.datetime(2000, 1, 1, 0)

while time.year == 2000:
    # 顧客の来店をガンマ分布でシミュレーション
    # 冬に来客数が増えるように調整
    gamma = 0.5 * (12-abs(time.month-6)) 
    time += datetime.timedelta(
        hours = np.round(np.random.gamma(gamma)
            )
        )
    ## 営業時間を 9:00 ~ 21:00 とする。
    ## それ以外に来客した場合、来客時間を 12 時間先送りにする。
    if 21 < time.hour or time.hour < 9:
        time += datetime.timedelta(hours = 12)
    t.append(time)

    # 顧客がどの商品を選ぶのかをランダムで決める
    goods = np.random.choice(goods_list, p=[0.6,0.3,0.1])
    g.append(goods)

    # 商品購入者の年齢をシミュレーション
    if goods == '商品A':
        age = np.round(np.random.normal(35,15))
    elif goods == '商品B':
        age = np.round(np.random.normal(50,20))
    else :
        age = np.round(np.random.normal(65,10))
    a.append(age)

    # 商品購入者の性別をシミュレーション
    if goods == '商品A':
        sex = np.random.choice(sex_list, p=[0.75,0.25])
    elif goods == '商品B':
        sex = np.random.choice(sex_list, p=[0.4,0.6])
    else :
        sex = np.random.choice(sex_list, p=[0.2,0.8])
    s.append(sex)

    # 2001 年になったらシミュレーションを終了する。
    if time.year == 2001:
        break

df = pd.DataFrame()
df['来客時間'] = t
df['購入商品'] = g
df['年齢'] = a
df['性別'] = s
df = df[:-1]

display(df)
display(df.head(5))
```


<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>来客時間</th>
      <th>購入商品</th>
      <th>年齢</th>
      <th>性別</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2000-01-01 19:00:00</td>
      <td>商品A</td>
      <td>26.0</td>
      <td>男</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2000-01-01 21:00:00</td>
      <td>商品A</td>
      <td>10.0</td>
      <td>男</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2000-01-02 13:00:00</td>
      <td>商品B</td>
      <td>45.0</td>
      <td>女</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2000-01-02 15:00:00</td>
      <td>商品B</td>
      <td>54.0</td>
      <td>女</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2000-01-02 21:00:00</td>
      <td>商品B</td>
      <td>28.0</td>
      <td>男</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>999</th>
      <td>2000-12-30 20:00:00</td>
      <td>商品A</td>
      <td>46.0</td>
      <td>男</td>
    </tr>
    <tr>
      <th>1000</th>
      <td>2000-12-31 10:00:00</td>
      <td>商品B</td>
      <td>42.0</td>
      <td>女</td>
    </tr>
    <tr>
      <th>1001</th>
      <td>2000-12-31 14:00:00</td>
      <td>商品B</td>
      <td>85.0</td>
      <td>女</td>
    </tr>
    <tr>
      <th>1002</th>
      <td>2000-12-31 17:00:00</td>
      <td>商品A</td>
      <td>59.0</td>
      <td>男</td>
    </tr>
    <tr>
      <th>1003</th>
      <td>2000-12-31 21:00:00</td>
      <td>商品B</td>
      <td>36.0</td>
      <td>女</td>
    </tr>
  </tbody>
</table>
<p>1004 rows × 4 columns</p>
</div>



<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>来客時間</th>
      <th>購入商品</th>
      <th>年齢</th>
      <th>性別</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2000-01-01 19:00:00</td>
      <td>商品A</td>
      <td>26.0</td>
      <td>男</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2000-01-01 21:00:00</td>
      <td>商品A</td>
      <td>10.0</td>
      <td>男</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2000-01-02 13:00:00</td>
      <td>商品B</td>
      <td>45.0</td>
      <td>女</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2000-01-02 15:00:00</td>
      <td>商品B</td>
      <td>54.0</td>
      <td>女</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2000-01-02 21:00:00</td>
      <td>商品B</td>
      <td>28.0</td>
      <td>男</td>
    </tr>
  </tbody>
</table>
</div>


## 時系列デモデータの可視化

### 折れ線グラフ


```python
import altair as alt
from altair_saver import save

line = alt.Chart(df).mark_line().encode(
    x=alt.X('month:O',
        timeUnit='month',
        title='来客月'
        ),
    y=alt.Y('count(購入商品)',
        title='購入数'
        ),
    color='購入商品'
    ).transform_timeunit(
    month='month(来客時間)'
    )


# 描画
display(line)
# 保存
# save(line, "qiita10.html",embed_options={'actions':True})
```

![](/image/Altair_line01.png)

## 折れ線グラフ（エラーバンドあり）
今回は 95% 信頼区間でエラーバンドをつけてみます．


```python
import altair as alt
from altair_saver import save

line = alt.Chart().mark_line().encode(
    x=alt.X('month:O',
        timeUnit='month',
        title='来客月'
        ),
    y=alt.Y('mean(年齢)',
        title='年齢'
        ),
    color='購入商品'
).transform_timeunit(
    month='month(来客時間)'
)

band = alt.Chart().mark_errorband(extent='ci').encode(
    x=alt.X('month:O',
        timeUnit='month',
        title='来客月'
        ),
    y=alt.Y('年齢', 
        title='年齢'
        ),
    color='購入商品'
).transform_timeunit(
    month='month(来客時間)'
)

chart = alt.layer(line,band, data=df)

# 描画
display(chart)
# 保存
# save(chart, "qiita11.html",embed_options={'actions':True})
```

![](/image/Altair_line02.png)

## まとめ
今回は，時系列データでの代表的なもので実装しました．

次は，別のオリジナルデータで可視化してみます．

## 参考サイト
[【Python】データ可視化ライブラリ Altair を使いこなす](https://qiita.com/keisuke-ota/items/aa93f45b3a9fc520541d)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">