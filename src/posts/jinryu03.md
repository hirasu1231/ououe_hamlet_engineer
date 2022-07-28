---
display: home
title: 'G空間統計の人流データを可視化していく03(OD付き滞在人口データ)'
description: G空間統計の人流データで仙台市青葉区のOD付き滞在人口データについて加工します。
date: 2022-8-1
image: https://www.hamlet-engineer.com/image/sendai_daynight_diff.png
categories: 
  - Python
tags:
  - Python
  - GIS
  - jinryu
---
G空間統計の人流データで仙台市青葉区のOD付き滞在人口データについて加工します。

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
├── ipag.ttf
└── jinryu.ipynb <- 実行用ノートブック
```

## 仙台市青葉区のcitycode
下記のコードで仙台市青葉区のcitycode(4101)を確認します。

```python
# 2019年を読み込み
citycode_path = './data/jinryu/prefcode_citycode_master/prefcode_citycode_master_utf8_2019.csv'
df_citycode1 = pd.read_csv(citycode_path)

df_citycode1[df_citycode1['cityname']=='仙台市青葉区']
# 4	宮城県	4101	仙台市青葉区	宮城県仙台市青葉区
```

## OD付き滞在人口データ
定義書を下記に示します。

![](/image/monthly_fromto_city_format.png)

dayflag:“0”:休日 “1”:平日 “2”:全日

timezone:“0”:昼 “1”:深夜 “2”:終日

fromarea: 0:仙台市青葉区内, 1:宮城県内_仙台市青葉区外, 2:東北地方内_宮城県外, 3:東北地方外

dayflag:{0, 1}, timezone:{0, 1}

### データの読み込み
```python
import pandas as pd
import matplotlib
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.ticker import ScalarFormatter

# データの読み込み
df_fromto = pd.read_csv('./data/jinryu/merge_monthly_fromto_city_04.csv')

df_fromto_aoba = df_fromto[df_fromto['citycode']==4101].reset_index(drop=True)
print(set(df_fromto_aoba['citycode'].tolist()))
```

### 可視化(スクリプト)

```python
def graph_make(df_fromto_city, df_citycode1, dayflag, xtitle):
    # citycode情報
    cityname = df_citycode1['cityname'][0]
    prefname = df_citycode1['prefname'][0]
    # 全日
    df_fromto_city_day = df_fromto_city[df_fromto_city['dayflag']==dayflag]
    df_fromto_city_day.head()

    # 平均化
    out_df = df_fromto_city_day.groupby(['citycode', 'from_area', 'timezone']).mean().sort_values('population', ascending=False)
    out_df = out_df.reset_index()

    # データ整形
    from_areas = [0, 1, 2, 3]
    timezones = [0, 1, 2]
    df_list = []
    # from_areaごとにtimezoneの平均人口をカラムで整理
    for fa in from_areas:
        append_list = [4101, 0, fa]
        for tz in timezones:
            out_df_a = out_df[(out_df['from_area']==fa)&(out_df['timezone']==tz)].reset_index(drop=True)
            append_list.append(out_df_a['population'][0])
        df_list.append(append_list)

    # データフレーム化
    df_graph = pd.DataFrame(df_list, columns=['citycode', 'dayflag', 'from_area', 'tz01_pop', 'tz02_pop', 'tz03_pop'])

    # 可視化
    # 日本語のフォント設定
    f = "ipag.ttf"
    font_manager.fontManager.addfont(f) # フォントの追加
    font_name = plt.matplotlib.font_manager.FontProperties(fname = f).get_name() # 追加フォント名
    matplotlib.rc('font', family=font_name) # 追加フォントの設定

    # カラム名等を置換
    # fromarea: 0:呉市内, 1:広島県内_呉市外, 2:中国地方内_広島県外, 3:中国地方外
    df_graph = df_graph.replace({'from_area': { 0: f"{cityname}内", \
                                                1: f"{prefname}内({cityname}以外)", \
                                                2: f"地方内({prefname}以外)", \
                                                3: f"地方外"}})
    # timezone:“0”:昼 “1”:深夜 “2”:終日
    df_graph = df_graph.rename(columns={'tz01_pop': '昼', 'tz02_pop': '深夜', 'tz03_pop': '終日'})

    # x軸をインデックスへ
    df_graph = df_graph.set_index('from_area')
    # プロット
    ax = df_graph.plot(kind='bar', y =['昼', '深夜', '終日'], figsize = (25,10), fontsize = 20)

    # 判例
    plt.legend(loc='upper right', fontsize=20)
    # x軸のラベル
    plt.xlabel(xtitle, fontsize=20)
    # y軸のラベル
    plt.ylabel("来訪者数(千人)", fontsize=20)
    # y軸べき数
    ax.yaxis.set_major_formatter(ScalarFormatter(useMathText=True))
    ax.ticklabel_format(style="sci", axis="y", scilimits=(3, 3))
    ax.yaxis.offsetText.set_fontsize(20)
```

### 可視化(実行)

```python
# 可視化(実行)
graph_make(df_fromto_city, df_citycode1, 0, '休日来訪者_居住地')
```

![](/image/sendai_od.png)

## まとめ
G空間統計の人流データで仙台市青葉区のOD付き滞在人口データについて加工しました．

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


