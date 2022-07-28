---
display: home
title: 'G空間統計の人流データを可視化していく02(滞在人口データ)'
description: G空間統計の人流データで仙台市青葉区の滞在人口データについて加工します。
date: 2022-7-31
image: https://www.hamlet-engineer.com/image/sendai_daynight_diff.png
categories: 
  - Python
tags:
  - Python
  - GIS
  - jinryu
---
G空間統計の人流データで仙台市青葉区の滞在人口データについて加工します。

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

## 仙台市青葉区のcitycode
下記のコードで仙台市青葉区のcitycode(4101)を確認します。

```python
import pandas as pd

# 2019年を読み込み
citycode_path = './data/jinryu/prefcode_citycode_master/prefcode_citycode_master_utf8_2019.csv'
df_citycode1 = pd.read_csv(citycode_path)

df_citycode1[df_citycode1['cityname']=='仙台市青葉区']
# 4	宮城県	4101	仙台市青葉区	宮城県仙台市青葉区
```

```python
# データの読み込み
df_mdp = pd.read_csv('./data/jinryu/merge_monthly_mdp_mesh1km_04.csv')

# 仙台市青葉区のcitycode:4101
df_mdp_aoba = df_mdp[df_mdp['citycode']==4101].reset_index(drop=True)
df_mdp_aoba.head()

df_mdp_aoba.sort_values('population', ascending=False).reset_index(drop=True)[0:5]
# mesh1kmid	prefcode	citycode	year	month	dayflag	timezone	population
# 57403710	4	4101	2019	9	1	0	113872
#	57403710	4	4101	2020	2	1	0	113076
#	57403710	4	4101	2019	11	1	0	112736
#	57403710	4	4101	2019	6	1	0	111264
#	57403710	4	4101	2019	7	1	0	111149
```

## カラムの状況
滞在人口が10人未満の場合は除外されているので、dayflag/timezone毎にデータ数を集計してデータ数のズレを確認します。

```python
mesh_num = len(set(df_mdp_aoba['mesh1kmid'].tolist()))
print(mesh_num)
print(mesh_num*3*12)
# dayflag
display(df_mdp_aoba.groupby('dayflag').count()['mesh1kmid'])
# timezone
display(df_mdp_aoba.groupby('timezone').count()['mesh1kmid'])

# 207
# 7452
# dayflag
# 0    13077
# 1    12640
# 2    12944

# timezone
# 0    14129
# 1    11543
# 2    12989
```

### timezone・dayflagの確認

下記のコードで、timezone・dayflagについて確認します。

```python
# mesh1kmid毎にデータ数をカウント
df_mdp_aoba_c = df_mdp_aoba.groupby('mesh1kmid').count()
df_mdp_aoba_c = df_mdp_aoba_c.sort_values('prefcode', ascending=False)
df_mdp_aoba_c = df_mdp_aoba_c.reset_index(drop=False)
display(df_mdp_aoba_c[0:1])
# 57403630	324	324	324	324	324	324	324

# 一番データ数が多いメッシュで出力
display(df_mdp_aoba[(df_mdp_aoba['mesh1kmid']==57403630)&
                    (df_mdp_aoba['year']==2019)&
                    (df_mdp_aoba['month']==1)])
```

| mesh1kmid | prefcode | citycode | year | month | dayflag | timezone | population | 
| --------- | -------- | -------- | ---- | ----- | ------- | -------- | ---------- | 
| 57403630 | 4        | 4101 | 2019  | 1       | 0        | 0          | 410 | 
| 57403630 | 4        | 4101 | 2019  | 1       | 0        | 1          | 440 | 
| 57403630 | 4        | 4101 | 2019  | 1       | 0        | 2          | 445 | 


| mesh1kmid | prefcode | citycode | year | month | dayflag | timezone | population | 
| --------- | -------- | -------- | ---- | ----- | ------- | -------- | ---------- | 
| 57403630 | 4        | 4101 | 2019  | 1       | 0        | 0          | 410 | 
| 57403630 | 4        | 4101 | 2019  | 1       | 1        | 0          | 842 | 
| 57403630 | 4        | 4101 | 2019  | 1       | 2        | 0          | 702 | 


- timezone：終日 = 昼　 + 夜
- dayflag：全日　= 平日 + 休日

となっているわけではないようです。


### (昼-夜)の滞在人口の推移(2019年〜2021年)
昼夜間人口の差を算出します。

- dayflag:“0”:休日 “1”:平日 “2”:全日
- timezone:“0”:昼 “1”:深夜 “2”:終日

dayflag:{0, 1}, timezone:{0, 1}

### 集計
下記のコードで昼夜間人口差を算出します。

```python
import pandas as pd

# 引数もどき
dflag = 1

# データの読み込み
df_mdp = pd.read_csv('./data/jinryu/merge_monthly_mdp_mesh1km_04.csv')
# 呉市を抽出
df_mdp_aoba = df_mdp[df_mdp['citycode']==4101].reset_index(drop=True)
df_mdp_aoba.head()

# メッシュID
mids = list(set(df_mdp_aoba['mesh1kmid'].tolist()))
```

```python
out_list = []
for mid in mids:
    # メッシュDF
    mdf = df_mdp_aoba[df_mdp_aoba['mesh1kmid']==mid]
    # 全日
    mdf_d = mdf[mdf['dayflag']==dflag]
    for year in [2019, 2020, 2021]:
        for month in range(1, 13):
            # 年月を抽出
            mdf_d_t = mdf_d[(mdf_d['year']==year)&\
                            (mdf_d['month']==month)]
            # 昼人口_timezone0
            mdf_d_t0 = mdf_d_t[mdf_d_t['timezone']==0].reset_index(drop=True)
            day_pop = 0 if len(mdf_d_t0) == 0 else mdf_d_t0['population'][0]
            # 深夜人口_timezone1
            mdf_d_t1 = mdf_d_t[mdf_d_t['timezone']==1].reset_index(drop=True)
            night_pop = 0 if len(mdf_d_t1) == 0 else mdf_d_t1['population'][0]
            # 全日人口_timezone2
            mdf_d_t2 = mdf_d_t[mdf_d_t['timezone']==2].reset_index(drop=True)
            all_pop = 0 if len(mdf_d_t2) == 0 else mdf_d_t2['population'][0]
            # リスト追加
            out_list.append([mid, dflag, 34, 34202, \
                             year, month, \
                             day_pop, night_pop, all_pop, day_pop-night_pop])
# 出力df
outdf = pd.DataFrame(out_list, columns=['mesh1kmid', 'dayflag', 'prefcode', \
                                        'citycode', 'year', 'month', \
                                        'day_pop', 'night_pop', 'all_pop', 'day_night_pop_diff'])
```

### 可視化
下記のコードで前述の昼夜間人口差を可視化します。

```python
import matplotlib.pyplot as plt

df_graph = outdf.copy()
df_graph['date'] = df_graph['year'].astype(str) + '-' + df_graph['month'].astype(str)

# IDS
mids = list(set(df_graph['mesh1kmid'].tolist()))

# 期間
dts = df_graph[df_graph['mesh1kmid']==mids[0]]
dts = dts[['date']]

for mid in mids:
    dts[mid] = df_graph[df_graph['mesh1kmid']==mid]['day_night_pop_diff'].tolist()

dts = dts.set_index('date')
display(dts.head())
dts.plot(legend=False)
```

| date\mesh | 57404417 | 57404418 | 57405449 | ・・・・ | 
| -------- | -------- | -------- | -------- | | -------- |
| 2019-1   | 0        | 23       | 0        | 25       |
| 2019-2   | 0        | 8        | 0        | 23       |
| 2019-3   | 0        | 26       | 0        | 37       |

![](/image/day_night_pop_diff.png)

**緊急事態宣言で露骨に露骨に下がっている**

### 平均値の算出
下記のコードで平均値を出して、概要を掴みます。

```python
# 平均値の算出+ソート
out_geodf = outdf.groupby('mesh1kmid').mean().sort_values('day_night_pop_diff', ascending=False)
out_geodf = out_geodf.reset_index()
out_geodf = out_geodf[['mesh1kmid', 'dayflag', 'prefcode', 'citycode', \
                       'day_pop', 'night_pop', 'all_pop', 'day_night_pop_diff']]
out_geodf.head()

# mesh1kmid	dayflag	prefcode	citycode	day_pop	night_pop	all_pop	day_night_pop_diff
# 57403710	1.0	34.0	34202.0	97372.916667	33201.833333	67077.916667	64171.083333
# 57403619	1.0	34.0	34202.0	78539.388889	27361.444444	54104.750000	51177.944444
```

### shpファイル
下記のコードで平均値のデータフレームを境界データのshpファイルに統合します。

```python
import geopandas

# geometry追加
# 工程1. shpファイルの読み込み
input_geodf = geopandas.read_file('./data/jinryu/SDDSWS5740/MESH05740.shp')

geometrys = []
for mid in out_geodf['mesh1kmid'].tolist():
    if mid//10000 != 5740:
        continue
    mgeodf = input_geodf[input_geodf['KEY_CODE']==str(mid)].reset_index(drop=True)
    if len(mgeodf['geometry'])>0:
        geometrys.append(mgeodf['geometry'][0])

# 工程5. GeoDataFrameを作成
geo_df = geopandas.GeoDataFrame(out_geodf, geometry=geometrys)
# 工程6. Shapeファイルの出力
geo_df.to_file(driver='ESRI Shapefile', filename="./data/jinryu/SDDSWS5740/heijitu_dn_diff_mean_1km.shp")
```

QGISで可視化すると、下記のようになります。

![](/image/sendai_daynight_diff.png)

## まとめ
G空間統計の人流データで仙台市青葉区の滞在人口データについて加工しました．

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


