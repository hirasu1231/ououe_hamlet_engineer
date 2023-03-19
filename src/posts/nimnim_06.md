---
display: home
title: 'Google Colaboratory+Nimで基本文法について勉強する(リスト, for文m, If文)'
description: Google Colaboratory+Nimで基本文法(リスト, for文m, If文)について勉強します．
date: 2023-3-27
image: https://www.hamlet-engineer.com/image/nim.png
categories: 
  - Nim
tags:
  - Nim
  - Google_Colaboratory
---
Google Colaboratory+Nimで基本文法(リスト, for文m, If文)について勉強します．

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

### リスト型
リスト型は、Pythonでは頻繁に使用され、かなり大事な型になりますので，Nimでも練習します。

変数は1つ数値・文字列しか格納できませんが、リスト型は複数の数値・文字列を格納できます。

Pythonでは、複数のデータを管理したい場合に使います。
listは 配列名 = ["a","b","c"] という形式で使用できます。

ただし、リストの中身は左から数え始め、最初は1ではなく、0から数えます。

このリストの順番のことをインデックスと呼びます。

text_list[0]など、リストのインデックスを指定することで、リスト内の数値・文字列を出力できます。

#### python

```python
text_list =  ["a", "b", "c", "d", "e", "f"] 
print(text_list)
print(text_list[0])
print(text_list[5])

# 実行結果
# ['a', 'b', 'c', 'd', 'e', 'f']
# a
# f
```


#### nim

```python
# Google Colabでnimを使用するためのおまじない
%%nimc
import sugar

var ary = @["a", "b", "c", "d", "e", "f"] 
echo ary, ary.len
echo ary[0]
echo ary[5]
echo ary[ary.len-1]

var results = @[ary[0], ary[2]]
echo results

# 実行結果
# @["a", "b", "c", "d", "e", "f"]6
# a
# f
# f
# @["a", "c"]
```


### for
for文は、リストに格納されている数値・文字列を順番に処理していくことです。

下記のコードでは、「text_list」を左から、「text」という変数にいれて、print(text)で出力するという繰り返し作業をしてます。

for文は、さまざまな書き方があるので、コードを書く時や他人のコード見た時に逐次検索していくことをお勧めします。

全て、把握しようとしたら、キリがないです。

#### python

```python
text_list =  ["a", "b", "c", "d", "e", "f"] 

for text in text_list:
    print(text)

# 実行結果
# a
# b
# c
# d
# e
# f
```

#### nim

```python
# Google Colabでnimを使用するためのおまじない
%%nimc
import sugar

# for x in 0..6:
#     echo x

var ary = @["a", "b", "c", "d", "e", "f"] 
echo ary, ary.len



for x in 0..6:
    echo x

# text_list =  ["a", "b", "c", "d", "e", "f"] 

# for i in range(6):
#     print(text_list[i])

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
# 実行結果
# 42
# 63
# 21
# 84
# 2.0
# 42 + 21
```

＼

#### 閑話休題：fou文(range)

本記事のサンプルコードでは使いませんが、for文ではrange()関数を用いることで、特定の回数分の繰り返し作業することもあります。

**Python**
```python
# range(6): 0から5までの連番のリストを返す
# range(2,6): 2から5までの連番のリストを返す

text_list =  ["a", "b", "c", "d", "e", "f"] 

for i in range(6):
    print(text_list[i])

# 実行結果
# a
# b
# c
# d
# e
# f
```

**Nim**
```python
%%nimc
var a = 0
var b = 0
for i in 0..3:
    a += 1 
    echo a
    b += 2
    echo b

# 実行結果
# 1
# 2
# 2
# 4
# 3
# 6
```

#### 閑話休題：fou文(逐次計算)
また、for文では、特定の数値を繰り返しで足し算したい場合は，下記のような特殊な書き方をします。

**Python**
```python
a = 0
b = 0
for i in range(3):
    a += 1 
    print(a)
    b += 2
    print(b)

# 実行結果
# 1
# 2
# 2
# 4
# 3
# 6
```

**Nim**
```python
%%nimc
var a = 0
var b = 0
for i in 0..3:
    a += 1 
    echo a
    b += 2
    echo b

# 実行結果
# 1
# 2
# 2
# 4
# 3
# 6
```

### if文
Pythonでは、ある条件に当てはまるかどうかによって、違う処理をしたい場合がありますので，Nimでも練習します。

その時は、if文を用いることで、条件によって処理を分岐させることができます。

「if 条件文」という書き方が基本で、条件文がTrueになれば、実行されます。

下記では、「iが5以下か否か」で処理を分岐させています。

また、否定文でif文を作りたい場合は、「if not 条件文」とします。

一応、条件文の動きも出力します。

#### python

```python
for i in range(10):
    # 5以下
    if i <= 5:
        print(i <= 5)
        print("5以下：", i)

for i in range(10):
    # 5以下
    if not i <= 5:
        print(i <= 5)
        print("5以上：", i)

# 実行結果
# True
# 5以下： 0
# True
# 5以下： 1
# True
# 5以下： 2
# True
# 5以下： 3
# True
# 5以下： 4
# True
# 5以下： 5
# False
# 5以上： 6
# False
# 5以上： 7
# False
# 5以上： 8
# False
# 5以上： 9
```

また、複数の条件分岐を記載する場合は、「elif」と「else」を使います。

「elif」は前述のif条件以外の条件を作成できます。

「elif」は前述のif条件・elif条件に当てはまらない時の処理を実行します。

下記では、「iが5未満の時」・「iが5以上・8以下」・「それ以外」で処理を分岐させています。

```python
for i in range(10):
    # 5以下
    if i <  5:
        print("5未満：", i)
    elif i <= 8: 
        print("8以下：", i)
    else:
        print("それ以外：", i)
        
# 実行結果
# 5未満： 0
# 5未満： 1
# 5未満： 2
# 5未満： 3
# 5未満： 4
# 8以下： 5
# 8以下： 6
# 8以下： 7
# 8以下： 8
# それ以外： 9
```

#### nim

```python

```

#### nim(関数定義)

```python
# Google Colabでnimを使用するためのおまじない
%%nimc
import sugar

for i in 0..10:
    if i <= 5:
        echo "5以下：", i

for i in 0..10:
    if not i <= 5:
        echo "5以上：", i

# 実行結果
# True
# 5以下： 0
# True
# 5以下： 1
# True
# 5以下： 2
# True
# 5以下： 3
# True
# 5以下： 4
# True
# 5以下： 5
# False
# 5以上： 6
# False
# 5以上： 7
# False
# 5以上： 8
# False
# 5以上： 9
```

```python
# Google Colabでnimを使用するためのおまじない
%%nimc
for i in 0..10:
    # 5以下
    if i <  5:
        echo "5未満：", i
    elif i <= 8: 
        echo "8以下：", i
    else:
        echo "それ以外：", i
```


## まとめ
Google Colaboratory+Nimで基本文法(リスト, for文m, If文)について勉強しました．


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

