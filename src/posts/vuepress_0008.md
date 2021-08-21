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

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">


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


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
