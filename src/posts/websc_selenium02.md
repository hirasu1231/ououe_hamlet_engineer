---
display: home
title: 'Python＋Docker＋Selenium＋Chromeでウェブスクレイピングをする part2'
description: Python＋Docker＋Selenium＋Chromeで甘茶の音楽工房ウェブスクレイピングします．本稿では，seleniumの操作を検索しながら必要な工程を実装します．
date: 2021-02-12
image: https://www.hamlet-engineer.com/image/amacha.jpeg
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - Docker
  - ウェブスクレイピング
---
Python＋Docker＋Selenium＋Chromeで甘茶の音楽工房ウェブスクレイピングします．本稿では，seleniumの操作を検索しながら必要な工程を実装します．jupyterだと楽です．<br>
<!-- more -->

作業用BGMとして[甘茶の音楽工房](https://amachamusic.chagasi.com/image_kurai.htm)の音楽をダウンロードして聞いていました．いい加減面倒臭くなってきたので，ウェブスクレイピングでダウンロードしていきます．<br>

## Seleniumの操作
### モジュール
```python
# coding: UTF-8
import requests
import urllib.request
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selene.driver import SeleneDriver
from webdriver_manager.utils import chrome_version
from webdriver_manager.chrome import ChromeDriverManager
```

### ページソースの表示
seleniumでイメージ音楽のページソースを取得します．
```python
# ページソースの表示
driver.page_source
```

### ページ一覧の取得
イメージ音楽のページから，2ページ目,3ページ目のURLを取得します．<br>
2ページ目,3ページ目のURLを示すclass名のpagerは1箇所しかないので,find_element_by_class_nameを使います．単数形のelementですので注意してください．
```python
# classで指定(1つ：find_element_by_class_name)
# ※ find_element!!
element = driver.find_element_by_class_name("pager")
# 2ページ目,3ページ目のURLを示すtagを取得
aPageTags = element.find_elements_by_tag_name("a")
# tagから2ページ目,3ページ目のURLを取得
for aPageTag in aPageTags:
    # tagからhref要素を取得
    page_url = aPageTag.get_attribute('href')
    print(page_url)
```

### WebElementのソース取得
find_element_by_class_name()で取得したWebElementのソースを確認します．
```python
print(element.get_attribute('innerHTML')) # WebElementからhtmlを取得
```

### mp3のダウンロード先のURL
イメージ音楽のページから，各mp3のダウンロード先のURLを取得します．<br>
イメージとしては，右クリックで「リンク先をダウンロード」する際の参照先となるURLを探す作業です．<br>
mp3のURLを示すclass名のdownloadは複数箇所あるので,find_elements_by_class_nameを使います．複数形のelementsですので注意してください．．<br>
取得した各mp3の詳細ページのURLを元にダウンロード先のURLに設定されていたので，ダウンロード先のURLはreplace()で置換して取得しました．

```python
# classで指定(複数：find_elements_by_class_name)
# ※ find_elements!!
elements = driver.find_elements_by_class_name("download")

for element in elements:
    #print(element.get_attribute('innerHTML')) # WebElementからhtmlを取得
    # mp3の詳細ページのURL,tagで取得
    aTag = element.find_element_by_tag_name("a")
    # mp3のダウンロードページのURL
    dlurl = aTag.get_attribute('href').replace('music_', 'mp3/').replace('.html', '.mp3')
```

### mp3のダウンロード
取得したmp3のURLからmp3ファイルをダウンロードします．イメージとしては，リンク先をダウンロードの作業です．
```python
dlfile = 'bgm/' + dlurl.split('/')[-1] # 保存ファイル名
urllib.request.urlretrieve(dlurl, dlfile) #ダウンロード実行:要はリンク先をダウンロード
```
## まとめ
ここまででおおよそのseleniumの操作を検索しながら，必要な工程を実装しました．次の記事でdef文でまとめようと思います．


## 参考サイト
[10分で理解する Selenium](https://qiita.com/Chanmoro/items/9a3c86bb465c1cce738a)<br>
[Dockerコンテナからseleniumを使ってスクレイピング](https://qiita.com/kei0919/items/f6f696169c92c936374c)<br>
[Python×SeleniumでWebスクレイピング実践](https://qiita.com/maroKanatani/items/e52984f37cc5474ccd98)<br>
[Selenium webdriverよく使う操作メソッドまとめ](https://qiita.com/mochio/items/dc9935ee607895420186)<br>
[Docker上でSeleniumとHeadless ChromeとPython3を動かす](https://qiita.com/sikkim/items/447b72e6ec45849058cd)<br>
[【Python】seleniumでWebElementからhtmlを取得する](https://engineeeer.com/python-selenium-webelement-get-html/)<br>
[Python + Selenium + Chrome でファイル保存まわり](https://qiita.com/memakura/items/f80d2e2c59514cfc14c9)
