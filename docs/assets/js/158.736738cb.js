(window.webpackJsonp=window.webpackJsonp||[]).push([[158],{423:function(t,s,a){"use strict";a.r(s);var e=a(2),r=Object(e.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("p",[t._v("Vuepressで吹き出しを実装します．主にcssの設定をVuepressでどうのように実装するかの流れになります．")]),t._v(" "),a("ClientOnly",[a("CallInArticleAdsense")],1),t._v(" "),a("p"),a("div",{staticClass:"table-of-contents"},[a("ul",[a("li",[a("a",{attrs:{href:"#ファイル構成"}},[t._v("ファイル構成")])]),a("li",[a("a",{attrs:{href:"#概要"}},[t._v("概要")])]),a("li",[a("a",{attrs:{href:"#vuepressでの吹き出し"}},[t._v("Vuepressでの吹き出し")]),a("ul",[a("li",[a("a",{attrs:{href:"#プラグインのインストール"}},[t._v("プラグインのインストール")])]),a("li",[a("a",{attrs:{href:"#vuepress-plugin-containerの設定"}},[t._v("vuepress-plugin-containerの設定")])]),a("li",[a("a",{attrs:{href:"#吹き出しのデザイン"}},[t._v("吹き出しのデザイン")])])])]),a("li",[a("a",{attrs:{href:"#まとめ"}},[t._v("まとめ")])]),a("li",[a("a",{attrs:{href:"#参考サイト"}},[t._v("参考サイト")])])])]),a("p"),t._v(" "),a("p",[a("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5",rel:"nofollow"}},[a("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"}})]),a("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5",alt:""}})]),t._v(" "),a("p",[a("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",rel:"nofollow"}},[a("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"}})]),a("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",alt:""}})]),t._v(" "),a("p",[a("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",rel:"nofollow"}},[t._v("全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】")]),a("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",alt:""}})]),t._v(" "),a("h2",{attrs:{id:"ファイル構成"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#ファイル構成"}},[t._v("#")]),t._v(" ファイル構成")]),t._v(" "),a("p",[t._v("ファイル構成は以下通りです．")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("hamlet_engineer\n└── src\n    ├── public\n    │   └── hirasu1231.jpg\n    └── .vuepress\n        ├── (省略)\n        ├── styles\n        │    └── index.styl\n        └── config.js\n")])])]),a("h2",{attrs:{id:"概要"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#概要"}},[t._v("#")]),t._v(" 概要")]),t._v(" "),a("p",[t._v("Custom Containerという，文字に対する装飾ではなく，ブロックに対してデザインを付与する仕組みを利用します．")]),t._v(" "),a("p",[t._v("公式の説明ページは"),a("a",{attrs:{href:"https://v1.vuepress.vuejs.org/guide/markdown.html#custom-containers",target:"_blank",rel:"noopener noreferrer"}},[t._v("こちら"),a("OutboundLink")],1),t._v("です．")]),t._v(" "),a("p",[t._v("これを利用してMarkdownに以下のコードを記述すると、吹き出しも出すことができるようになります．")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("::: bubble9\nこのような吹き出しを追加します．\n:::\n")])])]),a("div",{staticClass:"bubble9"},[a("div",{staticClass:"imgs"},[a("img",{attrs:{src:"/hirasu1231.jpg",alt:""}})]),a("div",{staticClass:"chat"},[a("div",{staticClass:"ss"},[a("p",[t._v("このような吹き出しを追加します．")])])])]),a("h2",{attrs:{id:"vuepressでの吹き出し"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#vuepressでの吹き出し"}},[t._v("#")]),t._v(" Vuepressでの吹き出し")]),t._v(" "),a("h3",{attrs:{id:"プラグインのインストール"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#プラグインのインストール"}},[t._v("#")]),t._v(" プラグインのインストール")]),t._v(" "),a("p",[t._v("Custom Containerはvuepress-plugin-containerというプラグインで導入されています")]),t._v(" "),a("p",[t._v("以下のコマンドで"),a("a",{attrs:{href:"https://github.com/vuepress/vuepress-plugin-container",target:"_blank",rel:"noopener noreferrer"}},[t._v("vuepress-plugin-container"),a("OutboundLink")],1),t._v("というプラグインをインストールします．")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("yarn add vuepress-plugin-container\n")])])]),a("h3",{attrs:{id:"vuepress-plugin-containerの設定"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#vuepress-plugin-containerの設定"}},[t._v("#")]),t._v(" vuepress-plugin-containerの設定")]),t._v(" "),a("p",[t._v(".vuepress/config.jsに以下のコードを追記します．")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[t._v("module"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    plugins"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 吹き出し")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'vuepress-plugin-container'")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        type"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'bubble9'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        defaultTitle"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("''")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("before")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("info")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token template-string"}},[a("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('<div class="bubble9"><div class="imgs"><img src="/hirasu1231.jpg" alt=""></div><div class="chat"><div class="ss">')]),a("span",{pre:!0,attrs:{class:"token interpolation"}},[a("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("${")]),t._v("info"),a("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("}")])]),a("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        after"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'</div></div></div>'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("h3",{attrs:{id:"吹き出しのデザイン"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#吹き出しのデザイン"}},[t._v("#")]),t._v(" 吹き出しのデザイン")]),t._v(" "),a("p",[t._v(".vuepress/styles/index.stylに以下のコードを追記して，吹き出しのデザインを調整します．")]),t._v(" "),a("p",[t._v("ベースはcssですが，tab区切りとスペース区切りになっています．")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v('/* 吹き出し*/\n/*以下、②左側のコメント*/\n.bubble9 \n  width 100%\n  margin 1.5em 0\n  overflow hidden\n\n.bubble9\n  .imgs \n    float left\n    margin-right -90px\n    width 75px\n\n.bubble9 \n  .imgs img\n    position relative\n    top 10px\n    width 95%\n    height auto\n    border solid 3px #1976D2\n    border-radius 50%\n\n.bubble9\n  .chat \n    width 95%\n\n.ss \n  margin 16px\n  position relative\n  padding 10px\n  border-radius 10px\n  color #000000\n  background-color #BBDEFB\n  margin-left 90px\n\n.ss\n  :after \n    content ""\n    display inline-block\n    position absolute\n    top 20px \n    left -24px\n    border 12px solid transparent\n    border-right 12px solid #BBDEFB\n\n.ss p \n  margin 16\n  padding 10\n')])])]),a("h2",{attrs:{id:"まとめ"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#まとめ"}},[t._v("#")]),t._v(" まとめ")]),t._v(" "),a("div",{staticClass:"bubble9"},[a("div",{staticClass:"imgs"},[a("img",{attrs:{src:"/hirasu1231.jpg",alt:""}})]),a("div",{staticClass:"chat"},[a("div",{staticClass:"ss"},[a("p",[t._v("Vuepressで吹き出しを実装しました．吹き出し以外にも追加できそうです．")])])])]),a("h2",{attrs:{id:"参考サイト"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#参考サイト"}},[t._v("#")]),t._v(" 参考サイト")]),t._v(" "),a("p",[a("a",{attrs:{href:"https://web-and-investment.info/posts/2020/07/12/vuepress-custom-container.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("VuePressで独自のCustom Containerの追加方法（吹き出し）"),a("OutboundLink")],1),a("br"),t._v(" "),a("a",{attrs:{href:"https://lpeg.info/html/css_bubble.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("CSSのみで吹き出しを作る方法【デザインサンプル10種】"),a("OutboundLink")],1),a("br"),t._v(" "),a("a",{attrs:{href:"https://v1.vuepress.vuejs.org/guide/markdown.html#custom-containers",target:"_blank",rel:"noopener noreferrer"}},[t._v("Vuepress Custom Containers"),a("OutboundLink")],1)]),t._v(" "),a("p",[a("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5",rel:"nofollow"}},[a("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"}})]),a("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5",alt:""}})]),t._v(" "),a("p",[a("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",rel:"nofollow"}},[a("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"}})]),a("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",alt:""}})]),t._v(" "),a("p",[a("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",rel:"nofollow"}},[t._v("全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】")]),a("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",alt:""}})]),t._v(" "),a("ClientOnly",[a("CallInArticleAdsense")],1)],1)}),[],!1,null,null,null);s.default=r.exports}}]);