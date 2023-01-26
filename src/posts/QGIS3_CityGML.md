---
display: home
title: 'PLATEAUのCityGMLの3D表現を実施します'
description: PLATEAUのCityGMLの3D表現を実施します
date: 2023-1-27
image: https://www.hamlet-engineer.com/image/3Dsibuya.png
categories: 
  - GIS
tags:
  - GIS
  - 3D
  - QGIS
  - PLATEAU
  - CityGML
---

<!-- https://www.hamlet-engineer.com -->
PLATEAUのCityGMLの3D表現を実施します。

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


## CityGMLのダウンロード
下記のサイトでCityGMLのダウンロードを実行します．

[3D都市モデル（Project PLATEAU）東京都23区（CityGML 2020年度）](https://www.geospatial.jp/ckan/dataset/plateau)

今回は，渋谷駅周辺(3次メッシュコード「53393596・53393586」)の投影をしてみたいので，2次メッシュコード「533935」のCityGMLをダウンロードします．

[533935の地図](http://gonhana.sakura.ne.jp/tanpopo2015/meshmap/tokyo/533935.html)でメッシュコードを確認しています．

ダウンロードしたファイルは[東京23区における3D都市モデルのための拡張製品仕様](https://www.geospatial.jp/ckan/dataset/plateau-tokyo23ku-citygml-2020/resource/e5edb01e-8e87-4540-a64e-53dcc0f31f43?inner_span=True)より，下記のような種類があり，各ファイルで圧縮されています．
```
bldg 建築物、建築物部分、建築物付属物、及びこれらの境界面 
tran 道路、通路
luse 土地利用
urf 都市計画区域、区域区分、地域地区
dem 地形(起伏)
fld 洪水浸水想定区域
tnm 津波浸水想定 
lsld 土砂災害警戒区域 
brid 橋梁
frn 設置物
```

今回は建築物を投影したいので，「bldg.7z」を解凍します．

中に入っているファイルは，3次メッシュコード(53393596 ex)で整理されているGMLファイルです．

例：53393586_bldg_6697_op2.gml(3次メッシュコード_GMLの種類_日本測地系22011のCRSコード_op2.gml)

また、appearanceフォルダには建物のテクスチャ（表面画像）が入っています．

## QGISの投影

### GMLの投影バグ
53393586_bldg_6697_op2.gmlをQGISにドラッグすると，「座標」の表記がXY逆になっていることがわかります．

本来，X=緯度・Y=経度となるはずが，X=35.63664,Y=139.70695となって逆になっています．

### GMLの投影の修正
その前に生のGMLだといろいろエラーが出ると怖いので、一旦 .gpkg（GeoPackage形式）にして座標のXY入れ替えをします．

SHPに変換もできなくもないのですが日本語の属性フィールド名ですとSHPがエラーを吐くので、*.gpkgとかのほうがおすすめです．

「座標のXY入れ替え」は，「プロセッシングメニュー/プロセッシングツールボックス/ベクタジオメトリ/座標のXY入れ替え」を使用します．

*.gpkgで保存したレイヤーを入力レイヤに選択したら，出力レイヤを入力します．ここではとりあえず，「一時レイヤを作成」でします．

### 3Dの投影
QGISの投影法(右下端)をEPSG：6677(JGD2011 平面直角ⅠX系)などのメートル単位の投影法に変更します．

そして，QGIS2Threejsプラグインなどを使って，建物高さを"measuredHeight"にして３Dにします．

![](image/3Dsibuya.png)

## まとめ
ここまでで，CityGMLの3D表現を実施しました．

次は，Pythonで自動化もしていきます．

## 参考サイト
[PLATEAU](https://www.mlit.go.jp/plateau/)

[PLATEAU Open Data](https://www.mlit.go.jp/plateau/opendata/)

[3D都市モデル（Project PLATEAU）東京都23区（CityGML 2020年度）](https://www.geospatial.jp/ckan/dataset/plateau-tokyo23ku-citygml-2020)

[G空間センター データセット](https://www.geospatial.jp/ckan/dataset)

[PLATEAUのCityGMLを鼻血出してQGISで表示する](https://qiita.com/Yfuruchin/items/aa3a847db26c7f378d6e)

[QGISでProject PLATEAUのCityGMLの緯度経度が入れ替わる問題を修正した件](https://zenn.dev/mugwort_rc/articles/34a427a9394580)

[3D都市モデル（Project PLATEAU）ポータルサイト(全国版)](https://www.geospatial.jp/ckan/dataset/plateau)

[3D都市データ”PLATEAU”をPythonで動かしてみよう](https://enjoyworks.jp/tech-blog/7352)

[Pythonでシェープファイルから都道府県境界図を作成する](https://irukanobox.blogspot.com/2020/01/python.html)

[533935の地図](http://gonhana.sakura.ne.jp/tanpopo2015/meshmap/tokyo/533935.html)

[1次メッシュ 2次メッシュ 3次メッシュ （基準地域メッシュ）](http://www.nilim.go.jp/lab/bcg/siryou/tnn/tnn0574pdf/ks057408.pdf)

[QGISで1対多の「結合」を保存する](https://erickndava.github.io/hands-on/2018/06/15/when-a-relate-wont-do/)

[QGIS3 GeoPackageの使い方](https://chiakikun.hatenadiary.com/entry/2018/10/04/235614)

[Djangoで地図アプリ開発をしよう【前編】](https://note.com/shinya_hd/n/n8de567cd82a4)



<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

