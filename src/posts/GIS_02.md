---
display: home
title: 'QGIS3で兵庫県の「DSM」から3D地図を描画する'
description: 兵庫県がオープンデータで「DSM」を公開しているので，QGISで3D地図を描画します．QGISのversionは3.18です．
date: 2021-04-27
image: https://www.hamlet-engineer.com/image/hyogo_dsm_3d.png
categories: 
  - GIS
tags:
  - QGIS3
  - 3D
  - DSM
---
兵庫県がオープンデータで「DSM」を公開しているので，QGISで3D地図を描画します．

QGISのversionは3.18です．
<!-- more -->

２〜３は，「[QGIS3で兵庫県の「DSM」から標高で色分けした地図を描画する](https://www.hamlet-engineer.com/posts/GIS_01.html)」と同じ内容です．


## 目次
[[toc]]

## １：ファイル構成
```
hyogo_lesson
└── DSM_05of89 <- ダウンロードしたDSMファイル,名前変更
    ├── DSM_05OF891_1g.txt
    ├── DSM_05OF892_1g.txt
    ├── DSM_05OF893_1g.txt
    ├── DSM_05OF894_1g.txt
    │
    ├── geotiff
    │   └── DSM_05OF891_1g_geotiff.tif
    └── shp
        ├── DSM_05OF891_1g_shp.shp
        └── (省略)
```

<br>

## ２：DSMとは
DSMは、建物、橋などの構造物の高さを含めた標高値で，市街の3D地図を作成する際は，このデータを使用します．

> DSM は、建物、樹木、橋などの高さを含めた標高値を表示するデータモデルのことを指します。<br>
地表面だけでなく、その上に存在する地物の高さを加味した標高データが必要な場合は、DSM データを入手する必要があります。<br>
引用元：[GIS 基礎解説 標高データ](https://www.esrij.com/gis-guide/other-dataformat/elevation-data/)

<br>

## ３：データの入手
[兵庫県の数値地形データダウンロードページ](https://www.geospatial.jp/ckan/dataset/2010-2018-hyogo-geo-potal)にアクセスして、DSMのデータをダウンロードします．

![](/image/dsm_DL.png)
<br>
<br>
本稿では，地面の高さと建物の高さをわかりやすくするために，神戸市中央区の南京町やポートタワーがあるメッシュID「05OF89」を選択します．

メッシュIDの選択は[兵庫県_DSMダウンロードページ](https://www.geospatial.jp/ckan/dataset/2010-2018-hyogo-geo-dsm/resource/5473fd75-0bcc-423b-960d-99ab37b25bff)に移動した後，下記の地図上のメッシュを選択してダウンロードできます．

![](/image/dsm_DL_map.png)

データの中身は，以下のように空白区切りで「Y座標（経度） X座標（緯度） 高度」となっています．

```
78000.500 -145499.500 2.72
78001.500 -145499.500 2.23
78002.500 -145499.500 2.22
78003.500 -145499.500 2.40
78004.500 -145499.500 2.07
```

ファイル構成は以下の通りです．

```
05of89
├── DSM_05OF891_1g.txt
├── DSM_05OF892_1g.txt
├── DSM_05OF893_1g.txt
└── DSM_05OF894_1g.txt
```
<br>

## ４：DSMデータをQGISに読み込む
ダウンロードしたDSMデータをQGIS3に読み込みます．

DSMデータはテキストファイルですので，メニューバーの「レイヤ->レイヤの追加->CSVテキストレイヤの追加」を選択します．

入力の設定は以下の通りです．
- 文字コードはShift_JIS．日本の公共データはだいたいこれ．
- ファイル形式は「カスタム区切り」の「空白」を選択
- レコードとフィールドのオプションは「フィールド型の検出する」のみ．
- X属性はfield_1，Y属性はfield_2，Z属性はfield_3
- ジオメトリのCRSは「EPSG：2447」を指定

![](/image/dsm_load.png)

読み込みが完了すると，長方形が表示されます．拡大すると，1mメッシュ間隔でポイントが表示され，ポイントデータであることが確認できます．

![](/image/dsm_point.png)<br>
<br>

## ５：プラグインのインストール
ここでは，ラスター変換等を実行する「Processing」と3D地図の描画する「QGIS2threejs」
をメニューバーの「プラグインの管理とインストール」からインストールします．

![](/image/qgis_plugin.png)<br>

<br>

## ６：geotiffへの変換
3D地図を描画するには，ラスタデータにする必要があるため，地図情報を持った画像ファイルのgeotiffに変換する必要があります．

geotiffに変換する場合は，textファイルで読み込んだレイヤーから変換しようとすると，エラーが発生します．

![](/image/raster_error.png)<br>
<br>

そこで，一旦shpファイルで保存してからラスター(geotiff)に変換してみます．

shpファイルの保存は，保存したいレイヤーのメニューから「エクスポート -> 新しいファイル名で地物を保存」で実行できます．(ここではファイル名を/hyogo_lesson/shp/DSM_05OF891_1g_shp.shpとしてます)

shpファイルの保存後は自動で保存したshpファイルの読み込みが開始されます．

![](/image/layer_menu.png)

![](/image/shp_export.png)


ラスター(geotiff)の変換は，メニューバーの「ラスタ」から「変換→ベクタのラスタ化」で実行します．

メニューバーの「ラスタ」に「変換」がない場合は，「プラグインの管理とインストール」で「Processing」がインストールされているか，確認してください．

![](/image/raster_menu.png)<br><br>


ここでは，shpファイルから読み込んだレイヤーを選択します．また，変換完了後，自動的に保存したgeotiffは読み込まれます．

設定は以下の通りです．(ここではファイル名を/hyogo_lesson/geotiff/DSM_05OF891_1g_geotiff.geotiffとしてます)
- 入力レイヤ：shpから読み込んだポイントデータを指定
- 焼き込み値の属性（フィールド）：高さのフィールド（field_3）
- 出力ラスタサイズの単位：地理単位
- 水平方向の解像度：1（元のDSMが1mメッシュ単位なので）
- 鉛直方向の解像度：1（元のDSMが1mメッシュ単位なので）
- 出力領域：右のボタンをクリックし、「レイヤの領域を使う」を選択
- 出力バンドに指定のnodata値を割り当てる：-9999
- 出力ファイル：保存先とファイル名を指定　　

![](/image/raster_export.png)<br><br>


読み込まれたgeotiffは，以下のような白黒で描画されます．

![](/image/geotiff_draw.png)<br>

<br>

## ７：3Dの都市景観図を描く
作成したDSMラスタを使って，空中写真図をベースとした3D図を描画してみます．

XYZ Tilesに空中写真図が登録されてない場合は，XYZ Tilesを右クリックし、「新しい接続を選択」を開きます．

ウィンドウで名前を適当に入力(ここでは全国最新写真)、URLに「https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg」をコピペして [ OK ] をクリックすると，登録できます．

![](/image/XYZ_Tiles.png)<br><br>

空中写真図は，XYZ Tilesから読み込み(ここでの名前は全国最新写真)，一番上のレイヤーにし，QGIS2threejsを開きます．

レイヤのDSMラスタ（下図では出力ファイル）にチェックを入れると，3D地図が描画されます．


![](/image/3D_menu.png)

![](/image/hyogo_dsm_3d.png)

<br>

## ８：まとめ
QGISで兵庫県の「DSM」の3D地図を描画しました．

3D地図は[兵庫県のDSMマップ](https://www.hamlet-engineer.com/DSM_web/index.html)で参照できます．

「DSM」1m間隔でデータを記述しているので，ビルのような高い構造物がでこぼこの山のように描画されます．

次回では，構造物の形も考慮して描画できるようにします．

## 参考サイト
[GIS 基礎解説 標高データ](https://www.esrij.com/gis-guide/other-dataformat/elevation-data/)

[【実習編】～兵庫県オープンデータ「DSM」をQGISで描画しよう～](https://note.com/kinari_iro/n/nd291716f021b)

[兵庫県_全域数値地形図_ポータル](https://www.geospatial.jp/ckan/dataset/2010-2018-hyogo-geo-potal)

[兵庫県_DSM](https://www.geospatial.jp/ckan/dataset/2010-2018-hyogo-geo-dsm/resource/5473fd75-0bcc-423b-960d-99ab37b25bff)

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>