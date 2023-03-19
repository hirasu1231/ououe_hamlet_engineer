---
display: home
title: 'Python + seleniumでポケモンの画像をウェブスクレイピングする'
description: Python + seleniumでポケモンの画像をウェブスクレイピングで収集します．
date: 2023-3-31
image: https://www.hamlet-engineer.com/image/selenium.jpg
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - selenium
---
Python + seleniumでポケモンの画像をウェブスクレイピングで収集します．<br>

<!-- more -->

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

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

## ライブラリのインストール
下記のコマンドでライブラリをインストールします．
```python
!pip install selenium

!apt-get update
!apt install chromium-chromedriver
!cp /usr/lib/chromium-browser/chromedriver /usr/bin
```

## 画像の収集

### ドライバーの起動
下記のコードでドライバーから[ポケモンのサイト](https://zukan.pokemon.co.jp/)を開きます．
```python
from selenium import webdriver

# ドライバーの設定
options = webdriver.ChromeOptions()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

# ドライバーの起動
driver = webdriver.Chrome('chromedriver',options=options)
# サイトを開く
url = 'https://zukan.pokemon.co.jp/'
driver.get(url)
```

### スクロールの対応
[ポケモンのサイト](https://zukan.pokemon.co.jp/)は縦にスクロールする度に，ポケモンの表示数が増えるようになっています．

そこで，下記のコードでseleniumで全ポケモンが表示されるまで，縦にスクロールしていきます．

```python
import time

times = 0
item_count = 0

# 60(5 * 12)秒間で表示数が変化しない場合に終了
while times < 12:
    # 最下部へスクロール
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    # class_name = loadItem
    Items = driver.find_elements_by_class_name('loadItem')

    if item_count!=len(Items): 
        # ポケモンの表示数
        print(len(Items))
        item_count = len(Items)
    else:
        # 5秒ごとに確認
        times += 1
        time.sleep(5)
```

### 画像のダウンロード
下記のコードで画像のダウンロードを実行します．

```python
import os
import requests

# 保存ディレクトリの作成
os.makedirs('pokemon', exist_ok=True)

for Item in Items:
    # 画像情報の取得
    img_name = Item.get_attribute("id").replace('item', 'pokemon')
    img_url = Item.find_element_by_tag_name("img").get_attribute("src")

    # ダウンロードの実行
    response = requests.get(img_url)
    file_name = f'./pokemon/{img_name}.png'
    print(file_name)

    image = response.content
    with open(file_name, "wb") as f:
        f.write(image)
```

### 収集画像の情報を整理
下記のコードで画像収集したポケモンの情報を整理しcsvで出力します．

ポケモンの情報は，「サイトでのID，名前，タイプ1・２」です．

```python
import glob
import pandas as pd

img_ids = glob.glob('pokemon/*')
img_ids = [img_id.replace('pokemon/pokemon', '').replace('.png', '') for img_id in img_ids]

csv_list = []
for img_id in img_ids:
    # detailのURL
    datail_url = f'https://zukan.pokemon.co.jp/detail/{img_id}'
    driver.get(datail_url)

    # ID
    ID = datail_url.split('/')[-1]
    # ポケモン名
    name = driver.find_element_by_class_name("name").text
    # タイプ
    types = driver.find_element_by_css_selector(".content__detail-features.js-type")
    types = types.find_elements_by_tag_name("a")
    types = [_type.text for _type in types]
    if len(types)==1:
        types.append('-')
    # リスト化
    csv_list.append([ID, name, types[0], types[1]])

# csv出力
df = pd.DataFrame(csv_list, columns=['ID', 'name', 'type1', 'type2'])
df.to_csv('pokemon.csv', index=False)
```

## まとめ
Python + seleniumでポケモンの画像をウェブスクレイピングで収集しました．

この画像を元にGANで新規ポケモンを生成しようと思います．

## 参考サイト
[GAN (Generative Adversarial Networks)：敵対的生成ネットワーク](https://blog.negativemind.com/2019/06/22/generative-adversarial-networks/)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>