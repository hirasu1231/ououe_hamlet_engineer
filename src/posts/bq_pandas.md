---
display: home
title: '[小ネタ001]PandasとBig Queryを連携させる'
description: PandasとBig Queryを連携させます．
date: 2022-2-17
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - 小ネタ
  - Python
  - GCP
  - GoogleBigQuery
---
PandasとBig Queryを連携させます.

<!-- https://www.hamlet-engineer.com -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ライブラリのインストール
下記のコードでライブラリをインストールします．
```python
!pip install pandas-gbq
```

## PandasとBig Queryの連携
下記のコードでPandasとBig Queryを連携させます.

```python
import pandas as pd

project_id = '**＊＊＊'
dataset_id = '**＊＊＊'
table_id = '**＊＊＊'

query = f'''SELECT * 
            FROM {project_id}.{dataset_id}.{table_id}'''

# strベースのクエリと、project_idが必要
df_gbq = pd.read_gbq(query, project_id)
```


## まとめ
PandasとBig Queryを連携させました．

## 参考サイト
[BigQueryとPython(pandas)を連携させてみた](https://qiita.com/i_am_miko/items/68cb516ad2be61d59554)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


