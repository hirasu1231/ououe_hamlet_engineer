---
display: home
title: 'Google Colaboratory+Nimで基本文法について勉強する(ライブラリ)'
description: Google Colaboratory+Nimで基本文法(ライブラリ)について勉強します．
date: 2023-3-27
image: https://www.hamlet-engineer.com/image/nim.png
categories: 
  - Nim
tags:
  - Nim
  - Google_Colaboratory
---
Google Colaboratory+Nimで基本文法(ライブラリ)について勉強します．

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

## Nimのライブラリ

### ライブラリとは？
ライブラリは、ある程度整理された処理を他のプログラムから読み込むことで、使うことが出来るようにしたファイルです。
Nimでは、Pythonと同じようにこのライブラリをインポートしてコードを書いていきます。

ライブラリは基本的に「import ライブラリ名」で使用できます。

### nimpy
nimのコードをPythonで使えるようにする．

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
    var text = "Hello World\n" & str1 # &は文字列連結演算子
    result = text

# 返り値:return
proc HelloWorld2(str1: string): string =
    var text = "Hello World\n" & str1 # &は文字列連結演算子
    return text

# 返り値:関数名
proc HelloWorld3(str1: string): string =
    var text = "Hello World\n" & str1 # &は文字列連結演算子
    text

echo HelloWorld("mass")
echo HelloWorld2("mass")
echo HelloWorld3("mass")
```

#### nimpy
```python
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

**nimpyの実行**
```python
# 作成・コンパイルしたsampleファイルをインポート
import time
import sample as sm # Nimでコンパイル

# 開始時間
start = time.time()
# *nimpyの実行
print(sm.HelloWorld('mass'))
print(sm.HelloWorld2('mass'))
print(sm.HelloWorld3('mass'))
# 終了時間
elapsed_time = time.time() - start
# 実行時間
print ("elapsed_time:{0}".format(elapsed_time) + "[sec]")

# 出力結果
# Hello World
# mass
# Hello World
# mass
# Hello World
# mass
# elapsed_time:0.0008447170257568359[sec]
```

### sugar
sugarは、Nimの標準モジュールの1つです。

macroを使い、複雑なものを簡潔に書けるようにしています．

ここでは，リストの処理を実装している．

#### python

```python
nineNum = [1, 2, 3, 4, 5, 6, 7, 8, 9]

oddNum = []
for i in nineNum:
    if i % 2 == 1:
        oddNum.append(i)
print(oddNum)
```

#### nim
```python
# Google Colabでnimを使用するためのおまじない
%%nimc
import sugar
var nineNum = @[1, 2, 3, 4, 5, 6, 7, 8, 9]
var oddNum = collect(newSeq):
  for i in nineNum:
    if i mod 2 == 1: i

echo oddNum

# 実行結果
# @[1, 3, 5, 7, 9]
```

### strformat
文字列の扱いをしやすくするライブラリ

#### python
```python
a = 1
b = 2
print(f"a+b = {a + b}")
print(f"a-b = {a - b}")
print(f"a*b = {a * b}")
print(f"a/b = {a / b}")
print(f"a%b = {a % b}")
```

#### nim
```python
# Google Colabでnimを使用するためのおまじない
%%nimc
import strformat

var a = 1
var b = 2
echo fmt"a+b = {a + b}" #pythonのf-strings 要 strformat
echo fmt"a-b = {a - b}"
echo fmt"a*b = {a * b}"
echo fmt"a/b = {a / b}"
echo fmt"a%b = {a mod b}" # %ではなくmod, 結構罠

# 実行結果
# a+b = 3
# a-b = -1
# a*b = 2
# a/b = 0.5
# a%b = 1
```

#### nimpy
```python
# セル内のをsample.nimとして書き出し
%%writefile nimodule.nim
import nimpy, strformat

proc echoAxB(a, b: int): int {.exportpy.} =
  echo fmt"a+b = {a + b}" #pythonのf-strings 要 strformat
  echo fmt"a-b = {a - b}"
  echo fmt"a*b = {a * b}"
  echo fmt"a/b = {a / b}"
  echo fmt"a%b = {a mod b}" # %ではなくmod, 結構罠
  result = 1 # result は特別な変数で，この値が暗黙的にreturnされます．  
```

```python
# 関数をコンパイル
%nim c --tlsEmulation:off --app:lib --out:nimodule.so nimodule.nim
# output sample.so
!ls
```

```python
import nimodule

a = nimodule.echoAxB(3,2)
print(a)
# 1
```

## まとめ
Google Colaboratory+Nimで基本文法(ライブラリ)について勉強しました．


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

