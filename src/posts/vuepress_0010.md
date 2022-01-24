---
display: home
title: 'Vuepressで数式を記述できるようにする'
description: Vuepressで数式を記述できるようにします．
date: 2022-01-25
image: https://www.hamlet-engineer.com/image/vuepress.png
categories: 
  - Vuepress
tags:
  - Vuepress
  - CSS
---
Vuepressで数式を記述できるようにします．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>


[[toc]]


## ライブラリをインストール
```
yarn add @iktakahiro/markdown-it-katex --dev
```

## .vuepress/config.jsの書き換え
以下のコードを動画を貼りたい場所に記述します．
```js
head: [
      ['link', {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/katex@0.11.0/dist/katex.min.css'
      }]
  ],
  markdown: {
      extendMarkdown: md => {
          md.use(require('@iktakahiro/markdown-it-katex'), {
              throwOnError: false,
              errorColor: "#cc0000",
              macros: {
                  '\\Z': '\\mathbb{Z}',
                  '*': '\\times'
              }
          })
      }
  },
  (省略)
```

## 数式の記述
```md
$$ H_b = 2 - \sum_{j=1}^{m}x_1,_j $$
```

$$ H_b = 2 - \sum_{j=1}^{m}x_1,_j $$

## 数式の記述(改行)
改行は下記のように記述する．
```md
<!-- 改行 -->
<!-- 
\begin{aligned} 
  \\
\end{aligned} 
-->

$$
\begin{aligned} 
  x^2 - (a + b)x + ab = 0 \\
  (x - a) (x - b) = 0 \\
  x = a, b
\end{aligned}
$$
```

$$
\begin{aligned} 
  x^2 - (a + b)x + ab = 0 \\
  (x - a) (x - b) = 0 \\
  x = a, b
\end{aligned}
$$


## 数式の記述(揃える)
揃えるのは下記のように記述する．
```md
<!-- 揃える -->
<!-- 
\begin{aligned} 
  &=
\end{aligned} 
-->

$$
\begin{aligned} 
  x^2 - (a + b)x + ab &= 0 \\
  (x - a) (x - b) &= 0 \\
  x &= a, b
\end{aligned}
$$
```

$$
\begin{aligned} 
  x^2 - (a + b)x + ab &= 0 \\
  (x - a) (x - b) &= 0 \\
  x &= a, b
\end{aligned}
$$

## 数式の記述(空白)
空白は下記のように記述する．
```md
<!-- 空白 -->
<!-- 
\begin{aligned} 
  \quad :1空白
  \qquad :2空白
\end{aligned} 
-->

$$
\begin{aligned} 
  x^2 - (a + b)x + ab &= 0 \\
  (x - a) (x - b) &= 0 \\
  x &= a, \qquad\quad b
\end{aligned}
$$
```

$$
\begin{aligned} 
  x^2 - (a + b)x + ab &= 0 \\
  (x - a) (x - b) &= 0 \\
  x &= a, \qquad\quad b
\end{aligned}
$$

## 参考サイト
[VuePress でのブログ環境の備忘録](https://openjny.github.io/posts/2019/12/28/hello-vuepress/#%E6%95%B0%E5%BC%8F)

[【MathJax-LaTeX】数式の表記方法まとめ](https://ramenhuhu.com/mathjax-equation)

[空白 - 水平方向のスペース - quad, hspace](https://medemanabu.net/latex/horizontal-space/)

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
