---
display: home
title: 'Python＋Selenium＋ChromeでウェブスクレイピングしてYouTubeの動画をダウンロードする'
description: Python＋Selenium＋ChromeでウェブスクレイピングしてYouTubeの動画をダウンロードします．本稿では，OfflibertyをSeleniumでダウンロードします
date: 2021-02-15
image: https://www.hamlet-engineer.com/image/offliberty.png
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - ウェブスクレイピング
---
Python＋Selenium＋ChromeでウェブスクレイピングしてYouTubeの動画をダウンロードします．本稿では，OfflibertyをSeleniumでダウンロードします<br>
<!-- more -->

前回までの[甘茶の音楽工房のダウンロード](https://www.hamlet-engineer.com/posts/websc_selenium01.html)を実施していましたが，せっかくなのでseleniumをとうしたブラウザの操作をしてみます．<br>
本稿では，[Offliberty](http://offliberty.io)というYouTubeのURLをコピペすればダウンロードできるサイトがあったので，これの操作をSeleniumでします．<br>
今回は練習でしたものですので，多分に悪ふざけが入っていますし，def文でまとめてはいません．



[[toc]]

## selenium.webdriverの起動
selenium.webdriverの起動は本サイトの[Python＋Docker＋Selenium＋Chromeでウェブスクレイピングをする part3](https://hirasu1231.github.io/hamlet_engineer/posts/2021/02/13/websc-selenium03.html)で作成したものを使います．
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

## SeleniumでGoogle検索する
まず，例題として下記のコードでSeleniumでGoogle検索を実施します．
```python
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

# selenium.webdriverの起動(ローカル)
driver = webdriver_local_start()

#指定したURLに遷移する
driver.get("https://www.google.co.jp")
#検索テキストボックスの要素を名前から取得
element = driver.find_element_by_name('q') 

#検索テキストボックスでシフトボタンを押下しながら"selenium"を入力
element.send_keys(Keys.SHIFT,"selenium")
#カーソルを１文字分左にずらす
element.send_keys(Keys.ARROW_LEFT)
#BackSpaceを１回押下し１文字分消去
element.send_keys(Keys.BACK_SPACE)
#Enterキーを押下する
element.send_keys(Keys.ENTER)
print(driver.current_url)
```
printされたURLをブラウザに表示し，「SELENIM」が表示されていたら，OKです．
![](/image/websc_selenium04/search.png)

## offlibertyでyoutubeをダウンロード
ここからは[offliberty](http://offliberty.io)にyoutubeのURLをコピペして動画をダウンロードします．<br>
![](/image/websc_selenium04/offliberty.png)

今回，ダウンロードするのはSIRENの[奉神御詠歌【ほうしんごえいか】 歌詞付き](https://www.youtube.com/watch?v=ZOX6JbecV3Y)です．<br>
コピペした後は読み込みに時間がかかるので，奉神御詠歌の歌詞が流れるようにしてます．(<-悪ふざけ)<br>
うまくいけば，1周半で読み込みが完了します．たまに，読み込みがうまくいかない時があるので複数回試す必要があります．<br>
後述の理由でdef文でまとめてはいません．

```python
import os
import sys
import urllib.request
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

'''offlibertyでyoutubeをダウンロード'''
# selenium.webdriverの起動(ローカル)
driver = webdriver_local_start()

#指定したURLに遷移する
driver.get("http://offliberty.io")

# youtubeのURL
url = 'https://www.youtube.com/watch?v=ZOX6JbecV3Y'
# URL入力箇所を取得
element = driver.find_element_by_class_name("track")
# URLを入力
element.send_keys(url)
#Enterキーを押下する
element.send_keys(Keys.ENTER)

# 読み込み中の処理
# WARUFUZAKE
import time
houshin = ['敬い申し上げる',
           '天におわす 御主（おんあるじ）',
           '光り輝く御姿で 現れ給う',
           'ぐるりや　三つの御印を',
           '持って拝み奉る',
           '一つや　二つ　三つを',
           '過ぎたれば　天の理（ことわり）',
           '我ら　父母の咎（とが）に',
           '罰を加え給うことなし',
           '御主（おんあるじ）のおいでます',
           '楽園にお連れ給う',
           '-------------']
i = 0
elements = []
while len(elements)==0:
    # エラー防止のためにelementsにしてリストで帰って来るようにする．
    elements = driver.find_elements_by_class_name("download")
    i += 1
    houshin_text = houshin[i%len(houshin)]
    print(houshin_text)
    time.sleep(4)
    # 読み込みに4分以上かかれば中止する
    if i >= 60:
        print('ダウンロード失敗')
        sys.exit() # 実行中止

# ダウンロードのリンク先
download_url = elements[0].get_attribute('href')

# 出力ファイル
outdir = './youtube/'
os.makedirs(outdir, exist_ok=True)
title_text = '奉神御詠歌【ほうしんごえいか】 歌詞付き'
file_name = os.path.join(outdir, title_text + '.mp4')
# ダウンロード開始
print('ダウンロード開始:'+ title_text)
urllib.request.urlretrieve(download_url, file_name)
print('ダウンロード完了')
```

## まとめ
seleniumに慣れるために，[offliberty](http://offliberty.io)というyoutubeをダウンロードしましたが，ぶっちゃけ上記のコードを使うくらいなら[pytube](https://python-pytube.readthedocs.io/en/latest/#)を使う方が楽ですので，def文でまとめてはいません．

## 参考サイト
[10分で理解する Selenium](https://qiita.com/Chanmoro/items/9a3c86bb465c1cce738a)<br>
[Selenium webdriverよく使う操作メソッドまとめ](https://qiita.com/mochio/items/dc9935ee607895420186)<br>
[【Python】seleniumでWebElementからhtmlを取得する](https://engineeeer.com/python-selenium-webelement-get-html/)<br>
[Python + Selenium + Chrome でファイル保存まわり](https://qiita.com/memakura/items/f80d2e2c59514cfc14c9)<br>
[Python/SeleniumでChrome自動Google検索](https://watlab-blog.com/2019/08/11/selenium-google-search/)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>