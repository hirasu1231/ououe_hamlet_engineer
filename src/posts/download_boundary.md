---
display: home
title: '日本の自治体の境界データをダウンロードする'
description: 日本の自治体の境界データをダウンロードします。
date: 2023-3-22
image: https://www.hamlet-engineer.com/image/syogyo_gis.png
categories: 
  - GIS
tags:
  - Python
  - GIS
  - JupyterNotebook
  - e-stat
---
日本の自治体の境界データをダウンロードします。


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
├── /R2_boundary
│   ├── /04_miyagi/04_miyagi.shp
│   └── (省略)
└── ＊＊＊.ipynb <- 実行用ノートブック
```

## 境界データのダウンロード

```python
import requests

# 境界データのディレクトリ作成
!mkdir -p ./R2_boundary

# 都道府県リスト
prefs = [["hokkaido",1], ["aomori",2], ["iwate",3], ["miyagi",4], ["akita",5], ["yamagata",6], ["fukushima",7],
             ["ibaraki",8], ["tochigi",9], ["gunma",10], ["saitama",11], ["chiba",12], ["tokyo",13], ["kanagawa",14],
             ["niigata",15], ["toyama",16], ["ishikawa",17], ["fukui",18], ["yamanashi",19], 
             ["nagano",20], ["gifu",21], ["shizuoka",22], ["aichi",23], ["mie",24],
             ["shiga",25], ["kyoto",26],["osaka",27], ["hyogo",28], ["nara",29], ["wakayama",30],
             ["tottori",31], ["shimane",32], ["okayama",33], ["hiroshima",34], ["yamaguchi",35],
             ["tokushima",36], ["kanagawa",37], ["ehime",38], ["kouchi",39], 
             ["fukuoka",40], ["saga",41], ["nagasaki",42], ["kumamoto",43], ["oita",44], ["miyagi",45], ["kagoshima",46],
             ["okinawa",47]]

# 都道府県でデータを抽出
for name,i in prefs:
    # e-statのURL
    prefCode = str(i).zfill(2)
    pref_dir = prefCode + "_" + name
    print(pref_dir, prefCode)
    # shpのURL
    url = f"https://www.e-stat.go.jp/gis/statmap-search/data?dlserveyId=A002005212020&code={prefCode}&coordSys=1&format=shape&downloadType=5&datum=2000"
    
    # ディレクトリが存在するか
    if not os.path.exists(f"./R2_boundary/{pref_dir}"):
        # urlにリクエスト
        urlData = requests.get(url).content
        
        # 出力ファイル名
        filename = f"./R2_boundary/{pref_dir}.zip"
        with open(filename ,mode='wb') as f: # wb でバイト型を書き込める
            f.write(urlData)
        
        # ディレクトリの作成
        !mkdir -p ./R2_boundary/$pref_dir
        # zipファイルの解凍
        !unzip ./R2_boundary/$pref_dir".zip" -d ./R2_boundary/$pref_dir > /dev/null
        # zipファイルの削除
        !rm ./R2_boundary/$pref_dir".zip"
        
        # ファイル名前の変更
        paths = glob.glob(f"./R2_boundary/{pref_dir}/*")
        for path in paths:
            # 変更後
            rename = path.replace(f"r2ka{prefCode}", pref_dir)
            # ファイル名の変更
            os.rename(path, rename) 

```


## まとめ
日本の自治体の境界データをダウンロードしました。

## 参考サイト
[e-stat 境界データ](https://www.e-stat.go.jp/gis/statmap-search?page=1&type=2&aggregateUnitForBoundary=A&toukeiCode=00200521&toukeiYear=2020&serveyId=A002005212020&coordsys=1&format=shape&datum=2000)<br>


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


