(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{374:function(n,e,t){"use strict";t.r(e);var a=t(2),s=Object(a.a)({},(function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("ContentSlotsDistributor",{attrs:{"slot-key":n.$parent.slotKey}},[t("p",[n._v("WordpressやHTMLでブログを作成するんが面倒になったので，Vuepressでの作成に移行しました．\n")]),n._v(" "),t("h2",{attrs:{id:"yarnのインストール"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#yarnのインストール"}},[n._v("#")]),n._v(" yarnのインストール")]),n._v(" "),t("p",[n._v("Vuepressのテーマのインストール，Vuepressの実行等ではnmpか，yarnのどちらかを使用しているサイトが多い．私は最初はnmpを使用していましたが，実行段階でテーマが反映されなかったので，yarnの方に切り替えてます．")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("# npm 経由でyarnをインストール\nnpm install -g yarn\n# yarnのバージョンを確認\nyarn -v\n# yarnの初期設定\nyarn init\n# yarnでjqueryをインストール\nyarn add --save jquery\n")])])]),t("h2",{attrs:{id:"vuepressとテーマのインストール"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#vuepressとテーマのインストール"}},[n._v("#")]),n._v(" Vuepressとテーマのインストール")]),n._v(" "),t("p",[n._v("以下のコマンドでVuepressのテーマをインストールします．")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("yarn add vuepress-theme-meteorlxy\n")])])]),t("h2",{attrs:{id:"ファイル構成"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ファイル構成"}},[n._v("#")]),n._v(" ファイル構成")]),n._v(" "),t("p",[n._v("ファイル構成は以下通りです．")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("hamlet_engineer\n├── src\n│   ├── _posts\n│   │   └── 20190803.md\n│   │   └── 20210118.md\n│   └── .vuepress\n│       ├── public\n│       │    ├── img\n│       │          └── hirasu.jpg ← 好きな画像で\n│       │    \n│       └── config.js\n├── package.json ← 自動生成\n└── yarn.lock ← 自動生成\n")])])]),t("p",[n._v("以下のコマンドで上記のファイル構成を再現する．")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("# デイレクトリの生成\nmkdir -p hamlet_engineer/src/_posts\nmkdir -p hamlet_engineer/src/.vuepress/public/img\n\n# ファイルの生成\ntouch hamlet_engineer/src/_posts/20190803.md\ntouch hamlet_engineer/src/_posts/20210118.md\ntouch hamlet_engineer/src/.vuepress/config.js\ntouch hamlet_engineer/package.json\n")])])]),t("h2",{attrs:{id:"config-js"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#config-js"}},[n._v("#")]),n._v(" config.js")]),n._v(" "),t("p",[n._v("config.jsの中身は以下の通りです．")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("// .vuepress/config.js\n\nmodule.exports = {\n    // GitHub Pagesにホスティング\n    base: '/hamlet_engineer/',\n    dest: 'docs',\n    // サイトのタイトル\n    title: 'ハムレット型エンジニアのカンニングノート',\n\n    // サイトの説明\n    description: 'ハムレット型：決断を下して行動に移るよりは、 むしろ懐疑や苦悩にこもってしまう思索的な性格．そんな元エンジニアの雑記帳です．個人的な趣味全開の実用性皆無なプログラミングを綴っています．',\n\n    // 言語設定\n    locales: {\n        '/': {\n            lang: 'ja-jp',\n        },\n    },\n\n    // テーマを指定\n    theme: 'meteorlxy',\n\n    // Theme config\n    themeConfig: {\n        // ボタンなどを日本語に変更\n        lang: {\n            home: 'ホーム',\n            posts: '記事検索',\n            category: 'カテゴリー',\n            categories: 'カテゴリー',\n            allCategories: '全て',\n            tag: 'タグ',\n            tags: 'タグ',\n            search: '検索',\n            createdAt: '作成日',\n            updatedAt: '更新日',\n            prevPost: '前の記事へ',\n            nextPost: '次の記事へ',\n            toc: '目次',\n        },\n\n        // ブログ作成者の情報\n        // Personal infomation (delete the fields if you don't have / don't want to display)\n        personalInfo: {\n            // ニックネーム\n            nickname: 'hirasu1231',\n\n            // 自己紹介(HYML対応)\n            description: '自己紹介',\n\n            // 拠点地\n            location: 'Fukuoka, Japan',\n\n            // アバターの画像\n            // Set to external link\n            avatar: '/img/hirasu.jpg',\n            // `.vuepress/public/img/avatar.jpg`に置く\n            // avatar: '/img/avatar.jpg'と記載する\n\n            // SNS　アカウント情報\n            sns: {\n\n                // Twitterのアカウントとリンク\n                twitter: {\n                    account: 'hirasu1231',\n                    link: 'https://twitter.com/hirasu1231',\n                },\n\n                // Githubのアカウントとリンク\n                github: {\n                    account: 'hirasu1231',\n                    link: 'https://github.com/hirasu1231',\n\n                // Facebookのアカウントとリンク\n                // facebook: {\n                //     account: 'meteorlxy.cn',\n                //     link: 'https://www.facebook.com/meteorlxy.cn',\n                // },\n\n                // Instagramのアカウントとリンク\n                // instagram: {\n                //     account: 'meteorlxy.cn',\n                //     link: 'https://www.instagram.com/meteorlxy.cn',\n                // },\n\n                // Docker Hub account and link\n                // docker: {\n                //     account: 'meteorlxy',\n                //     link: 'https://hub.docker.com/u/meteorlxy',\n                //     },\n\n                },\n            },\n        },\n\n        // Header Config (Optional)\n        header: {\n            // ヘッダーの背景画像\n            background: {\n                // urlを指定すると画像が、指定しないとランダムパターンが表示される\n                //url: '/assets/img/bg.jpg',\n\n                // ランダムパターンを使用するか？\n                useGeo: true,\n            },\n\n            // 記事のタイトルをヘッダーに表示するか？\n            showTitle: true,\n        },\n\n        // Footer Config (Optional)\n        footer: {\n            // Show 'Powered by VuePress' or not (enable it to support VuePress)\n            poweredBy: true,\n\n            // Show the theme that you are using (enable it to support this theme) (please do not disable it, haha)\n            poweredByTheme: true,\n\n            // フッター表示 HTML 可\n            custom: 'Copyright 2021 hirasu1231',\n        },\n\n        // Info Card Config (Optional)\n        infoCard: {\n            // ヘッダーの背景画像\n            headerBackground: {\n                // urlを指定すると画像が、指定しないとランダムパターンが表示される\n                //url: '/assets/img/bg.jpg',\n\n                // ランダムパターンを使用するか？\n                useGeo: true,\n            },\n        },\n\n        // Show the last updated time of your posts\n        lastUpdated: true,\n\n        // ナビバーに表示する項目\n        nav: [\n            { text: 'ホーム', link: '/', exact: true },\n            { text: '記事検索', link: '/posts/', exact: false },\n        ],\n\n        // Enable smooth scrolling or not\n        smoothScroll: true,\n\n        // ズームプラグイン vuepress-plugin-zooming を使うかどうかの設定\n        zooming: {\n            // @see https://vuepress.github.io/en/plugins/zooming\n        },\n\n        // 何ページづつ表示するか\n        pagination: {\n            perPage: 5,\n        },\n\n        // Default Pages (Optional, the default value of all pages is `true`)\n        defaultPages: {\n            // Allow theme to add Home page (url: /)\n            home: true,\n            // Allow theme to add Posts page (url: /posts/)\n            posts: true,\n        },\n    },\n}\n")])])]),t("h2",{attrs:{id:"実行"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#実行"}},[n._v("#")]),n._v(" 実行")]),n._v(" "),t("p",[n._v("ファイル作成ができたら以下のコマンドで実行し， http://localhost:8080/hamlet_engineer/ をブラウザに表示します．")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("# デイレクトリの移動\ncd hamlet_engineer\n# ファイルの生成\nyarn dev\n")])])]),t("h2",{attrs:{id:"参考サイト"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#参考サイト"}},[n._v("#")]),n._v(" 参考サイト")]),n._v(" "),t("ul",[t("li",[t("a",{attrs:{href:"https://github.com/meteorlxy/vuepress-theme-meteorlxy",target:"_blank",rel:"noopener noreferrer"}},[n._v("meteorlxy のGitHub"),t("OutboundLink")],1)]),n._v(" "),t("li",[t("a",{attrs:{href:"https://blog.raispg.com/posts/2020/09/29/vuepress-thema.html",target:"_blank",rel:"noopener noreferrer"}},[n._v("VuePress のブログに meteorlxy テーマを設定する"),t("OutboundLink")],1)]),n._v(" "),t("li",[t("a",{attrs:{href:"https://qiita.com/tomopict/items/9da7cf28c9bcd5f933cb",target:"_blank",rel:"noopener noreferrer"}},[n._v("VuePressで作ったblogに配布されているテーマを設定する"),t("OutboundLink")],1)]),n._v(" "),t("li",[t("a",{attrs:{href:"https://qiita.com/suisui654/items/1b89446e03991c7c2c3d",target:"_blank",rel:"noopener noreferrer"}},[n._v("yarnをインストールする"),t("OutboundLink")],1)])])])}),[],!1,null,null,null);e.default=s.exports}}]);