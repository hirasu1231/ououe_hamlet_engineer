---
display: home
title: 'QGIS3で兵庫県の「DSM」から標高で色分けした地図を描画する'
description: 兵庫県がオープンデータで「DSM」を公開しているので，QGISで標高で色分けした地図を描画します．．QGISのversionは3.18です．
date: 2021-04-21
image: https://www.hamlet-engineer.com/image/dsm_class.png
categories: 
  - GIS
tags:
  - QGIS3
  - 3D
  - DSM
---
兵庫県がオープンデータで「DSM」を公開しているので，QGISで標高で色分けした地図を描画します．

QGISのversionは3.18です．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>


[[toc]]

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

## １：DSMとは
DSMは、建物、橋などの構造物の高さを含めた標高値で，市街の3D地図を作成する際は，このデータを使用します．

> DSM は、建物、樹木、橋などの高さを含めた標高値を表示するデータモデルのことを指します。<br>
地表面だけでなく、その上に存在する地物の高さを加味した標高データが必要な場合は、DSM データを入手する必要があります。<br>
引用元：[GIS 基礎解説 標高データ](https://www.esrij.com/gis-guide/other-dataformat/elevation-data/)

<br>

## ２：データの入手
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

## ３：DSMデータをQGISに読み込む
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

## ４：DSMデータを色分け
3D地図とかんけいありませんが，レイヤのプロパティからシンボロジから高度で色分けしてみます．

分類方法を「連続値による定義」で，カラムを「field_3」に指定します．

シンボルではストロークスタイルを「ペンなし」に変更し，シンボルの縁を描かないように設定します．(でないと，高度の色分けがシンボルの縁の色で塗り潰されます)

モードを「丸め間隔」に設定し10クラスで分類し，以下の地図を描画します．
![](/image/dsm_class_setting.png)

やはり，山が高いので，黄色に着色されていますので，うまく色分けされているようです．
![](/image/dsm_class.png)

<br>

## ５：まとめ
兵庫県がオープンデータで「DSM」を公開しているので，QGISで標高で色分けした地図を描画しました

次回では，標高を考慮した3D地図を作成します．

## 参考サイト
[GIS 基礎解説 標高データ](https://www.esrij.com/gis-guide/other-dataformat/elevation-data/)

[【実習編】～兵庫県オープンデータ「DSM」をQGISで描画しよう～](https://note.com/kinari_iro/n/nd291716f021b)

[兵庫県_全域数値地形図_ポータル](https://www.geospatial.jp/ckan/dataset/2010-2018-hyogo-geo-potal)

[兵庫県_DSM](https://www.geospatial.jp/ckan/dataset/2010-2018-hyogo-geo-dsm/resource/5473fd75-0bcc-423b-960d-99ab37b25bff)


<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>