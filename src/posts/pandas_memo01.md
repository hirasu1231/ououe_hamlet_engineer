---
display: home
title: 'Pandasの小技をまとめる01'
description: Pandasの小技をまとめてます。(01)
date: 2023-2-24
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - memo
  - Python
  - Pandas
---
Pandasの小技をまとめてます。(01)

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## データフレームの作成

```python
import pandas as pd

# 辞書(Dictionary)からDataFrameを作成します
dict = {
        "name"  :["taro", "jiro", "saburo"],
        "age"   :["11",   "21",   "22"],
        "color" :["Red",  "Blue", "Green"],
        "flag"  :["True", "True", "False"],
}
df  = pd.DataFrame( dict )
display(df)
```
|name|age|color|flag|
|:----|:----|:----|:----|
|taro|11|Red|TRUE|
|jiro|21|Blue|TRUE|
|saburo|22|Green|FALSE|

## リストで複数条件で抽出
下記のコードで、リストから複数条件で抽出します。
```python
# リストで抽出
_list = ["taro", "jiro"]
df[df["name"].isin(_list)]
```
|name|age|color|flag|
|:----|:----|:----|:----|
|taro|11|Red|TRUE|
|jiro|21|Blue|TRUE|

## 文字列で特定の文字を含む
下記のコードで、文字列で特定の文字を含むものを抽出します。
```python
# 文字列で特定の文字を含む
df[df["name"].str.contains("ro")]
```
|name|age|color|flag|
|:----|:----|:----|:----|
|taro|11|Red|TRUE|
|jiro|21|Blue|TRUE|
|saburo|22|Green|FALSE|

## pandasでfor文を使わない処理(1列)
下記のコードで、pandasでfor文を使わない処理(1列)をします。
```python
#  pandasでfor文を使わない処理(1列)
df["new_columns"] = df["name"].apply(lambda x: x + "_aaa")
display(df)
```
|name|age|color|flag|new_columns|
|:----|:----|:----|:----|:----|
|taro|11|Red|TRUE|Red_aaa|
|jiro|21|Blue|TRUE|Blue_aaa|
|saburo|22|Green|FALSE|Green_aaa|

## pandasでfor文を使わない処理(2列)
下記のコードで、pandasでfor文を使わない処理(2列)をします。
```python
#  pandasでfor文を使わない処理(2列)
df["new_columns"] = df[["name", "color"]].apply(lambda x: x[0] + x[1], axis=1)
display(df)
```
|name|age|color|flag|new_columns|
|:----|:----|:----|:----|:----|
|taro|11|Red|TRUE|taroRed|
|jiro|21|Blue|TRUE|jiroBlue|
|saburo|22|Green|FALSE|saburoGreen|

## 重複削除
下記のコードで、pandasで重複削除をします。
```python
#  重複削除
df.drop_duplicates(subset="flag")
```
|name|age|color|flag|new_columns|
|:----|:----|:----|:----|:----|
|taro|11|Red|TRUE|taroRed|
|saburo|22|Green|FALSE|saburoGreen|


## カラム削除
下記のコードで、pandasでカラム削除をします。
```python
# カラム削除
df.drop('new_columns', axis=1, inplace=True)
df
```
|name|age|color|flag|
|:----|:----|:----|:----|
|taro|11|Red|TRUE|
|jiro|21|Blue|TRUE|
|saburo|22|Green|FALSE|

# 置換
下記のコードで、置換します。
```python
# 置換
df["color"] = df["color"].str.replace("Red", "Reda")
df
```
|name|age|color|flag|
|:----|:----|:----|:----|
|taro|11|Reda|TRUE|
|jiro|21|Blue|TRUE|
|saburo|22|Green|FALSE|

# 条件置換
下記のコードで、条件で置換します。
```python
# 条件置換
df.loc[df["color"]=="Reda", 'color'] = "Red"
df
```
|name|age|color|flag|
|:----|:----|:----|:----|
|taro|11|Red|TRUE|
|jiro|21|Blue|TRUE|
|saburo|22|Green|FALSE|

## まとめ
Pandasの小技をまとめてました。(01)

## 参考サイト

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">