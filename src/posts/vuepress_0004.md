---
display: home
title: 'VuepressにSEO対策を実施します'
description: VuepressのSEO関係の設定を実装します．本稿では，Google Search Console・サイトマップ・Googleアナリティクス・SEO・RSSの設定を実施します．
date: 2021-02-19
image: https://www.hamlet-engineer.com/image/seo.png
categories: 
  - Vuepress
tags:
  - Vuepress
  - SEO
---
VuepressのSEO関係の設定を実装します．本稿では，Google Search Console・サイトマップ・Googleアナリティクス・SEO・RSSの設定を実施します．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

## ファイル構成
ファイル構成は以下通りです．
```
hamlet_engineer
├── src
│   ├── _posts
│   │   └── 20190803.md
│   │   └── 20210118.md
│   ├── custom-pages
│   │   └── index.md
│   └── .vuepress
│       ├── public
│       │    ├── img
│       │    │     └── hirasu.jpg
│       │    └── robots.txt <-新規
│       ├── styles
│       │    └── index.styl
│       ├── components
│       │    └── CustomLayout.vue
│       └── config.js
├── package.json
├── yarn.lock
├── /.git
└── docs
    ├── /assets
    ├── /img
    ├── /posts
    ├── 404.html
    ├── index.html
    ├── /custom-pages
    ├── sitemap.xml <-新規(自動生成)
    └── robots.txt <-新規(自動生成)
```

## Google Search Console
### Google Search Consoleとは
Google Search Consoleは、Webサイトの掲載順位を測定したり、サイト内部の問題をいち早く把握することができるサービスです．

### Google Search Consoleの登録
[Googleサーチコンソールの登録・設定方法](https://cluster-seo.com/blog/register-search-console.html)を参考に，Google Search Consoleに登録してサイト認証タグを確認します．<br>
![](/image/tech_0004/GoogleSearchConsole.png)

### config.jsの設定
[VuePressに GoogleSearchConsole のメタタグを埋め込む](https://kitigai.hatenablog.com/entry/2019/03/28/233451)を参考に追記します．
```js
// サイト認証タグ: <meta name="google-site-verification" content="XXXXXXX" />
module.exports = {
  head: [['meta', { name: 'google-site-verification', content: 'XXXXXXX' }]]
}
```

<br>

## vuepress-plugin-sitemap
以下のコードでインストールできます．
```
yarn add vuepress-plugin-sitemap
```
### vuepress-plugin-sitemapとは
vuepress-plugin-sitemapはサイトマップの設定をできるプラグインです．<br>
調べた結果，検索されやすいように自分のHPの案内図をGoogle様に送るという理解です．<br>
下記の引用元から，サイトマップとはクローラーがGoogleに報告しやすいように自分のHPの案内図という理解です．

> サイトマップとはサイト上の各ファイルの情報/関係を伝えるファイルです．<br>
Google などの検索エンジンはサイトマップを読み込むことで、より高度なクロールを行います．<br>
引用元：[VuePress でサイトマップを設定する](https://hene.dev/blog/2019/05/02/sitemap)<br>
<br>
サイトマップとはサイトにどのようなコンテンツがあるのかを一覧でまとめてみれるページのことだ。<br>
サイトマップにはユーザーや検索エンジンにサイトの内容をわかりやすく伝える役割がある。
引用元：[SEO効果アップ！サイトマップの仕組みと理想的な作成方法を紹介](https://bazubu.com/how-to-create-an-effective-site-map-26793.html)
<br>

下記の引用元から，クロールとは自分のサイトを調べ尽くしてくれるロボット(クローラー)を招待して，Googleに検索されやすいように報告してもらえるようにするという理解です．
> クロールとは、“crawler（クローラー）と呼ばれるインターネットの上にあるWeb サイトやホームページの情報をかき集めるロボットが、自分のサイトに来ること”です。<br>
引用元：[Google検索の仕組み「クロール」と「インデックス」の違い](https://seeds-create.co.jp/google-search-console-crawl-index/)<br>

### config.jsの設定
[vuepress-plugin-sitemap でサイトマップ自動生成](https://hapicode.com/vuepress/sitemap.html#vuepress-config-js-%E8%A8%AD%E5%AE%9A%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E5%A4%89%E6%9B%B4)を参考にしています．<br>
```js
//.vuepress/config.jsに追記してください 
module.exports = {
    // プラグイン
    plugins: {
        // サイトマップ(案内図)
        //hostnameは自身のサイトのトップページです．
        'sitemap': {
          hostname: 'https://hirasu1231.github.io/hamlet_engineer/',
          //excludeはいらんところを案内図からはずす
          exclude: ["/404.html"],
          //dateFormatterは更新の度にサイトマップも更新
          dateFormatter: val => {
              return new Date().toISOString()
            }
        },
      }
}
```

### robots.txt
src/.vuepress/public/robots.txtを設置することで、クローラーを制御できます．
```
# src/.vuepress/public/robots.txt
User-agent : *
Disallow :
Sitemap : https://hirasu1231.github.io/hamlet_engineer/sitemap.xml
```

### Google Search Consoleへの登録
上記の設定をした上でビルドすると，docs/sitemap.xmlとdocs/robots.txtが生成されます．
```
yarn build
```
そして，[VuePress でサイトマップを設定する](https://hene.dev/blog/2019/05/02/sitemap)を参考に[Google Search Console](https://search.google.com/search-console/about?hl=ja)にサイトマップを登録します．<br>
![](/image/tech_0004/sitemap.png)



<br>

## plugin-google-analytics
以下のコードでインストールできます．
```
yarn add -D @vuepress/plugin-google-analytics
```

### plugin-google-analyticsとは
Google Analyticsのセットアップを行うことができるようになります．<br>
最新のGA4で発行されるG-00000000のIDは未対応のため，必ずUA-00000000-0も発行されるように，[Googleアナリティクスの登録・設置方法【2021年版】](https://blog.siteanatomy.com/register-google-analytics/)を参考に登録してください．<br>
![](/image/tech_0004/GoogleAnalytics.png)


### config.jsの設定
[【VuePress】Google Analyticsを導入する](https://ichiya.netlify.app/posts/2019/12/10/_20191210.html)を参考にしています．<br>
```js
module.exports = {
    plugins: {
        // Google Analytics
        // gaは．Google Analytics登録時に発行されるトラッキングID
        // 最新のGA4で発行されるG-00000000のIDは未対応
        '@vuepress/google-analytics': {
            'ga': 'UA-00000000-0'
        }
    },
}
```

<br>

## vuepress-plugin-seo
本章については，参考サイト，ドキュメントを見てもOGP画像の設定が実装できなかったので，また後日挑戦します．<br>
プラグインは以下のコードでインストールできます．
```
yarn add -D vuepress-plugin-seo
```

### vuepress-plugin-seoとは
metaタグという記事コンテンツの情報を検索エンジンやブラウザに伝えるための情報を生成してくれるプラグインと、SNSでリンクした際などにプレビュー表示を自動で生成してくれるプラグインです．

### config.jsの設定
[VuePressでOGP自動設定 (seoプラグイン＆placehold.jp編)](https://dorasu-tech.dorasu.com/posts/2020/01/24/vuepress-ogp-autogen.html)を参考にしています．<br>
```js
module.exports = {
    plugins: {
      // seo(metaタグ)
      'seo': {
        // descriptionは検索時に表示されるサイトの説明
        description: ($page, $site) => $page.frontmatter.description || ($page.excerpt && $page.excerpt.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")) || $site.description || "",
        // titleは検索時に表示されるサイトのタイトル
        title: ($page, $site) => $page.title || $site.title,
        // imageはSNSでリンクした際などにプレビュー表示される画像
        twitterCard: _ => 'summary',
        // 画像が反映されなかったので，ここではしません
        // image: ($page, $site) => $page.frontmatter.image && (($site.themeConfig.domain || '') + $page.frontmatter.image) || 'https://placehold.jp/40//fff/600x315.png?css=%7B"padding"%3A"%200%2080px"%2C"background-image"%3A"%20url(https%3A%2F%2Fplacehold.jp%2F057%2F333%2F130x40.png%3Ftext%3Dhamlet_engineer)"%7D&text='+encodeURIComponent($page.title||$site.title),
      },
    },
    themeConfig: {
      domain: 'https://hirasu1231.github.io/hamlet_engineer',
      }
    }
    
```
僕は参考サイトの通りでやってもできませんでしたが，一応下記にまとめました．<br>
```
# 1.プレビュー表示の背景となる画像の設定
# 背景色・文字色はRGBの16進数表記
# http://placehold.jp/{背景色}/{文字色}/{幅}x{高さ}.png?text={テキスト}
https://placehold.jp/057/333/150x40.png?text=Hamlet_engineer

# 2.プレビュー表示の画像(1.を使う)
# https://placehold.jp/{文字の大きさ}//{文字色}/{幅}x{高さ}.png?css={%22padding%22:%22%200%2080px%22,%22background-image%22:%22%20url({背景画像のURL})%22}&text={テキスト}
https://placehold.jp/40//fff/600x315.png?css=%7B"padding"%3A"%200%2080px"%2C"background-image"%3A"%20url(https%3A%2F%2Fplacehold.jp%2F057%2F333%2F130x40.png%3Ftext%3Dhamlet_engineer)"%7D&text=600x315ピクセルの画像として、ページのタイトルを使って画像生成
```

<br>

## vuepress-plugin-feed
以下のコードでインストールできます．
```
yarn add -D vuepress-plugin-feed
```
### vuepress-plugin-feedとは
サイトの見出しや要約・更新情報などを記述するRSSというファイルを生成するプラグインです．

### config.jsの設定
[VuePressのブログテーマ使ってみた。](https://inkohx.dev/2020/06/29/using-vuepress-blog-theme/)を参考にしています．<br>
```js
module.exports = {
  themeConfig: {
    // RSSの設置
    feed: {
      canonical_base: 'https://hirasu1231.github.io/hamlet_engineer',
    }
  }
}
```

<br>

## まとめ
vuepressのSEOの設定を実施しました．思ったよりもかなり時間がかかりました．<br>
OPGについては，また後日挑戦します．

<br>

## 参考サイト
[Vuepress で ブログを作る](https://blog.ouvill.net/blog/2019-03-30--vuepress_blog/make_vuepress_blog/)<br>

### 参考サイト(Google Search Console)
[Google Search Console](https://search.google.com/search-console/about?hl=ja)<br>
[VuePressに GoogleSearchConsole のメタタグを埋め込む](https://kitigai.hatenablog.com/entry/2019/03/28/233451)<br>
[新規サイトが検索に出てこない！まずやるべき7つのSEO対策](https://www.deepcrawl.jp/blog/column/seo/seven-seo-measures-you-must-do-first-if-you-start-a-new-site/)<br>
[Googleサーチコンソールの登録・設定方法](https://cluster-seo.com/blog/register-search-console.html)

### 参考サイト(vuepress-plugin-sitemap)
[vuepress-plugin-sitemap](https://github.com/ekoeryanto/vuepress-plugin-sitemap)<br>
[VuePress でサイトマップを設定する](https://hene.dev/blog/2019/05/02/sitemap)<br>
[Google検索の仕組み「クロール」と「インデックス」の違い](https://seeds-create.co.jp/google-search-console-crawl-index/)<br>
[SEO効果アップ！サイトマップの仕組みと理想的な作成方法を紹介](https://bazubu.com/how-to-create-an-effective-site-map-26793.html)<br>
[【VuePress・SEO】サイトマップの作り方【2つ送るだけ】](https://www.toybox-emomi.work/2020/07/22/_20200722/)<br>
[vuepress-plugin-sitemap でサイトマップ自動生成](https://hapicode.com/vuepress/sitemap.html#vuepress-config-js-%E8%A8%AD%E5%AE%9A%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E5%A4%89%E6%9B%B4)<br>
[VuePress に Google Analytics を追加する](https://blog.raispg.com/posts/2020/10/14/vuepress-ga.html)<br>

### 参考サイト(plugin-google-analytic)
[plugin-google-analytics](https://v1.vuepress.vuejs.org/plugin/official/plugin-google-analytics.html)<br>
[【VuePress】Google Analyticsを導入する](https://ichiya.netlify.app/posts/2019/12/10/_20191210.html)<br>
[GoogleアナリティクスのトラッキングIDの基本【確認・設置方法】](https://blog.siteanatomy.com/2020/05/tracking-id.html)<br>
[Googleアナリティクスの登録・設置方法【2021年版](https://blog.siteanatomy.com/register-google-analytics/)<br>


### 参考サイト(vuepress-plugin-seo)
[vuepress-plugin-seo](https://github.com/lorisleiva/vuepress-plugin-seo)<br>
[VuePressでOGP自動設定 (seoプラグイン＆placehold.jp編)](https://dorasu-tech.dorasu.com/posts/2020/01/24/vuepress-ogp-autogen.html)<br>
[metaタグ（メタタグ）とは？SEO効果のある記述箇所とポイントを紹介](https://ferret-plus.com/13074#:~:text=meta%E3%82%BF%E3%82%B0%E3%81%A8%E3%81%AF%E8%A8%98%E4%BA%8B,%E4%BC%9D%E3%81%88%E3%82%8B%E3%81%9F%E3%82%81%E3%81%AE%E6%83%85%E5%A0%B1%E3%81%A7%E3%81%99%E3%80%82)<br>
[meta description（要約タグ）の使い方](https://ferret-plus.com/curriculums/1358)<br>
[Placehold.jp](http://placehold.jp/#basic-tab)
[イラストダウンロード](https://illust.download/archives/31254)

### 参考サイト(vuepress-plugin-feed)
[vuepress-plugin-feed](https://github.com/webmasterish/vuepress-plugin-feed)<br>
[VuePressのブログテーマ使ってみた。](https://inkohx.dev/2020/06/29/using-vuepress-blog-theme/)<br>
[RSSとは？基本の仕組みと便利な使い方](https://uxmilk.jp/44993)<br>


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>