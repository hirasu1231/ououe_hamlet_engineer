---
display: home
title: 'Python＋Docker＋Selenium＋Chromeでウェブスクレイピングをする part3'
description: Python＋Docker＋Selenium＋Chromeで甘茶の音楽工房ウェブスクレイピングします．本稿では，前回のまでの工程をdef文を用いて定義します．
date: 2021-02-13
image: https://www.hamlet-engineer.com/image/amacha.jpeg
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - Docker
  - ウェブスクレイピング
---
Docker＋Selenium＋Chromeで甘茶の音楽工房ウェブスクレイピングします．本稿では，前回のまでの工程をdef文を用いて定義します．<br>
<!-- more -->

作業用BGMとして[甘茶の音楽工房](https://amachamusic.chagasi.com/image_kurai.html)の音楽をダウンロードして聞いていました．いい加減面倒臭くなってきたので，ウェブスクレイピングでダウンロードしていきます．

## スクリプト
### モジュール
```python
# coding: UTF-8
import os
import requests
import urllib.request
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selene.driver import SeleneDriver
from webdriver_manager.utils import chrome_version
from webdriver_manager.chrome import ChromeDriverManager
```

### selenium.webdriverの起動(docker)
```python
# docker上でselenium.webdriverの起動
def webdriver_start():
    # Chrome のオプションを設定する
    options = webdriver.ChromeOptions()

    # Selenium Server に接続する
    driver = webdriver.Remote(
        command_executor='http://localhost:4444/wd/hub',
        options=options,
    )
    return driver
```
### selenium.webdriverの起動(ローカル)
```python
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
```

### webドライバーで甘茶の音楽工房の音楽をダウンロード
イメージ音楽のページから，2ページ目,3ページ目のURLを取得します．
```python
# webドライバーで甘茶の音楽工房の音楽をダウンロード
def amacha_page_DL(driver):
    # 出力ディレクトリ作成
    os.makedirs('bgm', exist_ok=True)
    # WebElementから各mp3のダウンロード先URLを取得
    elements = driver.find_elements_by_class_name("download")

    for element in elements:
        #print(element.get_attribute('innerHTML')) # WebElementからhtmlを取得
        # mp3の詳細ページのURL,tagで取得
        aTag = element.find_element_by_tag_name("a")
        # mp3のダウンロードページのURL
        dlurl = aTag.get_attribute('href').replace('music_', 'mp3/').replace('.html', '.mp3')
        dlfile = 'bgm/' + dlurl.split('/')[-1]
        urllib.request.urlretrieve(dlurl, dlfile) #ダウンロード実行:要はリンク先をダウンロード
    return driver.current_url
```

### webドライバーで甘茶の音楽工房のイメージ音楽ごとのページ情報を取得
```python
# webドライバーで甘茶の音楽工房のイメージ音楽ごとのページ情報を取得
def amacha_page_tags(driver):
    # WebElementから次ページのURLを取得
    # classで指定(1つ：find_element_by_class_name:element!!)
    element = driver.find_element_by_class_name("pager")
    # 次ページのURL,tagで取得
    aPageTags = element.find_elements_by_tag_name("a")
    
    return aPageTags
```

### 甘茶の音楽工房の全ページ中の音楽をダウンロード
```python
# 甘茶の音楽工房の全ページ中の音楽をダウンロード
def amacha_DL(image_url):
    # 甘茶の音楽工房にアクセス
    driver = webdriver_start()
    driver.get(image_url)
    # イメージ音楽の最初のページをダウンロード
    print(amacha_page_DL(driver))
    # 2ページ目,3ページ目のURLを示すtagを取得
    aPageTags = amacha_page_tags(driver)
    # tagから2ページ目,3ページ目のURLを取得
    for aPageTag in aPageTags:
        # tagからhref要素を取得
        page_url = aPageTag.get_attribute('href')
        # 次ページのURLにアクセス
        next_driver = webdriver_start()
        next_driver.get(page_url)
        # ダウンロード
        print(amacha_page_DL(next_driver))
```
### 甘茶の音楽工房のダウンロード実行
```python
image_music_url = ['https://amachamusic.chagasi.com/image_kurai.html']
amacha_DL(image_music_url)
```

## まとめ
[甘茶の音楽工房](https://amachamusic.chagasi.com/image_kurai.htm)の音楽のダウンロードを実装しました．別シリーズでダウンロードしたmp3を乱数で任意の再生時間で結合してみようと思います．


## 参考サイト
[10分で理解する Selenium](https://qiita.com/Chanmoro/items/9a3c86bb465c1cce738a)<br>
[Python + Selenium + ChromeでChromeバージョンに合ったChromeDriverを自動インストールする方法](https://qiita.com/UrTom/items/bcd4d28443826ed92921)<br>
[Dockerコンテナからseleniumを使ってスクレイピング](https://qiita.com/kei0919/items/f6f696169c92c936374c)<br>
[Python×SeleniumでWebスクレイピング実践](https://qiita.com/maroKanatani/items/e52984f37cc5474ccd98)<br>
[Selenium webdriverよく使う操作メソッドまとめ](https://qiita.com/mochio/items/dc9935ee607895420186)<br>
[Docker上でSeleniumとHeadless ChromeとPython3を動かす](https://qiita.com/sikkim/items/447b72e6ec45849058cd)<br>
[【Python】seleniumでWebElementからhtmlを取得する](https://engineeeer.com/python-selenium-webelement-get-html/)<br>
[Python + Selenium + Chrome でファイル保存まわり](https://qiita.com/memakura/items/f80d2e2c59514cfc14c9)
