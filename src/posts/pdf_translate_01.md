---
display: home
title: 'Pythonで英文のPDFをレイアウトを維持したまま翻訳してみる'
description: Pythonで英文のPDFをレイアウトを維持したままの翻訳を実装します．
date: 2021-09-24
image: https://www.hamlet-engineer.com/image/pdf_tansrate01.png
categories: 
  - Python
tags:
  - Python
  - jupyter
  - machine_translate
---
<!-- https://www.hamlet-engineer.com -->
Pythonで英文のPDFをレイアウトを維持したままの翻訳を実装します．

<!-- more -->

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

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

## Google Colabのファイル構成
プロジェクトディレクトリはpdf_translateとしています．度々，省略しています．
```init
pdf_translate
├── /pdf_translate
│   ├── translate_csv.py <- 翻訳前後をcsv化
│   ├── pdf_translate.sh <- 実行スクリプト
│   ├── AttentionGAN.pdf <- 翻訳前
│   ├── JA_AttentionGAN.pdf <- 翻訳後
│   ├── AttentionGAN.pdf.csv <- 翻訳前後csv
│   ├── AttentionGAN.pdf.json  <- pdf情報のjson
│   └── (省略)
└── pdf_translate.ipynb <- 実行用ノートブック
```

## Google Driveと連携
Google ColabとGoogle Driveを連携させて，gitから[mima3/pdf_translate](https://github.com/mima3/pdf_translate.git)をダウンロードします．<br>

```python
# Google ColabとGoogle Driveを連携
from google.colab import drive
drive.mount('/content/drive')
```

```python
%%bash
# ディレクトリの移動
cd /content/drive/My\ Drive/PDF_transrate
# gitのダウンロード
git clone https://github.com/mima3/pdf_translate.git
ls
```

## モジュールのインストール
下記のコマンドでモジュールをインストールします．

```python
!pip install googletrans==4.0.0-rc1
!pip install fitz
!pip install PyMuPDF==1.16.14
```

## 翻訳実行

### コードの作成
個人的にcsvとして翻訳結果も残したいので，下記のコードを作成します．

```python
# translate_csv.pyの書き込み
%%writefile translate_csv.py

import sys
import time
import random
import pandas as pd
from googletrans import Translator

def main(input_path):
  argvs = sys.argv
  argc = len(argvs)
  if argc != 2:
      print("Usage #python %s [PDFãƒ‘ã‚¹]" % argvs[0])
      exit()
  input_path = argvs[1]
  df = pd.read_csv(input_path, names=('org_text', 'convert_text'))
  
  for i in range(len(df)):
      org_text = df['org_text'][i].replace('.', '. ')
      print(org_text)
      df['convert_text'][i] = Translator().translate(org_text, dest="ja").text
      
  df.to_csv(input_path, header=False, index=False)

if __name__ == '__main__':
  main(sys.argv)
```

### シェルスクリプトファイルの作成
下記のコマンドでシェルスクリプトファイルの作成します．

```python
# pdf_translate.shの書き込み
%%writefile pdf_translate.sh
#!/bin/sh
python ./analyze_pdf_text.py "$1"
python ./translate_csv.py "$1.csv"
python ./embed_annots.py "$1.json" "JA_$1"

# rm "$1.csv" "$1.json"
```

### 翻訳実行
下記のコマンドで翻訳を実行します．

```python
!sh pdf_translate.sh AttentionGAN.pdf
```

![](/image/pdf_tansrate01.png)

## まとめ
Pythonで英文のPDFをレイアウトを維持したままの翻訳を実装しました．

ただし，あまりに大量に翻訳すると，Googleから怒られて1日中翻訳できなくなるので，別のモデルを使ってより多くの翻訳ができるようにします．

※Adobe Acrobat Readerで閲覧してください。ブラウザ経由だと注釈が文字化けします。


## 参考サイト
[mima3/pdf_translate](https://github.com/mima3/pdf_translate)

[PythonでPDFのレイアウトを維持したまま翻訳してみる](https://qiita.com/mima_ita/items/3f698050196d4af3a46d)

[yta-git/pdf_translate](https://github.com/yta-git/pdf_translate)

[【python】googletransの『AttributeError: 'NoneType' object has no attribute 'group'』対策](https://qiita.com/_yushuu/items/83c51e29771530646659)

## エラー集
### エラーコード1
```python
File "./embed_annots.py", line 2, in <module>
    import fitz
ModuleNotFoundError: No module named 'fitz'
```

下記のモジュールをインストールしてください．

```
!pip install fitz
!pip install PyMuPDF==1.16.14
```

### エラーコード2
```python
AttributeError: 'NoneType' object has no attribute 'group'
```

一度googletransを消して，googletrans==4.0.0-rc1とversion指定してインストールする．

```
pip uninstall -y googletrans
pip install googletrans==4.0.0-rc1
```

tensorflow2系に存在しないコードを使おうとしているので，tensorflow1系にダウングレードする必要がある．

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
