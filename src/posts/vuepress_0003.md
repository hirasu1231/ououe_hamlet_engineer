---
display: home
title: 'Vuepressのフォントの設定とページメニューの追加'
description: デフォルトのフォントが中国語用の簡体字ベースなので，一般的に使われているフォントに変更します．そして，やりたいことをまとめるページを作りたかったので，ページメニューを追加します．
date: 2021-02-06
image: https://www.hamlet-engineer.com/image/vuepress.png
categories: 
  - Vuepress
tags:
  - Vuepress
---
デフォルトのフォントが中国語用の簡体字ベースなので，一般的に使われているフォントに変更します．そして，やりたいことをまとめるページを作りたかったので，ページメニューを追加します．
<!-- more -->


## 目次
[[toc]]

## ファイル構成
ファイル構成は以下通りです．
```
hamlet_engineer
├── src
│   ├── _posts
│   │   └── 20190803.md
│   │   └── 20210118.md
│   ├── custom-pages <-新規
│   │   └── index.md <-新規
│   └── .vuepress
│       ├── public
│       │    └── img
│       │          └── hirasu.jpg
│       ├── styles <-新規
│       │    └── index.styl <-新規
│       ├── components <-新規
│       │    └── CustomLayout.vue <-新規
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
    └── /custom-pages <-新規(自動生成)
```

## ページメニューの追加
雑記という名前でこれからやりたいことをまとめるページを追加します．
.vuepress/components/CustomLayout.vueを新しく作成し，config.jsを編集します．
```
mkdir .vuepress/components/
touch .vuepress/components/CustomLayout.vue
```

```js
<!-- .vuepress/components/CustomLayout.vue -->

<template>
  <div class="custom-layout">

    <!-- .main-div is the block with white background -->
    <div class="main-div">
      This is a custom layout
    </div>

    <div class="main-div">
      <!-- <Content /> is to show the rendered markdown content of this page -->
      <Content class="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomLayout',
}
</script>
```

```js
// .vuepress/config.js
module.exports = {
  // ...
  themeConfig: {
    // ナビバーに表示する項目
        nav: [
            { text: 'ホーム', link: '/', exact: true },
            { text: '記事検索', link: '/posts/', exact: false },
            { text: '雑記', link: '/custom-pages/', exact: false },
        ],
  },
}
```

次に表示するページ内容を記入します．ここでは，vuepress-theme-meteorlxyのCustom Pagesの内容を記載します．

```
# custom-pages/index.md

---
# Set the layout of this page
layout: CustomLayout
# Set the title of this page
title: Welcome to my custom page
# Show the aside info card or not (we hide it on this page)
aside: false
---

Contents here will be rendered in the `<Content />` component.
```

以下のような画像がでれば追加完了です．
![](/image/tech_0003/caustom_pages.png)




## vuepressのフォントの設定
.vuepress/styles/index.stylを生成して，簡体字フォントから日本語に適したフォントに変更します．<br>
```
mkdir .vuepress/styles/
touch .vuepress/styles/index.styl
```
```
body
  font-family "Helvetica"
```

## 参考サイト
- [VuePressのカスタムページ](https://vuepress-theme-meteorlxy.meteorlxy.cn/custom-pages/)
- [VuePress + Netlifyでブログ作成](https://meuniere.dev/posts/2020/08/06/create-vuepress.html)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>