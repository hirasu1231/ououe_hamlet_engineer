---
display: home
title: '[編集用]'
description: PythonでBig Queryを操作します．
date: 2022-2-18
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - 小ネタ
  - Python
  - GCP
  - GoogleBigQuery
---
PythonでBig Queryを操作します．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ライブラリのインストール
下記のコードでライブラリをインストールします．
```python
!pip install pandas-gbq
!pip install -U pyarrow
!pip install --upgrade pandas-gbq 'google-cloud-bigquery[bqstorage,pandas]'
```



## まとめ
PythonでBig Queryを操作させました．

## 参考サイト
[PythonでBigQueryの操作](https://blog.imind.jp/entry/2019/12/08/025818)

[BigQuery ↔ Pandas間で読み込み/書き込み](https://qiita.com/komiya_____/items/8fd900006bbb2ebeb8b8)

[[BigQuery] BigQueryのPython用APIの使い方 -テーブル作成編-](https://qiita.com/Hyperion13fleet/items/0e00f4070f623dacf92b)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


