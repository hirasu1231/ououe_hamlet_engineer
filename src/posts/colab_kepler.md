---
display: home
title: 'Colabratryでkeplerを実装する'
description: Colabratryでkeplerを実装します
date: 2023-2-4
image: https://www.hamlet-engineer.com/image/colab_kepler.png
categories: 
  - Python
tags:
  - Python
	- GIS
  - kepler
	- Colabratry
---
Colabratryでkeplerを実装します。

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ライブラリのインポート
下記のコードでライブラリをインポートします。
```python
# Keplerにプロット
try:
  import leafmap.kepler as leafmap
  from keplergl import KeplerGl
except ImportError:
  !pip install keplergl
  !pip install git+https://github.com/giswqs/leafmap.git
  import leafmap.kepler as leafmap
  from keplergl import KeplerGl
  
import pandas as pd
import base64
```

## データの作成
下記のコードでデータを作成します。
```python
dict1 = {
        "lon" :[139.7951, 139.7944, 139.7941, 139.7940, 139.7944],
        "lat":[35.6583, 35.6588, 35.6570, 35.6580, 35.6574]
}
df1 = pd.DataFrame(dict1)
df1
```

|lon|lat|
|:----|:----|
|139.7951|35.6583|
|139.7944|35.6588|
|139.7941|35.657|
|139.794|35.658|
|139.7944|35.6574|

```python
dict2 = {
        "lon" :[139.7851, 139.7844, 139.7841, 139.7840, 139.7844],
        "lat":[35.5583, 35.5588, 35.5570, 35.5580, 35.5574]
}
df2 = pd.DataFrame(dict2)
df2
```

|lon|lat|
|:----|:----|
|139.7851|35.5583|
|139.7844|35.5588|
|139.7841|35.557|
|139.784|35.558|
|139.7844|35.5574|

## keplerの実行
下記のコードでkeplerを実行します。
```python
# データを描画
map1 = KeplerGl(height=600)
map1.add_data(data=df1, name='df1')
map1.add_data(data=df2, name='df2')
map1
```

![](./image/colab_kepler.png)

## まとめ
Colabratryでkeplerを実装しました。

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">