(window.webpackJsonp=window.webpackJsonp||[]).push([[174],{591:function(t,a,e){"use strict";e.r(a);var i=e(2),s=Object(i.a)({},(function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("p",[t._v("PLATEAU SDKをMacBookProで操作できるようにするまでのことを記述します(1回目)")]),t._v(" "),e("ClientOnly",[e("CallInArticleAdsense")],1),t._v(" "),e("p"),e("div",{staticClass:"table-of-contents"},[e("ul",[e("li",[e("a",{attrs:{href:"#第一の失敗-サンプルを実行"}},[t._v("第一の失敗(サンプルを実行)")])]),e("li",[e("a",{attrs:{href:"#公式ドキュメント"}},[t._v("公式ドキュメント")]),e("ul",[e("li",[e("a",{attrs:{href:"#プロジェクトの作成"}},[t._v("プロジェクトの作成")])]),e("li",[e("a",{attrs:{href:"#plateau-sdk-for-unityのインストール"}},[t._v("PLATEAU SDK for Unityのインストール")])]),e("li",[e("a",{attrs:{href:"#都市モデルのインポート"}},[t._v("都市モデルのインポート")])]),e("li",[e("a",{attrs:{href:"#基準座標系の選択"}},[t._v("基準座標系の選択")])]),e("li",[e("a",{attrs:{href:"#範囲の選択"}},[t._v("範囲の選択")])]),e("li",[e("a",{attrs:{href:"#描画の設定"}},[t._v("描画の設定")])]),e("li",[e("a",{attrs:{href:"#dem-土地形状-を外す"}},[t._v("Dem(土地形状)を外す")])])])]),e("li",[e("a",{attrs:{href:"#まとめ"}},[t._v("まとめ")])]),e("li",[e("a",{attrs:{href:"#参考サイト"}},[t._v("参考サイト")])])])]),e("p"),t._v(" "),e("h2",{attrs:{id:"第一の失敗-サンプルを実行"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#第一の失敗-サンプルを実行"}},[t._v("#")]),t._v(" 第一の失敗(サンプルを実行)")]),t._v(" "),e("p",[e("a",{attrs:{href:"https://github.com/Project-PLATEAU/PLATEAU-SDK-for-Unity-Samples",target:"_blank",rel:"noopener noreferrer"}},[t._v("PLATEAU SDK for Unity Samples"),e("OutboundLink")],1),t._v("でサンプルを実装しようとしたら，Windowsのディレクトリでエラーが発生した．\nWindows用に作られているのか，Mac版なのにWindows用のディレクトリを参照しているようです．")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("A meta data file (.meta) exists but its asset 'Packages/com.synesthesias.plateau-unity-sdk/Plugins/Windows/x86_64/plateau.pdb' can't be found. When moving or deleting files outside of Unity, please ensure that the corresponding .meta file is moved or deleted along with it.\n")])])]),e("p",[t._v("見直そうと思います．")]),t._v(" "),e("h2",{attrs:{id:"公式ドキュメント"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#公式ドキュメント"}},[t._v("#")]),t._v(" 公式ドキュメント")]),t._v(" "),e("h3",{attrs:{id:"プロジェクトの作成"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#プロジェクトの作成"}},[t._v("#")]),t._v(" プロジェクトの作成")]),t._v(" "),e("ul",[e("li",[t._v("Unityバージョン 2021.3")]),t._v(" "),e("li",[t._v("テンプレートは3D")])]),t._v(" "),e("h3",{attrs:{id:"plateau-sdk-for-unityのインストール"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#plateau-sdk-for-unityのインストール"}},[t._v("#")]),t._v(" PLATEAU SDK for Unityのインストール")]),t._v(" "),e("ul",[e("li",[t._v("gitのURL指定で導入します")]),t._v(" "),e("li",[t._v("Window → Package Manager の＋ボタンから Add pacakge from git URL...を選択\n"),e("ul",[e("li",[e("a",{attrs:{href:"https://github.com/Synesthesias/PLATEAU-SDK-for-Unity/releases",target:"_blank",rel:"noopener noreferrer"}},[t._v(" PLATEAU SDK for Unity のリリースページ"),e("OutboundLink")],1)]),t._v(" "),e("li",[t._v("https://github.com/Synesthesias/PLATEAU-SDK-for-Unity.git#v1.1.0")]),t._v(" "),e("li",[t._v("公式コメント：デフォルトブランチは内容が予告なく変更されるので推奨しません。タグ名を記載することを推奨します。")])])]),t._v(" "),e("li",[t._v("ウィンドウのパッケージ一覧に Plateau Unity SDK が表示されたら完了")])]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/SDKinstall.png",loading:"lazy"}})]),t._v(" "),e("h3",{attrs:{id:"都市モデルのインポート"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#都市モデルのインポート"}},[t._v("#")]),t._v(" 都市モデルのインポート")]),t._v(" "),e("ul",[e("li",[t._v("Unityのメニューバーから PLATEAU → PLATEAU SDK を選択")])]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/SDK_menu.png",loading:"lazy"}})]),t._v(" "),e("ul",[e("li",[t._v("3D都市モデルは G空間情報センターのPLATEAUポータルサイト からダウンロードできます。\n"),e("ul",[e("li",[t._v("CityGML形式のものをダウンロードしてください。")])])]),t._v(" "),e("li",[t._v("都市データのフォルダの中には、udx,codelistsという名前のフォルダがあるはずです。\n"),e("ul",[e("li",[t._v("udxから階層が1つ上のフォルダを選択します。")])])])]),t._v(" "),e("h3",{attrs:{id:"基準座標系の選択"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#基準座標系の選択"}},[t._v("#")]),t._v(" 基準座標系の選択")]),t._v(" "),e("ul",[e("li",[t._v("3Dモデルなので平面直角座標系を使用する")]),t._v(" "),e("li",[t._v("地方に合わせた平面直角座標を選択する")])]),t._v(" "),e("h3",{attrs:{id:"範囲の選択"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#範囲の選択"}},[t._v("#")]),t._v(" 範囲の選択")]),t._v(" "),e("ul",[e("li",[t._v("マウスホイールを上下に回してズームアウト、ズームインします。")]),t._v(" "),e("li",[t._v("マウスホイールを押し込んだままドラッグしてカメラ移動します。")]),t._v(" "),e("li",[t._v("青色の線は利用可能な地域を示します。")])]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/areaSelectWindow.png",loading:"lazy"}})]),t._v(" "),e("h3",{attrs:{id:"描画の設定"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#描画の設定"}},[t._v("#")]),t._v(" 描画の設定")]),t._v(" "),e("ul",[e("li",[e("p",[t._v("Mesh Collider")]),t._v(" "),e("ul",[e("li",[t._v("Mesh：網")]),t._v(" "),e("li",[t._v("Collider：当たり判定処理を行ってくれる処理")])])]),t._v(" "),e("li",[e("p",[t._v("LOD")]),t._v(" "),e("ul",[e("li",[t._v("gmlファイルの中には、都市モデルの形状の細かさを指定したいという需要に対応するため、複数の形状データが格納されている場合があります。")]),t._v(" "),e("li",[t._v("LOD0がもっとも大雑把な形状で、LOD1, LOD2 と数字が上がるほど細かい形状になります。")]),t._v(" "),e("li",[t._v("建築物の場合、LOD0 は平面、LOD1は平面に一定の高さを付けたもの、LOD2はより細かい形状です。")])])]),t._v(" "),e("li",[e("p",[t._v("現実の景観と異なる地物について")]),t._v(" "),e("ul",[e("li",[t._v("地物の種類で「土地利用」と「災害リスク」については、情報の範囲を示す目印として白い板の3Dモデルが表示されます。")]),t._v(" "),e("li",[t._v("この白い板はリアルな景観のみを求める際には不要になるので、土地利用と災害リスクに関するデータが不要な場合はインポートしないか、インポート後オフにすることを推奨します")])])])]),t._v(" "),e("p",[t._v("今回は下記の設定")]),t._v(" "),e("ul",[e("li",[t._v("Mesh Collider:オフ")]),t._v(" "),e("li",[t._v("LOD：オン")]),t._v(" "),e("li",[t._v("「土地利用」と「災害リスク」:オン(後からオフ)")])]),t._v(" "),e("p",[t._v("ここでも，Windows関連のエラーになった")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("A meta data file (.meta) exists but its asset 'Packages/com.synesthesias.plateau-unity-sdk/Plugins/Windows/x86_64/plateau.pdb' can't be found. When moving or deleting files outside of Unity, please ensure that the corresponding .meta file is moved or deleted along with it.\n")])])]),e("ul",[e("li",[e("p",[t._v("*.pdb ファイルは，Windows 向けプレイヤービルドバイナリらしい")]),t._v(" "),e("ul",[e("li",[t._v("*.pdb ファイル ― デバッグ用のシンボルファイルです。 Build Settings ウィンドウで Copy PDB files を有効にすると、これらのファイルが Unity によってビルド ディレクトリ内にコピーされます。")]),t._v(" "),e("li",[t._v("あんまり，このエラーは関係にないのかな")])])]),t._v(" "),e("li",[e("p",[t._v("Demの読み込みでメモリ消費量230GBが出てきたw")])]),t._v(" "),e("li",[e("p",[t._v("Demでメモリオーバーするならのければイケる？")])])]),t._v(" "),e("h3",{attrs:{id:"dem-土地形状-を外す"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#dem-土地形状-を外す"}},[t._v("#")]),t._v(" Dem(土地形状)を外す")]),t._v(" "),e("p",[t._v("Dem(土地形状)を外したら，デケた")]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/sample_kokura.png",loading:"lazy"}})]),t._v(" "),e("h2",{attrs:{id:"まとめ"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#まとめ"}},[t._v("#")]),t._v(" まとめ")]),t._v(" "),e("p",[t._v("PLATEAU SDKをMacBookProで操作できるようにするまでのことを記述しました(1回目)")]),t._v(" "),e("h2",{attrs:{id:"参考サイト"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#参考サイト"}},[t._v("#")]),t._v(" 参考サイト")]),t._v(" "),e("p",[e("a",{attrs:{href:"https://www.mlit.go.jp/plateaudocument/",target:"_blank",rel:"noopener noreferrer"}},[t._v("plateauのドキュメント"),e("OutboundLink")],1)]),t._v(" "),e("ClientOnly",[e("CallInArticleAdsense")],1),t._v(" "),e("p",[e("a",{attrs:{href:"//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON",rel:"nofollow",referrerpolicy:"no-referrer-when-downgrade"}},[e("img",{staticStyle:{border:"none"},attrs:{src:"//image.moshimo.com/af-img/0866/000000029835.jpg",width:"728",height:"90"}})]),e("img",{staticStyle:{border:"none"},attrs:{src:"//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835",width:"1",height:"1"}})]),t._v(" "),e("p",[e("a",{attrs:{href:"//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON",rel:"nofollow",referrerpolicy:"no-referrer-when-downgrade"}},[e("img",{staticStyle:{border:"none"},attrs:{src:"//image.moshimo.com/af-img/1115/000000025847.png",width:"728",height:"90"}})]),e("img",{staticStyle:{border:"none"},attrs:{src:"//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847",width:"1",height:"1"}})])],1)}),[],!1,null,null,null);a.default=s.exports}}]);