---
display: home
title: 'Google Colab + Selenium + Deeplで機械翻訳を実施する'
description: Google Colab + Selenium + Deeplで機械翻訳を実施します
date: 2022-7-16
image: https://www.hamlet-engineer.com/image/Python.png
categories: 
  - Python
tags:
  - memo
  - Python
  - Pandas
---

Google Colab + Selenium + Deeplで機械翻訳を実施します

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ライブラリのインストール
下記のコマンドでモジュールをインストールします．

```python
!apt-get update
!apt install chromium-chromedriver
!cp /usr/lib/chromium-browser/chromedriver /usr/bin

!pip install selenium==4.3.0
```

## Deeplの機械翻訳の実行
下記のコードで実行します．

### ドライバーの起動

```python
from selenium import webdriver  

load_url = "https://www.deepl.com/ja/translator"
driver = webdriver.Chrome(executable_path='c:/work/chromedriver.exe')  #  driver = webdriver.Chrome()
driver.get(load_url)

import time
import requests,os,bs4
import urllib.request
from selenium import webdriver
from selenium.webdriver.common.by import By

# Google Colab上でselenium.webdriverの起動
def webdriver_colab_start():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome('chromedriver',options=options)
    
    return driver

# selenium.webdriverの起動(ローカル)
driver = webdriver_colab_start()

# Selenium 経由でブラウザを操作する
url = 'https://www.deepl.com/ja/translator/l/en/ja'
driver.get(url)
print(driver.current_url)
# https://www.deepl.com/ja/translator-mobile/l/en/ja
```

### 翻訳前の文を記入
下記のコードで翻訳前の文を記入します．

```python
# 英語を記入
en_text_area = driver.find_element(By.XPATH, """//textarea[@lang="en-EN"]""")
en_text_area.clear() # テキストエリアをクリア
en_text_area.send_keys("This is a pen.") # 英語記入
print(en_text_area.get_attribute("value")) # 記入した文字列確認

time.sleep(5) # 翻訳に要する時間を確保

# This is a pen.
```

### 翻訳後の文を出力
下記のコードで翻訳後の文を出力します．

```python
# 和訳の確認
jp_text_area = driver.find_element(By.XPATH, """//textarea[@lang="ja-JP"]""")
print(jp_text_area.get_attribute("value"))

# 'これはペンです。'
```

### スクリプト風
最後にスクリプトにまとめるので，そのための準備をします．

```python
# selenium.webdriverの起動(ローカル)
driver_deepl = webdriver_colab_start()
# Selenium 経由でブラウザを操作する
url = 'https://www.deepl.com/ja/translator/l/en/ja'
driver_deepl.get(url)
time.sleep(5)
```

```python
en_text="This is a pen."

def deepl_websc(en_text, driver_deepl):
    # 英語を記入
    # en_text_area = driver.find_element_by_css_selector(".lmt__textarea.lmt__source_textarea.lmt__textarea_base_style") # 英語のテキストエリア
    en_text_area = driver_deepl.find_element(By.XPATH, """//textarea[@lang="en-EN"]""")
    en_text_area.clear() # テキストエリアをクリア
    en_text_area.send_keys(en_text) # 英語記入
    time.sleep(len(en_text)//100)

    jp_text_prev = "あああ"
    while 1:
        # 和訳の確認
        try:
            jp_text_area = driver_deepl.find_element(By.XPATH, """//textarea[@lang="ja-JP"]""")
            jp_text = jp_text_area.get_attribute("value")
        except:
            jp_text = ""


        if len(jp_text_prev) == len(jp_text):
            break
        else:
            jp_text_prev = jp_text
            time.sleep(10) # 翻訳に要する時間を確保

    return(jp_text)

deepl_websc(en_text, driver_deepl)

# これはペンです。
```


## まとめ
Google Colab + Selenium + Deeplで機械翻訳を実施しました．

## 参考サイト



<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">
