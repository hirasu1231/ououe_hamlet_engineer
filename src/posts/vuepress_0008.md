---
display: home
title: 'VuepressとGoogle Adsenseを連携させる'
description: VuepressとGoogle Adsenseの連携を実装します．
date: 2021-08-07
image: https://www.hamlet-engineer.com/image/vuepress.png
categories: 
  - Vuepress
tags:
  - Vuepress
  - CSS
---
SlideShareと連携してVuepressにスライド機能を実装します．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>


[[toc]]

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


## ファイル構成
```
.vuepress
└── components
    ├── CallAdsense.vue
    └── CallInArticleAdsense.vue
```

## VuepressとGoogle Adsenseの連携
ディスプレイ広告と記事内広告を記述する場合は，.vuepress/componentsに以下のファイルを追加します．
```js
// ディスプレイ広告
// .vuepress/components/CallAdsense.vue
<template>
  <div>
    <Adsense
      data-ad-client="＊＊＊＊＊＊＊＊＊＊＊＊"
      data-ad-slot="＊＊＊＊＊"
    />
  </div>
</template>
```

```js
// 記事内広告
// .vuepress/components/CallInArticleAdsense.vue
<template>
  <div>
    <InArticleAdsense
      data-ad-client="＊＊＊＊＊＊＊＊＊＊＊＊"
      data-ad-slot="＊＊＊＊＊"
    />
  </div>
</template>
```

## Google Adsenseの貼り付け
vueファイルの生成が済みましたら，追加したい場所に以下のコードを記述します．
```md
<!-- ディスプレイ広告 -->
<ClientOnly>
  <CallAdsense />
</ClientOnly>

<!-- 記事内広告 -->
<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
```

## まとめ
VuepressとGoogle Adsenseの連携を実装しました．


## 参考サイト
[tacck/vuepress-google-adsense-sample](https://github.com/tacck/vuepress-google-adsense-sample)

[VuePress and Vue-Google-AdSense](https://vuepress-google-adsense.doc.tacck.net/ja/#ディスプレイ広告)

[VuePress に Vue-Google-AdSense を導入する手順解説](https://blog.tacck.net/archives/540)


<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
