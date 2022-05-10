---
display: home
title: 'HTML/CSSでFlaskに使うフロントエンドのデザインを作成する02(フッターとヘッダー)'
description: 簡単なヘッダーの作成を実施します．
date: 2022-5-13
image: https://www.hamlet-engineer.com/image/HTML_CSS.jpg
categories: 
  - FrontEnd
tags:
  - HTML
  - CSS
---
簡単なヘッダーの作成を実施します．

<!-- https://www.hamlet-engineer.com -->

<!-- more -->

最終成果は，WinXのデザインをベースにしたフロントエンドを作成します．

**デザイン元**
![](/image/WinX.png)


**デザイン元**
![](/image/goal_design.png)

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
後日，Flaskのフロントに利用したいので下記のようなファイル構成とします．
```
作業ディレクトリ
├── /templates <- HTML
│   └── main.html
└── /static <- CSS/JS
    ├── normalize.css
    └── style.css
```

## デザイン1221

下記の画像までのデザインを作成します．

![](/image/front_1221.png)


### HTML
前述の画像のHTMLは下記の通りです．
```HTML
<head>
    <meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css?family=Noto+Sans+JP:400,700&display=swap&subset=japanese" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Noto+Serif+JP:400,700&display=swap&subset=japanese" rel="stylesheet">
    <link rel="stylesheet" href="../static/normalize.css">
    <link rel="stylesheet" href="../static/style.css">
    <title>LineArt</title>
</head>

   <body>
    <div class="wrap">

        <header>
            <h2 class="header_title">LineArt</h2>
        </header>

        <main>
            <div class="separate_line1"></div>
            <div class="separate_line2"></div>
            
            <div class="preview_main"></div>
            <div class="preview_sub"></div>
            <div class="preview_menu"></div>
            <div class="convert_menu"></div>
        </main>
        <footer>
            <h2 class="footer_title">LineArt</h2>
        </footer>
    </div>

```

### CSS
前述の画像のCSSは下記の通りです．
```css
body {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
* {
    box-sizing: inherit;
}
.wrap {
}

/* 共通
------------------------------------------------------------*/
h1, h2{
    font-family: 'Modern Antiqua', 'Noto Sans JP',serif;
}

/* ヘッダー
------------------------------------------------------------*/
header {
    background: #808080;
    padding: 0px;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 15%;
    color: #FFF;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
    
    /* 光沢表現 */
    background-image: -webkit-linear-gradient(transparent 0%,rgba(255,255,255,.3) 50%,transparent 50%,rgba(0,0,0,.1) 100%);
    background-image:         linear-gradient(transparent 0%,rgba(255,255,255,.3) 50%,transparent 50%,rgba(0,0,0,.1) 100%);
    box-shadow: 0 2px 2px 0 rgba(255,255,255,.2) inset,0 2px 10px 0 rgba(255,255,255,.5) inset,0 -2px 2px 0 rgba(0,0,0,.1) inset;
    border: 1px solid rgba(0,0,0,.2);
    /* 光沢表現 ここまで */
}

header h2{
    font-family: 'Modern Antiqua', 'Noto Sans JP',serif;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-block-start: 0;
    margin-block-end: 0;
}

.header_title{
    background-color: 3d3d3d;
    position: absolute;
    right: 0;
    width: 15%;
    height: 15%;
    color: #FFF;
    /* 光沢表現 */
    background-image: -webkit-linear-gradient(transparent 0%,rgba(255,255,255,.3) 50%,transparent 50%,rgba(0,0,0,.1) 100%);
    background-image:         linear-gradient(transparent 0%,rgba(255,255,255,.3) 50%,transparent 50%,rgba(0,0,0,.1) 100%);
    box-shadow: 0 2px 2px 0 rgba(255,255,255,.2) inset,0 2px 10px 0 rgba(255,255,255,.5) inset,0 -2px 2px 0 rgba(0,0,0,.1) inset;
    border: 1px solid rgba(0,0,0,.2);
    /* 光沢表現 ここまで */
}



/* メイン
------------------------------------------------------------*/
main {
    background: rgba(0,0,0,0.75);
    position: absolute;
    top: 15%;
    height: 82%;
    width: 100%;

    /* スクロールがmain内に出ていいならこっちつかう */
    /*height: calc(100vh - 200px);*/
    /*overflow: auto;*/
}

.separate_line1{
    background: #ccc;
    position: absolute;
    bottom: 30%;
    height: 1%;
    width: 100%;
}

.separate_line2{
    background: #ccc;
    position: absolute;
    right: 30%;
    top: 70%;
    height: 30%;
    width: 1%;
}

/* 線画のpreview画面
------------------------------------------------------------*/
.preview_main  {
    background: rgba(255,0,0,0.5);
    position: absolute;
    height: 70%;
    width: 100%;
}

/* メイン領域以外でもスクロール効くように */
/*padding-bottom: 30px;*/

/* アニメ画のpreview画面
------------------------------------------------------------*/
.preview_sub {
    background: rgba(0,0,255,0.5);
    position: absolute;
    top: 70%;
    height: 30%;
    width: 70%;
}

/* アニメ画のpreviewメニュー
------------------------------------------------------------*/
.preview_menu {
    background: rgba(255,0,0,0.5);
    position: absolute;
    top: 70%;
    left: 50%;
    height: 30%;
    width: 20%;
}

/* 変換メニュー
------------------------------------------------------------*/
.convert_menu {
    background: rgba(0,255,0,0.5);
    position: absolute;
    top: 70%;
    right: 0;
    height: 30%;
    width: 30%;
}



/* フッター
------------------------------------------------------------*/
footer {
    background: #808080;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3%;
}

.footer_title{
    background-color: rgba(255,255,255,0);
    padding: 10px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0;
    text-align: right;
}

```

## CSSの要素

### 陰付きボックス
陰付きボックスの設定は下記ように記述しました．

**CSS**
```css
header {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
}
```

### 光沢表現
光沢表現は下記ように記述しました．
```css
header {
    /* 光沢表現 */
    background-image: -webkit-linear-gradient(transparent 0%,rgba(255,255,255,.3) 50%,transparent 50%,rgba(0,0,0,.1) 100%);
    background-image:         linear-gradient(transparent 0%,rgba(255,255,255,.3) 50%,transparent 50%,rgba(0,0,0,.1) 100%);
    box-shadow: 0 2px 2px 0 rgba(255,255,255,.2) inset,0 2px 10px 0 rgba(255,255,255,.5) inset,0 -2px 2px 0 rgba(0,0,0,.1) inset;
    border: 1px solid rgba(0,0,0,.2);
    /* 光沢表現 ここまで */
}
```

### フッター
フッターの表示は下記ように記述しました．

**HTML**
```HTML
<footer>
  <h2 class="footer_title">LineArt</h2>
</footer>
```

**CSS**
```css
/* フッター
------------------------------------------------------------*/
footer {
    background: #808080;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3%;
}

.footer_title{
    background-color: rgba(255,255,255,0);
    padding: 10px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0;
    text-align: right;
}
```

### メインの背景
メイン画面の背景は下記ように記述しました．

**HTML**
```HTML
<main>
</main>
```

**CSS**
```css
main {
    background: rgba(0,0,0,0.75);
    position: absolute;
    top: 15%;
    height: 82%;
    width: 100%;

    /* スクロールがmain内に出ていいならこっちつかう */
    /*height: calc(100vh - 200px);*/
    /*overflow: auto;*/
}
```

### メインの区分け線
下記の4領域に分ける区分け線を下記ように記述しました．
- 線画のプレビュー画面
- アニメ画のプレビュー画面
- プレビューメニュー
- 変換メニュー

**HTML**
```HTML
<main>
  <separate_line1></separate_line1>
  <separate_line2></separate_line2>
</main>
```

**CSS**
```css
separate_line1{
    background: #ccc;
    position: absolute;
    bottom: 30%;
    height: 1%;
    width: 100%;
}

separate_line2{
    background: #ccc;
    position: absolute;
    right: 30%;
    top: 70%;
    height: 30%;
    width: 1%;
}
```

### 領域分け
下記の4領域に分けるために，下記ように記述しました．
- 線画のプレビュー画面
- アニメ画のプレビュー画面
- プレビューメニュー
- 変換メニュー
**HTML**
```HTML
<main>
  <div class="separate_line1"></div>
  <div class="separate_line2"></div>
  
  <div class="preview_main"></div>
  <div class="preview_sub"></div>
  <div class="preview_menu"></div>
  <div class="convert_menu"></div>
</main>
```

**CSS**
```css
/* メイン
------------------------------------------------------------*/
main {
    background: rgba(0,0,0,0.75);
    position: absolute;
    top: 15%;
    height: 82%;
    width: 100%;

    /* スクロールがmain内に出ていいならこっちつかう */
    /*height: calc(100vh - 200px);*/
    /*overflow: auto;*/
}

.separate_line1{
    background: #ccc;
    position: absolute;
    bottom: 30%;
    height: 1%;
    width: 100%;
}

.separate_line2{
    background: #ccc;
    position: absolute;
    right: 30%;
    top: 70%;
    height: 30%;
    width: 1%;
}

/* 線画のpreview画面
------------------------------------------------------------*/
.preview_main  {
    background: rgba(255,0,0,0.5);
    position: absolute;
    height: 70%;
    width: 100%;
}

/* メイン領域以外でもスクロール効くように */
/*padding-bottom: 30px;*/

/* アニメ画のpreview画面
------------------------------------------------------------*/
.preview_sub {
    background: rgba(0,0,255,0.5);
    position: absolute;
    top: 70%;
    height: 30%;
    width: 70%;
}

/* アニメ画のpreviewメニュー
------------------------------------------------------------*/
.preview_menu {
    background: rgba(255,0,0,0.5);
    position: absolute;
    top: 70%;
    left: 50%;
    height: 30%;
    width: 20%;
}

/* 変換メニュー
------------------------------------------------------------*/
.convert_menu {
    background: rgba(0,255,0,0.5);
    position: absolute;
    top: 70%;
    right: 0;
    height: 30%;
    width: 30%;
}
```


## まとめ
フロントエンドの領域分けまで実行しました．

## 参考サイト
[【CSS】おしゃれなボックスデザイン（囲み枠）のサンプル30](https://saruwakakun.com/html-css/reference/box)

[CSSで使い回しの効く光沢表現を作る方法](https://webutubutu.com/webdesign/5044#toc_H3-7)

[[CSS] 背景色や文字色を透明・透過させる](https://agohack.com/transparent-background-color/)

[16進数の色](https://encycolorpedia.jp/808080)



<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

