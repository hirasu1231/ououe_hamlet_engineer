(window.webpackJsonp=window.webpackJsonp||[]).push([[132],{439:function(t,e,a){"use strict";a.r(e);var s=a(2),r=Object(s.a)({},(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("p",[t._v("Python＋Docker＋Selenium＋Chromeで甘茶の音楽工房ウェブスクレイピングします．本稿では，一通りの設定を実施します．"),a("br")]),t._v(" "),a("ClientOnly",[a("CallInArticleAdsense")],1),t._v(" "),a("p",[t._v("ただし，jupyter or pythonはローカルです．"),a("br"),t._v("\n作業用BGMとして"),a("a",{attrs:{href:"https://amachamusic.chagasi.com/image_kurai.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("甘茶の音楽工房"),a("OutboundLink")],1),t._v("の音楽をダウンロードして聞いていました．いい加減面倒臭くなってきたので，ウェブスクレイピングでダウンロードしていきます．")]),t._v(" "),a("p"),a("div",{staticClass:"table-of-contents"},[a("ul",[a("li",[a("a",{attrs:{href:"#selenium"}},[t._v("Selenium")])]),a("li",[a("a",{attrs:{href:"#seleniumとは"}},[t._v("Seleniumとは")])]),a("li",[a("a",{attrs:{href:"#docker-selenium-chrome"}},[t._v("Docker＋Selenium＋Chrome")]),a("ul",[a("li",[a("a",{attrs:{href:"#docker-selenium-chromeの起動確認"}},[t._v("Docker＋Selenium＋Chromeの起動確認")])])])]),a("li",[a("a",{attrs:{href:"#まとめ"}},[t._v("まとめ")])]),a("li",[a("a",{attrs:{href:"#参考サイト"}},[t._v("参考サイト")])])])]),a("p"),t._v(" "),a("p",[a("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5",rel:"nofollow"}},[a("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"}})]),a("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5",alt:""}})]),t._v(" "),a("p",[a("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",rel:"nofollow"}},[a("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"}})]),a("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",alt:""}})]),t._v(" "),a("p",[a("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",rel:"nofollow"}},[t._v("全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】")]),a("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",alt:""}})]),t._v(" "),a("h2",{attrs:{id:"selenium"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#selenium"}},[t._v("#")]),t._v(" Selenium")]),t._v(" "),a("p",[t._v("本稿では，seleniumでウェブスクレイピングを実施します．以前はrequestsとBeautifulSoupでスクレイピングしていましたが，jsで情報を挿入しているサイトではスクレイピングできないことがありましたので，seleniumを使います．"),a("br"),t._v("\nちなみに，スクレイピングできなかったサイトは，Fanzaです!!!"),a("br"),t._v("\nDVDのサンプル画像をスクレイピングしようとしていましたwww")]),t._v(" "),a("h2",{attrs:{id:"seleniumとは"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#seleniumとは"}},[t._v("#")]),t._v(" Seleniumとは")]),t._v(" "),a("blockquote",[a("p",[t._v("Selenium は Web ブラウザの操作を自動化するためのフレームワークです。\n2004 年に ThoughtWorks 社によって Web アプリケーションの UI テストを自動化する目的で開発されました。\nhttps://selenium.dev/history/\n元々は Web アプsリケーションの UI テストや JavaScript のテストの目的で開発されましたが、テスト以外にもタスクの自動化や Web サイトのクローリングなど様々な用途で利用されています。")])]),t._v(" "),a("h2",{attrs:{id:"docker-selenium-chrome"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#docker-selenium-chrome"}},[t._v("#")]),t._v(" Docker＋Selenium＋Chrome")]),t._v(" "),a("p",[t._v("本稿では，Docker上でSeleniumを使います．dockerで使う理由として，chrome driverのversion管理が面倒臭いからです．"),a("br"),t._v("\n有志の方がわかりやすくしてくれているので，がっつりあやかります．")]),t._v(" "),a("div",{staticClass:"language-init extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("docker run -d -p 4444:4444 -v /dev/shm:/dev/shm selenium/standalone-chrome:4.0.0-beta-1-prerelease-20201208\n")])])]),a("h3",{attrs:{id:"docker-selenium-chromeの起動確認"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#docker-selenium-chromeの起動確認"}},[t._v("#")]),t._v(" Docker＋Selenium＋Chromeの起動確認")]),t._v(" "),a("p",[t._v("Docker＋Selenium＋Chromeの起動を確認します．また，ローカル上のChromeを使う際のコードも記載しておきます．")]),t._v(" "),a("div",{staticClass:"language-python extra-class"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# dockerのselenium")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" selenium "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" webdriver\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Chrome のオプションを設定する")]),t._v("\noptions "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" webdriver"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("ChromeOptions"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Selenium Server に接続する")]),t._v("\ndriver "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" webdriver"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Remote"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n    command_executor"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'http://localhost:4444/wd/hub'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    options"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("options"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Selenium 経由でブラウザを操作する")]),t._v("\nurl "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'https://amachamusic.chagasi.com/image_ayashii.html'")]),t._v("\ndriver"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("get"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("url"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("driver"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("current_url"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 出力:https://amachamusic.chagasi.com/image_ayashii.html")]),t._v("\n")])])]),a("div",{staticClass:"language-python extra-class"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# ローカル上のchromeを使う場合．")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# coding: UTF-8")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" requests\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" selenium "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" webdriver\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" selenium"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("webdriver"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("chrome"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("options "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" Options\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" selene"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("driver "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" SeleneDriver\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" webdriver_manager"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("utils "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" chrome_version\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" webdriver_manager"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("chrome "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" ChromeDriverManager\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# versionに応じたchrome driver のインストール")]),t._v("\nversion "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" chrome_version"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nurl "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'http://chromedriver.storage.googleapis.com/LATEST_RELEASE_'")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" version\nresponse "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" requests"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("get"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("url"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\noptions "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" Options"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\noptions"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("add_argument"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'--headless'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# インストールしたchrome driverでchromeを起動")]),t._v("\ndriver "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" SeleneDriver"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("wrap"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("webdriver"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Chrome"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n    executable_path"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("ChromeDriverManager"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("install"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" \n    chrome_options"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("options"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Selenium 経由でブラウザを操作する")]),t._v("\nurl "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'https://amachamusic.chagasi.com/image_ayashii.html'")]),t._v("\ndriver"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("get"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("url"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("print")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("driver"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("current_url"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 出力:https://amachamusic.chagasi.com/image_ayashii.html")]),t._v("\n")])])]),a("h2",{attrs:{id:"まとめ"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#まとめ"}},[t._v("#")]),t._v(" まとめ")]),t._v(" "),a("p",[t._v("ここまででDocker＋Selenium＋Chromeの起動を実施しました．おおよその次の記事でSeleniumの操作を検索しながら，必要な工程を実装します．"),a("br"),t._v("\n時間があれば，docker composeまでやってDocker上のjupyterでやりたいです．")]),t._v(" "),a("h2",{attrs:{id:"参考サイト"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#参考サイト"}},[t._v("#")]),t._v(" 参考サイト")]),t._v(" "),a("p",[a("a",{attrs:{href:"https://qiita.com/Chanmoro/items/9a3c86bb465c1cce738a",target:"_blank",rel:"noopener noreferrer"}},[t._v("10分で理解する Selenium"),a("OutboundLink")],1),a("br"),t._v(" "),a("a",{attrs:{href:"https://qiita.com/sikkim/items/447b72e6ec45849058cd",target:"_blank",rel:"noopener noreferrer"}},[t._v("Docker上でSeleniumとHeadless ChromeとPython3を動かす"),a("OutboundLink")],1),a("br"),t._v(" "),a("a",{attrs:{href:"https://qiita.com/kei0919/items/f6f696169c92c936374c",target:"_blank",rel:"noopener noreferrer"}},[t._v("Dockerコンテナからseleniumを使ってスクレイピング"),a("OutboundLink")],1),a("br"),t._v(" "),a("a",{attrs:{href:"https://qiita.com/maroKanatani/items/e52984f37cc5474ccd98",target:"_blank",rel:"noopener noreferrer"}},[t._v("Python×SeleniumでWebスクレイピング実践"),a("OutboundLink")],1),a("br")]),t._v(" "),a("p",[a("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5",rel:"nofollow"}},[a("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"}})]),a("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5",alt:""}})]),t._v(" "),a("p",[a("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",rel:"nofollow"}},[a("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"}})]),a("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",alt:""}})]),t._v(" "),a("p",[a("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",rel:"nofollow"}},[t._v("全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】")]),a("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",alt:""}})]),t._v(" "),a("ClientOnly",[a("CallInArticleAdsense")],1)],1)}),[],!1,null,null,null);e.default=r.exports}}]);