---
display: home
title: 'G空間統計の人流データを可視化していく01(データ仕様確認)'
description: G空間統計の人流データのデータ仕様を確認します．
date: 2022-7-30
image: https://www.hamlet-engineer.com/image/sendai_daynight_diff.png
categories: 
  - Python
tags:
  - Python
  - GIS
  - jinryu
---
G空間統計の人流データのデータ仕様を確認します．

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
├── ./data/jinryu
│   ├── /attribute <- 1kmメッシュ定義書
│   ├── /prefcode_citycode_master <- 市町村コード定義書
│   ├── /regioncode_master <- 都道府県コード定義書
│   ├── /SDDSWS5740 <- 1kmメッシュの境界データ
│   ├── /monthly_mdp_mesh1km_04 <- 滞在人口データ
│   ├── /monthly_fromto_city_04 <- 簡易ODデータ
│   ├── merge_monthly_mdp_mesh1km_04.csv <- 統合滞在人口データ
│   └── merge_monthly_fromto_city_04.csv <- 統合簡易ODデータ
└── jinryu.ipynb <- 実行用ノートブック
```

## 市町村コード

### データ数の確認
下記のコードで2019年と2020年で市町村コードそれぞれ用意されているので、差分をとります。

データ数は一致していました。

![](/image/citycode_format.png)

```python
import pandas as pd

# 2019年を読み込み
citycode_path = './data/jinryu/prefcode_citycode_master/prefcode_citycode_master_utf8_2019.csv'
df_citycode1 = pd.read_csv(citycode_path)

# 2020年を読み込み
citycode_path = './data/jinryu/prefcode_citycode_master/prefcode_citycode_master_utf8_2020.csv'
df_citycode2 = pd.read_csv(citycode_path)

len(df_citycode1), len(df_citycode2)
# (1896, 1896)
```

#### データ内容の確認
そして、下記のコードで内容に差分がないか、確認します。

```python
# df_citycode1の差分箇所を表示
print("="*20, '2019年', "="*20)
diff_df1 = df_citycode1[(df_citycode1 == df_citycode2).all(axis=1) == False]
display(diff_df1)

# df_citycode２の差分箇所を表示
print("="*20, '2020年', "="*20)
diff_df2 = df_citycode2[(df_citycode2 == df_citycode1).all(axis=1) == False]
display(diff_df2)
```

**==================== 2019年 ====================**
| prefcode | prefname | citycode | cityname | address            | 
| -------- | -------- | -------- | -------- | -------- | 
| 13       | 東京都   | 13101    | 東京２３区千代田区 | 東京都千代田区 | 
| 13       | 東京都   | 13102    | 東京２３区中央区   | 東京都中央区 | 
| 13       | 東京都   | 13103    | 東京２３区港区     | 東京都港区 | 
| 13       | 東京都   | 13104    | 東京２３区新宿区   | 東京都新宿区 | 
| ・・・       | ・・・   | ・・・    | ・・・   | ・・・ | 
| 28  | 兵庫県 | 28221 | 篠山市         | 兵庫県篠山市         | 
| 40  | 福岡県 | 40305 | 筑紫郡那珂川町 | 福岡県筑紫郡那珂川町 | 

**==================== 2020年 ====================**
| prefcode | prefname | citycode | cityname | address  | 
| -------- | -------- | -------- | -------- | -------- | 
| 13       | 東京都   | 13101    | 千代田区 | 東京都千代田区 | 
| 13       | 東京都   | 13102    | 中央区   | 東京都中央区 | 
| 13       | 東京都   | 13103    | 港区     | 東京都港区 | 
| 13       | 東京都   | 13104    | 新宿区   | 東京都新宿区 | 
| ・・・       | ・・・   | ・・・    | ・・・   | ・・・ | 
| 28  | 兵庫県 | 28221 | 丹波篠山市 | 兵庫県丹波篠山市 | 
| 40  | 福岡県 | 40231 | 那珂川市   | 福岡県那珂川市   | 

なぜか、東京23区のcitynameが変更されたこと以外では、「町→市」に名前が変わっている箇所が2つありました。

```python
# df_citycode1の差分箇所を表示
diff_address1 = df_citycode1[(df_citycode1['address'] == df_citycode2['address']) == False]
display(diff_address1)

# df_citycode２の差分箇所を表示
diff_address2 = df_citycode2[(df_citycode2['address'] == df_citycode1['address']) == False]
display(diff_address2)
```

**==================== 2019年 ====================**
| prefcode | prefname | citycode | cityname | address            | 
| -------- | -------- | -------- | -------- | -------- | 
| 28  | 兵庫県 | 28221 | 篠山市         | 兵庫県篠山市         | 
| 40  | 福岡県 | 40305 | 筑紫郡那珂川町 | 福岡県筑紫郡那珂川町 | 

**==================== 2020年 ====================**
| prefcode | prefname | citycode | cityname | address  | 
| -------- | -------- | -------- | -------- | -------- | 
| 28  | 兵庫県 | 28221 | 丹波篠山市 | 兵庫県丹波篠山市 | 
| 40  | 福岡県 | 40231 | 那珂川市   | 福岡県那珂川市   | 


citycodeの重複も確認しましたが、問題ありません。

```python
# citycodeの重複確認
display(df_citycode1[df_citycode1['citycode']=='40231'])

display(df_citycode2[df_citycode2['citycode']=='40305'])
```

### 市町村コードのルール
下記のコードの確認で、市町村コードは国勢調査と一致するようです。
```python
import folium

# 2019年を読み込み
mesh_path = './data/jinryu/attribute/attribute_mesh1km_2019.csv'
df_mesh = pd.read_csv(mesh_path)

# 国勢調査の市民コード：34101,広島市中区
df_34101 = df_mesh[df_mesh['citycode']==34101].reset_index(drop=True)
lon_center = df_34101['lon_center'][4]
lat_center = df_34101['lat_center'][4]

# 地図オブジェクト作成
map = folium.Map(location=[lat_center, lon_center], zoom_start=18)
# 地図表示
map
```

![](/image/map_C34101.png)

## メッシュコード
市町村コードや座標も付属されているので、他分析でも使えそうです。

![](/image/attribute_mesh1k_format.png)

### データ数
下記のコードで2019年と2020年のデータ数を確認します。

```python
# 2019年を読み込み
mesh_path = './data/jinryu/attribute/attribute_mesh1km_2019.csv'
df_mesh1 = pd.read_csv(mesh_path)

# 2020年を読み込み
mesh_path = './data/jinryu/attribute/attribute_mesh1km_2020.csv'
df_mesh2 = pd.read_csv(mesh_path)

len(df_mesh1), len(df_mesh2)
# (387500, 387500)　
# 一致!!!!!!!
```

### 市町村コード
メッシュデータ内での市町村コードを確認します。

```python
# df_mesh_citycode1の差分箇所を表示
diff_mesh_citycode1 = df_mesh1[(df_mesh1['citycode'] == df_mesh2['citycode']) == False]
# display(diff_mesh_citycode1)

# df_mesh_citycode２の差分箇所を表示
diff_mesh_citycode2 = df_mesh2[(df_mesh2['citycode'] == df_mesh1['citycode']) == False]
# display(diff_mesh_citycode2)

print(set(diff_mesh_citycode1['citycode'].tolist()))
print(set(diff_mesh_citycode2['citycode'].tolist()))

# {40305, 15307}
# {15206, 40231}
```

2019年と2020年で市町村コードが異なる箇所があります。

(那珂川町→那珂川市、40305→40231)
(北蒲原郡聖籠町→新発田市、15307→15206)

(那珂川町→那珂川市、40305→40231)は市町村コードでも確認したが、(北蒲原郡聖籠町→新発田市、15307→15206)については把握できていない。

下記のコードで(北蒲原郡聖籠町→新発田市、15307→15206)について確認します。

```python
# 2019年を読み込み
citycode_path = './data/jinryu/prefcode_citycode_master/prefcode_citycode_master_utf8_2019.csv'
df_citycode1 = pd.read_csv(citycode_path)
display(df_citycode1[(df_citycode1['citycode']==15307)|(df_citycode1['citycode']==15206)])
# 15	新潟県	15307	北蒲原郡聖籠町	新潟県北蒲原郡聖籠町
# 15	新潟県	15206	新発田市	新潟県新発田市

# 2020年を読み込み
citycode_path = './data/jinryu/prefcode_citycode_master/prefcode_citycode_master_utf8_2020.csv'
df_citycode2 = pd.read_csv(citycode_path)
display(df_citycode2[(df_citycode2['citycode']==15307)|(df_citycode2['citycode']==15206)])
# 15	新潟県	15307	北蒲原郡聖籠町	新潟県北蒲原郡聖籠町
# 15	新潟県	15206	新発田市	新潟県新発田市
```

### メッシュデータの確認

上記より、2020年で北蒲原郡聖籠町→新発田市に変更されていないことが確認できます。

では、(北蒲原郡聖籠町→新発田市、15307→15206)で差分が出たデータを下記のコードで確認します。

下記より、メッシュコード:56397264で差分が出ていることがわかります。

```python
# df_mesh_citycode1の差分箇所を表示
diff_mesh_citycode1 = df_mesh1[(df_mesh1['citycode'] == df_mesh2['citycode']) == False]
diff_mesh_citycode1 = diff_mesh_citycode1[diff_mesh_citycode1['citycode'] == 15307]
display(diff_mesh_citycode1)
# mesh1kmid	lon_center	lat_center	lon_max	lat_max	lon_min	lat_min	prefcode	citycode
# 56397264	139.306244	37.970833	139.3125	37.974998	139.300003	37.966667	15	15307

# df_mesh_citycode２の差分箇所を表示
diff_mesh_citycode2 = df_mesh2[(df_mesh2['citycode'] == df_mesh1['citycode']) == False]
diff_mesh_citycode2 = diff_mesh_citycode2[diff_mesh_citycode2['citycode'] == 15206]
display(diff_mesh_citycode2)
# mesh1kmid	lon_center	lat_center	lon_max	lat_max	lon_min	lat_min	prefcode	citycode
# 56397264	139.306244	37.970833	139.3125	37.974998	139.300003	37.966667	15	15206
```

よくわからないので、下記のコードで地図を出力して確認します。
```python
import folium

# 56397264,新潟県
df1 = diff_mesh_citycode1[diff_mesh_citycode1['mesh1kmid']==56397264].reset_index(drop=True)
lon_center = df1['lon_center'][0]
lat_center = df1['lat_center'][0]

# 地図オブジェクト作成
map = folium.Map(location=[lat_center, lon_center], zoom_start=18)
# 地図表示
map
```

![](image/map_56397264.png)


## データの統合

### monthly_mdp_mesh1km_04
宮城県の1meshの滞在データを市町村別なのを統合する。

monthly_mdp_mesh1km_**：1kmメッシュ別に、いつ、何人が滞在したのかを収録したデータ

```python
import os
import glob
import zipfile
import pandas as pd

paths = glob.glob("./data/jinryu/monthly_mdp_mesh1km_04/*/*/*zip")

flag = 0
for path in paths:
    # zipの読み込み
    df = pd.read_csv(path, compression='zip')
    # 出力
    if not flag:
        df_out = df
        flag = 1
        continue
    # 統合
    df_out = pd.concat([df_out, df])

# 出力
# os.makedirs('../kure_city_data/Visit_opendata/process_data/', exist_ok=True)
df_out.to_csv('./data/jinryu/merge_monthly_mdp_mesh1km_04.csv', index=False)
```

### monthly_fromto_city_04
宮城県の簡易的なODデータを市町村別なのを統合する。

monthly_fromto_city_*：市区町村別に、いつ、どこ（同市区町村／同都道府県／同地方／それ以外）から何人来たのかを収録したデータ

```python
import os
import glob
import zipfile
import pandas as pd

paths = glob.glob("./data/jinryu/monthly_fromto_city_04/*/*/*zip")

flag = 0
for path in paths:
    # zipの読み込み
    df = pd.read_csv(path, compression='zip')
    # 出力
    if not flag:
        df_out = df
        flag = 1
        continue
    # 統合
    df_out = pd.concat([df_out, df])

# 出力
# os.makedirs('../kure_city_data/Visit_opendata/process_data/', exist_ok=True)
df_out.to_csv('./data/jinryu/merge_monthly_fromto_city_04.csv', index=False)
```

## まとめ
G空間統計の人流データのデータ仕様を確認しました．

## 参考サイト
[全国の人流オープンデータ（1kmメッシュ、市町村単位発地別）](https://www.geospatial.jp/ckan/dataset/mlit-1km-fromto)

[monthly_mdp_mesh1km_04（宮城県）_1kmメッシュ別に、いつ、何人が滞在したのかを収録したデータ](https://www.geospatial.jp/ckan/dataset/mlit-1km-fromto/resource/38c30b0b-3e55-4375-b48e-09122905af0b)

[monthly_fromto_city_04（宮城県）_市区町村別に、いつ、どこ（同市区町村／同都道府県／同地方／それ以外）から何人来たのかを収録したデータ]()

[prefcode_citycode_master(都道府県コード、市区町村コードのマスタファイル)](https://www.geospatial.jp/ckan/dataset/mlit-1km-fromto/resource/56b103d4-70c0-4585-b5e5-1664b3515835)

[regioncode_master(地方区分コードのマスタファイル)](https://www.geospatial.jp/ckan/dataset/mlit-1km-fromto/resource/43692772-c20b-4cf6-ad35-07fa5a44df14)

[attribute(1kmメッシュの座標データ)](https://www.geospatial.jp/ckan/dataset/mlit-1km-fromto/resource/83cd91e4-c4c8-4a39-91ce-299227217939)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


