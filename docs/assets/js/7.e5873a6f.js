(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{362:function(t,a,s){"use strict";s.r(a);var n=s(2),r=Object(n.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("p",[t._v("Python, OpenCVで指定した色の抽出と別の色への置換を実装します．"),s("br"),t._v("\n本稿では，Cityscapesデータセットのカラーマスキング画像の内，人だけを抽出し，白色に置換します．\n")]),t._v(" "),s("h3",{attrs:{id:"特定の色を抽出する"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#特定の色を抽出する"}},[t._v("#")]),t._v(" 特定の色を抽出する")]),t._v(" "),s("p",[t._v("ここでは特定の色を抽出して，人のマスキングのみを残した画像を作成します．"),s("br"),t._v("\n人のマスキングのRGBは，"),s("a",{attrs:{href:"https://github.com/mcordts/cityscapesScripts/blob/master/cityscapesscripts/helpers/labels.py",target:"_blank",rel:"noopener noreferrer"}},[t._v("cityscapesScripts/cityscapesscripts/helpers/labels.py"),s("OutboundLink")],1),t._v("よりRGB=(220, 20, 60)となります．"),s("br"),t._v("\n以下のコードではBGRをベースに抽出しています．"),s("br")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" cv2\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" numpy "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" np\n\nimage "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" cv2"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("imread"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'color_mask_image.png'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# ファイル読み込み")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# bgrでの色抽出")]),t._v("\nbgrLower "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" np"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("array"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("60")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("20")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("220")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 抽出する色の下限(bgr)")]),t._v("\nbgrUpper "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" np"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("array"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("60")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("20")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("220")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 抽出する色の上限(bgr)")]),t._v("\nimg_mask "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" cv2"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("inRange"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("image"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" bgrLower"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" bgrUpper"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# bgrからマスクを作成")]),t._v("\nextract "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" cv2"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("bitwise_and"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("image"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" image"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" mask"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("img_mask"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 元画像とマスクを合成")]),t._v("\ncv2"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("imwrite"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'extract.png'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("extract"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("p",[t._v("color_mask_image.png"),s("br"),t._v(" "),s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/color_mask_image.png",loading:"lazy"}}),s("br")]),t._v(" "),s("p",[t._v("extract.png"),s("br"),t._v(" "),s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/extract.png",loading:"lazy"}})]),t._v(" "),s("h3",{attrs:{id:"特定の色を別の色に置換する"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#特定の色を別の色に置換する"}},[t._v("#")]),t._v(" 特定の色を別の色に置換する")]),t._v(" "),s("p",[t._v("抽出した人のマスキングを特定の色，ここではBGR=(255, 255, 255)に置換します．"),s("br"),t._v("\n以下のコードで実行します．"),s("br")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" cv2\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" numpy "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" np\n\nresult "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" cv2"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("imread"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'result.png'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 特定の色を別の色に置換する")]),t._v("\nbefore_color "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("60")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("20")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("220")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\nafter_color "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("255")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("255")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("255")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\nresult"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("np"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("where"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("result "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v(" before_color"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("all")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("axis"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" after_color\ncv2"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("imwrite"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'replace.png'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("result"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("p",[t._v("extract.png"),s("br"),t._v(" "),s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/extract.png",loading:"lazy"}}),s("br")]),t._v(" "),s("p",[t._v("replace.png"),s("br"),t._v(" "),s("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/replace.png",loading:"lazy"}})]),t._v(" "),s("h2",{attrs:{id:"参考サイト"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#参考サイト"}},[t._v("#")]),t._v(" 参考サイト")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://rikoubou.hatenablog.com/entry/2019/02/21/190310",target:"_blank",rel:"noopener noreferrer"}},[t._v("【python/OpenCV】画像の特定の色を抽出する方法"),s("OutboundLink")],1),s("br"),t._v(" "),s("a",{attrs:{href:"https://qiita.com/pashango2/items/d6dda5f07109ee5b6163",target:"_blank",rel:"noopener noreferrer"}},[t._v("PIL/Pillowで画像の色を高速に置換する"),s("OutboundLink")],1),s("br"),t._v(" "),s("a",{attrs:{href:"http://ni4muraano.hatenablog.com/entry/2017/05/15/000000",target:"_blank",rel:"noopener noreferrer"}},[t._v("【OpenCV】 forループを使わずに指定した色を別の色に変更する"),s("OutboundLink")],1)])])}),[],!1,null,null,null);a.default=r.exports}}]);