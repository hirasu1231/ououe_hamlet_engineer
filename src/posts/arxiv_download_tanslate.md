---
display: home
title: 'Google Colab + seleniumでarxivの論文をアブストも含めてダウンロードし，翻訳も実施する'
description: Google Colab上でseleniumを使ってarxivの論文をアブストも含めダウンロードし，翻訳も実施します．
date: 2021-10-13
image: https://www.hamlet-engineer.com/image/arxiv.png
categories: 
  - Python
tags:
  - Python
  - jupyter
  - Google Colaboratory
---
<!-- https://www.hamlet-engineer.com -->
Google Colab上でseleniumを使ってarxivの論文をアブストも含めダウンロードし，翻訳も実施します．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

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
プロジェクトディレクトリはarxiv_downloadとしています．度々，省略しています．
```init
pdf_translate
├── /arxiv_download
│   ├── analyze_pdf_text_bert.py ←pdfの文情報を取得
│   ├── translate_csv_bert.py ←pdfの文を翻訳
│   ├── embed_annots.py ←翻訳文をpdfに書き込み
│   ├── arxiv_download_translate.sh  ←ダウンロード&翻訳スクリプト
│   └── /arxiv/2109_00663/
│       ├── abstract.txt <-概要
│       ├── 2109.00663.pdf <-オリジナル
│       └── JA_BERT_2109.00663.pdf <-翻訳
│
└── arxiv_download.ipynb <- 実行用ノートブック
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
# 作業ディレクトリを作成
mkdir arxiv_download
```

```python
# 作業ディレクトリへ移動
%cd /content/drive/My\ Drive/PDF_transrate/arxiv_download
!ls
```

## Google Colab上でseleniumを使う準備
下記のコードでGoogle Colab上でseleniumを使うことができます．

```python
!apt-get update
!apt install chromium-chromedriver
!cp /usr/lib/chromium-browser/chromedriver /usr/bin

!pip install selenium
```

## その他のライブラリをインストール
さらに，下記のコードで翻訳に必要なライブラリをインストールします．
```python
!pip install -U easynmt
!pip install fitz
!pip install PyMuPDF==1.16.14
```

## ダウンロードのスクリプト
下記のコードでarXivのダウンロードするスクリプト`arxiv_download.py`を作成します．

```python
# translate_csv.pyの書き込み
%%writefile arxiv_download.py
import sys
import os
import urllib.request
from selenium import webdriver
from easynmt import EasyNMT

# Google Colab上でselenium.webdriverの起動
def webdriver_colab_start():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome('chromedriver',options=options)
    
    return driver


def main(url):
  # selenium.webdriverの起動(Google Colab)
  driver = webdriver_colab_start()

  # Selenium 経由でブラウザを操作する
  argvs = sys.argv
  url = "https://arxiv.org/abs/" + argvs[1].replace('_', '.')
  driver.get(url)
  print(driver.current_url)

  # 出力ディレクトリ作成
  os.makedirs("./arxiv/{0}/".format(argvs[1]), exist_ok=True)

  # タイトル・アブストの書き込み
  title = driver.find_element_by_css_selector('.title.mathjax').text # タイトル
  abstract = driver.find_element_by_css_selector('.abstract.mathjax').text # アブスト
  f = open("./arxiv/{0}/abstract.txt".format(argvs[1]), 'w', encoding='utf-8') # txt生成
  # 書き込み
  f.write('【タイトル_英語】\n')
  f.write('{}\n\n'.format(title))
  f.write('【アブスト_英語】\n')
  f.write('{}\n\n\n'.format(abstract))

  # 翻訳の書き込み
  # モデルの読み込み
  model = EasyNMT('mbart50_m2m')
  f.write('【タイトル_日本語】\n')
  ja_title = model.translate(title, target_lang='ja')
  f.write('{}\n\n'.format(ja_title))
  f.write('【アブスト_日本語】\n')
  ja_abstract = model.translate(abstract, target_lang='ja')
  f.write('{}\n'.format(ja_abstract))
  f.close() # 閉じる

  # 論文pdfダウンロード
  pdf_url = driver.find_element_by_css_selector('.abs-button.download-pdf').get_attribute("href")
  urllib.request.urlretrieve(pdf_url, "./arxiv/{0}/{0}.pdf".format(argvs[1]))

if __name__ == '__main__':
  main(sys.argv)
```

## 翻訳のスクリプト
下記のコードでダウンロードした論文を翻訳する，3つのスクリプトを作成します．
- analyze_pdf_text_bert.py ←pdfの文情報を取得
- translate_csv_bert.py ←pdfの文を翻訳
- embed_annots.py ←翻訳文をpdfに書き込み

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
      # print(org_text)
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
            # print(txt)
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

## シェルスクリプトファイルの作成
下記のコマンドでシェルスクリプトファイルの作成します．
```sh
# pdf_translate.shの書き込み
%%writefile arxiv_download_translate.sh
#!/bin/sh
python ./arxiv_download.py "$1"
python ./analyze_pdf_text_bert.py "./arxiv/$1/$1.pdf"
python ./translate_csv_bert.py "./arxiv/$1/$1.pdf.bert.csv"
python ./embed_annots.py "./arxiv/$1/$1.pdf.bert.json" "./arxiv/$1/JA_BERT_$1.pdf"

rm "./arxiv/$1/$1.pdf.bert.csv" "./arxiv/$1/$1.pdf.bert.json"
```

## ダウンロード&翻訳の実行
論文URL`https://arxiv.org/abs/2109.00663`をダウンロードする場合は，下記のように実行します．

```python
!sh arxiv_download_translate.sh '2109.00663'
```

## まとめ
Google Colab上でseleniumを使ってarxivの論文をアブストも含めダウンロードと翻訳を実行しました．

## 参考サイト
[google ColaboratoryでSeleniumを使う](https://enjoy-a-lot.com/google-colaboratory-selenium/)

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>