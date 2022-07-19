---
display: home
title: 'Google Colaboratory+Nimで基本文法について勉強する(文字列と数値)'
description: Google Colaboratory+Nimで基本文法について勉強します．
date: 2022-07-26
image: https://www.hamlet-engineer.com/image/nim.png
categories: 
  - Nim
tags:
  - Nim
  - GoogleColaboratory
---
Google Colaboratory+Nimで基本文法(文字列と数値)について勉強します．

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

## Nimの基本文法
ここでは、「空ファイルの作成」に必要なNimの基本構文を記載します。

### 文字列
文字列とは「"」で囲まれた文字です。

文字列とは「"」で囲まれた文字です。
文字列は「"」で囲んでいないと、コードが動かなくなります。

#### nim

```python
# Google Colabでnimを使用するためのおまじない
%%nimc
# echo 'Hello, World'
echo "Hello, World"
echo "Hello, World"&"Hello, World" # &は文字列連結演算子
echo "Hello, World \nHello, World"

# echo '''Hello, World, Hello, World'''

# 実行結果
# Hello, World
# Hello, World
# Hello, World
```

#### nim(関数定義)

```python
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

# 実行結果
# Hello World
# Hello Worldmass
# Hello World
# mass
```

#### 閑話休題:数値から文字列へ

```python
%%nimc
var i = 5
var a = $i # 文字列へ変換
echo "5以下："&a # 文字列の結合
# echo "5以下："&$i # エラー発生
echo "5以下：" & $i # OK
echo "5以下："&($i) # OK
```

#### nimpy
```
proc HelloWorld(入力変数: 入力の型): 出力の型 {.exportpy.} =
```

| 入力値 | Nimの型名 |
| - | - |
| 　なし | void |
| 文字列 | string |
| 整数　| int |
| リスト　| seq[string] |


```python
# セル内のをsample.nimとして書き出し
%%writefile sample.nim
import nimpy

# proc 定義
# 返り値:result
proc HelloWorld(str1: string): string {.exportpy.} =
    var text = "Hello World\n" & str1 # &は文字列連結演算子
    result = text

# 返り値:return
proc HelloWorld2(str1: string): string {.exportpy.} =
    var text = "Hello World\n" & str1 # &は文字列連結演算子
    return text

# 返り値:関数名
proc HelloWorld3(str1: string): string {.exportpy.} =
    var text = "Hello World\n" & str1 # &は文字列連結演算子
    text

# Writing sample.nim
```

**コンパイル**
```python
# 関数をコンパイル
%nim c --tlsEmulation:off --app:lib --out:sample.so sample.nim
# output sample.so
!ls
```

**nimpy実行**
```python
# 作成・コンパイルしたsampleファイルをインポート
import time
import sample as sm # Nimでコンパイル

# 開始時間
start = time.time()
# nimpyを実行
print(sm.HelloWorld('mass'))
print(sm.HelloWorld2('mass'))
print(sm.HelloWorld3('mass'))
# 終了時間
elapsed_time = time.time() - start
# 実行時間
print ("elapsed_time:{0}".format(elapsed_time) + "[sec]")

# 出力結果
# 1134903170
# elapsed_time:36[sec]
```

### 数値
「"」で囲まず数字を打ち込むと、それは「数値」として扱われます。

「+」、「-」等を使うことで四則演算ができるようになります。

Nimでは「×」、「÷」は「*」、「/」で記述します。

ただし、「"」「'」で囲むと、数字は文字列と扱われます。

そして、文字列の数字は四則演算されません。

#### nim
```python
# Google Colabでnimを使用するためのおまじない
%%nimc
echo 42 
echo 42 + 21 # 足し算
echo 42 - 21 # 引き算
echo 42 * 2 # かけ算
echo 42 / 21 # 割り算
echo "42 + 21" # 文字列

# 実行結果
# 42
# 63
# 21
# 84
# 2.0
# 42 + 21
```

#### nim(関数定義)
```python
# Google Colabでnimを使用するためのおまじない
%%nimc
# 返り値:result
proc integer00() =
    echo 42     
    echo 42 + 21 # 足し算
    echo 42 - 21 # 引き算
    echo 42 * 2 # かけ算
    echo 42 / 21 # 割り算
    echo "42 + 21" # 文字列

integer00()
```

#### nimpy


```python
# セル内のをsample.nimとして書き出し
%%writefile sample1.nim
import nimpy

proc HelloWorld00(str1: string): string {.exportpy.} =
    var text = "Hello World\n" & str1 # &は文字列連結演算子
    result = text

proc hello( ): void {.exportpy.} = 
    echo "HELLO NIMPY!!!"

proc integer00(): void {.exportpy.} =
    echo 42     
    echo 42 + 21 # 足し算
    echo 42 - 21 # 引き算
    echo 42 * 2 # かけ算
    echo 42 / 21 # 割り算
    echo "42 + 21" # 文字列

# Writing sample.nim
```

**コンパイル**
```python
# 関数をコンパイル
%nim c --tlsEmulation:off --app:lib --out:sample1.so sample1.nim
# output sample.so
!ls
```

**nimpy実行**
```python
# 作成・コンパイルしたsampleファイルをインポート
import time
import importlib
import sample1 as sm1 # Nimでコンパイル
# importlib.reload(sm1)

# 開始時間
start = time.time()
# 数値を実行
print(sm1.HelloWorld00('mass'))
print(sm1.hello())
print(sm1.integer00())
# 終了時間
elapsed_time = time.time() - start
# 実行時間
print ("elapsed_time:{0}".format(elapsed_time) + "[sec]")

# 出力結果
# Hello World
# mass
# None
# None
# elapsed_time:0.0020661354064941406[sec]
```


## まとめ
Google Colaboratory+Nimで基本文法(文字列と数値)について勉強しました．


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

