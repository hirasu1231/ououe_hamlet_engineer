---
display: home
title: 'Google Colaboratoryとフィボナッチ数列でPythonとNimを比較する'
description: PythonとNimが連携できるようなので，Google Colaboratoryで実装しようと思います．本稿では，フィボナッチ数列でPythonとNimの比較します．
date: 2021-05-26
image: https://www.hamlet-engineer.com/image/nim.png
categories: 
  - Nim
tags:
  - Nim
  - Google_Colaboratory
---
PythonとNimが連携できるようなので，Google Colaboratoryで実装しようと思います．

本稿では，フィボナッチ数列でPythonとNimの比較します．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

[[toc]]

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


## Google Colabのファイル構成
プロジェクトディレクトリはNim_fibとしています．度々，省略しています．
```
Nim_fib
├── Nim4Colab_sample_fib.ipynb
├── fib.nim 
└── fib.so
```


## Google Driveと連携
Google ColabとGoogle Driveを連携させ，作業ディレクトリ(ここではfirst_nim)に移動します．<br>

```python
# Google ColabとGoogle Driveを連携
from google.colab import drive
drive.mount('/content/drive')
```

```python
# ディレクトリの移動
%cd /content/drive/My\ Drive/Nimnim/Nim_fib
!ls
```

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

## Pythonのみでフィボナッチ数を出力する関数を実行
以下のコードでは，45番目のフィボナッチ数を出力させてみます．

```python
import time

def fib(n):
    if n == 0:
        return 0 
    elif n <3:
        return 1 
    return fib(n-1) + fib(n-2)

# 開始時間
start = time.time()
# フィボナッチ数を実行
print(fib(45))
# 終了時間
elapsed_time = time.time() - start
# 実行時間
print ("elapsed_time:{0}".format(elapsed_time) + "[sec]")

# 出力結果
# 1134903170
# elapsed_time:360[sec]
```

## Python + Nim でフィボナッチ数を出力する関数を実行
%%writefile ファイル名.nim とすることでマジックコマンドのあるセル内のコードを.nim ファイルとして書き出すことができます．

特徴として，proc を使った関数の宣言，引数の型指定，Pythonモジュールで使用することをNimに支持するための{.exportpy.}があります．

[Speeding up Python code with Nim](https://medium.com/statch/speeding-up-python-code-with-nim-ec205a8a5d9c)

```python
# セル内のfib関数をfib.minとして書き出し
%%writefile fib.nim
import nimpy

proc fib(n: int): int {.exportpy.} =
    if n == 0:
        return 0
    elif n < 3:
        return 1
    return fib(n-1) + fib(n-2)
# Writing fib.nim
```

## Python + Nim でフィボナッチ数を出力する関数をコンパイル
書き出したfib.min をコンパイルします。

> --tlsEmulation:off・・・スレッドローカルストレージエミュレーションをオン|オフにする<br>
--app:lib・・・コンソールアプリ| GUIアプリ| DLL |静的ライブラリを生成する<br>
スレッドローカルストレージ：変数宣言の際に，記憶域としてthread_localキーワードを指定することで、スレッドごとの静的記憶域に変数が保持される．<br>

[Nim Compiler User Guide](https://nim-lang.org/docs/nimc.html)

[スレッドローカルストレージ](https://cpprefjp.github.io/lang/cpp11/thread_local_storage.html)

```python
%nim c --tlsEmulation:off --app:lib --out:fib.so fib.nim
# output fib.so
```

## Python + Nim でフィボナッチ数を出力する関数を実行
コンパイルしたfib.min を実行します．

```python
import sys
import time

# ライブラリのインポート先を追加
sys.path.append("./")

# 作成・コンパイルしたfibファイルをインポート
import fib

# 開始時間
start = time.time()
# フィボナッチ数を実行
print(fib.fib(45))
# 終了時間
elapsed_time = time.time() - start
# 実行時間
print ("elapsed_time:{0}".format(elapsed_time) + "[sec]")

# 出力結果
# 1134903170
# elapsed_time:36[sec]
```

## まとめ
重い処理をNimで実行することで，処理スピードが約10倍になりました．

|    |  Pythonのみ  | Python+Nim  |
| :----: | ----: | ----: |
|  処理時間  |  約360秒  |  約36秒  |

「GPUなしの低スペックの環境で高速化を目指す」という縛りプレイをするのも面白そうです．


## 参考サイト
[Nimの特徴や使い方をわかりやすく解説！](https://agency-star.co.jp/column/nim/)

[Nim初心者が始めるNimとnimpy](https://qiita.com/k4saNova/items/5bb67d1cb40ba90431af)

[Speeding up Python code with Nim](https://medium.com/statch/speeding-up-python-code-with-nim-ec205a8a5d9c)

[Nimを組み込んでPythonを高速化してみた](https://zenn.dev/megane_otoko/articles/029_nim_for_python)

[至高の言語、Nimを始めるエンジニアへ](https://qiita.com/rigani/items/6e87c7cee6903ed65ed2)

[Nim Compiler User Guide](https://nim-lang.org/docs/nimc.html)

[スレッドローカルストレージ](https://cpprefjp.github.io/lang/cpp11/thread_local_storage.html)

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

