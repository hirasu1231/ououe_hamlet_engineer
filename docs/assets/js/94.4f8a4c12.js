(window.webpackJsonp=window.webpackJsonp||[]).push([[94],{481:function(t,a,s){"use strict";s.r(a);var n=s(2),r=Object(n.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("p",[t._v("Pythonで英文のPDFをレイアウトを維持したままの翻訳を実装します．")]),t._v(" "),s("p",[t._v("今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．"),s("br")]),t._v(" "),s("ClientOnly",[s("CallInArticleAdsense")],1),t._v(" "),s("blockquote",[s("p",[t._v("Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。"),s("br"),t._v("\n引用元："),s("a",{attrs:{href:"https://interface.cqpub.co.jp/ail01/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Google Colabの使い方"),s("OutboundLink")],1)])]),t._v(" "),s("p"),s("div",{staticClass:"table-of-contents"},[s("ul",[s("li",[s("a",{attrs:{href:"#google-colabのファイル構成"}},[t._v("Google Colabのファイル構成")])]),s("li",[s("a",{attrs:{href:"#google-driveと連携"}},[t._v("Google Driveと連携")])]),s("li",[s("a",{attrs:{href:"#モジュールのインストール"}},[t._v("モジュールのインストール")])]),s("li",[s("a",{attrs:{href:"#翻訳実行"}},[t._v("翻訳実行")]),s("ul",[s("li",[s("a",{attrs:{href:"#コードの作成"}},[t._v("コードの作成")])]),s("li",[s("a",{attrs:{href:"#シェルスクリプトファイルの作成"}},[t._v("シェルスクリプトファイルの作成")])]),s("li",[s("a",{attrs:{href:"#翻訳実行"}},[t._v("翻訳実行")])])])]),s("li",[s("a",{attrs:{href:"#まとめ"}},[t._v("まとめ")])]),s("li",[s("a",{attrs:{href:"#参考サイト"}},[t._v("参考サイト")])]),s("li",[s("a",{attrs:{href:"#エラー集"}},[t._v("エラー集")]),s("ul",[s("li",[s("a",{attrs:{href:"#エラーコード1"}},[t._v("エラーコード1")])]),s("li",[s("a",{attrs:{href:"#エラーコード2"}},[t._v("エラーコード2")])])])])])]),s("p"),t._v(" "),s("p",[s("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5",rel:"nofollow"}},[s("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"}})]),s("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5",alt:""}})]),t._v(" "),s("p",[s("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",rel:"nofollow"}},[s("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"}})]),s("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",alt:""}})]),t._v(" "),s("p",[s("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",rel:"nofollow"}},[t._v("全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】")]),s("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",alt:""}})]),t._v(" "),s("h2",{attrs:{id:"google-colabのファイル構成"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#google-colabのファイル構成"}},[t._v("#")]),t._v(" Google Colabのファイル構成")]),t._v(" "),s("p",[t._v("プロジェクトディレクトリはpdf_translateとしています．度々，省略しています．")]),t._v(" "),s("div",{staticClass:"language-init extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("pdf_translate\n├── /pdf_translate\n│   ├── translate_csv.py <- 翻訳前後をcsv化\n│   ├── pdf_translate.sh <- 実行スクリプト\n│   ├── AttentionGAN.pdf <- 翻訳前\n│   ├── JA_AttentionGAN.pdf <- 翻訳後\n│   ├── AttentionGAN.pdf.csv <- 翻訳前後csv\n│   ├── AttentionGAN.pdf.json  <- pdf情報のjson\n│   └── (省略)\n└── pdf_translate.ipynb <- 実行用ノートブック\n")])])]),s("h2",{attrs:{id:"google-driveと連携"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#google-driveと連携"}},[t._v("#")]),t._v(" Google Driveと連携")]),t._v(" "),s("p",[t._v("Google ColabとGoogle Driveを連携させて，gitから"),s("a",{attrs:{href:"https://github.com/mima3/pdf_translate.git",target:"_blank",rel:"noopener noreferrer"}},[t._v("mima3/pdf_translate"),s("OutboundLink")],1),t._v("をダウンロードします．"),s("br")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Google ColabとGoogle Driveを連携")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" google"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("colab "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" drive\ndrive"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("mount"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/content/drive'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("bash\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# ディレクトリの移動")]),t._v("\ncd "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("content"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("drive"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("My\\ Drive"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("PDF_transrate\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# gitのダウンロード")]),t._v("\ngit clone https"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("//")]),t._v("github"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("com"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("mima3"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("pdf_translate"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("git\nls\n")])])]),s("h2",{attrs:{id:"モジュールのインストール"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#モジュールのインストール"}},[t._v("#")]),t._v(" モジュールのインストール")]),t._v(" "),s("p",[t._v("下記のコマンドでモジュールをインストールします．")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[t._v("!pip install googletrans"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("4.0")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v(".0")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("rc1\n!pip install fitz\n!pip install PyMuPDF"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1.16")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v(".14")]),t._v("\n")])])]),s("h2",{attrs:{id:"翻訳実行"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#翻訳実行"}},[t._v("#")]),t._v(" 翻訳実行")]),t._v(" "),s("h3",{attrs:{id:"コードの作成"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#コードの作成"}},[t._v("#")]),t._v(" コードの作成")]),t._v(" "),s("p",[t._v("個人的にcsvとして翻訳結果も残したいので，下記のコードを作成します．")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# translate_csv.pyの書き込み")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("writefile translate_csv"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("py\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" sys\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" time\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" random\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" pandas "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" pd\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" googletrans "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" Translator\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("def")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("main")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("input_path"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  argvs "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" sys"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("argv\n  argc "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("len")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("argvs"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" argc "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Usage #python %s [PDFãƒ‘ã‚¹]"')]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v(" argvs"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n      exit"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  input_path "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" argvs"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n  df "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" pd"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("read_csv"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("input_path"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" names"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'org_text'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'convert_text'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  \n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("for")]),t._v(" i "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("in")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("range")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("len")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("df"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      org_text "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" df"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'org_text'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("i"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("replace"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'.'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'. '")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("org_text"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n      df"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'convert_text'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("i"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" Translator"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("translate"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("org_text"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" dest"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"ja"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("text\n      \n  df"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("to_csv"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("input_path"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" header"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("False")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" index"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("False")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" __name__ "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'__main__'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  main"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("sys"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("argv"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("h3",{attrs:{id:"シェルスクリプトファイルの作成"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#シェルスクリプトファイルの作成"}},[t._v("#")]),t._v(" シェルスクリプトファイルの作成")]),t._v(" "),s("p",[t._v("下記のコマンドでシェルスクリプトファイルの作成します．")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# pdf_translate.shの書き込み")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("writefile pdf_translate"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("sh\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("#!/bin/sh")]),t._v("\npython "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("analyze_pdf_text"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("py "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"$1"')]),t._v("\npython "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("translate_csv"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("py "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"$1.csv"')]),t._v("\npython "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("embed_annots"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("py "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"$1.json"')]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"JA_$1"')]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('# rm "$1.csv" "$1.json"')]),t._v("\n")])])]),s("h3",{attrs:{id:"翻訳実行-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#翻訳実行-2"}},[t._v("#")]),t._v(" 翻訳実行")]),t._v(" "),s("p",[t._v("下記のコマンドで翻訳を実行します．")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[t._v("!sh pdf_translate"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("sh AttentionGAN"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("pdf\n")])])]),s("p",[s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/pdf_tansrate01.png",loading:"lazy"}})]),t._v(" "),s("h2",{attrs:{id:"まとめ"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#まとめ"}},[t._v("#")]),t._v(" まとめ")]),t._v(" "),s("p",[t._v("Pythonで英文のPDFをレイアウトを維持したままの翻訳を実装しました．")]),t._v(" "),s("p",[t._v("ただし，あまりに大量に翻訳すると，Googleから怒られて1日中翻訳できなくなるので，別のモデルを使ってより多くの翻訳ができるようにします．")]),t._v(" "),s("p",[t._v("※Adobe Acrobat Readerで閲覧してください。ブラウザ経由だと注釈が文字化けします。")]),t._v(" "),s("h2",{attrs:{id:"参考サイト"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#参考サイト"}},[t._v("#")]),t._v(" 参考サイト")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/mima3/pdf_translate",target:"_blank",rel:"noopener noreferrer"}},[t._v("mima3/pdf_translate"),s("OutboundLink")],1)]),t._v(" "),s("p",[s("a",{attrs:{href:"https://qiita.com/mima_ita/items/3f698050196d4af3a46d",target:"_blank",rel:"noopener noreferrer"}},[t._v("PythonでPDFのレイアウトを維持したまま翻訳してみる"),s("OutboundLink")],1)]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/yta-git/pdf_translate",target:"_blank",rel:"noopener noreferrer"}},[t._v("yta-git/pdf_translate"),s("OutboundLink")],1)]),t._v(" "),s("p",[s("a",{attrs:{href:"https://qiita.com/_yushuu/items/83c51e29771530646659",target:"_blank",rel:"noopener noreferrer"}},[t._v("【python】googletransの『AttributeError: 'NoneType' object has no attribute 'group'』対策"),s("OutboundLink")],1)]),t._v(" "),s("h2",{attrs:{id:"エラー集"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#エラー集"}},[t._v("#")]),t._v(" エラー集")]),t._v(" "),s("h3",{attrs:{id:"エラーコード1"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#エラーコード1"}},[t._v("#")]),t._v(" エラーコード1")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[t._v("File "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"./embed_annots.py"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" line "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("in")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("module"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" fitz\nModuleNotFoundError"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" No module named "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'fitz'")]),t._v("\n")])])]),s("p",[t._v("下記のモジュールをインストールしてください．")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("!pip install fitz\n!pip install PyMuPDF==1.16.14\n")])])]),s("h3",{attrs:{id:"エラーコード2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#エラーコード2"}},[t._v("#")]),t._v(" エラーコード2")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[t._v("AttributeError"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'NoneType'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("object")]),t._v(" has no attribute "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'group'")]),t._v("\n")])])]),s("p",[t._v("一度googletransを消して，googletrans==4.0.0-rc1とversion指定してインストールする．")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("pip uninstall -y googletrans\npip install googletrans==4.0.0-rc1\n")])])]),s("p",[t._v("tensorflow2系に存在しないコードを使おうとしているので，tensorflow1系にダウングレードする必要がある．")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5",rel:"nofollow"}},[s("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"}})]),s("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5",alt:""}})]),t._v(" "),s("p",[s("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",rel:"nofollow"}},[s("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"}})]),s("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",alt:""}})]),t._v(" "),s("p",[s("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",rel:"nofollow"}},[t._v("全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】")]),s("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",alt:""}})]),t._v(" "),s("ClientOnly",[s("CallInArticleAdsense")],1)],1)}),[],!1,null,null,null);a.default=r.exports}}]);