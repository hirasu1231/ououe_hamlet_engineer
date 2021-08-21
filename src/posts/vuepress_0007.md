---
display: home
title: 'SlideShareと連携してVuepressにスライド機能を実装する'
description: Vuepressにコメント機能を実装します．
date: 2021-08-05
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

## SlideShareと連携
最初に SlideShare の画面で埋め込みたいスライドを表示してください．

スライドの下に表示されている「Share」をクリックしてください．

![](/image/slide01.png)

スライドが表示されていた位置に一般的なブログや Web サイトの記事に埋め込むための Embed 用コードが表示されます。

![](/image/slide02.png)

あとは，Embed 用のコードをMarkdownに直打ちします．
```js
<iframe src="//www.slideshare.net/slideshow/embed_code/key/zrtRp6bml0uECo" \
width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" \
style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" \
allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> \
<a href="//www.slideshare.net/hirasuYearEnd/sped-246760601" \
title="ゴジラSPのEDの小ネタをまとめてみました" target="_blank">\
ゴジラSPのEDの小ネタをまとめてみました</a> </strong> from <strong>\
<a href="https://www.slideshare.net/hirasuYearEnd" target="_blank">hirasuYearEnd</a>\
</strong> </div>
```



<iframe src="//www.slideshare.net/slideshow/embed_code/key/zrtRp6bml0uECo" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/hirasuYearEnd/sped-246760601" title="ゴジラSPのEDの小ネタをまとめてみました" target="_blank">ゴジラSPのEDの小ネタをまとめてみました</a> </strong> from <strong><a href="https://www.slideshare.net/hirasuYearEnd" target="_blank">hirasuYearEnd</a></strong> </div>

## まとめ
SlideShareと連携してVuepressにスライド機能を実装しました．


## 参考サイト
[スライドをブログやWebサイトに埋め込む](https://www.howtonote.jp/slideshare/use/index6.html)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
