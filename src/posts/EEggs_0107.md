---
display: home
title: 'pandasでdbfを読み込む'
description: pandasでdbfを読み込みを実装します．
date: 2022-6-1
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - memo
  - Python
  - Pandas
  - DBF
---
pandasでdbfを読み込みを実装します．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ファイル構成
```
diablos_gan
├── /data/miyagi_pop/
│   ├── h27ka04.dbf
│   └── (省略)
├── ipag.ttf
└── pandas_dbf.ipynb <- 実行用ノートブック
```

## ライブラリのインストール
下記のコードでライブラリをインストールします．
```python
!pip install simpledbf
```

## データのダウンロード
下記のサイトから宮城県　国勢調査(shpファイル)をダウンロードします。

[e-stat 宮城県　国勢調査](https://www.e-stat.go.jp/gis/statmap-search?page=1&type=2&aggregateUnitForBoundary=A&toukeiCode=00200521&toukeiYear=2015&serveyId=A002005212015&prefCode=04&coordsys=1&format=shape&datum=2000)

## pandasでdbfを読み込む

### pandasでdbfを読み込む
```python
import pandas as pd
from simpledbf import Dbf5

# dbfの読み込み
dbf_pop = Dbf5('./data/miyagi_pop/h27ka04.dbf', codec='SJIS')
df_pop = dbf_pop.to_dataframe()
display(df_pop.head())
```

### 人口の可視化
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
df_pop_sum = df_pop.groupby('GST_NAME').sum()
# JINKO(人口)でソートしプロット
ax = df_pop_sum.sort_values(by = 'JINKO', ascending = False).plot(kind='bar', y = 'JINKO', figsize = (25,10), fontsize = 20)

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

![](/image/miyagi_pop.png)

## まとめ
pandasでdbfを読み込みを実装しました．

## 参考サイト
[e-stat 宮城県　国勢調査](https://www.e-stat.go.jp/gis/statmap-search?page=1&type=2&aggregateUnitForBoundary=A&toukeiCode=00200521&toukeiYear=2015&serveyId=A002005212015&prefCode=04&coordsys=1&format=shape&datum=2000)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


