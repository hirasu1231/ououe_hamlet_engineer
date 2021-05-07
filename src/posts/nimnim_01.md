---
display: home
title: 'Google ColaboratoryでNimを実行する'
description: Google ColaboratoryでNimが扱えるそうなので，慣れるために適当な関数を作って慣れてみようと思います．
date: 2021-05-07
image: https://www.hamlet-engineer.com/image/nim.png
categories: 
  - Nim
tags:
  - Nim
  - Google_Colaboratory
---
Google ColaboratoryでNimが扱えるそうなので，慣れるために適当な関数を作って慣れてみようと思います．
<!-- more -->

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

## Google Colabのファイル構成
プロジェクトディレクトリはfirst_nimとしています．度々，省略しています．
```
first_nim
├── Nim4Colab_first.ipynb
├── reverse.nim 
└── reverse
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

## nimのコードを作成
文字列を返すコードをお試しで作成します．

このコードで現時点で解読できていることを以下に示します．
- %%writefile ＊＊＊.nimで出力するファイル名を指定します．
- 「proc reverse(s: string): string」は，Pythonでいう「def reverse(s)」のようです．
- 「echo "Reversed: ", reverse(str1)」は，Pythonでいう「print("Reversed: ", reverse(str1))」のようです．
- 「high(s)」は，Pythonでいう「len(s)」のようです．
- 「for i in countdown(12, 0)」は「12, 11, 10,・・1, 0」と出力される．
- 「for i in countup(0, 12)」は「0, 1, 2,・・11, 12」と出力される．Pythonでは「for i in range(0, 12)」となる．
- 「result = ""」 で「result.add "a" 」は，5回実行されると「result = "aaaaa"」となる．Pythonでは「result =+ "a"」となる．

```nim
# セル内のreverse関数をreverse.minとして書き出し
%%writefile reverse.nim
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

## nimのコードの実行
作成したnimファイルは「nim complie –run reverse.nim」or 「nim c -r reverse.nim」で実行できます．

-d:release を追記すると，デバック情報が書き込まれないので軽くなるようです．

```python
%nim c -r reverse.nim
# %nim c -d:release reverse.nim
```

出力は以下のようになる．
```
Hint: used config file '/root/nim-stable/nim/config/nim.cfg' [Conf]
Hint: used config file '/root/nim-stable/nim/config/config.nims' [Conf]
....CC: reverse.nim

Hint:  [Link]
Hint: 22434 lines; 0.394s; 25.59MiB peakmem; Debug build; proj: /content/drive/My Drive/Nimnim/first_nim/reverse.nim; out: /content/drive/My Drive/Nimnim/first_nim/reverse [SuccessX]
Hint: '/content/drive/My Drive/Nimnim/first_nim/reverse'  [Exec]
12
12
11
10
9
8
7
6
5
4
3
2
1
0
Reversed: !sihT esreveR
------------------------------
12
0
1
2
3
4
5
6
7
8
9
10
11
12
Not Reversed: Reverse This!
```

## まとめ
Nimに慣れるために適当な関数を作成してみました．

次は，学習しやすいようにNotebook風に実行できるようにします．

## 参考サイト
[Nimの特徴や使い方をわかりやすく解説！](https://agency-star.co.jp/column/nim/)

[Nim初心者が始めるNimとnimpy](https://qiita.com/k4saNova/items/5bb67d1cb40ba90431af)

[Speeding up Python code with Nim](https://medium.com/statch/speeding-up-python-code-with-nim-ec205a8a5d9c)

[Nimを組み込んでPythonを高速化してみた](https://zenn.dev/megane_otoko/articles/029_nim_for_python)

[至高の言語、Nimを始めるエンジニアへ](https://qiita.com/rigani/items/6e87c7cee6903ed65ed2)

[Nim Compiler User Guide](https://nim-lang.org/docs/nimc.html)

[スレッドローカルストレージ](https://cpprefjp.github.io/lang/cpp11/thread_local_storage.html)
