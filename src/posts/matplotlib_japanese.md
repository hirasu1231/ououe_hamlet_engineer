---
display: home
title: 'matplotlibで日本語表示を実施する'
description: matplotlibで日本語表示を実施する．
date: 2021-09-27
image: https://www.hamlet-engineer.com/image/matplotlib.jpeg
categories: 
  - Python
tags:
  - Python
  - jupyter
  - Google Colab
  - matplotlib
---
<!-- https://www.hamlet-engineer.com -->
matplotlibでキャッシュの削除を行わずに日本語表示を実施します．

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

## Google ColabとGoogle Driveを連携
```python
# Google ColabとGoogle Driveを連携
from google.colab import drive
drive.mount('/content/drive')
```

gitから参考コードをダウンロードします．
```python
%cd /content/drive/MyDrive/
!git clone https://github.com/hirasu1231/matplotlib_japanese.git
!ls
```
```python
%cd /content/drive/MyDrive/matplotlib_japanese
!ls
```

## matplotlibの日本語表示
ここでは，あらかじめ整形済みの「ボードゲーム」で検索したyoutube動画の再生回数順でTOP50のcsvファイルを使用します．
```python
import pandas as pd

# csvファイルの読み込み
df = pd.read_csv('BoardGame_scape.csv')
```

### 日本語フォントの設定
以下のコードで日本語フォントの設定を実施します．
```python
import matplotlib
import matplotlib.pyplot as plt
from matplotlib import font_manager

# 日本語のフォント設定
f = "ipag.ttf"
font_manager.fontManager.addfont(f) # フォントの追加
font_name = plt.matplotlib.font_manager.FontProperties(fname = f).get_name() # 追加フォント名
matplotlib.rc('font', family=font_name) # 追加フォントの設定
```

### 棒グラフの描画
以下のコードで棒グラフの描画を実施します．
```python
# 再生回数をfloatに変更
df['viewCount'] = df['viewCount'].astype(float)
# pandasの描画_棒グラフ
df.groupby('title').sum().sort_values(by = 'viewCount', ascending = False)[0:50].plot(kind='bar', y = 'viewCount', figsize = (25,10), fontsize = 20)
```

![](/image/viewcount_youtube.png)

## 参考サイト
[hirasu1231/matplotlib_japanese](https://github.com/hirasu1231/matplotlib_japanese.git)

[【Python】matplotlib3.2の日本語フォント設定方法【公式遵守】](https://qiita.com/mikan3rd/items/791e3cd7f75e010c8f9f)

[matplotlibの日本語化(フォント変更)](https://ricrowl.hatenablog.com/entry/2020/09/14/032424#%E3%83%95%E3%82%A9%E3%83%B3%E3%83%88%E3%82%92matplotlib%E3%81%AB%E8%BF%BD%E5%8A%A0)

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>