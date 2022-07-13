---
display: home
title: '国勢調査から100%積み上げ棒グラフを作成する'
description: 国勢調査から100%積み上げ棒グラフを作成します．
date: 2022-7-15
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - 小ネタ
  - Python
  - Pandas
  - テキストファイル
  - matplotlib
  - 2重棒グラフ
---
国勢調査から100%積み上げ棒グラフを作成します．

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
├── ./data/age_pop.txt
└── plot_2bar.ipynb <- 実行用ノートブック
```

## データのダウンロード
下記のサイトから宮城県　国勢調査_年齢別(txtファイル)をダウンロードします。

[e-stat 宮城県　国勢調査_年齢別(txt)](https://www.e-stat.go.jp/gis/statmap-search?page=1&type=1&toukeiCode=00200521&toukeiYear=2015&aggregateUnit=A&serveyId=A002005212015&statsId=T000849)

## 積み上げ棒グラフの作成

### pandasでテキストファイルを読み込む
```python
import pandas as pd

# データの読み込み
# T000849002 - T000849016
# 総数0~4歳 - 総数70~74歳
df_age = pd.read_table("./data/age_pop.txt", encoding='SJIS', sep=',')
df_age = df_age[1:].reset_index(drop=True)
df_age = df_age.replace(['-', 0])
df_age = df_age.replace(['X', 0])
display(df_age.head())
```

![](/image/df_age.png)

### データの加工と整理
下記のコードで以下のことを実施します。
- T000849001等のカラム名を変更
- 市郡の名前を整理
- 総人口の算出
- HYOSYO==1(秘匿処理なし)

```python
# カラム名の変換
df_age = df_age.rename(columns={'T000849001': 'population',
                                'T000849002': 'sum_age_0_4',
                                'T000849003':'sum_age_5_9', 
                                'T000849004':'sum_age_10_14', 
                                'T000849005':'sum_age_15_19', 
                                'T000849006':'sum_age_20_24', 
                                'T000849007':'sum_age_25_29', 
                                'T000849008':'sum_age_30_34', 
                                'T000849009':'sum_age_35_39', 
                                'T000849010':'sum_age_40_44', 
                                'T000849011':'sum_age_45_49', 
                                'T000849012':'sum_age_50_54', 
                                'T000849013':'sum_age_55_59', 
                                'T000849014':'sum_age_60_64', 
                                'T000849015':'sum_age_65_69', 
                                'T000849016':'sum_age_70_74'})
# 数値型に変換
df_age.loc[:, 'population':'sum_age_70_74'] = df_age.loc[:, 'population':'sum_age_70_74'].astype(int)

# 'GST_NAME'追加
# GST_NAME：郡市・特別区・政令指定都市名
df_age['GST_NAME'] = df_age['CITYNAME']
for idx in range(len(df_age)):
    GST_TEXT = df_age['GST_NAME'][idx]
    if '市' in GST_TEXT:
        GST_TEXT = GST_TEXT.split('市')[0] + '市'
    if '郡' in GST_TEXT:
        GST_TEXT = GST_TEXT.split('郡')[0] + '郡'
    # if '廿日市' in GST_TEXT:
    #     GST_TEXT = '廿日市市'
    df_age['GST_NAME'][idx] = GST_TEXT
    
# 各CITYNAMEの総人口を抽出
df_age = df_age[df_age['NAME'].isnull()]

# 市町村のみ
df_age = df_age[df_age['HYOSYO']==1]
```

![](/image/df_age2.png)

### GST_NAME別で集計
```python
# GST_NAME別で集計
# GST_NAME：郡市・特別区・政令指定都市名
df_age_sum  = df_age.groupby('GST_NAME').sum()
# population(人口)でソートしプロット
df_age_sum = df_age_sum.sort_values(by = 'population', ascending = False)
```

![](/image/df_age3.png)

### 年齢のレンジを変更
```python
# GST_NAME別で集計
# GST_NAME：郡市・特別区・政令指定都市名
df_age_sum  = df_age.groupby('GST_NAME').sum()
# population(人口)でソートしプロット
df_age_sum = df_age_sum.sort_values(by = 'population', ascending = False)
```

![](/image/df_age4.png)

### 割合の算出
```python
# 割合算出
df_age_plot100 = df_age_plot.copy()
df_age_plot100['sum_age_0_15'] = df_age_plot100['sum_age_0_15'] / df_age_sum['population']

for idx_a in range(2, 7):
    exec(f"df_age_plot100['sum_age_{idx_a*10}_{idx_a*10+9}'] = df_age_plot100['sum_age_{idx_a*10}_{idx_a*10+9}'] / df_age_sum['population']")

df_age_plot100['sum_age_15_19'] = df_age_plot100['sum_age_15_19'] / df_age_sum['population']
df_age_plot100['sum_age_70_74'] = df_age_plot100['sum_age_70_74'] / df_age_sum['population']

# 年齢不詳
df_age_plot100['unknown'] = df_age_plot100['unknown'] / df_age_sum['population']

df_age_plot100.head()
```

![](/image/df_age5.png)

### 100%積み上げ棒グラフの可視化
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

# 年齢別の積み上げ棒グラフ
ax = df_age_plot100.plot(kind='bar', stacked=True, figsize = (25,10), fontsize = 20)

# 判例
# plt.legend(loc='upper right', fontsize=20)
plt.legend(bbox_to_anchor=(1.18, 1),loc='upper right',fontsize=20)
# x軸のラベル
plt.xlabel("市町村郡", fontsize=20)
# y軸のラベル
plt.ylabel("人口(百万人)", fontsize=20)
# y軸べき数
ax.yaxis.set_major_formatter(ScalarFormatter(useMathText=True))
ax.ticklabel_format(style="sci", axis="y", scilimits=(6, 6))
ax.yaxis.offsetText.set_fontsize(20)
```

![](/image/Stacked_100_Bar.png)

## まとめ
国勢調査から100%積み上げ棒グラフを作成しました．

## 参考サイト
[e-stat 宮城県　国勢調査_年齢別(txt)](https://www.e-stat.go.jp/gis/statmap-search?page=1&type=1&toukeiCode=00200521&toukeiYear=2015&aggregateUnit=A&serveyId=A002005212015&statsId=T000849)

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


