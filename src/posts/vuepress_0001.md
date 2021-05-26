---
display: home
title: 'Vuepressで当ブログを作る'
description: WordpressやHTMLでブログを作成するんが面倒になったので，Vuepressでの作成に移行しました．
date: 2021-02-01
image: https://www.hamlet-engineer.com/image/vuepress.png
categories: 
  - Vuepress
tags:
  - Vuepress
---
WordpressやHTMLでブログを作成するんが面倒になったので，Vuepressでの作成に移行しました．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

## yarnのインストール
Vuepressのテーマのインストール，Vuepressの実行等ではnmpか，yarnのどちらかを使用しているサイトが多い．私は最初はnmpを使用していましたが，実行段階でテーマが反映されなかったので，yarnの方に切り替えてます．
```
# npm 経由でyarnをインストール
npm install -g yarn
# yarnのバージョンを確認
yarn -v
# yarnの初期設定
yarn init
# yarnでjqueryをインストール
yarn add --save jquery
```

## Vuepressとテーマのインストール
以下のコマンドでVuepressのテーマをインストールします．
```
yarn add vuepress-theme-meteorlxy
```

## ファイル構成
ファイル構成は以下通りです．
```
hamlet_engineer
├── src
│   ├── _posts
│   │   └── 20190803.md
│   │   └── 20210118.md
│   └── .vuepress
│       ├── public
│       │    ├── img
│       │          └── hirasu.jpg ← 好きな画像で
│       │    
│       └── config.js
├── package.json ← 自動生成
└── yarn.lock ← 自動生成
```
以下のコマンドで上記のファイル構成を再現する．
```
# デイレクトリの生成
mkdir -p hamlet_engineer/src/_posts
mkdir -p hamlet_engineer/src/.vuepress/public/img

# ファイルの生成
touch hamlet_engineer/src/_posts/20190803.md
touch hamlet_engineer/src/_posts/20210118.md
touch hamlet_engineer/src/.vuepress/config.js
touch hamlet_engineer/package.json
```

## config.js
config.jsの中身は以下の通りです．
```
// .vuepress/config.js

module.exports = {
    // GitHub Pagesにホスティング
    base: '/hamlet_engineer/',
    dest: 'docs',
    // サイトのタイトル
    title: 'ハムレット型エンジニアのカンニングノート',

    // サイトの説明
    description: 'ハムレット型：決断を下して行動に移るよりは、 むしろ懐疑や苦悩にこもってしまう思索的な性格．そんな元エンジニアの雑記帳です．個人的な趣味全開の実用性皆無なプログラミングを綴っています．',

    // 言語設定
    locales: {
        '/': {
            lang: 'ja-jp',
        },
    },

    // テーマを指定
    theme: 'meteorlxy',

    // Theme config
    themeConfig: {
        // ボタンなどを日本語に変更
        lang: {
            home: 'ホーム',
            posts: '記事検索',
            category: 'カテゴリー',
            categories: 'カテゴリー',
            allCategories: '全て',
            tag: 'タグ',
            tags: 'タグ',
            search: '検索',
            createdAt: '作成日',
            updatedAt: '更新日',
            prevPost: '前の記事へ',
            nextPost: '次の記事へ',
            toc: '目次',
        },

        // ブログ作成者の情報
        // Personal infomation (delete the fields if you don't have / don't want to display)
        personalInfo: {
            // ニックネーム
            nickname: 'hirasu1231',

            // 自己紹介(HYML対応)
            description: '自己紹介',

            // 拠点地
            location: 'Fukuoka, Japan',

            // アバターの画像
            // Set to external link
            avatar: '/img/hirasu.jpg',
            // `.vuepress/public/img/avatar.jpg`に置く
            // avatar: '/img/avatar.jpg'と記載する

            // SNS　アカウント情報
            sns: {

                // Twitterのアカウントとリンク
                twitter: {
                    account: 'hirasu1231',
                    link: 'https://twitter.com/hirasu1231',
                },

                // Githubのアカウントとリンク
                github: {
                    account: 'hirasu1231',
                    link: 'https://github.com/hirasu1231',

                // Facebookのアカウントとリンク
                // facebook: {
                //     account: 'meteorlxy.cn',
                //     link: 'https://www.facebook.com/meteorlxy.cn',
                // },

                // Instagramのアカウントとリンク
                // instagram: {
                //     account: 'meteorlxy.cn',
                //     link: 'https://www.instagram.com/meteorlxy.cn',
                // },

                // Docker Hub account and link
                // docker: {
                //     account: 'meteorlxy',
                //     link: 'https://hub.docker.com/u/meteorlxy',
                //     },

                },
            },
        },

        // Header Config (Optional)
        header: {
            // ヘッダーの背景画像
            background: {
                // urlを指定すると画像が、指定しないとランダムパターンが表示される
                //url: '/assets/img/bg.jpg',

                // ランダムパターンを使用するか？
                useGeo: true,
            },

            // 記事のタイトルをヘッダーに表示するか？
            showTitle: true,
        },

        // Footer Config (Optional)
        footer: {
            // Show 'Powered by VuePress' or not (enable it to support VuePress)
            poweredBy: true,

            // Show the theme that you are using (enable it to support this theme) (please do not disable it, haha)
            poweredByTheme: true,

            // フッター表示 HTML 可
            custom: 'Copyright 2021 hirasu1231',
        },

        // Info Card Config (Optional)
        infoCard: {
            // ヘッダーの背景画像
            headerBackground: {
                // urlを指定すると画像が、指定しないとランダムパターンが表示される
                //url: '/assets/img/bg.jpg',

                // ランダムパターンを使用するか？
                useGeo: true,
            },
        },

        // Show the last updated time of your posts
        lastUpdated: true,

        // ナビバーに表示する項目
        nav: [
            { text: 'ホーム', link: '/', exact: true },
            { text: '記事検索', link: '/posts/', exact: false },
        ],

        // Enable smooth scrolling or not
        smoothScroll: true,

        // ズームプラグイン vuepress-plugin-zooming を使うかどうかの設定
        zooming: {
            // @see https://vuepress.github.io/en/plugins/zooming
        },

        // 何ページづつ表示するか
        pagination: {
            perPage: 5,
        },

        // Default Pages (Optional, the default value of all pages is `true`)
        defaultPages: {
            // Allow theme to add Home page (url: /)
            home: true,
            // Allow theme to add Posts page (url: /posts/)
            posts: true,
        },
    },
}
```

## 実行
ファイル作成ができたら以下のコマンドで実行し， http://localhost:8080/hamlet_engineer/ をブラウザに表示します．
```
# デイレクトリの移動
cd hamlet_engineer
# ファイルの生成
yarn dev
```

## 参考サイト
- [meteorlxy のGitHub](https://github.com/meteorlxy/vuepress-theme-meteorlxy)
- [VuePress のブログに meteorlxy テーマを設定する](https://blog.raispg.com/posts/2020/09/29/vuepress-thema.html)
- [VuePressで作ったblogに配布されているテーマを設定する](https://qiita.com/tomopict/items/9da7cf28c9bcd5f933cb)
- [yarnをインストールする](https://qiita.com/suisui654/items/1b89446e03991c7c2c3d)


<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>