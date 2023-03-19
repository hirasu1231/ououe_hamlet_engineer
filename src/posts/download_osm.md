---
display: home
title: '日本のOpenStreetMapをダウンロードする'
description: 日本のOpenStreetMapをダウンロードします。
date: 2023-3-22
image: https://www.hamlet-engineer.com/image/miyagi_osm.png
categories: 
  - GIS
tags:
  - Python
  - GIS
  - OpenStreetMap
  - JupyterNotebook
---
日本のOpenStreetMapをダウンロードします。


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
├── /osm
│   ├── /tohoku/gis_osm_roads_free_1.shp
│   └── (省略)
└── ＊＊＊.ipynb <- 実行用ノートブック
```

## OpenStreetMapのダウンロード

```python
# 地方リスト
regions = ["chubu", "chugoku", "hokkaido", "kansai", 
           "kanto", "kyushu", "shikoku", "tohoku"]

# OpenStreetMapのディレクトリ作成
!mkdir -p osm
# osmのダウンロード
for region in regions:
    # ディレクトリが存在するか
    if not os.path.exists(f"./osm/{region}"):
        # zipファイルのダウンロード
        !wget -P ./osm/ http://download.geofabrik.de/asia/japan/$region-latest-free.shp.zip
        # 地方別ディレクトリの作成
        !mkdir -p ./osm/$region
        # zipファイルの解凍
        !unzip ./osm/$region-latest-free.shp.zip -d ./osm/$region > /dev/null
        # zipファイルの削除
        !rm ./osm/$region-latest-free.shp.zip
```


## まとめ
日本のOpenStreetMapをダウンロードしました。

## 参考サイト
[OSM Japan ChūgokuRegion shp](http://download.geofabrik.de/asia/japan.html)<br>
[OpenStreetMapの道路酒別](https://wiki.openstreetmap.org/wiki/JA:Key:highway)<br>
[OpenStreetMap Data in Layered GIS Format](http://www.geofabrik.de/data/geofabrik-osm-gis-standard-0.3.pdf)<br>
[Chūbu region shp](http://download.geofabrik.de/asia/japan/chubu-latest-free.shp.zip)<br>
[Chūgoku region shp](http://download.geofabrik.de/asia/japan/chugoku-latest-free.shp.zip)<br>
[Hokkaidō shp](http://download.geofabrik.de/asia/japan/hokkaido-latest-free.shp.zip)<br>
[Kinki region shp](http://download.geofabrik.de/asia/japan/kansai-latest-free.shp.zip)<br>
[Kantō region shp](http://download.geofabrik.de/asia/japan/kanto-latest-free.shp.zip)<br>
[Kyūshū shp](http://download.geofabrik.de/asia/japan/kyushu-latest-free.shp.zip)<br>
[Shikoku shp](http://download.geofabrik.de/asia/japan/shikoku-latest-free.shp.zip)<br>
[Tōhoku region shp](http://download.geofabrik.de/asia/japan/tohoku-latest-free.shp.zip)<br>


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


