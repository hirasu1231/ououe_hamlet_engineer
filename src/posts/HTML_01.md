---
display: home
title: 'HTML/CSSでFlaskに使うフロントエンドのデザインを作成する01(背景色と文字色の指定)'
description: 背景色と文字色の指定を実施します．
date: 2022-5-12
image: https://www.hamlet-engineer.com/image/HTML_CSS.jpg
categories: 
  - FrontEnd
tags:
  - HTML
  - CSS
---
背景色と文字色の指定を実施します．

<!-- https://www.hamlet-engineer.com -->

<!-- more -->

最終成果は，WinXのデザインをベースにしたフロントエンドを作成します．

**デザイン元**
![](/image/WinX.png)


**デザインゴール**
![](/image/goal_design.png)

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


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

### 編集ファイル
編集するファイルは，main.htmlとstyle.cssとなります．

### normalize.css
normalize.cssは，どのブラウザでアクセスしても表示が変化しないように，各々のブラウザに適用されているデフォルトのスタイルを平均化するために読み込ませるCSSです．
[normalize.css](http://necolas.github.io/normalize.css/)からダウンロードします．

## CSSの単位
CSSには下記のような単位があります．
- px：デバイスの1ドットを表す絶対値
- em：その要素自身のfont-size値を基準として相対値

```CSS
/* 基準が16pxより */
body {
  /* 1.125em = 16 * 1.125 = 18px */
  font-size: 1.125em;
}
.parent {
  /* 1.5em = 18 * 1.5 = 27px */
  font-size: 1.5em;
  /* 2em = 27 * 2 = 54px */
  padding: 2em;
}
.child {
  /* 0.5em = 27 * 0.5 = 13.5px */
  padding: .5em;
}
```

- rem:ルート要素（通常はhtml要素）のfont-size値を基準として相対値．font-sizeプロパティが指定されているかどうかは影響しません．
```CSS
/* 基準が16pxより */
body {
  /* 1.125em = 16 * 1.125 = 18px */
  font-size: 1.125rem;
}
.parent {
  /* 1.5em = 16 * 1.5 = 24px */
  font-size: 1.5rem;
  /* 2em = 16 * 2 = 32px */
  padding: 2rem;
}
.child {
  /* 0.5em = 16 * 0.5 = 8px */
  padding: .5rem;
}
```
- %:%単位の相対値．しかし，何を基準としているかはプロパティごとに確認すること．widthやmargin、paddingプロパティなら親要素の横幅に対する割合、heightプロパティなら親要素の高さに対する割合、font-sizeプロパティなら親要素の文字サイズに対する割合となります．
- vw:ブラウザの横幅に対する相対値となり，1vwはブラウザの横幅の1%に相当します．

## ヘッダーのデザイン1

下記の画像までのデザインを作成します．

![](/image/header01.png)


### HTML
前述の画像のHTMLは下記の通りです．
```HTML
<head>
    <meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css?family=Noto+Sans+JP:400,700&display=swap&subset=japanese" rel="stylesheet">
    <link rel="stylesheet" href="../static/normalize.css">
    <link rel="stylesheet" href="../static/style.css">

    <title>LineArt</title>
</head>
   <body>
    <div class="wrap">

        <header>
            <h2 class="header_title">LineArt</h2>
        </header>
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
h2{
    font-family: 'Modern Antiqua', 'Noto Sans JP',serif;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-block-start: 0;
    margin-block-end: 0;
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
}

.header_title{
    background-color: 3d3d3d;
    position: absolute;
    right: 0;
    width: 10%;
    height: 15%;
    color: #FFF;
}
```

## CSSの要素

### フォントの指定
フォントはHTMLで読み込み，CSSで指定します．

**HTML**
```HTML
<head>
    <meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css?family=Noto+Sans+JP:400,700&display=swap&subset=japanese" rel="stylesheet">
</head>
```

**CSS**
```css
h2{
    font-family: 'Modern Antiqua', 'Noto Sans JP',serif;
}
```

### h2の自動配置の修正
`h2`はデフォルトだと，下画像のような空白が挿入されます．

![](/image/header02.png)

そこで下記のcssで空白が挿入されないようにします．
```css
h2{
    margin-block-start: 0;
    margin-block-end: 0;
}
```

### 上下左右中央揃え
テキストの上下左右中央揃えする場合は下記のように記述します．
```css
h2{
    display: flex;
    justify-content: center;
    align-items: center;
}
```

### 文字色の指定
文字色は，`color`で指定します．
色の数値は，[16進数の色](https://encycolorpedia.jp/808080)が参考になります．
```css
.header_title{
    color: #FFF;
}
```

### 背景色の指定
背景色は，`background`・`background-color`で指定します．
色の数値は，[16進数の色](https://encycolorpedia.jp/808080)が参考になります．
```css
header {
    background: #808080;
}

.header_title{
    background-color: 3d3d3d;
    position: absolute;
    right: 0;
    width: 10%;
    height: 15%;
    color: #FFF;
}
```

### 前面配置
`header`の前面に`header_title`を配置するために，「position: absolute;」+ 「top, left, right, bottom」の絶対値指定で設定します．

```css
header {
    background: #808080;
    padding: 0px;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 15%;
    color: #FFF;
}

.header_title{
    background-color: 3d3d3d;
    position: absolute;
    right: 0;
    width: 10%;
    height: 15%;
    color: #FFF;
}
```

## まとめ
簡単なヘッダーを作成しました．

ここから徐々に作成します．

## 参考サイト
[CSSのnormalize.cssの使い方を現役エンジニアが解説【初心者向け】](https://techacademy.jp/magazine/19732)

[ちゃんと使い分けてる？CSSのpx, em, rem, %, vw単位の違い](https://note.com/takamoso/n/nde1275183086#SI8rQ)

[[CSS/HTML]上下左右中央揃えまとめ。](https://qiita.com/super-mana-chan/items/0d35a0b9ac1bf97593c8)

[16進数の色](https://encycolorpedia.jp/808080)



<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

