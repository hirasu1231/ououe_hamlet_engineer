---
display: home
title: 'Pythonでndjsonの読み込みを実施する'
description: Pythonでndjsonの読み込みを実施します
date: 2022-7-23
image: https://www.hamlet-engineer.com/image/ndjson.jpeg
categories: 
  - Python
tags:
  - memo
  - Python
  - Pandas
  - ndjson
---
Pythonでndjsonの読み込みを実施します．

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
├── ./data/prefecture.ndjson
└── plot_2bar.ipynb <- 実行用ノートブック
```

## データのダウンロード
下記のサイトからデータをダウンロードします。

[ワクチン接種状況オープンデータ](https://info.vrs.digital.go.jp/dashboard/)

## ndjsonの読み込み

```python
import json
import pandas as pd

df_pref = pd.read_json('./data/prefecture.ndjson', lines=True)
df_pref.head()
# df_pref.to_csv("covid19_vaccine_pref.csv")
```

![](/image/df_vaccine.png)


## まとめ
Pythonでndjsonの読み込みを実施しました．

## 参考サイト
[pandasでndjsonを読み込む（ワクチン接種状況オープンデータ）](https://qiita.com/yasubei/items/6725cbbd4071a48c0605)

[ワクチン接種状況オープンデータ](https://info.vrs.digital.go.jp/dashboard/)

[ワクチン接種状況オープンデータ 定義書](https://cio.go.jp/c19vaccine_opendata)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


