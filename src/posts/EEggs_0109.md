---
display: home
title: '国勢調査から２重棒グラフを作成する'
description: 国勢調査から２重棒グラフを作成します．
date: 2022-7-13
image: https://www.hamlet-engineer.com/image/matplot.png
categories: 
  - Python
tags:
  - memo
  - Python
  - Pandas
  - matplotlib
  - Visualization
---
国勢調査から２重棒グラフを作成します．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ファイル構成
```
project_dir
├── ./data/tblT000848C04.txt
└── plot_2bar.ipynb <- 実行用ノートブック
```

## データのダウンロード
下記のサイトから宮城県　国勢調査(txtファイル)をダウンロードします。

[e-stat 宮城県　国勢調査(txt)](https://www.e-stat.go.jp/gis/statmap-search?page=1&type=1&toukeiCode=00200521&toukeiYear=2015&aggregateUnit=A&serveyId=A002005212015&statsId=T000848)

## ２重棒グラフの作成

### pandasでテキストファイルを読み込む
```python
import pandas as pd

# データの読み込み
# T000848001	T000848002	T000848003	T000848004
# 人口総数	男	女	世帯総数
df_gender = pd.read_table("./data/tblT000848C04.txt", encoding='SJIS', sep=',')
df_gender = df_gender[1:].reset_index(drop=True) # 最初の数行は削除
df_gender.head()
```

![](/image/pandas_txt.png)

### データの加工と整理
下記のコードで以下のことを実施します。
- T000848001等のカラム名を変更
- 市郡の名前を整理
- 総人口の算出
- 世帯数0の箇所は削除する(過剰に人口を集計することを防ぐ)

```python
# 数値型に変換_T000848001(人口総数)
df_gender = df_gender.rename(columns={'T000848001': 'population'})
df_gender['population'] = df_gender['population'].replace(['-', 0]).astype(int)
# 数値型に変換_T000848002(男)
df_gender = df_gender.rename(columns={'T000848002': 'male'})
df_gender['male'] = df_gender['male'].replace(['-', 0]).astype(int)
# 数値型に変換_T000848003(女)
df_gender = df_gender.rename(columns={'T000848003': 'female'})
df_gender['female'] = df_gender['female'].replace(['-', 0]).astype(int)

# 'GST_NAME'追加
# GST_NAME：郡市・特別区・政令指定都市名
df_gender['GST_NAME'] = df_gender['CITYNAME']
for idx in range(len(df_gender)):
    GST_TEXT = df_gender['GST_NAME'][idx]
    if '市' in GST_TEXT:
        GST_TEXT = GST_TEXT.split('市')[0] + '市'
    if '郡' in GST_TEXT:
        GST_TEXT = GST_TEXT.split('郡')[0] + '郡'
    # if '廿日市' in GST_TEXT:
    #     GST_TEXT = '廿日市市'
    df_gender['GST_NAME'][idx] = GST_TEXT
    
# 各CITYNAMEの総人口を抽出
df_gender = df_gender[df_gender['NAME'].isnull()]

# 世帯数なしを消去
df_gender = df_gender[df_gender['T000848004']!='-']
```

![](/image/pandas_gender_prep.png)

### 可視化
```python
import matplotlib
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.ticker import ScalarFormatter

# 日本語のフォント設定
f = "ipag.ttf"
font_manager.fontManager.addfont(f) # フォントの追加
font_name = plt.matplotlib.font_manager.FontProperties(fname = f).get_name() # 追加フォント名
matplotlib.rc('font', family=font_name) # 追加フォントの設定

# GST_NAME別で集計
# GST_NAME：郡市・特別区・政令指定都市名
df_gender_sum  = df_gender.groupby('GST_NAME').sum()
# JINKO(人口)でソートしプロット
ax = df_gender_sum.sort_values(by = 'population', ascending = False).plot(kind='bar', y = ['male', 'female'], figsize = (25,10), fontsize = 20)

# 判例
plt.legend(loc='upper right', fontsize=20)
# x軸のラベル
plt.xlabel("市町村郡", fontsize=20)
# y軸のラベル
plt.ylabel("人口(百万人)", fontsize=20)
# y軸べき数
ax.yaxis.set_major_formatter(ScalarFormatter(useMathText=True))
ax.ticklabel_format(style="sci", axis="y", scilimits=(6, 6))
ax.yaxis.offsetText.set_fontsize(20)
```

![](/image/pandas_gender_plot.png)

## まとめ
国勢調査から２重棒グラフを作成しました．

## 参考サイト
[e-stat 宮城県　国勢調査(txt)](https://www.e-stat.go.jp/gis/statmap-search?page=1&type=1&toukeiCode=00200521&toukeiYear=2015&aggregateUnit=A&serveyId=A002005212015&statsId=T000848)

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


