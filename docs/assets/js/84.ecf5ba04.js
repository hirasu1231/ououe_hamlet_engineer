(window.webpackJsonp=window.webpackJsonp||[]).push([[84],{520:function(t,a,s){"use strict";s.r(a);var e=s(2),r=Object(e.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("p",[t._v("Kepler.glをJupyterNotebook上で扱ってみます.")]),t._v(" "),s("ClientOnly",[s("CallInArticleAdsense")],1),t._v(" "),s("p"),s("div",{staticClass:"table-of-contents"},[s("ul",[s("li",[s("a",{attrs:{href:"#ライブラリのインストール"}},[t._v("ライブラリのインストール")])]),s("li",[s("a",{attrs:{href:"#サンプルデータのダウンロード"}},[t._v("サンプルデータのダウンロード")])]),s("li",[s("a",{attrs:{href:"#コードの実行"}},[t._v("コードの実行")])]),s("li",[s("a",{attrs:{href:"#まとめ"}},[t._v("まとめ")])]),s("li",[s("a",{attrs:{href:"#参考サイト"}},[t._v("参考サイト")])])])]),s("p"),t._v(" "),s("h2",{attrs:{id:"ライブラリのインストール"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ライブラリのインストール"}},[t._v("#")]),t._v(" ライブラリのインストール")]),t._v(" "),s("p",[t._v("下記のコードでライブラリをインストールします．")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[t._v("!pip install keplergl\n!pip install geopandas\n!pip install sodapy\n!jupyter labextension install @jupyter"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("widgets"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("jupyterlab"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("manager keplergl"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("jupyter\n")])])]),s("h2",{attrs:{id:"サンプルデータのダウンロード"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#サンプルデータのダウンロード"}},[t._v("#")]),t._v(" サンプルデータのダウンロード")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://www.geospatial.jp/ckan/dataset/kakogawacity-car-data",target:"_blank",rel:"noopener noreferrer"}},[t._v("加古川市_公用車走行データ"),s("OutboundLink")],1),t._v("より、2017年のcsvデータをダウンロードします。")]),t._v(" "),s("h2",{attrs:{id:"コードの実行"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#コードの実行"}},[t._v("#")]),t._v(" コードの実行")]),t._v(" "),s("p",[t._v("下記のコードでデータを読み込みます．")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" keplergl "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" KeplerGl\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" pandas "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" pd\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" base64\n\ndf "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" pd"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("read_csv"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'../kakogawa_probe_2017/probe_kaisen081_2017.csv.csv'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                 header "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("None")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                 names"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'car_id'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'record_time'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'lat'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'lon'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("p",[t._v("下記のコードでkeplerを表示します．")]),t._v(" "),s("p",[t._v("HTMLが出力されるので，jupyterで読み込みます．")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# データの読み込み")]),t._v("\nmap1 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" KeplerGl"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("height"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("400")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nmap1"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("add_data"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("data"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("df"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" name"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'data1'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# htmlで表記")]),t._v("\norig_html "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("str")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("map1"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_repr_html_"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'utf-8'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nb64d_html "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" base64"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("b64encode"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("orig_html"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("encode"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'utf-8'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("decode"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'utf-8'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nframed_html "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string-interpolation"}},[s("span",{pre:!0,attrs:{class:"token string"}},[t._v("f'<iframe src=\"data:text/html;base64,")]),s("span",{pre:!0,attrs:{class:"token interpolation"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("b64d_html"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")])]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('" style="width:95%; height: 600px">\'')])]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" IPython\nIPython"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("display"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("HTML"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("framed_html"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("p",[s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/kepler.png",loading:"lazy"}})]),t._v(" "),s("h2",{attrs:{id:"まとめ"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#まとめ"}},[t._v("#")]),t._v(" まとめ")]),t._v(" "),s("p",[t._v("Kepler.glをJupyterNotebook上で扱ってみました．")]),t._v(" "),s("h2",{attrs:{id:"参考サイト"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#参考サイト"}},[t._v("#")]),t._v(" 参考サイト")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://lonlat.info/kepler-jupyternotebook/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Kepler.glをJupyterNotebook上で扱ってみた"),s("OutboundLink")],1)]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/keplergl/kepler.gl/blob/master/bindings/kepler.gl-jupyter/README.md",target:"_blank",rel:"noopener noreferrer"}},[t._v("bindings/kepler.gl-jupyter"),s("OutboundLink")],1)]),t._v(" "),s("p",[s("a",{attrs:{href:"https://qiita.com/nailbiter/items/6de340139e07de57de44",target:"_blank",rel:"noopener noreferrer"}},[t._v("Using Kepler.GL in Jupyter"),s("OutboundLink")],1)]),t._v(" "),s("p",[s("a",{attrs:{href:"https://docs.kepler.gl/docs/keplergl-jupyter#add_data",target:"_blank",rel:"noopener noreferrer"}},[t._v("kepler.gl for Jupyter User Guide"),s("OutboundLink")],1)]),t._v(" "),s("p",[s("a",{attrs:{href:"https://www.geospatial.jp/ckan/dataset/kakogawacity-car-data",target:"_blank",rel:"noopener noreferrer"}},[t._v("加古川市_公用車走行データ"),s("OutboundLink")],1)]),t._v(" "),s("ClientOnly",[s("CallInArticleAdsense")],1),t._v(" "),s("p",[s("a",{attrs:{href:"//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON",rel:"nofollow",referrerpolicy:"no-referrer-when-downgrade"}},[s("img",{staticStyle:{border:"none"},attrs:{src:"//image.moshimo.com/af-img/0866/000000029835.jpg",width:"728",height:"90"}})]),s("img",{staticStyle:{border:"none"},attrs:{src:"//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835",width:"1",height:"1"}})]),t._v(" "),s("p",[s("a",{attrs:{href:"//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON",rel:"nofollow",referrerpolicy:"no-referrer-when-downgrade"}},[s("img",{staticStyle:{border:"none"},attrs:{src:"//image.moshimo.com/af-img/1115/000000025847.png",width:"728",height:"90"}})]),s("img",{staticStyle:{border:"none"},attrs:{src:"//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847",width:"1",height:"1"}})])],1)}),[],!1,null,null,null);a.default=r.exports}}]);