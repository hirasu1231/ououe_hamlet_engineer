---
display: home
title: 'Python＋Seleniumでカラ鉄のランキングをウェブスクレイピングする'
description: カラ鉄のランキングをウェブスクレイピングします．
date: 2023-3-24
image: https://www.hamlet-engineer.com/image/selenium.jpg
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - ウェブスクレイピング
  - Selenium
---

<!-- https://www.hamlet-engineer.com -->
カラ鉄のランキングをウェブスクレイピングします．

ただし，[前回の記事]()でDBを作成済みであることを前提にしています．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## selenium.webdriverの起動
selenium.webdriverの起動は本サイトの[Python＋Docker＋Selenium＋Chromeでウェブスクレイピングをする part3](https://hirasu1231.github.io/hamlet_engineer/posts/2021/02/13/websc-selenium03.html)で作成したものを使います．

```python
# coding: UTF-8
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selene.driver import SeleneDriver
from webdriver_manager.utils import chrome_version
from webdriver_manager.chrome import ChromeDriverManager

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

# Selenium 経由でブラウザを操作する
url = 'https://www.karatetsu.com/vocala/pickup/ranking.php'
driver.get(url)
print(driver.current_url)
# 出力:https://amachamusic.chagasi.com/image_ayashii.html
```

## ランキング情報の整理
下記のコードでランキング情報のスクレイピング・整理を実行します．

```python
# テーブルの情報を抽出
tds = [Item.find_elements(By.TAG_NAME, "td") for Item in Items]

music_infos = []
for tds_infos in tds:
    # 各セルを取得
    td_list = [tds_info.text for tds_info in tds_infos]
    
    if td_list[0] == '順位':
        continue
    if len(td_list[0]) > 0:
        infos = [int(td_list[0].replace('位', ''))] + td_list[1:]
        music_infos = music_infos + [infos]
        
    else:
        break
        
# 情報の確認 & SQL構文の作成
music_info = music_infos[0]
music_info = [music_info[0]] + music_info[2:]
print(f"INSERT INTO karatetsu_202112_all_ranking VALUES ({music_info});".replace('[', '').replace(']', ''))
```

## サイトをスクロール
最初に読み込んだ際はtop100くらいしか読み込まれないので，最下部までスクロールして100位以降の楽曲も表示されるようにします．

そして．5秒待機してまたスクロールするのを24回繰り返して，表示楽曲数が変化しなければスクレイピングを終了します．
```python
import time
import itertools
from selenium.webdriver.common.by import By

times = 0
item_count = 0
music_list = []
while times < 24:
    # 最下部へスクロール
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    # class_name = loadItem
    # テーブルの情報を抽出
    tables = driver.find_elements(By.TAG_NAME, "table")
    trs = [table.find_elements(By.TAG_NAME, "tr") for table in tables]
    Items = list(itertools.chain.from_iterable(trs))

    if item_count!=len(Items):
        print(len(Items))
        item_count = len(Items)
    else:
        times += 1
        time.sleep(5)
```

## SQLの格納

### テーブルの作成
下記のコードでランキング情報を格納します．
```python
import sqlite3

# dbの読み込み(sample.dbは自動で作成される)
con = sqlite3.connect('karaoke.db')
# カーソルの設定
# https://www.postgresql.jp/document/9.2/html/plpgsql-cursors.html
cur = con.cursor()

# テーブル1:ランキングテーブルの作成
# テーブル名 　データ型 unique　: 重複禁止のカラム作成
cur.execute('''CREATE TABLE karatetsu_202112_vocala_ranking
               (rank int, 
               title text,
               track text,
               karatetsu_id int unique
               )
               ''')

# テーブルの中身を削除
# cur.execute('DELETE FROM karatetsu_2020_all_ranking;')
# テーブルを削除
# cur.execute('DROP TABLE karatetsu_202112_anime_ranking;')

# テーブル変更を保存
con.commit()

# dbとカーソルを閉じる
cur.close()
con.close()
```

### 情報を格納
下記のコードで情報をテーブルに格納します．

```python
import sqlite3

# dbの読み込み(sample.dbは自動で作成される)
con = sqlite3.connect('karaoke.db')
# カーソルの設定
# https://www.postgresql.jp/document/9.2/html/plpgsql-cursors.html
cur = con.cursor()

# 情報をテーブルに格納
for music_info in music_infos:
    # music_info = [music_info[0]] + music_info[2:]
    cur.execute(f"INSERT INTO karatetsu_202112_vocala_ranking VALUES ({music_info});".replace('[', '').replace(']', ''))

# テーブル変更を保存
con.commit()

# dbとカーソルを閉じる
cur.close()
con.close()
```

### 情報を表示
下記のコードでテーブルに格納されている情報をします．
```python
import sqlite3

# dbの読み込み(sample.dbは自動で作成される)
con = sqlite3.connect('karaoke.db')
# カーソルの設定
# https://www.postgresql.jp/document/9.2/html/plpgsql-cursors.html
cur = con.cursor()


# テーブル1:info_table(楽曲の情報)の格納
# tracks[0][0:8]
cur.execute(f"SELECT * FROM karatetsu_202112_vocala_ranking;")
data = cur.fetchall()

# テーブル変更を保存
con.commit()

# dbとカーソルを閉じる
cur.close()
con.close()
```

## まとめ
ここまでで，PythonでSpotifyAPIの情報から音楽をダウンロードしました．

## 参考サイト
[カラオケの鉄人 アニソンランキング](https://www.karatetsu.com/animegame/pickup/ranking.php)

[カラ鉄HP](https://www.karatetsu.com/index.shtml)

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
