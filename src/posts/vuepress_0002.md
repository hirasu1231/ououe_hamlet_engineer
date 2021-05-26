---
display: home
title: 'Vuepressで作成したブログをGIthub Pageで公開する'
description: サーバーを契約するのが面倒くさいので，Github PagesでVuepressを公開します．
date: 2021-02-02
image: https://www.hamlet-engineer.com/image/vuepress.png
categories: 
  - Vuepress
tags:
  - Vuepress
---
サーバーを契約するのが面倒くさいので，Github PagesでVuepressを公開します．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

## Vuepressをビルド
ビルドが終了するとdocsディレクトリが生成され，その中にビルドファイルが出力されます．
ビルドファイルで動作確認するにはgoogle chromeのWeb Server for Chromeという拡張機能を利用すると便利です．
```
# ビルド
yarn build
```
![](/image/tech_0002/webserver.png)


## GitHub Pagesでホスティングする
ビルドしたvuepressをGitHub Pagesでホスティングします．そのためにはリポジトリが必要になるのでプロジェクトと同じ名前で”hamlet_engineer”というリポジトリを作成します．<br>
<br>
config.jsの中身では以下のように設定できます．
```
// GitHub Pagesにホスティング
// base:リポジトリの名前,dest:出力ディレクトリの名前
base: '/hamlet_engineer/',
dest: 'docs', 
```

## ファイル構成
ファイル構成は以下通りです．
```
hamlet_engineer
├── src
│   ├── _posts
│   │   └── 20190803.md
│   │   └── 20210118.md
│   └── .vuepress
│       ├── public
│       │    ├── img
│       │          └── hirasu.jpg
│       │    
│       └── config.js
├── package.json
├── yarn.lock
├── /.git
└── docs
    ├── /assets
    ├── /img
    ├── /posts
    ├── 404.html
    └── index.html
```

## docsを公開する設定を行う
vuepressをコミットしGitHubのリポジトリへpushします.<br>
次にリポジトリのsettingsページのOptionsで下にスクロールすると，GitHub Pagesの設定があります．<br>
そして，sourceを"None"から"main branch /docs folder"へ変更して保存します.<br>
反映されるまでに時間がかかりますが，しばらくすると以下のようなURLで表示されます．<br>
https://hirasu1231.github.io/hamlet_engineer

![](/image/tech_0002/GithubPages.png)

## 参考サイト
- [VuePressで作成した静的サイトをGitHub Pagesで公開する](https://qiita.com/rubytomato@github/items/f8153f0d00f89ba87ed5#docs%E3%82%92%E5%85%AC%E9%96%8B%E3%81%99%E3%82%8B%E8%A8%AD%E5%AE%9A%E3%82%92%E8%A1%8C%E3%81%86)


<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>