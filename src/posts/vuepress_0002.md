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

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

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


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>