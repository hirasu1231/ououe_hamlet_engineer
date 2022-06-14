---
display: home
title: 'Python + BERTで英文のPDFをレイアウトを維持したまま翻訳してみる'
description: Python + BERTで英文のPDFをレイアウトを維持したままの翻訳を実施します．
date: 2021-10-03
image: https://www.hamlet-engineer.com/image/pdf_tansrate01.png
categories: 
  - Python
tags:
  - Python
  - jupyter
  - machine_translate
  - BERT
  - Transformer
---
<!-- https://www.hamlet-engineer.com -->
Python + BERTで英文のPDFをレイアウトを維持したままの翻訳を実施します．<br>

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
プロジェクトディレクトリはpdf_translate_bertとしています．度々，省略しています．
```init
pdf_translate
├── /pdf_translate_bert
│   ├── analyze_pdf_text_bert.py <- pdfの解析
│   ├── translate_csv_bert.py <- 翻訳前後をcsv化
│   ├── embed_annots.py <- pdfにコメ追加
│   ├── pdf_translate_bert.sh <- 実行スクリプト
│   ├── AttentionGAN.pdf <- 翻訳前
│   ├── JA_BERT_AttentionGAN.pdf <- 翻訳後
│   ├── AttentionGAN.pdf.bert.csv <- 翻訳前後csv
│   ├── AttentionGAN.pdf.bert.json  <- pdf情報のjson
│   └── (省略)
└── pdf_translate_bert.ipynb <- 実行用ノートブック
```

## Google Driveと連携
Google ColabとGoogle Driveを連携させて，作業ディレクトリを作成します．<br>

```python
# Google ColabとGoogle Driveを連携
from google.colab import drive
drive.mount('/content/drive')
```

```python
%%bash
# ディレクトリの移動
cd /content/drive/My\ Drive/PDF_transrate
# 作業ディレクトリの作成
mkdir pdf_translate_bert
```

```python
# 作業ディレクトリへ移動
%cd /content/drive/My\ Drive/PDF_transrate/pdf_translate_bert
!ls
```

## モジュールのインストール
下記のコマンドでモジュールをインストールします．
```python
!pip install -U easynmt
!pip install fitz
!pip install PyMuPDF==1.16.14
```

## 翻訳実行

### pythonスクリプトの作成
下記のコードでpythonスクリプトを作成します．

```python
# analyze_pdf_text_bert.pyの書き込み
%%writefile analyze_pdf_text_bert.py

import sys
import fitz
import csv
import json
from tqdm import tqdm


def main(input_path):
    argvs = sys.argv
    argc = len(argvs)
    if argc != 2:
        print("Usage #python %s [PDFパス]" % argvs[0])
        exit()
    input_path = argvs[1]
    doc = fitz.open(input_path)
    list_string = []
    result = []
    pno = 0
    for page in tqdm(doc):
        blocklist = page.getText('blocks')
        for block in blocklist:
            r = fitz.Rect(block[0], block[1], block[2], block[3])
            txt = block[4].replace('\n', '').replace('\r', '')
            result.append({
                'page' : pno,
                'x0' : block[0],
                'y0' : block[1],
                'x1' : block[2],
                'y1' : block[3],
                'text' : txt,
                'block_type' : block[5],
                'block_no' : block[6],
            })
            if not txt in list_string:
                list_string.append(txt)
        pno += 1

    string_path = '{}.bert.csv'.format(input_path)
    with open(string_path, 'w', encoding='utf8', newline="") as fp:
        writer = csv.writer(fp)
        for s in list_string:
            writer.writerow([s, 'todo'])
    data = {
        "input_path" : input_path,
        "string_path" : string_path,
        "text_block" : result
    }
    with open('{}.bert.json'.format(input_path), mode='w', encoding='utf8') as fp:
        json.dump(data, fp, sort_keys=True, indent=4, ensure_ascii=False)


if __name__ == '__main__':
    main(sys.argv)
```

```python
# translate_csv.pyの書き込み
%%writefile translate_csv_bert.py

import sys
import time
import random
import pandas as pd
from easynmt import EasyNMT

# モデルの読み込み
model = EasyNMT('mbart50_m2m')

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
      df['convert_text'][i] = model.translate(org_text, target_lang='ja')
      
  df.to_csv(input_path, header=False, index=False)

if __name__ == '__main__':
  main(sys.argv)
```

```python
%%writefile embed_annots.py
import sys
import fitz
import csv
import json
from tqdm import tqdm


def main(argvs):
    """メイン処理"""
    argvs = sys.argv
    argc = len(argvs)
    if argc != 3:
        print("Usage #python %s [JSONパス] [出力パス]" % argvs[0])
        exit()
    json_path = argvs[1]
    out_path = argvs[2]
    with open(json_path, mode='r', encoding='utf8') as fp:
        json_info = json.load(fp)

    string_path = json_info['string_path']
    string_info = {}
    with open(string_path, 'r', encoding='utf8', newline="\n") as fp:
        reader = csv.reader(fp)
        for row in reader:
            string_info[row[0].strip()] = row[1]
    doc = fitz.open(json_info['input_path'])

    for text_block in tqdm(json_info["text_block"]):
        txt = text_block['text'].strip()
        if txt in string_info:
            txt = string_info[txt]
            print(txt)
            page = doc[text_block['page']]
            page.addTextAnnot(
                (text_block['x1'] - 20, text_block['y1'] - 20),
                txt
            )
        else:
            print("翻訳に失敗：", text_block['text'])

    doc.save(out_path, garbage=1, clean=1, deflate=1) 

if __name__ == '__main__':
    main(sys.argv)
```

### シェルスクリプトファイルの作成
下記のコマンドでシェルスクリプトファイルの作成します．
```python
# pdf_translate.shの書き込み
%%writefile pdf_translate_bert.sh
#!/bin/sh
python ./analyze_pdf_text_bert.py "$1"
python ./translate_csv_bert.py "$1.bert.csv"
python ./embed_annots.py "$1.bert.json" "JA_BERT_$1"

# rm "$1.csv" "$1.json"
```

### 翻訳実行
下記のコマンドで翻訳を実行します．

```python
!sh pdf_translate_bert.sh AttentionGAN.pdf
```


## まとめ
Python + BERTで英文のPDFをレイアウトを維持したままの翻訳を実施しました．


## 参考サイト
[mima3/pdf_translate](https://github.com/mima3/pdf_translate)

[UKPLab/EasyNMT](https://github.com/UKPLab/EasyNMT)

[PythonでPDFのレイアウトを維持したまま翻訳してみる](https://qiita.com/mima_ita/items/3f698050196d4af3a46d)

[yta-git/pdf_translate](https://github.com/yta-git/pdf_translate)

[【python】googletransの『AttributeError: 'NoneType' object has no attribute 'group'』対策](https://qiita.com/_yushuu/items/83c51e29771530646659)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
