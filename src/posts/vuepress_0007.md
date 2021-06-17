---
display: home
title: 'SlideShareと連携してVuepressにスライド機能を実装する'
description: Vuepressにコメント機能を実装します．
date: 2021-06-17
image: https://www.hamlet-engineer.com/image/vuepress.png
categories: 
  - Vuepress
tags:
  - Vuepress
  - CSS
---
SlideShareと連携してVuepressにスライド機能を実装します．

<!-- more -->

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
