---
display: home
title: 'VuepressでGoogle AdSense広告を表示する'
description: VuepressでGoogle AdSense広告を表示できるようにします．
date: 2022-01-27
image: https://www.hamlet-engineer.com/image/vuepress.png
categories: 
  - Vuepress
tags:
  - Vuepress
  - CSS
---
VuepressでGoogle AdSense広告を表示できるようにします．

本稿の設定の利点は，自分で広告コードを貼り付ける必要がなくなることです．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## Google AdSenseに登録
[]()を参照してください．

## .vuepress/config.jsの書き換え
以下のコードをに追記します．
```js
module.exports = {
  ...
  head: [
    ...
    [
      "script",
      {
        "async src": "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      }
    ],
    [
      "script",
      {},
      '(adsbygoogle = window.adsbygoogle || []).push({  google_ad_client: "ca-pub-0000000000000000",  enable_page_level_ads: true });'
    ]
  ],
  ...
}
```

あとは，[Google AdSense](https://www.google.com/intl/ja_jp/adsense/start/)に飛んで，自動最適化の設定をします．

## 参考サイト
[Google AdSense](https://www.google.com/intl/ja_jp/adsense/start/)

[VuePress に広告を表示する](https://hene.dev/blog/2019/06/27/google-adsense)

[VuePress に広告を表示する2](https://hene.dev/blog/2019/11/01/google-adsense)

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
