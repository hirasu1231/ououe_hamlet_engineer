---
display: home
title: 'macでracketを構築する'
description: macでracketを構築する
date: 2023-2-13
image: https://www.hamlet-engineer.com/image/racket.png
categories: 
  - LISP
tags:
  - LISP
  - racket
  - scheme
---
macでracketを構築する

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## scheme(racket)のインストール

```
brew cask install racket
```

## 動作確認
```
racket -v
```

## 簡単なコードを実行

```racket
#lang racket
;; Print the Greek alphabet
(
 for ([i (in-range 26)])
  (display
   (integer->char
    (
     + i (char->integer #\a)
    )
   )
  )
)
```

## ファイルを指定して実行
上記のコードをtest.rktで保存する
```
$ racket test.rkt
abcdefghijklmnopqrstuvwxyz
```

## ライブラリのインポート

```scheme
(require ***)
```

## グラフの作成
sin(x)のグラフを作成する

```racket
#lang racket
;; y = sin(x)
(require plot)
(plot (function sin (- pi) pi #:label "y = sin(x)"))
```

![](/image/racket_2D.png)

３Dグラフを作成する

```racket
#lang racket
;; y = sin(x) plot
(require plot)
(plot3d (surface3d (λ (x y) (* (cos x) (sin y)))
                     (- pi) pi (- pi) pi)
          #:title "An R × R → R function"
          #:x-label "x" #:y-label "y" #:z-label "cos(x) sin(y)")
```

![](/image/racket_3D.png)

## まとめ
macでracketを構築しました．

## 参考サイト
[macでscheme(racket)コンパイル環境を構築する](https://qiita.com/shivase/items/ce9c9335d61f2b7e2e23)

[scheme(racket)でグラフ作成](https://docs.racket-lang.org/plot/intro.html)



<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">