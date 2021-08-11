---
display: home
title: 'Vuepressで動画を貼れるようにする'
description: Vuepressで動画を貼れるようにします．
date: 2021-08-11
image: https://www.hamlet-engineer.com/image/vuepress.png
categories: 
  - Vuepress
tags:
  - Vuepress
  - CSS
---
Vuepressで動画を貼れるようにします．

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
└── public
    └── video
        └── sample.mp4
```

## 動画の貼り付け
以下のコードを動画を貼りたい場所に記述します．
```md
<video width="560" height="240" controls>
  <source src="/video/sample.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video> 
```

<video width="560" height="240" controls>
  <source src="/video/sample.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video> 


## 参考サイト
[Displaying Videos | VuePress Examples 3.0.1](https://vuepress-examples.netlify.app/demos/video/)



<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
