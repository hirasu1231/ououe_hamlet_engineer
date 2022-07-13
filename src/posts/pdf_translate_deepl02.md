---
display: home
title: 'Google Colab + Selenium + DeeplでarxivからのDLと機械翻訳を実施する'
description: Google Colab + Selenium + Deeplで機械翻訳を実施します
date: 2022-7-17
image: https://www.hamlet-engineer.com/image/machine_translate.jpeg
categories: 
  - Python
tags:
  - Python
  - jupyterNotebook
  - Machine_Translates
---

Google Colab + Selenium + DeeplでarxivからのDLと機械翻訳を実施します

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## Google Driveと連携
Google ColabとGoogle Driveを連携させて，作業ディレクトリを作成します．<br>

```python
# Google ColabとGoogle Driveを連携
from google.colab import drive
drive.mount('/content/drive')
```

```python
# 作業ディレクトリの作成
!mkdir -p /content/drive/MyDrive/PDF_DEEPL/
# 作業ディレクトリの移動
%cd /content/drive/MyDrive/PDF_DEEPL/
!ls 
```

## ライブラリのインストール
下記のコマンドでライブラリをインストールします．

```python
!apt-get update
!apt install chromium-chromedriver
!cp /usr/lib/chromium-browser/chromedriver /usr/bin

!pip install selenium==4.3.0
!pip install fitz
!pip install PyMuPDF==1.16.14
```

DEEPLは，5000文字以上は翻訳できないので，nltkライブラリを使用し文ごとで分割した後，5000文字以下になるように，文章を分割します．
```python
import nltk
nltk.download('all')
```

## フォントファイルのダウンロード
日本語に対応したフォントが必要なので，下記のコードでダウンロードします．

```python
# gitからクローン
!git clone https://github.com/hirasu1231/matplotlib_japanese.git
# フォントファイルの移動
!mv ./matplotlib_japanese/ipag.ttf ./ipag.ttf
!mv ./matplotlib_japanese/ipaexm.ttf ./ipaexm.ttf
# ディレクトリの削除
!rm -rf ./matplotlib_japanese
!ls
```

## スクリプトの作成

### arxiv_download_deepl.py(ダウンロード & 翻訳)

```python
# arxiv_download_deepl.pyの書き込み
%%writefile arxiv_download_deepl.py
# arxivのダウンロード
import sys
import os
import urllib.request
from selenium import webdriver
from selenium.webdriver.common.by import By

# 翻訳用に文章抽出
import fitz
import csv
import json
from tqdm import tqdm

# csvから文章を翻訳
import nltk
import time
import random
import pandas as pd

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


def deepl_websc(en_text, driver_deepl):
    print(len(en_text), "="*30)
    print(en_text)
    try:
        # 英語を記入
        en_text_area = driver_deepl.find_element(By.XPATH, """//textarea[@lang="en-EN"]""")
        en_text_area.clear() # テキストエリアをクリア
    except:
        # selenium.webdriverの起動(ローカル)
        driver_deepl = webdriver_colab_start()
        # Selenium 経由でブラウザを操作する
        url = 'https://www.deepl.com/ja/translator/l/en/ja'
        driver_deepl.get(url)
        time.sleep(10)

        # 英語を記入
        en_text_area = driver_deepl.find_element(By.XPATH, """//textarea[@lang="en-EN"]""")
        en_text_area.clear() # テキストエリアをクリア

    try:
        en_text_area.send_keys(en_text) # 英語記入
    except:
        en_text = "99999999"
        en_text_area.send_keys(en_text) # 英語記入

    
    while (len(en_text)-10)>len(en_text_area.get_attribute("value")):
        time.sleep(1)

    jp_text_prev = "あああ"
    jp_text = ""
    time0 = 0
    while 1:
        # 和訳の確認
        try:
            jp_text_area = driver_deepl.find_element(By.XPATH, """//textarea[@lang="ja-JP"]""")
            jp_text = jp_text_area.get_attribute("value")
        except:
            jp_text = ""

        if (len(jp_text_prev) == len(jp_text)) & (len(jp_text) > len(en_text)//10) & ("[...]" not in jp_text):
            break
        else:
            jp_text_prev = jp_text
            time.sleep(1) # 翻訳に要する時間を確保
            time0 += 1

        if time0>(len(en_text)//2):
            jp_text = ""
            break
    print(jp_text)

    return(jp_text)

# arxivのダウンロード
def arxiv_download_deepl(arxiv_id, driver_deepl):
    # selenium.webdriverの起動(Google Colab)
    driver = webdriver_colab_start()
    
    # Selenium 経由でブラウザを操作する
    # argvs = sys.argv
    url = "https://arxiv.org/abs/" + arxiv_id.replace('_', '.')
    driver.get(url)
    print(driver.current_url)
    
    # 出力ディレクトリ作成
    os.makedirs("./{0}/".format(arxiv_id), exist_ok=True)
    
    # タイトル・アブストの書き込み
    title = driver.find_element(By.CSS_SELECTOR, '.title.mathjax').text # タイトル
    abstract = driver.find_element(By.CSS_SELECTOR, '.abstract.mathjax').text # アブスト
    f = open("./{0}/abstract.txt".format(arxiv_id), 'w', encoding='utf-8') # txt生成
    # 書き込み
    f.write('【タイトル_英語】\n')
    f.write('{}\n\n'.format(title))
    f.write('【アブスト_英語】\n')
    f.write('{}\n\n\n'.format(abstract))
    
    # 翻訳の書き込み
    # モデルの読み込み
    f.write('【タイトル_日本語】\n')
    ja_title = deepl_websc(title, driver_deepl)
    f.write('{}\n\n'.format(ja_title))
    f.write('【アブスト_日本語】\n')
    ja_abstract = deepl_websc(abstract, driver_deepl)
    f.write('{}\n'.format(ja_abstract))
    f.close() # 閉じる
    
    # 論文pdfダウンロード
    pdf_url = driver.find_element(By.CSS_SELECTOR, '.abs-button.download-pdf').get_attribute("href")
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

    string_path = '{}.deepl.csv'.format(input_path)
    with open(string_path, 'w', encoding='utf8', newline="") as fp:
        writer = csv.writer(fp)
        for s in list_string:
            writer.writerow([s, 'todo'])
    data = {
        "input_path" : input_path,
        "string_path" : string_path,
        "text_block" : result
    }
    with open('{}.deepl.json'.format(input_path), mode='w', encoding='utf8') as fp:
        json.dump(data, fp, sort_keys=True, indent=4, ensure_ascii=False)

# csvから文章を翻訳
def translate_csv_deepl(input_path, driver_deepl):
    df = pd.read_csv(input_path, names=('org_text', 'convert_text'))

    for i in range(len(df)):
        org_text = df['org_text'][i].replace('.', '. ')
        if not df['convert_text'][i]=="todo":
          continue

        if len(org_text)>2000:
            results = nltk.sent_tokenize(org_text, language='english')
            text_part = ""
            jp_part = ""
            for result in results:
                text_part  = text_part + result
                if len(text_part) > 1000:
                    jp_part = jp_part + deepl_websc(text_part, driver_deepl)
                    text_part = ""
            df['convert_text'][i] = jp_part
            df.to_csv(input_path, header=False, index=False)
        else:
            df['convert_text'][i] = deepl_websc(org_text, driver_deepl)
            df.to_csv(input_path, header=False, index=False)
    

# 日本語の判定
def is_japanese(string):
    length = 0
    for ch in string:
        name = unicodedata.name(ch) 
        if "CJK UNIFIED" in name \
        or "HIRAGANA" in name \
        or "KATAKANA" in name:
            length += 1
    # 出力
    if len(string)==0:
        ret = 0
    else:
        ret = (length/len(string))//0.4
    return ret
    
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
    df_lang.to_csv(string_path.replace('.pdf.deepl.csv', '_fontsize.pdf.deepl.csv'), index=False)

if __name__ == '__main__':
    # 引数の選択
    arxiv_id = sys.argv[1].replace('.', '_')

    # selenium.webdriverの起動(ローカル)
    driver_deepl = webdriver_colab_start()
    # Selenium 経由でブラウザを操作する
    url = 'https://www.deepl.com/ja/translator/l/en/ja'
    driver_deepl.get(url)
    time.sleep(3)
        
    # arxivのダウンロード
    ##arxiv_download_deepl(arxiv_id, driver_deepl)
    # 翻訳用に文章抽出
    ##analyze_pdf_text(f"./{arxiv_id}/{arxiv_id}.pdf")
    # csvから文章を翻訳
    translate_csv_deepl(f"./{arxiv_id}/{arxiv_id}.pdf.deepl.csv", driver_deepl)
    # 翻訳結果をコメントで追記
    embed_annots(f"./{arxiv_id}/{arxiv_id}.pdf.deepl.json", f"./{arxiv_id}/JA_COMMENT_{arxiv_id}.pdf")
    # 翻訳結果をテキストボックスで上書き
    embed_textbox(f"./{arxiv_id}/{arxiv_id}.pdf.deepl.json", f"./{arxiv_id}/JA_TEXTBOX_{arxiv_id}.pdf")
    
    # 不要ファイルを削除
```

## 翻訳の実行

### arxivのダウンロードと翻訳

```python
!python arxiv_download_deepl.py "2108.07258"
```

## まとめ
Google Colab + Selenium + DeeplでarxivからのDLと機械翻訳を実施しました．

## 参考サイト



<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">
