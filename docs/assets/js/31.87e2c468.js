(window.webpackJsonp=window.webpackJsonp||[]).push([[31],{425:function(t,a,s){"use strict";s.r(a);var e=s(2),r=Object(e.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("p",[t._v("pandasでテキストファイルを読み込みを実装します．")]),t._v(" "),s("ClientOnly",[s("CallInArticleAdsense")],1),t._v(" "),s("p"),s("div",{staticClass:"table-of-contents"},[s("ul",[s("li",[s("a",{attrs:{href:"#ファイル構成"}},[t._v("ファイル構成")])]),s("li",[s("a",{attrs:{href:"#データのダウンロード"}},[t._v("データのダウンロード")])]),s("li",[s("a",{attrs:{href:"#pandasでテキストファイルを読み込む"}},[t._v("pandasでテキストファイルを読み込む")])]),s("li",[s("a",{attrs:{href:"#まとめ"}},[t._v("まとめ")])]),s("li",[s("a",{attrs:{href:"#参考サイト"}},[t._v("参考サイト")])])])]),s("p"),t._v(" "),s("h2",{attrs:{id:"ファイル構成"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ファイル構成"}},[t._v("#")]),t._v(" ファイル構成")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("project_dir\n├── ./data/tblT000848C04.txt\n└── pandas_txt.ipynb <- 実行用ノートブック\n")])])]),s("h2",{attrs:{id:"データのダウンロード"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#データのダウンロード"}},[t._v("#")]),t._v(" データのダウンロード")]),t._v(" "),s("p",[t._v("下記のサイトから宮城県　国勢調査(txtファイル)をダウンロードします。")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://www.e-stat.go.jp/gis/statmap-search?page=1&type=1&toukeiCode=00200521&toukeiYear=2015&aggregateUnit=A&serveyId=A002005212015&statsId=T000848",target:"_blank",rel:"noopener noreferrer"}},[t._v("e-stat 宮城県　国勢調査(txt)"),s("OutboundLink")],1)]),t._v(" "),s("h2",{attrs:{id:"pandasでテキストファイルを読み込む"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#pandasでテキストファイルを読み込む"}},[t._v("#")]),t._v(" pandasでテキストファイルを読み込む")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" pandas "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" pd\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# データの読み込み")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# T000848001\tT000848002\tT000848003\tT000848004")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 人口総数\t男\t女\t世帯総数")]),t._v("\ndf_gender "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" pd"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("read_table"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"./data/tblT000848C04.txt"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" encoding"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'SJIS'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" sep"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("','")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\ndf_gender "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" df_gender"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("reset_index"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("drop"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("True")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 最初の数行は削除")]),t._v("\ndf_gender"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("head"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("p",[s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/pandas_txt.png",loading:"lazy"}})]),t._v(" "),s("h2",{attrs:{id:"まとめ"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#まとめ"}},[t._v("#")]),t._v(" まとめ")]),t._v(" "),s("p",[t._v("pandasでdbfを読み込みを実装しました．")]),t._v(" "),s("h2",{attrs:{id:"参考サイト"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#参考サイト"}},[t._v("#")]),t._v(" 参考サイト")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://www.e-stat.go.jp/gis/statmap-search?page=1&type=1&toukeiCode=00200521&toukeiYear=2015&aggregateUnit=A&serveyId=A002005212015&statsId=T000848",target:"_blank",rel:"noopener noreferrer"}},[t._v("e-stat 宮城県　国勢調査(txt)"),s("OutboundLink")],1)]),t._v(" "),s("ClientOnly",[s("CallInArticleAdsense")],1),t._v(" "),s("p",[s("a",{attrs:{href:"//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON",rel:"nofollow",referrerpolicy:"no-referrer-when-downgrade"}},[s("img",{staticStyle:{border:"none"},attrs:{src:"//image.moshimo.com/af-img/0866/000000029835.jpg",width:"728",height:"90"}})]),s("img",{staticStyle:{border:"none"},attrs:{src:"//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835",width:"1",height:"1"}})]),t._v(" "),s("p",[s("a",{attrs:{href:"//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON",rel:"nofollow",referrerpolicy:"no-referrer-when-downgrade"}},[s("img",{staticStyle:{border:"none"},attrs:{src:"//image.moshimo.com/af-img/1115/000000025847.png",width:"728",height:"90"}})]),s("img",{staticStyle:{border:"none"},attrs:{src:"//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847",width:"1",height:"1"}})])],1)}),[],!1,null,null,null);a.default=r.exports}}]);