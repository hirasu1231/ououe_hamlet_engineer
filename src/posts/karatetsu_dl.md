---
display: home
title: 'Python＋Seleniumでカラ鉄のランキングの楽曲をダウンロードする'
description: Python＋Seleniumでカラ鉄のランキングの楽曲をダウンロードします．
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
Python＋Seleniumでカラ鉄のランキングの楽曲をダウンロードします．

ただし，[前回の記事]()でDBを作成済みであることを前提にしています．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ライブラリのインストール
下記のコードでライブラリをインストールします．
```python
!pip install yt_dlp
```

## youtubeでの検索 & ダウンロード

### 関数の作成
下記の関数でyoutubeでの検索とダウンロードを実行できます．

```python
import os
import glob
import shutil

import urllib.request

import mutagen
import yt_dlp as youtube_dl
from mutagen.easyid3 import EasyID3
from mutagen.id3 import APIC, ID3
from mutagen.mp3 import MP3

# アーティスト名・曲名で検索とダウンロード
def search_yt_dlp(download_directory, name, artist, rank_num):
    # 出力ファイルの設定
    file_name = f"{artist}-{name}".replace(":", "").replace("\"", "").replace("\'", "").replace("\\u3000", "").replace("／", "_").replace("．", "_")
    file_path = os.path.join('./', file_name)
    print(file_path)
    outtmpl = f"{file_path}.%(ext)s"
    
    # youtubeの検索設定
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': outtmpl,
        'default_search': 'ytsearch',
        'noplaylist': True,
        'postprocessor_args': ['-metadata', 'title=' + name,
                           '-metadata', 'artist=' + artist]
    }

    # 出力拡張子(.mp3)の情報
    mp3_postprocess_opts = {
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192',
    }
    ydl_opts['postprocessors'] = [mp3_postprocess_opts.copy()]
    
    # youtubeの検索実行
    query = f"{artist} - {name}".replace(":", "").replace("\"", "").replace("\\u3000", "")
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        try:
            ydl.download([query])
        except Exception as e:
            log.debug(e)
            print('Failed to download: {}, please ensure YouTubeDL is up-to-date. '.format(query))
            # continue
            return 0
            
    # 新規ディレクトリ
    os.makedirs(download_directory, exist_ok=True)
    _dir = f"{download_directory}/{str(rank_num).zfill(6)}_"
    # パス名
    path = glob.glob('./*.mp3')[0]
    # 半角変換
    path_han = path.translate(str.maketrans({chr(0xFF01 + i): chr(0x21 + i) for i in range(94)}))
    # ファイル移動
    shutil.move(path, path_han.replace('./', _dir))
    
    return 1
```

### youtubeでの検索 & ダウンロードの実行
下記のコードでyoutubeでの検索とダウンロードを実行します．

```python
# 引数
rank_num = 2
download_directory = './karaoke/anime_202112'
name = '残酷な天使のテーゼ'
artist = '高橋\\u3000洋子'

# 検索 & ダウンロード実行
search_yt_dlp(download_directory, name, artist, rank_num)
```

## DBからダウンロード
DBを参照して，ダウンロードを実行します．

### DBから情報を抽出
下記のコードでBから情報を抽出します．
```python
import sqlite3

# dbの読み込み(sample.dbは自動で作成される)
con = sqlite3.connect('karaoke.db')
# カーソルの設定
# https://www.postgresql.jp/document/9.2/html/plpgsql-cursors.html
cur = con.cursor()

# DBから情報を抽出
cur.execute(f"SELECT * FROM karatetsu_202112_anime_ranking;")
data = cur.fetchall()

# テーブル変更を保存
con.commit()

# dbとカーソルを閉じる
cur.close()
con.close()
```

### DBからダウンロード
下記のコードでダウンロードを実行します．
```python
download_directory = './karaoke/anime_202112'
os.makedirs(download_directory , exist_ok=True)

for i in range(len(data)):
    # 引数
    rank_num = data[i][0]
    name = data[i][1]
    artist = data[i][2]
    _id = data[i][3]
    print(download_directory, name, artist, rank_num, _id)
    # ダウンロード実行
    res = search_yt_dlp(download_directory, name, artist, rank_num)
    # DBに保存
    if res:
        # dbの読み込み(sample.dbは自動で作成される)
        con = sqlite3.connect('karaoke.db')
        # カーソルの設定
        # https://www.postgresql.jp/document/9.2/html/plpgsql-cursors.html
        cur = con.cursor()

        # テーブル1:info_table(楽曲の情報)の作成
        # テーブル名 　データ型 unique　: 重複禁止のカラム作成
        cur.execute(f"INSERT INTO download_table_all VALUES ({_id}, '{download_directory.split('/')[-1]}', {rank_num}, '{name}', '{artist}');")
        # テーブル変更を保存
        con.commit()

        # dbとカーソルを閉じる
        cur.close()
        con.close()
```

## まとめ
Python＋Seleniumでカラ鉄のランキングの楽曲をダウンロードしました．

## 参考サイト
[SathyaBhat/spotify-dl](https://github.com/SathyaBhat/spotify-dl)

[spotify_dl/spotify_dl.py](https://github.com/SathyaBhat/spotify-dl/blob/master/spotify_dl/spotify_dl.py)

[PythonでYouTubeの動画や音声を保存する](https://hihan.hatenablog.com/entry/2020/09/14/143630)

[カラオケの鉄人 アニソンランキング](https://www.karatetsu.com/animegame/pickup/ranking.php)

[カラ鉄HP](https://www.karatetsu.com/index.shtml)

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
