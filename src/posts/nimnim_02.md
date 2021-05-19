---
display: home
title: 'Google ColaboratoryでNotebook風にNimを実行する'
description: Google ColaboratoryでNimが扱えるそうなので，慣れるために適当な関数を作って慣れてみようと思います．今回は，Notebook風に実行します．
date: 2021-05-17
image: https://www.hamlet-engineer.com/image/nim.png
categories: 
  - Nim
tags:
  - Nim
  - Google_Colaboratory
---
Google ColaboratoryでNimが扱えるそうなので，慣れるために適当な関数を作って慣れてみようと思います．今回は，Notebook風に実行します．
<!-- more -->

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

[[toc]]

## Google Colabのファイル構成
プロジェクトディレクトリはfirst_nimとしています．度々，省略しています．
```
first_nim
├── Nim4Colab_first_ipython.ipynb
└── (省略)
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
%cd /content/drive/My\ Drive/Nimnim/first_nim
!ls
```

## nim4colabのインストール
Google Colab で nimコマンドを使用するためのライブラリであるnim4colabをインストールします．

```python
!pip install git+https://github.com/demotomohiro/nim4colab.git
%load_ext nim4colab
```

## Notebook風にnimを実行
Google Colabでnimを使用するためのおまじないとして「%%nimc」を記述すると，nimのコードを実行できるようになります．

```python
# Google Colabでnimを使用するためのおまじない
%%nimc
echo "Hello World!"
echo "Nim version is ", NimVersion
```

前回，記述したnimのコードを改めてNotebook風に実行します．

```python
# Google Colabでnimを使用するためのおまじない
%%nimc
proc reverse(s: string): string =
  result = "" # 暗黙的なresult変数
  echo high(s)
  for i in countdown(high(s), 0):
    echo i
    result.add s[i]

proc not_reverse(s: string): string =
  result = "" # 暗黙的なresult変数
  echo high(s)
  for i in countup(0, high(s)):
    echo i
    result.add s[i]

var str1 = "Reverse This!"
echo "Reversed: ", reverse(str1)
echo "------------------------------"
echo "Not Reversed: ", not_reverse(str1)
```

## まとめ
学習しやすいようにNotebook風に実行しました．

次はPythonと連携できるようなので，Pythonの連携と速度比較をしてみたいです．

## 参考サイト
[Nimの特徴や使い方をわかりやすく解説！](https://agency-star.co.jp/column/nim/)

[Nim初心者が始めるNimとnimpy](https://qiita.com/k4saNova/items/5bb67d1cb40ba90431af)

[Speeding up Python code with Nim](https://medium.com/statch/speeding-up-python-code-with-nim-ec205a8a5d9c)

[Nimを組み込んでPythonを高速化してみた](https://zenn.dev/megane_otoko/articles/029_nim_for_python)

[至高の言語、Nimを始めるエンジニアへ](https://qiita.com/rigani/items/6e87c7cee6903ed65ed2)

[Nim Compiler User Guide](https://nim-lang.org/docs/nimc.html)

[スレッドローカルストレージ](https://cpprefjp.github.io/lang/cpp11/thread_local_storage.html)
