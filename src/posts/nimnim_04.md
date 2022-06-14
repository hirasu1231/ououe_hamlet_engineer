---
display: home
title: 'Google Colaboratory+Nimで変数宣言について勉強する'
description: Google Colaboratory+Nimで変数宣言について勉強します．
date: 2022-06-13
image: https://www.hamlet-engineer.com/image/nim.png
categories: 
  - Nim
tags:
  - Nim
  - Google_Colaboratory
---
Google Colaboratory+Nimで変数宣言について勉強します．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

[[toc]]

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">


## nim4colabのインストール
Google Colab で nimコマンドを使用するためのライブラリであるnim4colabをインストールします．

%load_ext nim4colab により%を付けてNimのコマンドを使えます．

```python
!pip install git+https://github.com/demotomohiro/nim4colab.git
%load_ext nim4colab
```

## nimpyのインストール
PythonからNimを呼び出すためのNimのライブラリ、nimpyをインストールします．

[Nim初心者が始めるNimとnimpy](https://qiita.com/k4saNova/items/5bb67d1cb40ba90431af)

nimpyをインストールすることで、後述の fib.nim内で使っているnimpyをコンパイル、ライブラリとして使用することができます．

nimbleはNimのライブラリをインストールするためのコマンドです．

```python
%nimble install nimpy -y
```

## Nimのコメントアウト
プログラミングでは、コード中にコメントを書くことができます。

Nimでは文頭に「#」を書くことで、コメントとして扱われます。

コメント扱いされた文は実行されることはありません。

```Python
# Google Colabでnimを使用するためのおまじない
%%nimc
# この行はコメントです.
# print("コメントです") 

echo "Hello, World"
echo "Not, Comment"

# 実行結果
# Hello, World
# Not, Comment
```

## Nimの変数宣言
Nimでは，Pythonと同様に変数をつける時は、左に変数名・右に数値や文字列を置き、間に「=」を挟みます。変数は大文字と小文字でも区別されます。

変数名が長い時に、Pythonのように「_」で区切るとエラーが発生しますので，区切る箇所を大文字にします。

### 変数宣言
また，Nimでは変数宣言の前に「var, let, const」をつける必要があります．

上記の3つのタグについては，下記の通りです．

- var：書き換え可能な変数の定義はvarで行います
- let：変数を束縛したい場合はletを使用します
- const：constで宣言した値は、コンパイル時に確定します。
letの場合は実行時に確定する変数で、変更ができないという扱いのようです。

[Nim 変数、定数の宣言方法(var, let, const)](https://symfoware.blog.fc2.com/blog-entry-2239.html)

[Nimを知ってほしい2022](https://zenn.dev/dumblepy/articles/b475b3b4f7d0da)

#### nim(var)
```Python
# Google Colabでnimを使用するためのおまじない
%%nimc
# データ型→初期値
var text:string
text = "text"
# データ型と初期値を同時
var Text = "Text"

# 出力
echo text
echo Text

# 変数名が長い時
# 同時に宣言
# varの後で改行は必須
var 
    x, y:int = 1
    helloworldmessage = "Hello, World"
    HelloWorldMessage = "Hello, World"
# varなので書き換え可能
y = 2

# 出力
echo x, helloworldmessage
echo y, HelloWorldMessage
# 実行結果
# text
# Text
# 1Hello, World
# 2Hello, World
```

#### nim(let)
```Python
# Google Colabでnimを使用するためのおまじない
%%nimc
# データ型→初期値
# letでは初期値なしではエラー発生
# let text:string
# text = "text"

# データ型と初期値を同時
let text = "text"
let Text = "Text"

# 出力
echo text
echo Text

# 変数名が長い時
# 同時に宣言
# varの後で改行は必須
let 
    x, y:int = 1
    helloworldmessage = "Hello, World"
    HelloWorldMessage = "Hello, World"

# letなので書き換え不可能
# エラー発生
# y = 2

# 出力
echo x, helloworldmessage
echo y, HelloWorldMessage
# 実行結果
# text
# Text
# 1Hello, World
# 1Hello, World
```

#### nim(const)
```Python
# Google Colabでnimを使用するためのおまじない
%%nimc
# データ型→初期値
# constでも初期値なしではエラー発生
# const text:string
# text = "text"

# データ型と初期値を同時
const text = "text"
const Text = "Text"

# 出力
echo text
echo Text

# 変数名が長い時
# 同時に宣言
# constの後で改行は必須
const 
    # x, y:int = 1 #constではエラー発生
    x = 1
    y:int = 2
    helloworldmessage = "Hello, World"
    HelloWorldMessage = "Hello, World"

# constなので書き換え不可能
# エラー発生
# y = 2

# 出力
echo x, helloworldmessage
echo y, HelloWorldMessage
# 実行結果
# text
# Text
# 1Hello, World
# 2Hello, World
```

### 関数を作成(def → proc)
Nimではprocで関数を作成する．
```Python
# Google Colabでnimを使用するためのおまじない
%%nimc
# 返り値:result
proc integer00() =
    var 
        text = "text"
        Text = "Text"
    echo text
    echo Text

    # 変数名が長い時
    var 
        helloworldmessage  = "Hello, World"
        HelloWorldMessage = "Hello, World"
    echo helloworldmessage
    echo HelloWorldMessage

integer00()
# text
# Text
# Hello, World
# Hello, World
```

また，返り値は下記の3つで設定できる．
- result
- return
- 関数名

```Python
# Google Colabでnimを使用するためのおまじない
%%nimc
# 返り値:result
proc HelloWorld(str1: string): string =
    var text = str1 # &は文字列連結演算子
    result = "Hello World"

# 返り値:return
proc HelloWorld2(str1: string): string =
    var text = "Hello World" & str1 # &は文字列連結演算子
    return text

# 返り値:関数名
proc HelloWorld3(str1: string): string =
    var text = "Hello World\n" & str1 # &は文字列連結演算子
    text

# 初期設定
var echo_str:string

# 返り値:result
echo_str = HelloWorld("mass")
echo echo_str
# 返り値:return
echo_str = HelloWorld2("mass")
echo echo_str
# 返り値:関数名
echo_str = HelloWorld3("mass")
echo echo_str

# Hello World
# Hello Worldmass
# Hello World
# mass
```

## まとめ
Google Colaboratory+Nimで変数宣言について勉強しました．


## 参考サイト
[Nimの特徴や使い方をわかりやすく解説！](https://agency-star.co.jp/column/nim/)

[Nim初心者が始めるNimとnimpy](https://qiita.com/k4saNova/items/5bb67d1cb40ba90431af)

[Speeding up Python code with Nim](https://medium.com/statch/speeding-up-python-code-with-nim-ec205a8a5d9c)

[Nimを組み込んでPythonを高速化してみた](https://zenn.dev/megane_otoko/articles/029_nim_for_python)

[至高の言語、Nimを始めるエンジニアへ](https://qiita.com/rigani/items/6e87c7cee6903ed65ed2)

[Nim Compiler User Guide](https://nim-lang.org/docs/nimc.html)

[スレッドローカルストレージ](https://cpprefjp.github.io/lang/cpp11/thread_local_storage.html)

[Nim 関数](https://2vg.github.io/Nim-World/proc/)

[PythonistaのためのNim入門](https://zenn.dev/dumblepy/articles/3f4f1c288ada66#%E6%AF%94%E8%BC%83)

[nim内包表記](https://qiita.com/6in/items/809f4eb788d00503a825)

[Nimの便利な標準ライブラリ sugar](https://qiita.com/meganeo/items/051fd0aa59d89b3a7049)

[Nim初心者が始めるNimとnimpy](https://qiita.com/k4saNova/items/5bb67d1cb40ba90431af)

[Nimでゼロ埋め](https://qiita.com/mkanenobu/items/0e100625ea7d719c6d96)

[Nim 変数、定数の宣言方法(var, let, const)](https://symfoware.blog.fc2.com/blog-entry-2239.html)

[Nimを知ってほしい2022](https://zenn.dev/dumblepy/articles/b475b3b4f7d0da)

[nim いろいろなコメントの方法](https://symfoware.blog.fc2.com/blog-entry-2236.html)

[【Nim】個人的逆引きリファレンス](https://flat-leon.hatenablog.com/entry/nim_howto)

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

