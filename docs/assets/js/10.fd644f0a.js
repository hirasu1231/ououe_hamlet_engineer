(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{369:function(a,t,s){"use strict";s.r(t);var r=s(2),e=Object(r.a)({},(function(){var a=this,t=a.$createElement,s=a._self._c||t;return s("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[s("p",[a._v("Python + CycleGanでオリジナルデータでの学習を実装を目指して，本稿ではディアブロス(原種)とディアブロス亜種の変換を実施します．"),s("br")]),a._v(" "),s("p",[a._v("今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．"),s("br")]),a._v(" "),s("blockquote",[s("p",[a._v("Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。"),s("br"),a._v("\n引用元："),s("a",{attrs:{href:"https://interface.cqpub.co.jp/ail01/",target:"_blank",rel:"noopener noreferrer"}},[a._v("Google Colabの使い方"),s("OutboundLink")],1)])]),a._v(" "),s("p",[a._v("最終的に，実写モンハンのディアブロス亜種を原種に戻す試みをします．\n"),s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/diablos_black.jpg",loading:"lazy"}})]),a._v(" "),s("h2",{attrs:{id:"作業ディレクトリのファイル構成"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#作業ディレクトリのファイル構成"}},[a._v("#")]),a._v(" 作業ディレクトリのファイル構成")]),a._v(" "),s("p",[a._v("プロジェクトディレクトリはdiablos_ganとしています．度々，省略しています．")]),a._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[a._v("diablos_gan\n├── /pytorch-CycleGAN-and-pix2pix\n│   ├── /checkpoints <- 学習モデルの保存先\n│   │   └── /diablos_gan\n│   │       ├── /web <- 学習中の変換画像\n│   │       ├── latest_net_G.pth <- テストで使う変換モデル\n│   │       ├── latest_net_G_A.pth <- AからBへの変換モデル\n│   │       └── latest_net_G_B.pth <- BからAへの変換モデル\n│   ├── /results <- 出力される変換画像\n│   │   └── /diablos_gan\n│   ├── /datasets <- 学習データ\n│   │   ├── diablos_gan.zip\n│   │   └── /diablos_gan\n│   │       ├── trainA\n│   │       ├── testA\n│   │       ├── trainB\n│   │       └── testB\n│   ├── requirements.txt\n│   ├── train.py\n│   ├── test.py\n│   └── (省略)\n└── diablos_gan.ipynb <- 実行用ノートブック\n")])])]),s("h2",{attrs:{id:"オリジナルデータの学習"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#オリジナルデータの学習"}},[a._v("#")]),a._v(" オリジナルデータの学習")]),a._v(" "),s("p",[a._v("ディアブロスとディアブロス亜種の画像を準備して，オリジナルデータでの学習を実施します．")]),a._v(" "),s("h3",{attrs:{id:"学習データの準備"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#学習データの準備"}},[a._v("#")]),a._v(" 学習データの準備")]),a._v(" "),s("p",[a._v("ディアブロスとディアブロス亜種のGoogle画像検索をウェブスクレイピングして，準備しました．"),s("br"),a._v("\nGoogle Driveでデータをやりとりする場合は，zipで圧縮したものをアップロードして，Colab上で回答した方がエラーも発生しづらくおすすめです．"),s("br"),a._v("\n以下のコマンドでzipの解凍ができます．")]),a._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# ディレクトリの移動")]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("%")]),a._v("cd "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("content"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("drive"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("My\\ Drive"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("diablos_gan"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("pytorch"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),a._v("CycleGAN"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("and")]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),a._v("pix2pix"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("datasets\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# 学習データの解凍")]),a._v("\n!unzip diablos_gan"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),s("span",{pre:!0,attrs:{class:"token builtin"}},[a._v("zip")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("dev"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("null\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# データ数")]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# (trainA, testA) = (80, 16)")]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# (trainB, testB) = (80, 16)")]),a._v("\n")])])]),s("h3",{attrs:{id:"オリジナルデータの学習-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#オリジナルデータの学習-2"}},[a._v("#")]),a._v(" オリジナルデータの学習")]),a._v(" "),s("p",[a._v("以下のコマンドで学習を実行できます．"),s("br")]),a._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# ディレクトリの移動")]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("%")]),a._v("cd "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("content"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("drive"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("My\\ Drive"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("diablos_gan"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("pytorch"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),a._v("CycleGAN"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("and")]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),a._v("pix2pix\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# オリジナルデータの学習")]),a._v("\n!python train"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("py "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),a._v("dataroot "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("datasets"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("diablos_gan \\\n                 "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),a._v("n_epochs "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("300")]),a._v(" \\\n                 "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),a._v("name diablos_gan \\\n                 "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),a._v("model cycle_gan \\\n                 "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),a._v("display_id "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("0")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),a._v("gpu_ids "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("0")]),a._v("\n")])])]),s("h3",{attrs:{id:"オリジナルデータの学習モデルでテスト"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#オリジナルデータの学習モデルでテスト"}},[a._v("#")]),a._v(" オリジナルデータの学習モデルでテスト")]),a._v(" "),s("p",[a._v("ディアブロスとディアブロス亜種の画像を変換する学習モデルを作成しましたので，以下のコマンドでテストを実行します．"),s("br"),a._v("\n--nameでは/checkpointsの中にある学習モデルのディレクトリ名を記述します．"),s("br"),a._v("\n学習モデルの名前は"),s("code",[a._v("latest_net_G.pth")]),a._v("としてください．"),s("br"),a._v("\nAのデータ -> Bのデータに変換するモデルは"),s("code",[a._v("＊＊＊_G_A.pth")]),a._v("で，Bのデータ -> Aのデータに変換するのモデルは"),s("code",[a._v("＊＊＊_G_B.pth")]),a._v("です．"),s("br"),a._v("\n※trainA・testAはディアブロス原種，trainB・testBはディアブロス亜種の画像となっています．"),s("br"),a._v(" "),s("br"),a._v("\n変換画像は自動的に256x256の正方形に変換されて出力されます．オリジナルのサイズとアスペクト比を保持したい場合は， "),s("code",[a._v("--preprocess none")]),a._v("を追記してください．"),s("br"),a._v("\nただし，GPUの負荷もハンパなく重くなります．僕の場合は，1920x1280と1080x720はGPUのメモリーをオーバーして，640x480で動きました．")]),a._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# 現在ディレクトリ")]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# /content/drive/My\\ Drive/diablos_gan/pytorch-CycleGAN-and-pix2pix")]),a._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# 学習モデルの名前変更")]),a._v("\n!cp checkpoints"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("diablos_gan"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("latest_net_G_B"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("pth checkpoints"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("diablos_gan"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("latest_net_G"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("pth\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# 学習モデルのテスト実行")]),a._v("\n!python test"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("py "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),a._v("dataroot datasets"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("diablos_gan"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("testB \\\n                "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),a._v("name diablos_gan \\\n                "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),a._v("results_dir "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("results"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v("diablos_gan"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("/")]),a._v(" \\\n                "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),a._v("preprocess none \\\n                "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),a._v("model test "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),a._v("no_dropout\n")])])]),s("h3",{attrs:{id:"mhw版ディアブロス亜種の変換"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#mhw版ディアブロス亜種の変換"}},[a._v("#")]),a._v(" MHW版ディアブロス亜種の変換")]),a._v(" "),s("p",[a._v("MHW版ディアブロス亜種の変換前画像"),s("br"),a._v(" "),s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/mhw_real.png",loading:"lazy"}})]),a._v(" "),s("p",[a._v("MHW版ディアブロス亜種の変換後画像"),s("br"),a._v(" "),s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/mhw_fake.png",loading:"lazy"}})]),a._v(" "),s("h3",{attrs:{id:"実写版ディアブロス亜種の変換"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#実写版ディアブロス亜種の変換"}},[a._v("#")]),a._v(" 実写版ディアブロス亜種の変換")]),a._v(" "),s("p",[a._v("実写版ディアブロス亜種の変換前画像"),s("br"),a._v(" "),s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/diablos_real.png",loading:"lazy"}})]),a._v(" "),s("p",[a._v("実写版ディアブロス亜種の変換後画像"),s("br"),a._v(" "),s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/diablos_fake.png",loading:"lazy"}})]),a._v(" "),s("h2",{attrs:{id:"おまけ"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#おまけ"}},[a._v("#")]),a._v(" おまけ")]),a._v(" "),s("p",[a._v("最近発売したモンハンライズでは原種のディアブロスはでているので，イラストをディアブロス亜種に変換しました．")]),a._v(" "),s("h3",{attrs:{id:"mhr版ディアブロス-イラスト-の変換"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#mhr版ディアブロス-イラスト-の変換"}},[a._v("#")]),a._v(" MHR版ディアブロス(イラスト)の変換")]),a._v(" "),s("p",[a._v("MHR版ディアブロス(イラスト)の変換前画像"),s("br"),a._v(" "),s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/mhr_illust_real.png",loading:"lazy"}})]),a._v(" "),s("p",[a._v("MHR版ディアブロス(イラスト)の変換後画像"),s("br"),a._v(" "),s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/mhr_illust_fake.png",loading:"lazy"}})]),a._v(" "),s("h2",{attrs:{id:"まとめ"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#まとめ"}},[a._v("#")]),a._v(" まとめ")]),a._v(" "),s("p",[a._v("Python + CycleGanでオリジナルデータでの学習を兼ねて，ディアブロス(原種)とディアブロス亜種の変換を実施します"),s("br"),a._v("\nたった80枚の学習画像でも結構できていましたが，もう少し精度が向上するように手を加えていきます．")]),a._v(" "),s("h2",{attrs:{id:"参考サイト"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#参考サイト"}},[a._v("#")]),a._v(" 参考サイト")]),a._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix",target:"_blank",rel:"noopener noreferrer"}},[a._v("junyanz/pytorch-CycleGAN-and-pix2pix"),s("OutboundLink")],1),s("br")])])}),[],!1,null,null,null);t.default=e.exports}}]);