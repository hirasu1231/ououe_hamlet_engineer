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
  - jupyter
  - 機械翻訳
---
<!-- https://www.hamlet-engineer.com -->
Excel等ですでに翻訳したい文をまとめている場合，いちいちコピペしてDeepLに翻訳させるのは面倒なので，Python＋Selenium＋ChromeでDeepLの翻訳を実行します．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>


[[toc]]

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

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

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>