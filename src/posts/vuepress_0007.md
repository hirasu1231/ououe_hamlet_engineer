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

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

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


<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
