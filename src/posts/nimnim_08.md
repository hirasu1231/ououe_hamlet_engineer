---
display: home
title: 'Google Colaboratory+Nimで空フォルダの作成する'
description: Google Colaboratory+Nimで空フォルダの作成します．
date: 2023-3-28
image: https://www.hamlet-engineer.com/image/nim.png
categories: 
  - Nim
tags:
  - Nim
  - Google_Colaboratory
---
Google Colaboratory+Nimで空フォルダを作成します．

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

## 空フォルダの作成
ここでは、「空フォルダの作成」のサンプルコードを書き、プログラムを実行します。

本章では、山手線の駅名の空フォルダを作成します。

[nim-lang OS](https://nim-lang.org/docs/os.html#createDir,string)

### ライブラリ
下記のコードでライブラリをインポートします。

```python
# Google Colabでnimを使用するためのおまじない
%%nimc
import os
```

### リスト作成
山手線の駅名の空フォルダを作るために，山手線の駅名のリストを作成します。

```python
# Python
# station_list = ['大崎', '五反田', '目黒', '恵比寿', '渋谷', '原宿', '代々木', '新宿', 
#                 '新大久保', '高田馬場', '目白', '池袋', '大塚', '巣鴨', '駒込', 
#                 '田端', '西日暮里', '日暮里', '鶯谷', '上野', '御徒町', '秋葉原', '神田', 
#                 '東京', '有楽町', '新橋', '浜松町', '田町', '高輪ゲートウェイ', '品川']
# print(station_list)
# # ['大崎', '五反田', '目黒', '恵比寿', ・・・・, '田町', '高輪ゲートウェイ', '品川']

# Google Colabでnimを使用するためのおまじない
%%nimc
var station_list = @ ["大崎", "五反田", "目黒", "恵比寿", "渋谷", "原宿", "代々木", "新宿", 
                      "新大久保", "高田馬場", "目白", "池袋", "大塚", "巣鴨", "駒込", 
                      "田端", "西日暮里", "日暮里", "鶯谷", "上野", "御徒町", "秋葉原", "神田", 
                      "東京", "有楽町", "新橋", "浜松町", "田町", "高輪ゲートウェイ", "品川"]


echo station_list
# @['大崎', '五反田', '目黒', '恵比寿', ・・・・, '田町', '高輪ゲートウェイ', '品川']
```

### for文
山手線の駅名のリストで繰り返し作業ができるfor文を下記に示します。

```python
# # Python
# station_list = ['大崎', '五反田', '目黒', '恵比寿', '渋谷', '原宿', '代々木', '新宿', 
#                 '新大久保', '高田馬場', '目白', '池袋', '大塚', '巣鴨', '駒込', 
#                 '田端', '西日暮里', '日暮里', '鶯谷', '上野', '御徒町', '秋葉原', '神田', 
#                 '東京', '有楽町', '新橋', '浜松町', '田町', '高輪ゲートウェイ', '品川']

# for station_name in station_list:
#     print(station_name)

# Google Colabでnimを使用するためのおまじない
%%nimc
var station_list = @ ["大崎", "五反田", "目黒", "恵比寿", "渋谷", "原宿", "代々木", "新宿", 
                      "新大久保", "高田馬場", "目白", "池袋", "大塚", "巣鴨", "駒込", 
                      "田端", "西日暮里", "日暮里", "鶯谷", "上野", "御徒町", "秋葉原", "神田", 
                      "東京", "有楽町", "新橋", "浜松町", "田町", "高輪ゲートウェイ", "品川"]


for x in 0..station_list.len-25:
    echo station_list[x]

echo "========"

for station_name in station_list:
    echo station_name

# 出力結果
# 大崎
# 五反田
# 目黒
# 恵比寿
# 渋谷
# 原宿
# ========
# 大崎
# 五反田
# 目黒
# 恵比寿
# 渋谷
# 原宿
# 代々木
# 新宿
# (省略)
# 品川
```

### 条件
次に、「作成したいフォルダがない場合」を条件とし、空フォルダの作成を実行します。

また、ここでのフォルダ名は「2桁数字_駅名」としています。
この作り方のほうが、順番の入れ替えが楽だからです。

フォルダの操作等の処理については、下記の通りです。
- フォルダがあるか否：「existsDir(フォルダ名)」
- 空フォルダを作成：「createdir(フォルダ名)」
- 2桁数字(2桁のゼロ埋め)：fmt"{n:02}"

#### フォルダ名の編集
```python
# # Python
# idx = 1
# station_name = '大崎'
# folder_name = './make_folder/' + str(idx).zfill(2) + '_' + station_name
# print(folder_name)

# Google Colabでnimを使用するためのおまじない
%%nimc
import strformat

var station_list = @ ["大崎"]
var idx = 0
var folder_name = "./make_folder/" & fmt"{idx+1:02}" & "_" & station_list[0]
echo folder_name
```

#### フォルダの作成(1階層)
```python
# # Python
# import os

# station_list = ["大崎"]
# idx = 0
# folder_name = str(idx+1).zfill(2) + '_' + station_list[idx]
# if not os.path.exists(folder_name):
#     os.mkdir(folder_name)
#     print("make folder : " + folder_name)
    
# Google Colabでnimを使用するためのおまじない
%%nimc
import os
import strformat

var station_list = @ ["大崎"]
var idx = 0
var folder_name = fmt"{idx+1:02}" & "_" & station_list[0]

# ディレクトリがなければ作成
if not existsDir(folder_name):
  createDir(folder_name)
  echo folder_name

# 作成ディレクトリ：01_大崎
```

#### フォルダの作成(2階層)
Nimでは，存在しないディレクトリの直下を指定しても，ディレクトリが作成される．
```python
# # Python
# import os

# station_list = ["大崎"]
# idx = 0
# folder_name = './make_folder/' + str(idx+1).zfill(2) + '_' + station_list[idx]
# # ディレクトリの作成
# os.makedirs(folder_name, exist_ok=True)

# !ls ./make_folder/
# # 出力結果：01_大崎

# Google Colabでnimを使用するためのおまじない
%%nimc
import os
import strformat

var station_list = @ ["大崎"]
var idx = 0
var folder_name = "./make_folder/" & fmt"{idx+1:02}" & "_" & station_list[0]

# ディレクトリがなければ作成
if not existsDir(folder_name):
  createDir(folder_name)
  echo folder_name

# 作成ディレクトリ：./make_folder/01_大崎
```

### 全体コード
これまでの処理を1つに整理すると、下記の通りとなる。

下記のコードを実行すると、30個の空フォルダが一瞬で作成できます。

```python
# # Python
# # 空ファイルの作成
# import os

# station_list = ['大崎', '五反田', '目黒', '恵比寿', '渋谷', '原宿', '代々木', '新宿', 
#                 '新大久保', '高田馬場', '目白', '池袋', '大塚', '巣鴨', '駒込', 
#                 '田端', '西日暮里', '日暮里', '鶯谷', '上野', '御徒町', '秋葉原', '神田', 
#                 '東京', '有楽町', '新橋', '浜松町', '田町', '高輪ゲートウェイ', '品川']

# idx = 0
# for station_name in station_list:
#   idx += 1
#   folder_name = './make_folder/' + str(idx).zfill(2) + '_' + station_name
#   if not os.path.exists(folder_name):
#             os.mkdir(folder_name)
#             print("make folder : " + folder_name)
# # # 実行結果
# # make folder : 01_大崎
# # (省略)
# # make folder : 30_品川

# Google Colabでnimを使用するためのおまじない
%%nimc
import os
import strformat
var station_list = @ ["大崎", "五反田", "目黒", "恵比寿", "渋谷", "原宿", "代々木", "新宿", 
                      "新大久保", "高田馬場", "目白", "池袋", "大塚", "巣鴨", "駒込", 
                      "田端", "西日暮里", "日暮里", "鶯谷", "上野", "御徒町", "秋葉原", "神田", 
                      "東京", "有楽町", "新橋", "浜松町", "田町", "高輪ゲートウェイ", "品川"]

var idx = 0
for station_name in station_list:
    idx += 1; #
    var folder_name = "./make_folder/" & fmt"{idx:02}" & "_" & station_name

    # ディレクトリがなければ作成
    if not existsDir(folder_name):
        createDir(folder_name)
        echo "make folder : " & folder_name

# 実行結果
# make folder : 01_大崎
# (省略)
# make folder : 30_品川
```

```python
!ls ./make_folder/

# '''
# 01_大崎    08_新宿	15_駒込      22_秋葉原	29_高輪ゲートウェイ
# 02_五反田  09_新大久保	16_田端      23_神田	30_品川
# 03_目黒    10_高田馬場	17_西日暮里  24_東京	sample_data
# 04_恵比寿  11_目白	18_日暮里    25_有楽町
# 05_渋谷    12_池袋	19_鶯谷      26_新橋
# 06_原宿    13_大塚	20_上野      27_浜松町
# 07_代々木  14_巣鴨	21_御徒町    28_田町
# '''
```


## まとめ
Google Colaboratory+Nimで空フォルダを作成しました．


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

