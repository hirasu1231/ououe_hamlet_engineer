(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{372:function(t,a,e){"use strict";e.r(a);var s=e(2),r=Object(s.a)({},(function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("p",[t._v("兵庫県がオープンデータで「DSM」を公開しているので，QGISで3D地図を描画します．")]),t._v(" "),e("p",[t._v("QGISのversionは3.18です．")]),t._v(" "),e("ClientOnly",[e("CallInArticleAdsense")],1),t._v(" "),e("p",[t._v("２〜３は，「"),e("a",{attrs:{href:"https://www.hamlet-engineer.com/posts/GIS_01.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("QGIS3で兵庫県の「DSM」から標高で色分けした地図を描画する"),e("OutboundLink")],1),t._v("」と同じ内容です．")]),t._v(" "),e("p"),e("div",{staticClass:"table-of-contents"},[e("ul",[e("li",[e("a",{attrs:{href:"#_1-ファイル構成"}},[t._v("１：ファイル構成")])]),e("li",[e("a",{attrs:{href:"#_2-dsmとは"}},[t._v("２：DSMとは")])]),e("li",[e("a",{attrs:{href:"#_3-データの入手"}},[t._v("３：データの入手")])]),e("li",[e("a",{attrs:{href:"#_4-dsmデータをqgisに読み込む"}},[t._v("４：DSMデータをQGISに読み込む")])]),e("li",[e("a",{attrs:{href:"#_5-プラグインのインストール"}},[t._v("５：プラグインのインストール")])]),e("li",[e("a",{attrs:{href:"#_6-geotiffへの変換"}},[t._v("６：geotiffへの変換")])]),e("li",[e("a",{attrs:{href:"#_7-3dの都市景観図を描く"}},[t._v("\b７：3Dの都市景観図を描く")])]),e("li",[e("a",{attrs:{href:"#_8-まとめ"}},[t._v("８：まとめ")])]),e("li",[e("a",{attrs:{href:"#参考サイト"}},[t._v("参考サイト")])])])]),e("p"),t._v(" "),e("p",[e("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5",rel:"nofollow"}},[e("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"}})]),e("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5",alt:""}})]),t._v(" "),e("p",[e("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",rel:"nofollow"}},[e("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"}})]),e("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",alt:""}})]),t._v(" "),e("p",[e("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",rel:"nofollow"}},[t._v("全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】")]),e("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",alt:""}})]),t._v(" "),e("h2",{attrs:{id:"_1-ファイル構成"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-ファイル構成"}},[t._v("#")]),t._v(" １：ファイル構成")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("hyogo_lesson\n└── DSM_05of89 <- ダウンロードしたDSMファイル,名前変更\n    ├── DSM_05OF891_1g.txt\n    ├── DSM_05OF892_1g.txt\n    ├── DSM_05OF893_1g.txt\n    ├── DSM_05OF894_1g.txt\n    │\n    ├── geotiff\n    │   └── DSM_05OF891_1g_geotiff.tif\n    └── shp\n        ├── DSM_05OF891_1g_shp.shp\n        └── (省略)\n")])])]),e("br"),t._v(" "),e("h2",{attrs:{id:"_2-dsmとは"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2-dsmとは"}},[t._v("#")]),t._v(" ２：DSMとは")]),t._v(" "),e("p",[t._v("DSMは、建物、橋などの構造物の高さを含めた標高値で，市街の3D地図を作成する際は，このデータを使用します．")]),t._v(" "),e("blockquote",[e("p",[t._v("DSM は、建物、樹木、橋などの高さを含めた標高値を表示するデータモデルのことを指します。"),e("br"),t._v("\n地表面だけでなく、その上に存在する地物の高さを加味した標高データが必要な場合は、DSM データを入手する必要があります。"),e("br"),t._v("\n引用元："),e("a",{attrs:{href:"https://www.esrij.com/gis-guide/other-dataformat/elevation-data/",target:"_blank",rel:"noopener noreferrer"}},[t._v("GIS 基礎解説 標高データ"),e("OutboundLink")],1)])]),t._v(" "),e("br"),t._v(" "),e("h2",{attrs:{id:"_3-データの入手"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-データの入手"}},[t._v("#")]),t._v(" ３：データの入手")]),t._v(" "),e("p",[e("a",{attrs:{href:"https://www.geospatial.jp/ckan/dataset/2010-2018-hyogo-geo-potal",target:"_blank",rel:"noopener noreferrer"}},[t._v("兵庫県の数値地形データダウンロードページ"),e("OutboundLink")],1),t._v("にアクセスして、DSMのデータをダウンロードします．")]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/dsm_DL.png",loading:"lazy"}}),t._v(" "),e("br"),t._v(" "),e("br"),t._v("\n本稿では，地面の高さと建物の高さをわかりやすくするために，神戸市中央区の南京町やポートタワーがあるメッシュID「05OF89」を選択します．")]),t._v(" "),e("p",[t._v("メッシュIDの選択は"),e("a",{attrs:{href:"https://www.geospatial.jp/ckan/dataset/2010-2018-hyogo-geo-dsm/resource/5473fd75-0bcc-423b-960d-99ab37b25bff",target:"_blank",rel:"noopener noreferrer"}},[t._v("兵庫県_DSMダウンロードページ"),e("OutboundLink")],1),t._v("に移動した後，下記の地図上のメッシュを選択してダウンロードできます．")]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/dsm_DL_map.png",loading:"lazy"}})]),t._v(" "),e("p",[t._v("データの中身は，以下のように空白区切りで「Y座標（経度） X座標（緯度） 高度」となっています．")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("78000.500 -145499.500 2.72\n78001.500 -145499.500 2.23\n78002.500 -145499.500 2.22\n78003.500 -145499.500 2.40\n78004.500 -145499.500 2.07\n")])])]),e("p",[t._v("ファイル構成は以下の通りです．")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("05of89\n├── DSM_05OF891_1g.txt\n├── DSM_05OF892_1g.txt\n├── DSM_05OF893_1g.txt\n└── DSM_05OF894_1g.txt\n")])])]),e("br"),t._v(" "),e("h2",{attrs:{id:"_4-dsmデータをqgisに読み込む"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4-dsmデータをqgisに読み込む"}},[t._v("#")]),t._v(" ４：DSMデータをQGISに読み込む")]),t._v(" "),e("p",[t._v("ダウンロードしたDSMデータをQGIS3に読み込みます．")]),t._v(" "),e("p",[t._v("DSMデータはテキストファイルですので，メニューバーの「レイヤ->レイヤの追加->CSVテキストレイヤの追加」を選択します．")]),t._v(" "),e("p",[t._v("入力の設定は以下の通りです．")]),t._v(" "),e("ul",[e("li",[t._v("文字コードはShift_JIS．日本の公共データはだいたいこれ．")]),t._v(" "),e("li",[t._v("ファイル形式は「カスタム区切り」の「空白」を選択")]),t._v(" "),e("li",[t._v("レコードとフィールドのオプションは「フィールド型の検出する」のみ．")]),t._v(" "),e("li",[t._v("X属性はfield_1，Y属性はfield_2，Z属性はfield_3")]),t._v(" "),e("li",[t._v("ジオメトリのCRSは「EPSG：2447」を指定")])]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/dsm_load.png",loading:"lazy"}})]),t._v(" "),e("p",[t._v("読み込みが完了すると，長方形が表示されます．拡大すると，1mメッシュ間隔でポイントが表示され，ポイントデータであることが確認できます．")]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/dsm_point.png",loading:"lazy"}}),e("br"),t._v(" "),e("br")]),t._v(" "),e("h2",{attrs:{id:"_5-プラグインのインストール"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_5-プラグインのインストール"}},[t._v("#")]),t._v(" ５：プラグインのインストール")]),t._v(" "),e("p",[t._v("ここでは，ラスター変換等を実行する「Processing」と3D地図の描画する「QGIS2threejs」\nをメニューバーの「プラグインの管理とインストール」からインストールします．")]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/qgis_plugin.png",loading:"lazy"}}),e("br")]),t._v(" "),e("br"),t._v(" "),e("h2",{attrs:{id:"_6-geotiffへの変換"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_6-geotiffへの変換"}},[t._v("#")]),t._v(" ６：geotiffへの変換")]),t._v(" "),e("p",[t._v("3D地図を描画するには，ラスタデータにする必要があるため，地図情報を持った画像ファイルのgeotiffに変換する必要があります．")]),t._v(" "),e("p",[t._v("geotiffに変換する場合は，textファイルで読み込んだレイヤーから変換しようとすると，エラーが発生します．")]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/raster_error.png",loading:"lazy"}}),e("br"),t._v(" "),e("br")]),t._v(" "),e("p",[t._v("そこで，一旦shpファイルで保存してからラスター(geotiff)に変換してみます．")]),t._v(" "),e("p",[t._v("shpファイルの保存は，保存したいレイヤーのメニューから「エクスポート -> 新しいファイル名で地物を保存」で実行できます．(ここではファイル名を/hyogo_lesson/shp/DSM_05OF891_1g_shp.shpとしてます)")]),t._v(" "),e("p",[t._v("shpファイルの保存後は自動で保存したshpファイルの読み込みが開始されます．")]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/layer_menu.png",loading:"lazy"}})]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/shp_export.png",loading:"lazy"}})]),t._v(" "),e("p",[t._v("ラスター(geotiff)の変換は，メニューバーの「ラスタ」から「変換→ベクタのラスタ化」で実行します．")]),t._v(" "),e("p",[t._v("メニューバーの「ラスタ」に「変換」がない場合は，「プラグインの管理とインストール」で「Processing」がインストールされているか，確認してください．")]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/raster_menu.png",loading:"lazy"}}),e("br"),e("br")]),t._v(" "),e("p",[t._v("ここでは，shpファイルから読み込んだレイヤーを選択します．また，変換完了後，自動的に保存したgeotiffは読み込まれます．")]),t._v(" "),e("p",[t._v("設定は以下の通りです．(ここではファイル名を/hyogo_lesson/geotiff/DSM_05OF891_1g_geotiff.geotiffとしてます)")]),t._v(" "),e("ul",[e("li",[t._v("入力レイヤ：shpから読み込んだポイントデータを指定")]),t._v(" "),e("li",[t._v("焼き込み値の属性（フィールド）：高さのフィールド（field_3）")]),t._v(" "),e("li",[t._v("出力ラスタサイズの単位：地理単位")]),t._v(" "),e("li",[t._v("水平方向の解像度：1（元のDSMが1mメッシュ単位なので）")]),t._v(" "),e("li",[t._v("鉛直方向の解像度：1（元のDSMが1mメッシュ単位なので）")]),t._v(" "),e("li",[t._v("出力領域：右のボタンをクリックし、「レイヤの領域を使う」を選択")]),t._v(" "),e("li",[t._v("出力バンドに指定のnodata値を割り当てる：-9999")]),t._v(" "),e("li",[t._v("出力ファイル：保存先とファイル名を指定")])]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/raster_export.png",loading:"lazy"}}),e("br"),e("br")]),t._v(" "),e("p",[t._v("読み込まれたgeotiffは，以下のような白黒で描画されます．")]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/geotiff_draw.png",loading:"lazy"}}),e("br")]),t._v(" "),e("br"),t._v(" "),e("h2",{attrs:{id:"_7-3dの都市景観図を描く"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_7-3dの都市景観図を描く"}},[t._v("#")]),t._v(" \b７：3Dの都市景観図を描く")]),t._v(" "),e("p",[t._v("作成したDSMラスタを使って，空中写真図をベースとした3D図を描画してみます．")]),t._v(" "),e("p",[t._v("XYZ Tilesに空中写真図が登録されてない場合は，XYZ Tilesを右クリックし、「新しい接続を選択」を開きます．")]),t._v(" "),e("p",[t._v("ウィンドウで名前を適当に入力(ここでは全国最新写真)、URLに「https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg」をコピペして [ OK ] をクリックすると，登録できます．")]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/XYZ_Tiles.png",loading:"lazy"}}),e("br"),e("br")]),t._v(" "),e("p",[t._v("空中写真図は，XYZ Tilesから読み込み(ここでの名前は全国最新写真)，一番上のレイヤーにし，QGIS2threejsを開きます．")]),t._v(" "),e("p",[t._v("レイヤのDSMラスタ（下図では出力ファイル）にチェックを入れると，3D地図が描画されます．")]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/3D_menu.png",loading:"lazy"}})]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/hyogo_dsm_3d.png",loading:"lazy"}})]),t._v(" "),e("br"),t._v(" "),e("h2",{attrs:{id:"_8-まとめ"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_8-まとめ"}},[t._v("#")]),t._v(" ８：まとめ")]),t._v(" "),e("p",[t._v("QGISで兵庫県の「DSM」の3D地図を描画しました．")]),t._v(" "),e("p",[t._v("3D地図は"),e("a",{attrs:{href:"https://www.hamlet-engineer.com/DSM_web/index.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("兵庫県のDSMマップ"),e("OutboundLink")],1),t._v("で参照できます．")]),t._v(" "),e("p",[t._v("「DSM」1m間隔でデータを記述しているので，ビルのような高い構造物がでこぼこの山のように描画されます．")]),t._v(" "),e("p",[t._v("次回では，構造物の形も考慮して描画できるようにします．")]),t._v(" "),e("h2",{attrs:{id:"参考サイト"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#参考サイト"}},[t._v("#")]),t._v(" 参考サイト")]),t._v(" "),e("p",[e("a",{attrs:{href:"https://www.esrij.com/gis-guide/other-dataformat/elevation-data/",target:"_blank",rel:"noopener noreferrer"}},[t._v("GIS 基礎解説 標高データ"),e("OutboundLink")],1)]),t._v(" "),e("p",[e("a",{attrs:{href:"https://note.com/kinari_iro/n/nd291716f021b",target:"_blank",rel:"noopener noreferrer"}},[t._v("【実習編】～兵庫県オープンデータ「DSM」をQGISで描画しよう～"),e("OutboundLink")],1)]),t._v(" "),e("p",[e("a",{attrs:{href:"https://www.geospatial.jp/ckan/dataset/2010-2018-hyogo-geo-potal",target:"_blank",rel:"noopener noreferrer"}},[t._v("兵庫県_全域数値地形図_ポータル"),e("OutboundLink")],1)]),t._v(" "),e("p",[e("a",{attrs:{href:"https://www.geospatial.jp/ckan/dataset/2010-2018-hyogo-geo-dsm/resource/5473fd75-0bcc-423b-960d-99ab37b25bff",target:"_blank",rel:"noopener noreferrer"}},[t._v("兵庫県_DSM"),e("OutboundLink")],1)]),t._v(" "),e("p",[e("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5",rel:"nofollow"}},[e("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"}})]),e("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5",alt:""}})]),t._v(" "),e("p",[e("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",rel:"nofollow"}},[e("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"}})]),e("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",alt:""}})]),t._v(" "),e("p",[e("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",rel:"nofollow"}},[t._v("全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】")]),e("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",alt:""}})]),t._v(" "),e("ClientOnly",[e("CallInArticleAdsense")],1)],1)}),[],!1,null,null,null);a.default=r.exports}}]);