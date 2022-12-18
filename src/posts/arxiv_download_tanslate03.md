---
display: home
title: 'Google Colab + seleniumでarxivの論文をアブストも含めてダウンロードし，翻訳も実施する(2022/12/18)'
description: Python + BERTで英文のPDFをレイアウトを維持したままの翻訳を実施します．
date: 2022-12-18
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
[Google Colab + seleniumでarxivの論文をアブストも含めてダウンロードし，翻訳も実施する(2022/02/25修正版)](https://www.hamlet-engineer.com/posts/arxiv_download_tanslate02.html)において，arxiv論文のダウンロード・翻訳のコードを整理します．<br>

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
./
├── /PDF_translate
│   ├── arxiv_download_translate.py <- (ダウンロード & 翻訳)
│   ├── translate_csv_bert.py <- 翻訳前後をcsv化
│   └── (省略)
└── arxiv_translate_220618.ipynb <- 実行用ノートブック
```

## Google Driveと連携
Google ColabとGoogle Driveを連携させて，作業ディレクトリを作成します．

```python
# Google ColabとGoogle Driveを連携
from google.colab import drive
drive.mount('/content/drive')
```

```python
# 作業ディレクトリの作成
!mkdir -p /content/drive/MyDrive/PDF_translate/
# 作業ディレクトリの移動
%cd /content/drive/MyDrive/PDF_translate/
!ls 
```

## ライブラリのインストール
下記のコマンドでライブラリをインストールします．

```python
!apt-get update
!apt install chromium-chromedriver
!cp /usr/lib/chromium-browser/chromedriver /usr/bin

!pip install selenium
```

```python
!pip install -U easynmt
!pip install fitz
!pip install PyMuPDF==1.16.14
```

## フォントファイルのダウンロード

```python
# gitからクローン
!git clone https://github.com/hirasu1231/matplotlib_japanese.git
# フォントファイルの移動
!mv ./matplotlib_japanese/ipag.ttf ./ipag.ttf
# ディレクトリの削除
!rm -rf ./matplotlib_japanese
!ls
```

## スクリプトの作成

### arxiv_download_translate.py(ダウンロード & 翻訳)
下記のコードでpythonスクリプトを作成します．

```python
# arxiv_download_translate.pyの書き込み
%%writefile arxiv_download_translate.py
# arxivのダウンロード
import sys
import os
import urllib.request
from selenium import webdriver

# 翻訳用に文章抽出
import fitz
import csv
import json
from tqdm import tqdm

# csvから文章を翻訳
import time
import random
import pandas as pd
from easynmt import EasyNMT

# 日本語判定
import unicodedata

# Google Colab上でselenium.webdriverの起動
def webdriver_colab_start():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome('chromedriver',options=options)
    
    return driver

# arxivのダウンロード
def arxiv_download(arxiv_id, model):
    # selenium.webdriverの起動(Google Colab)
    driver = webdriver_colab_start()
    
    # Selenium 経由でブラウザを操作する
    argvs = sys.argv
    url = "https://arxiv.org/abs/" + arxiv_id.replace('_', '.')
    driver.get(url)
    print(driver.current_url)
    
    # 出力ディレクトリ作成
    os.makedirs("./{0}/".format(arxiv_id), exist_ok=True)
    
    # タイトル・アブストの書き込み
    title = driver.find_element_by_css_selector('.title.mathjax').text # タイトル
    abstract = driver.find_element_by_css_selector('.abstract.mathjax').text # アブスト
    f = open("./{0}/abstract.txt".format(arxiv_id), 'w', encoding='utf-8') # txt生成
    # 書き込み
    f.write('【タイトル_英語】\n')
    f.write('{}\n\n'.format(title))
    f.write('【アブスト_英語】\n')
    f.write('{}\n\n\n'.format(abstract))
    
    # 翻訳の書き込み
    # モデルの読み込み
    # model = EasyNMT('mbart50_m2m')
    f.write('【タイトル_日本語】\n')
    ja_title = model.translate(title, target_lang='ja')
    f.write('{}\n\n'.format(ja_title))
    f.write('【アブスト_日本語】\n')
    ja_abstract = model.translate(abstract, target_lang='ja')
    f.write('{}\n'.format(ja_abstract))
    f.close() # 閉じる
    
    # 論文pdfダウンロード
    pdf_url = driver.find_element_by_css_selector('.abs-button.download-pdf').get_attribute("href")
    urllib.request.urlretrieve(pdf_url, "./{0}/{0}.pdf".format(arxiv_id))

# 翻訳用に文章抽出
def analyze_pdf_text(input_path):
    # argvs = sys.argv
    # argc = len(argvs)
    # if argc != 2:
    #     print("Usage #python %s [PDFãƒ‘ã‚¹]" % argvs[0])
    #     exit()
    # input_path = argvs[1]
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

# csvから文章を翻訳
def translate_csv_bert(input_path, model):
    # argvs = sys.argv
    # argc = len(argvs)
    # if argc != 2:
    #   print("Usage #python %s [PDFãƒ‘ã‚¹]" % argvs[0])
    #   exit()
    # input_path = argvs[1]
    df = pd.read_csv(input_path, names=('org_text', 'convert_text'))
    
    for i in range(len(df)):
      org_text = df['org_text'][i].replace('.', '. ')
      # print(org_text)
      df['convert_text'][i] = model.translate(org_text, target_lang='ja')
      
    df.to_csv(input_path, header=False, index=False)
    

# 日本語の判定
def is_japanese(string):
    for ch in string:
        name = unicodedata.name(ch) 
        if "CJK UNIFIED" in name \
        or "HIRAGANA" in name \
        or "KATAKANA" in name:
            return True
    return False
    
# 翻訳結果をコメントで追記
def embed_annots(json_path, out_path):
    # """メイン処理"""
    # argvs = sys.argv
    # argc = len(argvs)
    # if argc != 3:
    #     print("Usage #python %s [JSONパス] [出力パス]" % argvs[0])
    #     exit()
    # json_path = argvs[1]
    # out_path = argvs[2]
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
            # 日本語を含むか?
            if not is_japanese(txt):
                continue
            # ほぼ数字
            num_len = sum([txt.count(strn) for strn in '01234567890'] )
            if (len(txt) - num_len) < 3:
                continue
            # print(txt)
            page = doc[text_block['page']]
            page.addTextAnnot(
                (text_block['x1'] - 20, text_block['y1'] - 20),
                txt
            )
        else:
            print("翻訳に失敗：", text_block['text'])

    doc.save(out_path, garbage=1, clean=1, deflate=1) 
    
# 翻訳結果をテキストボックスで上書き
def embed_textbox(json_path, out_path):
    # """メイン処理"""
    # argvs = sys.argv
    # argc = len(argvs)
    # if argc != 3:
    #     print("Usage #python %s [JSONパス] [出力パス]" % argvs[0])
    #     exit()
    # json_path = argvs[1]
    # out_path = argvs[2]
    with open(json_path, mode='r', encoding='utf8') as fp:
        json_info = json.load(fp)

    string_path = json_info['string_path']
    string_info = {}
    with open(string_path, 'r', encoding='utf8', newline="\n") as fp:
        reader = csv.reader(fp)
        for row in reader:
            string_info[row[0].strip()] = row[1]
    doc = fitz.open(json_info['input_path'])

    # 画像部を判定
    img_list = []
    for text_block in tqdm(json_info["text_block"]):
        txt = text_block['text'].strip()
        if txt in string_info:
            txt = string_info[txt]
            txt = txt.replace('•', '・')
            page = doc[text_block['page']]
            # 空白以外むし
            if len(txt)!=0 or len(txt)!=txt.count(' '):
                continue
            # 図表らしいところを抽出
            img_list.append({
                            'page' : text_block['page'],
                            'x0' : text_block['x0'],
                            'y0' : text_block['y0'],
                            'x1' : text_block['x1'],
                            'y1' : text_block['x1']
                        })
    img_df = pd.DataFrame(img_list)

    # 日本語訳直打ち
    fsize_list = []
    for text_block in tqdm(json_info["text_block"]):
        img_flag = 0
        txt = text_block['text'].strip()
        if txt in string_info:
            txt = string_info[txt]
            txt = txt.replace('•', '・').replace('ー', '')
            # print(txt)
            page = doc[text_block['page']]
            rect = fitz.Rect(text_block['x0'], text_block['y0'], text_block['x1'], text_block['y1'])

            # 中心
            csnter_x = (text_block['x0'] + text_block['x1'])/2
            csnter_y = (text_block['y0'] + text_block['y1'])/2

            '''除外する'''
            # 図表とかぶるもの
            imgdf_len = 0
            if len(img_df) > 0:
                img_df2 = img_df[img_df['page']==text_block['page']].reset_index(drop=True)
                imgdf_len = len(img_df2)
            if imgdf_len > 0:
                for num in range(len(img_df2)):
                    a1 =   csnter_x - img_df2['x0'][num] > 0
                    a2 = - csnter_x + img_df2['x1'][num] > 0
                    a3 =   csnter_y - img_df2['y0'][num] > 0
                    a4 = - csnter_y + img_df2['y1'][num] > 0
                    # 中心がある場合
                    if (a1 * a2 * a3 * a4) > 0:
                        img_flag = 1
                        break
            # 日本語を含むか?
            if not is_japanese(txt):
                fsize_list.append(999)
                continue
            # ほぼ数字
            num_len = sum([txt.count(strn) for strn in '01234567890'] )
            if (len(txt) - num_len) < 3:
                fsize_list.append(999)
                continue
            if img_flag:
                fsize_list.append(999)
                continue   

            # 小さすぎる字は追加しない
            # 認識できない文字は追記しない
            rc = page.insertTextbox(rect, txt,
                                        fontsize=6,
                                        fontname="Mincho",
                                        fontfile='ipaexm.ttf',
                                        align = 0)
            if len(txt)==0 or rc<0 or len(txt)==txt.count(' '):
                fsize_list.append(6)
                continue

            # 文字を追記
            page.drawRect(rect,color=(.25,1,0.25))
            page.drawRect(rect,fill=(1, 1, 1))

            fsize = 30
            rc = -1
            while rc < 0:
                rc = page.insertTextbox(rect, txt,
                                        fontsize=fsize,
                                        fontname="Mincho",
                                        fontfile='ipaexm.ttf',
                                        align = 0)
                fsize -= 0.2
            fsize_list.append(fsize)
        else:
            print("翻訳に失敗：", text_block['text'])
    # PDF保存
    doc.save(out_path, garbage=1, clean=1, deflate=1)
    # CSV保存
    df_lang = pd.read_json(json_path)
    df_lang['font_size'] = fsize_list
    df_lang.to_csv(string_path.replace('.pdf.bert.csv', '_fontsize.pdf.bert.csv'), index=False)

if __name__ == '__main__':
    # 引数の選択
    arxiv_id = sys.argv[1].replace('.', '_')
    # 学習済みモデルの読み込み
    tarained_model = EasyNMT('mbart50_m2m')
    
    # arxivのダウンロード
    arxiv_download(arxiv_id, tarained_model)
    # 翻訳用に文章抽出
    analyze_pdf_text(f"./{arxiv_id}/{arxiv_id}.pdf")
    # csvから文章を翻訳
    translate_csv_bert(f"./{arxiv_id}/{arxiv_id}.pdf.bert.csv", tarained_model)
    # 翻訳結果をコメントで追記
    embed_annots(f"./{arxiv_id}/{arxiv_id}.pdf.bert.json", f"./{arxiv_id}/JA_COMMENT_{arxiv_id}.pdf")
    # 翻訳結果をテキストボックスで上書き
    embed_textbox(f"./{arxiv_id}/{arxiv_id}.pdf.bert.json", f"./{arxiv_id}/JA_TEXTBOX_{arxiv_id}.pdf")
```

### pdf_translate.py(翻訳のみ)

```python
# pdf_translate.pyの書き込み
%%writefile pdf_translate.py
import sys
import os
import urllib.request
from selenium import webdriver

# 翻訳用に文章抽出
import fitz
import csv
import json
from tqdm import tqdm

# csvから文章を翻訳
import time
import random
import pandas as pd
from easynmt import EasyNMT

# 日本語判定
import unicodedata

# 翻訳用に文章抽出
def analyze_pdf_text(input_path):
    # argvs = sys.argv
    # argc = len(argvs)
    # if argc != 2:
    #     print("Usage #python %s [PDFãƒ‘ã‚¹]" % argvs[0])
    #     exit()
    # input_path = argvs[1]
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

# csvから文章を翻訳
def translate_csv_bert(input_path, model):
    # argvs = sys.argv
    # argc = len(argvs)
    # if argc != 2:
    #   print("Usage #python %s [PDFãƒ‘ã‚¹]" % argvs[0])
    #   exit()
    # input_path = argvs[1]
    df = pd.read_csv(input_path, names=('org_text', 'convert_text'))
    
    for i in range(len(df)):
      org_text = df['org_text'][i].replace('.', '. ')
      # print(org_text)
      df['convert_text'][i] = model.translate(org_text, target_lang='ja')
      
    df.to_csv(input_path, header=False, index=False)
    

# 日本語の判定
def is_japanese(string):
    for ch in string:
        try:
            name = unicodedata.name(ch)
        except:
            continue
        if "CJK UNIFIED" in name \
        or "HIRAGANA" in name \
        or "KATAKANA" in name:
            return True
    return False
    
# 翻訳結果をコメントで追記
def embed_annots(json_path, out_path):
    # """メイン処理"""
    # argvs = sys.argv
    # argc = len(argvs)
    # if argc != 3:
    #     print("Usage #python %s [JSONパス] [出力パス]" % argvs[0])
    #     exit()
    # json_path = argvs[1]
    # out_path = argvs[2]
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
            # 日本語を含むか?
            if not is_japanese(txt):
                continue
            # ほぼ数字
            num_len = sum([txt.count(strn) for strn in '01234567890'] )
            if (len(txt) - num_len) < 3:
                continue
            # print(txt)
            page = doc[text_block['page']]
            page.addTextAnnot(
                (text_block['x1'] - 20, text_block['y1'] - 20),
                txt
            )
        else:
            print("翻訳に失敗：", text_block['text'])

    doc.save(out_path, garbage=1, clean=1, deflate=1) 
    
# 翻訳結果をテキストボックスで上書き
def embed_textbox(json_path, out_path):
    # """メイン処理"""
    # argvs = sys.argv
    # argc = len(argvs)
    # if argc != 3:
    #     print("Usage #python %s [JSONパス] [出力パス]" % argvs[0])
    #     exit()
    # json_path = argvs[1]
    # out_path = argvs[2]
    with open(json_path, mode='r', encoding='utf8') as fp:
        json_info = json.load(fp)

    string_path = json_info['string_path']
    string_info = {}
    with open(string_path, 'r', encoding='utf8', newline="\n") as fp:
        reader = csv.reader(fp)
        for row in reader:
            string_info[row[0].strip()] = row[1]
    doc = fitz.open(json_info['input_path'])

    # 画像部を判定
    img_list = []
    for text_block in tqdm(json_info["text_block"]):
        txt = text_block['text'].strip()
        if txt in string_info:
            txt = string_info[txt]
            txt = txt.replace('•', '・')
            page = doc[text_block['page']]
            # 空白以外むし
            if len(txt)!=0 or len(txt)!=txt.count(' '):
                continue
            # 図表らしいところを抽出
            img_list.append({
                            'page' : text_block['page'],
                            'x0' : text_block['x0'],
                            'y0' : text_block['y0'],
                            'x1' : text_block['x1'],
                            'y1' : text_block['x1']
                        })
    img_df = pd.DataFrame(img_list)

    # 日本語訳直打ち
    fsize_list = []
    for text_block in tqdm(json_info["text_block"]):
        img_flag = 0
        txt = text_block['text'].strip()
        if txt in string_info:
            txt = string_info[txt]
            txt = txt.replace('•', '・').replace('ー', '')
            # print(txt)
            page = doc[text_block['page']]
            rect = fitz.Rect(text_block['x0'], text_block['y0'], text_block['x1'], text_block['y1'])

            # 中心
            csnter_x = (text_block['x0'] + text_block['x1'])/2
            csnter_y = (text_block['y0'] + text_block['y1'])/2

            '''除外する'''
            # 図表とかぶるもの
            imgdf_len = 0
            if len(img_df) > 0:
                img_df2 = img_df[img_df['page']==text_block['page']].reset_index(drop=True)
                imgdf_len = len(img_df2)
            if imgdf_len > 0:
                for num in range(len(img_df2)):
                    a1 =   csnter_x - img_df2['x0'][num] > 0
                    a2 = - csnter_x + img_df2['x1'][num] > 0
                    a3 =   csnter_y - img_df2['y0'][num] > 0
                    a4 = - csnter_y + img_df2['y1'][num] > 0
                    # 中心がある場合
                    if (a1 * a2 * a3 * a4) > 0:
                        img_flag = 1
                        break
            # 日本語を含むか?
            if not is_japanese(txt):
                fsize_list.append(999)
                continue
            # ほぼ数字
            num_len = sum([txt.count(strn) for strn in '01234567890'] )
            if (len(txt) - num_len) < 3:
                fsize_list.append(999)
                continue
            if img_flag:
                fsize_list.append(999)
                continue   

            # 小さすぎる字は追加しない
            # 認識できない文字は追記しない
            rc = page.insertTextbox(rect, txt,
                                        fontsize=6,
                                        fontname="Mincho",
                                        fontfile='ipaexm.ttf',
                                        align = 0)
            if len(txt)==0 or rc<0 or len(txt)==txt.count(' '):
                fsize_list.append(6)
                continue

            # 文字を追記
            page.drawRect(rect,color=(.25,1,0.25))
            page.drawRect(rect,fill=(1, 1, 1))

            fsize = 30
            rc = -1
            while rc < 0:
                rc = page.insertTextbox(rect, txt,
                                        fontsize=fsize,
                                        fontname="Mincho",
                                        fontfile='ipaexm.ttf',
                                        align = 0)
                fsize -= 0.2
            fsize_list.append(fsize)
        else:
            print("翻訳に失敗：", text_block['text'])
    # PDF保存
    doc.save(out_path, garbage=1, clean=1, deflate=1)
    # CSV保存
    df_lang = pd.read_json(json_path)
    df_lang['font_size'] = fsize_list
    df_lang.to_csv(string_path.replace('.pdf.bert.csv', '_fontsize.pdf.bert.csv'), index=False)

if __name__ == '__main__':
    # # 引数の選択
    # arxiv_id = sys.argv[1].replace('.', '_')
    pdf_path = sys.argv[1]
    # 学習済みモデルの読み込み
    tarained_model = EasyNMT('mbart50_m2m')
    
    # # arxivのダウンロード
    # arxiv_download(arxiv_id, tarained_model)
    # # 翻訳用に文章抽出
    # analyze_pdf_text(pdf_path)
    # # csvから文章を翻訳
    # translate_csv_bert(f"{pdf_path}.bert.csv", tarained_model)
    # 翻訳結果をコメントで追記
    embed_annots(f"{pdf_path}.bert.json", pdf_path.replace(".pdf", "_JA_COMMENT.pdf"))
    # 翻訳結果をテキストボックスで上書き
    embed_textbox(f"{pdf_path}.bert.json", pdf_path.replace(".pdf", "_JA_TEXTBOX.pdf"))
```


### 翻訳実行
下記のコマンドで翻訳を実行します．

### arxivのダウンロードと翻訳
```python
!python arxiv_download_translate.py "2204.04676"
```

### PDFの翻訳のみ
```python
!python pdf_translate.py "./THE_HIGHLY_SENSITIVE_PERSON/THE_HIGHLY_SENSITIVE_PERSON.pdf"
```


## まとめ
[Google Colab + seleniumでarxivの論文をアブストも含めてダウンロードし，翻訳も実施する(2022/02/25修正版)](https://www.hamlet-engineer.com/posts/arxiv_download_tanslate02.html)において，arxiv論文のダウンロード・翻訳のコードを整理しました．


## 参考サイト
[mima3/pdf_translate](https://github.com/mima3/pdf_translate)

[UKPLab/EasyNMT](https://github.com/UKPLab/EasyNMT)

[PythonでPDFのレイアウトを維持したまま翻訳してみる](https://qiita.com/mima_ita/items/3f698050196d4af3a46d)

[yta-git/pdf_translate](https://github.com/yta-git/pdf_translate)

[【python】googletransの『AttributeError: 'NoneType' object has no attribute 'group'』対策](https://qiita.com/_yushuu/items/83c51e29771530646659)

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
