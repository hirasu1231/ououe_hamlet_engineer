---
display: home
title: 'Vuepressで吹き出しを実装する'
description: Vuepressで吹き出しを実装します．主にcssの設定をVuepressでどうのように実装するかの流れになります．
date: 2021-04-13
image: https://www.hamlet-engineer.com/image/vuepress.png
categories: 
  - Vuepress
tags:
  - Vuepress
  - CSS
---
Vuepressで吹き出しを実装します．主にcssの設定をVuepressでどうのように実装するかの流れになります．

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
└── src
    ├── public
    │   └── hirasu1231.jpg
    └── .vuepress
        ├── (省略)
        ├── styles
        │    └── index.styl
        └── config.js
```

## 概要
Custom Containerという，文字に対する装飾ではなく，ブロックに対してデザインを付与する仕組みを利用します．

公式の説明ページは[こちら](https://v1.vuepress.vuejs.org/guide/markdown.html#custom-containers)です．

これを利用してMarkdownに以下のコードを記述すると、吹き出しも出すことができるようになります．
```
::: bubble9
このような吹き出しを追加します．
:::
```
::: bubble9
このような吹き出しを追加します．
:::


## Vuepressでの吹き出し
### プラグインのインストール
Custom Containerはvuepress-plugin-containerというプラグインで導入されています

以下のコマンドで[vuepress-plugin-container](https://github.com/vuepress/vuepress-plugin-container)というプラグインをインストールします．

```
yarn add vuepress-plugin-container
```

### vuepress-plugin-containerの設定
.vuepress/config.jsに以下のコードを追記します．
```js
module.exports = {
    ...,
    plugins: [
      ...,
      // 吹き出し
      'vuepress-plugin-container': {
        type: 'bubble9',
        defaultTitle: '',
        before: info => `<div class="bubble9"><div class="imgs"><img src="/hirasu1231.jpg" alt=""></div><div class="chat"><div class="ss">${info}`,
        after: '</div></div></div>',
      },
    ],
  }
```

### 吹き出しのデザイン
.vuepress/styles/index.stylに以下のコードを追記して，吹き出しのデザインを調整します．

ベースはcssですが，tab区切りとスペース区切りになっています．


```
/* 吹き出し*/
/*以下、②左側のコメント*/
.bubble9 
  width 100%
  margin 1.5em 0
  overflow hidden

.bubble9
  .imgs 
    float left
    margin-right -90px
    width 75px

.bubble9 
  .imgs img
    position relative
    top 10px
    width 95%
    height auto
    border solid 3px #1976D2
    border-radius 50%

.bubble9
  .chat 
    width 95%

.ss 
  margin 16px
  position relative
  padding 10px
  border-radius 10px
  color #000000
  background-color #BBDEFB
  margin-left 90px

.ss
  :after 
    content ""
    display inline-block
    position absolute
    top 20px 
    left -24px
    border 12px solid transparent
    border-right 12px solid #BBDEFB

.ss p 
  margin 16
  padding 10
```

## まとめ
::: bubble9
Vuepressで吹き出しを実装しました．吹き出し以外にも追加できそうです．
:::

## 参考サイト
[VuePressで独自のCustom Containerの追加方法（吹き出し）](https://web-and-investment.info/posts/2020/07/12/vuepress-custom-container.html)<br>
[CSSのみで吹き出しを作る方法【デザインサンプル10種】](https://lpeg.info/html/css_bubble.html)<br>
[Vuepress Custom Containers](https://v1.vuepress.vuejs.org/guide/markdown.html#custom-containers)

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>