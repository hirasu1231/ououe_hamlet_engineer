---
display: home
title: '国別covid-19感染者データでアニメーション棒グラフを作成しよう'
description: 国別covid-19感染者データでアニメーション棒グラフを作成します．
date: 2021-12-22
image: https://www.hamlet-engineer.com/image/covid-19-bar.png
categories: 
  - Python
tags:
  - Python
  - jupyter
  - グラフ
  - 可視化
---
<!-- https://www.hamlet-engineer.com -->
国別covid-19感染者データでアニメーション棒グラフを作成します．

<!-- more -->

[[toc]]


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">


## Google Colabのファイル構成
プロジェクトディレクトリはcolor_videoとしています．度々，省略しています．
```init
color_video
├── /macacon
│   ├── colorize.tfmodel <- 学習済みモデル
│   └── (省略)
└── pandas_alive.ipynb <- 実行用ノートブック
```

## データのダウンロード
下記のコードでデータをダウンロードします．
```python
!wget https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv \
    -O time_series_covid19_confirmed_global.csv
```

# データの整形
下記にcsvファイルのカラムがあります．

- Province_State：州の名前。
- Country_Region：国、地域、または主権の名前。ウェブサイトに含まれている場所の名前は、米国国務省が使用している正式な名称に対応しています。
- Lat and Long_：緯度軽度。地図に表示されているすべてのポイント（オーストラリアを除く）は地理的な重心に基づいており、特定の住所、建物、または州/州よりも細かい空間スケールの場所を表すものではありません。オーストラリアの点は、各州で最大の都市の重心にあります
- 1/22/20〜10/26/21: 各日付の累計感染者

今回使用するのは「Country/Region」列にある国名と各日付の列にある累計感染者数ですので，不要な「Lat」と「Long」列を列ごと削除します．

下記のコードでデータフレームの情報を

```python
import pandas as pd

# データの読み込み
df = pd.read_csv('time_series_covid19_confirmed_global.csv')
display(df.head())

# カラムが多すぎる
display(df.info())

# <class 'pandas.core.frame.DataFrame'>
# RangeIndex: 279 entries, 0 to 278
# Columns: 648 entries, Province/State to 10/26/21
# dtypes: float64(2), int64(644), object(2)
# memory usage: 1.4+ MB
# None
```

よって，下記のコードでカラムを一部抽出して，NULLがあるか確認する．
```python
df[['Province/State', 'Country/Region', 'Lat', 'Long', '1/22/20']].info()

# 出力結果
# <class 'pandas.core.frame.DataFrame'>
# RangeIndex: 279 entries, 0 to 278
# Data columns (total 5 columns):
#  #   Column          Non-Null Count  Dtype  
# ---  ------          --------------  -----  
#  0   Province/State  87 non-null     object 
#  1   Country/Region  279 non-null    object 
#  2   Lat             277 non-null    float64
#  3   Long            277 non-null    float64
#  4   1/22/20         279 non-null    int64  
# dtypes: float64(2), int64(1), object(2)
# memory usage: 11.0+ KB
```

「Country/Region」がnullなしにも関わらず，「Province/State」にはnullが存在することがわかります．

次に，重複が存在するか，確認すします．
出力結果より，2つのカラムについて，下記のことが判明しました．
- Province/State：重複なし
- Country/Region：重複あり(count > unique)

```python
# 統計情報の表示(カテゴリーデータ)
df.describe(include=['O'])
```
|  | Province/State | Country/Region |
| - | - | - |
| count | 87 | 279 |
| unique | 87 | 195 |
| top | Australian Capital Territory | Chine |
| freq | 1 | 34 |

そして，「Country/Region」でどのような国が重複しているのか，を確認します．
```python
# Country/Region
CRdf = df.groupby('Country/Region').count().sort_values('1/22/20', ascending=False)
CRdf = CRdf[['1/22/20']].rename(columns={'1/22/20': 'count'})
display(CRdf)
```
| Country/Region | count |
| - | - |
| China | 34 |
| Canada | 16 |
| France | 12 |
| ... | ... |


下記のコードで中国のデータを抜粋すると，「Province/State」が存在することがわかります．
```python
# 中国のデータを抜粋
df[df['Country/Region']=='China']
```

![png](/image/china_covid19.png)

重複の「Country/Region」に「Province/State」の値が存在する可能性があるため，重複の「Country/Region」のカウントを合計します．
```python
# Country/Regionの重複リスト作成
print(CRdf[CRdf['count'] > 1].sum())

# 出力結果
# count    92
```

重複(count > 1)の「Country/Region」のカウントの合計(92)と「Province/State」のnon-null(87)に5つの差がありましたので，重複(count > 1)の「Country/Region」について，「Province/State」・「Country/Region」の関係を参照します．

```python
CR_list = CRdf[CRdf['count'] > 1].index.tolist()

for CR in CR_list:
    display(df[df['Country/Region']==CR][['Province/State', 'Country/Region']])
```

| Province/State | Country/Region |
| - | - |
| Anhui | China |
| Beijing | China |
| Chongqing | China |
| ... | ... |

| Province/State | Country/Region |
| - | - |
| Alberta | Canada |
| British Columbia | Canada |
| Diamond Princess	 | Canada |
| ... | ... |

ex.

重複の「Country/Region」に「Province/State」が存在するのは確かで，差分の5つはNaNも確認できました．

よって，重複の「Country/Region」は感染者数を合計して対応します．

下記のコードで，グラフ作成用にデータを加工しcsvで保存します．

```python
# 各国で感染者数を合計
df_new = df.groupby('Country/Region').sum()

# 余分なカラムを削除
df_new = df_new.drop('Lat', axis=1)
df_new = df_new.drop('Long', axis=1)

# カラム名の変更
df_new = df_new.reset_index()
df_new = df_new.rename(columns={'Country/Region': 'Country'})

# csv出力
df_new.to_csv('new_time_series_covid19_confirmed_global.csv', index=False)
display(df_new)
```

## アニメーショングラフの作成

### ライブラリのインストール
下記のコードでライブラリをインストールします．
```python
!pip install pandas pandas_alive Pillow
```

```python
import pandas as pd
import pandas_alive
from datetime import datetime as dt
```

### データの読み込み
下記のコードでcsvファイルの読み込みと表の転置（列名と行名を入れ替える）を実行します．
```python
# データの読み込み
covid_data = pd.read_csv("new_time_series_covid19_confirmed_global.csv")

# 'Country'をインデックスにして，転置
covid_data_trans = covid_data.set_index('Country').transpose()
```

新しいDataFrameを作成します．転置する前のDataFrameから「Country」列の国名リストを取得し，新しいDataFrameに数値と共に移していきます．

fillna関数でデータセットに欠損値があった場合に「0」で補完します．
```python
df_covid = pd.DataFrame()

for country in covid_data['Country']:
    df_covid[country] = None
    df_covid[country] = covid_data_trans[country].values

df_covid = df_covid.fillna(0)
```

置後後のDataFrameを1行ずつリスト化し，日付をそれぞれDateTime型に変換して新規DataFrameに移してインデックスにセットします．

```python
data_range = []
for i, row in enumerate(covid_data_trans.iterrows()):
    data_range.append(dt.strptime(covid_data_trans.index[i], '%m/%d/%y'))
    
df_covid['Date']=pd.to_datetime(data_range) 

df_covid = df_covid.set_index('Date')
```

そして，plot_animated関数でgif形式のアニメーションファイルを作成します．

period_fmtにdatetimeの表示フォーマットを指定することで，アニメーションに年月日などのラベルを付与できます．

n_visibleでは数値の上位何番目までの要素を表示するかを指定します．
```python
df_covid.plot_animated(filename="covid-19-bar_race.gif",
                       period_fmt="%Y-%m-%d",
                       title="Covid-19 Cases",
                       n_visible=15)
```

`covid-19-bar_race.gif`<br>
![](/image/covid-19-bar_race2.gif)


## まとめ
国別covid-19感染者データでアニメーション棒グラフを作成しました．


## 参考サイト



<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">



<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
