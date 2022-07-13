---
display: home
title: 'Python＋Selenium＋ChromeでDeepLの翻訳を実行する'
description: Python＋Selenium＋ChromeでDeepLの翻訳を実行します．
date: 2021-08-14
image: https://www.hamlet-engineer.com/image/deepl_logo.png
categories: 
  - Python
tags:
  - Python
  - jupyterNotebook
  - Machine_Translate
---
<!-- https://www.hamlet-engineer.com -->
Excel等ですでに翻訳したい文をまとめている場合，いちいちコピペしてDeepLに翻訳させるのは面倒なので，Python＋Selenium＋ChromeでDeepLの翻訳を実行します．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>


[[toc]]

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

## Selenium＋Chromeの起動
下記のコードでSelenium＋Chromeを起動させ，DeepLに接続します．

```python
import time
import requests,os,bs4
from selenium import webdriver
from selenium.webdriver import Chrome
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selene.driver import SeleneDriver
from webdriver_manager.utils import chrome_version
from webdriver_manager.chrome import ChromeDriverManager

# ローカル上でselenium.webdriverの起動
def webdriver_local_start():
    # versionに応じたchrome driver のインストール
    version = chrome_version()
    url = 'http://chromedriver.storage.googleapis.com/LATEST_RELEASE_' + version
    response = requests.get(url)

    options = Options()
    options.add_argument('--headless')

    # インストールしたchrome driverでchromeを起動
    driver = SeleneDriver.wrap(webdriver.Chrome(
        executable_path=ChromeDriverManager().install(), 
        chrome_options=options))
    
    return driver

# selenium.webdriverの起動(ローカル)
driver = webdriver_local_start()

# Selenium 経由でブラウザを操作する
url = 'https://www.deepl.com/ja/translator'
driver.get(url)
print(driver.current_url)
# https://www.deepl.com/ja/translator
```

## 翻訳前の文を入力

### 翻訳前言語のメニューの展開
下記のコードで翻訳前言語のメニューを開きます．

```python
# 言語の設定
languages = driver.find_elements_by_class_name("lmt__language_select__active__title")
print(languages[0].text)
# 言語メニューを開く
languages[0].click()

# 言語
```

### 翻訳前言語の選択
下記のコードで翻訳前言語の選択します．

```python
# 言語メニュー
language_menu = driver.find_element_by_class_name("lmt__language_select__menu")
language_buttons = language_menu.find_elements_by_tag_name("button")

# 英語を選択
for language_button in language_buttons:
    if language_button.text=='英語':
        # 画面外のボタンをクリック
        driver.execute_script("arguments[0].click();", language_button)
        break

# 英語と選択したか確認
languages = driver.find_elements_by_class_name("lmt__language_select__active__title")
print(languages[0].text)

# 英語
```

### 翻訳前の文を記入
下記のコードで翻訳前の文を記入します．

```python
# 英語を記入
en_text_area = driver.find_element_by_css_selector(".lmt__textarea.lmt__source_textarea.lmt__textarea_base_style") # 英語のテキストエリア
en_text_area.clear() # テキストエリアをクリア
en_text_area.send_keys("This is a pen.") # 英語記入
print(en_text_area.get_attribute("value")) # 記入した文字列確認

time.sleep(5) # 翻訳に要する時間を確保

# This is a pen.
```

## 翻訳後の文を出力
下記のコードで翻訳後の文を出力します．

```python
# 和訳の確認
jp_text_area = driver.find_element_by_css_selector(".lmt__textarea.lmt__target_textarea.lmt__textarea_base_style")
print(jp_text_area.get_attribute("value"))

# 'これはペンです。'
```

## まとめ
以上で，Python＋Selenium＋ChromeでDeepLの翻訳を実行しました．

ただ，やりすぎると途中で止められるので，改善は必要です．

## 参考サイト
[10分で理解する Selenium](https://qiita.com/Chanmoro/items/9a3c86bb465c1cce738a)<br>
[Docker上でSeleniumとHeadless ChromeとPython3を動かす](https://qiita.com/sikkim/items/447b72e6ec45849058cd)<br>
[Dockerコンテナからseleniumを使ってスクレイピング](https://qiita.com/kei0919/items/f6f696169c92c936374c)<br>
[Python×SeleniumでWebスクレイピング実践](https://qiita.com/maroKanatani/items/e52984f37cc5474ccd98)<br>

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>