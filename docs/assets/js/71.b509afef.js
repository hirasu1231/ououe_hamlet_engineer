(window.webpackJsonp=window.webpackJsonp||[]).push([[71],{415:function(t,a,s){"use strict";s.r(a);var r=s(2),e=Object(r.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("p",[t._v("Python + CycleGanでオリジナルデータでの学習を実装を目指して，本稿ではディアブロス(原種)とディアブロス亜種の変換を実施します．"),s("br")]),t._v(" "),s("ClientOnly",[s("CallInArticleAdsense")],1),t._v(" "),s("p",[t._v("今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．"),s("br")]),t._v(" "),s("blockquote",[s("p",[t._v("Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。"),s("br"),t._v("\n引用元："),s("a",{attrs:{href:"https://interface.cqpub.co.jp/ail01/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Google Colabの使い方"),s("OutboundLink")],1)])]),t._v(" "),s("p",[t._v("最終的に，実写モンハンのディアブロス亜種を原種に戻す試みをします．\n"),s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/diablos_black.jpg",loading:"lazy"}})]),t._v(" "),s("p"),s("div",{staticClass:"table-of-contents"},[s("ul",[s("li",[s("a",{attrs:{href:"#作業ディレクトリのファイル構成"}},[t._v("作業ディレクトリのファイル構成")])]),s("li",[s("a",{attrs:{href:"#オリジナルデータの学習"}},[t._v("オリジナルデータの学習")]),s("ul",[s("li",[s("a",{attrs:{href:"#学習データの準備"}},[t._v("学習データの準備")])]),s("li",[s("a",{attrs:{href:"#オリジナルデータの学習"}},[t._v("オリジナルデータの学習")])]),s("li",[s("a",{attrs:{href:"#オリジナルデータの学習モデルでテスト"}},[t._v("オリジナルデータの学習モデルでテスト")])]),s("li",[s("a",{attrs:{href:"#mhw版ディアブロス亜種の変換"}},[t._v("MHW版ディアブロス亜種の変換")])]),s("li",[s("a",{attrs:{href:"#実写版ディアブロス亜種の変換"}},[t._v("実写版ディアブロス亜種の変換")])])])]),s("li",[s("a",{attrs:{href:"#おまけ"}},[t._v("おまけ")]),s("ul",[s("li",[s("a",{attrs:{href:"#mhr版ディアブロス-イラスト-の変換"}},[t._v("MHR版ディアブロス(イラスト)の変換")])])])]),s("li",[s("a",{attrs:{href:"#まとめ"}},[t._v("まとめ")])]),s("li",[s("a",{attrs:{href:"#参考サイト"}},[t._v("参考サイト")])])])]),s("p"),t._v(" "),s("p",[s("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5",rel:"nofollow"}},[s("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"}})]),s("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5",alt:""}})]),t._v(" "),s("p",[s("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",rel:"nofollow"}},[s("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"}})]),s("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",alt:""}})]),t._v(" "),s("p",[s("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",rel:"nofollow"}},[t._v("全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】")]),s("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",alt:""}})]),t._v(" "),s("h2",{attrs:{id:"作業ディレクトリのファイル構成"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#作業ディレクトリのファイル構成"}},[t._v("#")]),t._v(" 作業ディレクトリのファイル構成")]),t._v(" "),s("p",[t._v("プロジェクトディレクトリはdiablos_ganとしています．度々，省略しています．")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("diablos_gan\n├── /pytorch-CycleGAN-and-pix2pix\n│   ├── /checkpoints <- 学習モデルの保存先\n│   │   └── /diablos_gan\n│   │       ├── /web <- 学習中の変換画像\n│   │       ├── latest_net_G.pth <- テストで使う変換モデル\n│   │       ├── latest_net_G_A.pth <- AからBへの変換モデル\n│   │       └── latest_net_G_B.pth <- BからAへの変換モデル\n│   ├── /results <- 出力される変換画像\n│   │   └── /diablos_gan\n│   ├── /datasets <- 学習データ\n│   │   ├── diablos_gan.zip\n│   │   └── /diablos_gan\n│   │       ├── trainA\n│   │       ├── testA\n│   │       ├── trainB\n│   │       └── testB\n│   ├── requirements.txt\n│   ├── train.py\n│   ├── test.py\n│   └── (省略)\n└── diablos_gan.ipynb <- 実行用ノートブック\n")])])]),s("h2",{attrs:{id:"オリジナルデータの学習"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#オリジナルデータの学習"}},[t._v("#")]),t._v(" オリジナルデータの学習")]),t._v(" "),s("p",[t._v("ディアブロスとディアブロス亜種の画像を準備して，オリジナルデータでの学習を実施します．")]),t._v(" "),s("h3",{attrs:{id:"学習データの準備"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#学習データの準備"}},[t._v("#")]),t._v(" 学習データの準備")]),t._v(" "),s("p",[t._v("ディアブロスとディアブロス亜種のGoogle画像検索をウェブスクレイピングして，準備しました．"),s("br"),t._v("\nGoogle Driveでデータをやりとりする場合は，zipで圧縮したものをアップロードして，Colab上で回答した方がエラーも発生しづらくおすすめです．"),s("br"),t._v("\n以下のコマンドでzipの解凍ができます．")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# ディレクトリの移動")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("cd "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("content"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("drive"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("My\\ Drive"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("diablos_gan"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("pytorch"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("CycleGAN"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("and")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("pix2pix"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("datasets\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 学習データの解凍")]),t._v("\n!unzip diablos_gan"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("zip")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("dev"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("null\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# データ数")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# (trainA, testA) = (80, 16)")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# (trainB, testB) = (80, 16)")]),t._v("\n")])])]),s("h3",{attrs:{id:"オリジナルデータの学習-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#オリジナルデータの学習-2"}},[t._v("#")]),t._v(" オリジナルデータの学習")]),t._v(" "),s("p",[t._v("以下のコマンドで学習を実行できます．"),s("br")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# ディレクトリの移動")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("cd "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("content"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("drive"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("My\\ Drive"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("diablos_gan"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("pytorch"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("CycleGAN"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("and")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("pix2pix\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# オリジナルデータの学習")]),t._v("\n!python train"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("py "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("dataroot "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("datasets"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("diablos_gan \\\n                 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("n_epochs "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("300")]),t._v(" \\\n                 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("name diablos_gan \\\n                 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("model cycle_gan \\\n                 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("display_id "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("gpu_ids "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),t._v("\n")])])]),s("h3",{attrs:{id:"オリジナルデータの学習モデルでテスト"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#オリジナルデータの学習モデルでテスト"}},[t._v("#")]),t._v(" オリジナルデータの学習モデルでテスト")]),t._v(" "),s("p",[t._v("ディアブロスとディアブロス亜種の画像を変換する学習モデルを作成しましたので，以下のコマンドでテストを実行します．"),s("br"),t._v("\n--nameでは/checkpointsの中にある学習モデルのディレクトリ名を記述します．"),s("br"),t._v("\n学習モデルの名前は"),s("code",[t._v("latest_net_G.pth")]),t._v("としてください．"),s("br"),t._v("\nAのデータ -> Bのデータに変換するモデルは"),s("code",[t._v("＊＊＊_G_A.pth")]),t._v("で，Bのデータ -> Aのデータに変換するのモデルは"),s("code",[t._v("＊＊＊_G_B.pth")]),t._v("です．"),s("br"),t._v("\n※trainA・testAはディアブロス原種，trainB・testBはディアブロス亜種の画像となっています．"),s("br"),t._v(" "),s("br"),t._v("\n変換画像は自動的に256x256の正方形に変換されて出力されます．オリジナルのサイズとアスペクト比を保持したい場合は， "),s("code",[t._v("--preprocess none")]),t._v("を追記してください．"),s("br"),t._v("\nただし，GPUの負荷もハンパなく重くなります．僕の場合は，1920x1280と1080x720はGPUのメモリーをオーバーして，640x480で動きました．")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 現在ディレクトリ")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# /content/drive/My\\ Drive/diablos_gan/pytorch-CycleGAN-and-pix2pix")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 学習モデルの名前変更")]),t._v("\n!cp checkpoints"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("diablos_gan"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("latest_net_G_B"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("pth checkpoints"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("diablos_gan"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("latest_net_G"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("pth\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 学習モデルのテスト実行")]),t._v("\n!python test"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("py "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("dataroot datasets"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("diablos_gan"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("testB \\\n                "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("name diablos_gan \\\n                "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("results_dir "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("results"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("diablos_gan"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v(" \\\n                "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("preprocess none \\\n                "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("model test "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("no_dropout\n")])])]),s("h3",{attrs:{id:"mhw版ディアブロス亜種の変換"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#mhw版ディアブロス亜種の変換"}},[t._v("#")]),t._v(" MHW版ディアブロス亜種の変換")]),t._v(" "),s("p",[t._v("MHW版ディアブロス亜種の変換前画像"),s("br"),t._v(" "),s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/mhw_real.png",loading:"lazy"}})]),t._v(" "),s("p",[t._v("MHW版ディアブロス亜種の変換後画像"),s("br"),t._v(" "),s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/mhw_fake.png",loading:"lazy"}})]),t._v(" "),s("h3",{attrs:{id:"実写版ディアブロス亜種の変換"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#実写版ディアブロス亜種の変換"}},[t._v("#")]),t._v(" 実写版ディアブロス亜種の変換")]),t._v(" "),s("p",[t._v("実写版ディアブロス亜種の変換前画像"),s("br"),t._v(" "),s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/diablos_real.png",loading:"lazy"}})]),t._v(" "),s("p",[t._v("実写版ディアブロス亜種の変換後画像"),s("br"),t._v(" "),s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/diablos_fake.png",loading:"lazy"}})]),t._v(" "),s("h2",{attrs:{id:"おまけ"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#おまけ"}},[t._v("#")]),t._v(" おまけ")]),t._v(" "),s("p",[t._v("最近発売したモンハンライズでは原種のディアブロスはでているので，イラストをディアブロス亜種に変換しました．")]),t._v(" "),s("h3",{attrs:{id:"mhr版ディアブロス-イラスト-の変換"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#mhr版ディアブロス-イラスト-の変換"}},[t._v("#")]),t._v(" MHR版ディアブロス(イラスト)の変換")]),t._v(" "),s("p",[t._v("MHR版ディアブロス(イラスト)の変換前画像"),s("br"),t._v(" "),s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/mhr_illust_real.png",loading:"lazy"}})]),t._v(" "),s("p",[t._v("MHR版ディアブロス(イラスト)の変換後画像"),s("br"),t._v(" "),s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/mhr_illust_fake.png",loading:"lazy"}})]),t._v(" "),s("h2",{attrs:{id:"まとめ"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#まとめ"}},[t._v("#")]),t._v(" まとめ")]),t._v(" "),s("p",[t._v("Python + CycleGanでオリジナルデータでの学習を兼ねて，ディアブロス(原種)とディアブロス亜種の変換を実施します"),s("br"),t._v("\nたった80枚の学習画像でも結構できていましたが，もう少し精度が向上するように手を加えていきます．")]),t._v(" "),s("h2",{attrs:{id:"参考サイト"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#参考サイト"}},[t._v("#")]),t._v(" 参考サイト")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix",target:"_blank",rel:"noopener noreferrer"}},[t._v("junyanz/pytorch-CycleGAN-and-pix2pix"),s("OutboundLink")],1),s("br")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5",rel:"nofollow"}},[s("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"}})]),s("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5",alt:""}})]),t._v(" "),s("p",[s("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",rel:"nofollow"}},[s("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"}})]),s("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",alt:""}})]),t._v(" "),s("p",[s("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",rel:"nofollow"}},[t._v("全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】")]),s("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",alt:""}})]),t._v(" "),s("ClientOnly",[s("CallInArticleAdsense")],1)],1)}),[],!1,null,null,null);a.default=e.exports}}]);