---
display: home
title: 'QGIS3で兵庫県の「DEM」と「DSM」から構造物の3D地図を描画する'
description: QGIS3で兵庫県の「DSM」の3D地図を描画しましたが，構造物の凸凹の地図が棒がされるので，構造物も考慮した3D地図をを描画します．QGISのversionは3.18です．
date: 2021-04-29
image: https://www.hamlet-engineer.com/image/bld_03.png
categories: 
  - GIS
tags:
  - QGIS3
  - 3D
  - DSM
---
QGIS3で兵庫県の「DSM」の3D地図を描画しましたが，構造物の凸凹の地図が棒がされるので，構造物も考慮した3D地図を描画します．

QGISのversionは3.18です．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

２〜３は，「[QGIS3で兵庫県の「DSM」から3D地図を描画する](https://www.hamlet-engineer.com/posts/GIS_02.html)」と同じ内容です．


[[toc]]

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

## １：ファイル構成
```
hyogo_lesson
├── DSM_05of89 <- ダウンロードしたDSMファイル
│   ├── DSM_05OF891_1g.txt
│   ├── (省略)
│   │
│   ├── geotiff
│   │   └── DSM_05OF891_1g_geotiff.tif
│   └── shp
│       ├── DSM_05OF891_1g_shp.shp
│       └── (省略)
│
├── DEM_05of89 <- ダウンロードしたDEMファイル
│   ├── DSM_05OF891_1g.txt
│   └── (省略)
│
├── DEM_05of89 <- 作成したDCMファイル
│   └── DCM_05OF891_1g.tif
│
├── kiban_chizu <- ダウンロードした基盤地図ファイル
│   └──  FG-GML-523501-11-20210101
│       ├── FG-GML-523501-BldA-20210101-0001.xml
│       ├── FG-GML-523501-BldA-20210101-0002.xml
│       ├── merge_BldA_523501.shp <- マージしたshpファイル
│       ├── select_BldA_523501.shp <- 範囲を選択したshpファイル
│       └── (省略)
│
├── building <- 標高付き構造物ポリゴン
│   ├── building_05of89.shp
│   └── (省略)
│
└── 3D_hyogo <- 3D地図のHTMLファイル
    ├── index.html
    └── (省略)
```



<br>

## ２：入力データ
入力データには，「DSM」・「DEM」・「建物形状のポリゴンデータ」の３つを用いります．

## ２．１：DSM
DSMは、建物、橋などの構造物の高さを含めた標高値で，市街の3D地図を作成する際は，このデータを使用します．

ここでは，前回と同様にメッシュID：「05OF89」のデータを使用します．

[兵庫県の数値地形データダウンロードページ](https://www.geospatial.jp/ckan/dataset/2010-2018-hyogo-geo-potal)にアクセスして、DSMのデータをダウンロードします．

詳細は，「[QGIS3で兵庫県の「DSM」から標高で色分けした地図を描画する](https://www.hamlet-engineer.com/posts/GIS_01.html)」で記述しています．


> DSM は、建物、樹木、橋などの高さを含めた標高値を表示するデータモデルのことを指します。<br>
地表面だけでなく、その上に存在する地物の高さを加味した標高データが必要な場合は、DSM データを入手する必要があります。<br>
引用元：[GIS 基礎解説 標高データ](https://www.esrij.com/gis-guide/other-dataformat/elevation-data/)

<br>

## ２．２：DEM
DEMは、建物や樹木などを取り除いた地表面た標高値です．

ここでは，前回と同様にメッシュID：「05OF89」のデータを使用します．

[兵庫県の数値地形データダウンロードページ](https://www.geospatial.jp/ckan/dataset/2010-2018-hyogo-geo-potal)にアクセスして、DEMのデータをダウンロードします．

詳細は，「[QGIS3で兵庫県の「DSM」から標高で色分けした地図を描画する](https://www.hamlet-engineer.com/posts/GIS_01.html)」で記述しています．


>  DEM は、建物や樹木などを取り除いた地表面の高さを表示するデータモデルです。日本では、国土地理院が提供する「基盤地図情報（数値標高モデル）」という DEM データが広く利用されており、これは航空レーザー測量や写真測量によって得た標高データをメッシュ（5m、10m 単位などの方眼）で区切り、その中心点の標高値を抽出したデータです。<br>
引用元：[GIS 基礎解説 標高データ](https://www.esrij.com/gis-guide/other-dataformat/elevation-data/)

<br>

## ２．３：建物形状のポリゴンデータ
建物形状のポリゴンデータは、DSMやDEMと同じ範囲のものを基盤地図情報からダウンロードします．

メッシュIDの振り方が異なるので，重なる範囲を入手します．(ここでは，メッシュID：523501を選択します．)

[基盤地図情報のダウンロードサイト](https://fgd.gsi.go.jp/download/menu.php)にアクセスして，検索条件指定から「建築物の外周線」にチェックを入れ，ダウンロードします．

![](/image/kiban_chizu.png)

![](/image/gaisyu.png)

<br>

## ３：構造物の高さを算出
DSMとDEMを用いると，構造物の高さの値を計算することができます．

DSMは地物の高さを含んだ高さの値，DEMは標高値のデータであるため，`DSM - DEM`と計算をすれば建物の高さを算出できます．

DSMからDEMを引いて算出されたデータのことを，森林学の分野では，DCM（Digital Canopy Model）と呼んでおり，便宜的にDCMと呼びます．

![](/image/dsm_dem.png)<br><br>

QGIS3では，DEMをtxtデータをドラッグすれば，そのままラスターデータとして読み込まれます．

DSMとDEMをラスタ-データで読み込んで、ラスタの各ピクセルの値を使って計算できるラスタ計算機という機能を用いります．

QGISにDSMとDEMのラスタデータを読み込んだ状態でラスタ計算機を開き，演算式とに保存先を設定します．(ここでは，/DCM_05of89/DCM_05OF891_1g.tifで保存します)

![](/image/raster_calculation.png)<br><br>

DCMの標高値が低いと青，高いと黄色として色分けすると，山側の標高が低く色分けされています．

![](/image/dcm_raster.png)<br><br>

<br>


## ４：DCMの値をポリゴンデータに付与する

### ４．１：基盤地図情報の読み込み
基盤地図情報ウェブサイトからダウンロードしたzipファイルから，建物領域の「BldA」のベクタタイプのものだけ読み込みます．

0001、0002のように複数に分かれている場合は、両方読み込みます．xmlファイルをドラッグすれば，読み込まれます．

<br>

### ４．２：複数ファイルの結合
複数ファイルを読み込んだ場合は，マージ機能を用いてレイヤの結合を行います．

メニューバーの「ベクタ」から「データ管理ツール → ベクタレイヤのマージ」をクリックします．

マージウィンドウで、入力レイヤに結合するレイヤを指定し、出力先を指定したら [ 実行 ] をクリックします．（ここでのファイル名はmerge_BldA_523501.shpとします）

![](/image/dcm_polygon_02.png)<br><br>

### ４．３：処理範囲のポリゴンを抽出
ラスタのサイズに対し、基盤地図情報の建物ポリゴンは広域にわたって存在しますので，必要な範囲のフィーチャを選択して切り出す処理を行います。（ここでのファイル名はselect_BldA_523501.shpとします）

![](/image/dcm_polygon_03.png)<br><br>


### ４．４：高さの値をポリゴンと重なるラスタから抽出する
QGISでは，空間的に重なっているデータ同士を関連付けて属性情報を結合したり演算したりすることができます．

ここでは，建物ポリゴンと重なるラスタのセル値を計算して、建物ポリゴンの属性テーブルに付与する手法について紹介します。

メニューの「プロセシング」から「ツールボックス」をクリックし，表示されたツールボックスの「ラスタ解析」から「ゾーン統計量(ベクタ)」を選択します．

![](/image/dcm_polygon_04.png)<br><br>

「ゾーン統計量(ベクタ)」の設定は以下の通りです．「計算する統計量」は，平均、中央値、最大値の3つを選択します．(ここでの保存ファイル名は/building/building_05of89.shpとします)

![](/image/dcm_polygon_05.png)<br><br>

![](/image/dcm_polygon_06.png)<br><br>


## ５：構造物ポリゴンを3Dで描画する
構造物ポリゴンを3Dで描画します．

使用するデータは、建物ポリゴンデータ、DEMラスタ、国土地理院空中写真です．

![](/image/bld_01.png)<br><br>

Qgis2threejsを起動し，，建物ポリゴンデータ、DEMラスタにチェックを入れます．

そして，ポリゴンレイヤを右クリックし，プロパティの設定を行います．

設定箇所は以下の通りです．設定が完了したら [ OK ] ボタンをクリックします．
- Object type：「Extruded」に変更する
- Mode：DEMラスタを指定
- Height：下のプルダウンメニューから高さに使うカラムを指定（meanなど）

![](/image/bld_02.png)<br><br>

すると，構造物ポリゴンを3Dで描画されました．

![](/image/bld_03.png)<br><br>

HTMLファイルで保存する場合は，メニューバーの「File -> Export to Web」で保存できます．

![](/image/bld_04.png)<br><br>

<br>

## ６：まとめ
QGIS3で構造物も考慮した3D地図を描画しました．

構造物も考慮した3D地図は[こちらのページ](https://www.hamlet-engineer.com/3D_hyogo/index.html)で参照できます．

## 参考サイト
[GIS 基礎解説 標高データ](https://www.esrij.com/gis-guide/other-dataformat/elevation-data/)

[【実習編】～兵庫県オープンデータ「DSM」をQGISで描画しよう～](https://note.com/kinari_iro/n/nd291716f021b)

[【実習編】～兵庫県オープンデータを使って建物ポリゴンを立体表示させよう～](https://note.com/kinari_iro/n/n92ca18761af8)

[兵庫県_全域数値地形図_ポータル](https://www.geospatial.jp/ckan/dataset/2010-2018-hyogo-geo-potal)

[兵庫県_DSM](https://www.geospatial.jp/ckan/dataset/2010-2018-hyogo-geo-dsm/resource/5473fd75-0bcc-423b-960d-99ab37b25bff)

[基盤地図情報のダウンロードサイト](https://fgd.gsi.go.jp/download/menu.php)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>