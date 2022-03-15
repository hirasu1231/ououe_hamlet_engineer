---
display: home
title: 'PythonでSpotifyAPIの情報から音楽をダウンロードする'
description: PythonでSpotifyAPIの情報から音楽をダウンロードします．
date: 2021-03-16
image: https://www.hamlet-engineer.com/image/spotify.png
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - Spotify
  - API
---

<!-- https://www.hamlet-engineer.com -->
PythonでSpotifyAPIの情報から音楽をダウンロードします．

ただし，[前回の記事](https://www.hamlet-engineer.com/posts/spotify05.html)でDBを作成済みであることを前提にしています．

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

## Spotify APIの導入
Spotify APIの導入は下記のサイトを参考にしてください．

[前回の記事](https://www.hamlet-engineer.com/posts/spotify05.html)

## 楽曲情報の抽出
楽曲情報の抽出は下記のサイトを参考にしてください．

[前回の記事](https://www.hamlet-engineer.com/posts/spotify05.html)

## ライブラリのインストール
下記のコードでライブラリをインストールします．
```python
!pip install spotdl
```

## 特定年代の情報を抽出
下記のコードで特定年代の情報を抽出します．
```python
import sqlite3

# dbの読み込み(sample.dbは自動で作成される)
con = sqlite3.connect('spotify_music.db')
# カーソルの設定
# https://www.postgresql.jp/document/9.2/html/plpgsql-cursors.html
cur = con.cursor()

year = 2020
# info_table(楽曲の情報)の情報抽出
cur.execute(f'''SELECT * FROM info_table WHERE release_date BETWEEN '{year}-01-01' AND '{year}-12-31';''')
data = cur.fetchall()
print(len(data))

# テーブル変更を保存
con.commit()

# dbとカーソルを閉じる
cur.close()
con.close()

# データフレームに格納
df = pd.DataFrame(data, columns = ['track_id', 'name', 'album', 'artist', 'release_date', 'country', 'length', 'popularity'])
# お気に入り降順にソート
df.sort_values('popularity', ascending=False, inplace=True)
# DFの表示
display(df.head(10))
```

## SpotifyのDBにダウンロード状況を保存
下記のコードでSpotifyのDBにダウンロード状況を保存します．

情報は下記の通りです．
- track_id：SpotifyのID
- name:楽曲名
- release_date：発売日
- country：楽曲の国
- popularity：人気度(再生回数+お気に入り数の総合得点)
- rannk：年代別ランキング
- youtube_id：youtuneのID

```python
import sqlite3

# dbの読み込み(sample.dbは自動で作成される)
con = sqlite3.connect('spotify_music.db')
# カーソルの設定
# https://www.postgresql.jp/document/9.2/html/plpgsql-cursors.html
cur = con.cursor()

# テーブル1:info_table(楽曲の情報)の作成
# テーブル名 　データ型 unique　: 重複禁止のカラム作成
cur.execute('''CREATE TABLE download_table
               (track_id text unique, 
               name text,
               release_date date,
               country text,
               popularity int,
               rannk int,
               youtube_id text)
               ''')

# テーブル変更を保存
con.commit()

# dbとカーソルを閉じる
cur.close()
con.close()
```

## ダウンロードの実行工程
ダウンロードの実行工程は下記の通りです．
1. DBの読み込み
2. 1970~2021年隔年で指定
3. 特定年代の音楽人気ランキングを出力
4. spotdlでダウンロード
5. YouTubeのIDの出力
6. mp3の移動
7. DBに格納する情報を整理
8. download_tableに格納

## 工程3_特定年代の音楽人気ランキングを出力
下記のコードでDBから情報を抽出を実行します．
```python
import sqlite3
import pandas as pd

# 特定年代の音楽人気ランキング
def year_music_ranking(year):
    # dbの読み込み(sample.dbは自動で作成される)
    con = sqlite3.connect('spotify_music.db')
    # カーソルの設定
    # https://www.postgresql.jp/document/9.2/html/plpgsql-cursors.html
    cur = con.cursor()

    # テーブル1:info_table(楽曲の情報)の格納
    # テーブル情報の抽出
    # to_date('2019-09-03', 'yyyy-mm-dd') AND to_date('2019-09-04', 'yyyy-mm-dd')
    cur.execute(f'''SELECT * FROM info_table WHERE release_date BETWEEN '{year}-01-01' AND '{year}-12-31';''')
    data = cur.fetchall()
    #print(len(data))

    # データフレームに格納
    df = pd.DataFrame(data, columns = ['track_id', 'name', 'album', 'artist', 'release_date', 'country', 'length', 'popularity'])
    # お気に入り降順にソート
    df.sort_values('popularity', ascending=False, inplace=True)
    #  indexの初期化
    df.reset_index(drop=True, inplace=True)

    # テーブル変更を保存
    con.commit()

    # dbとカーソルを閉じる
    cur.close()
    con.close()
    
    return df
```

## 工程5_YouTubeのIDを抽出
下記のコードでyoutubeのIDの抽出します．
```python
# youtubeのIDの出力
def output_youtubeID():
    # テキストを入力
    f = open('hoge.txt', 'r')
    # ターミナルの出力をリスト化
    terminallist = f.readlines()
    # youtubeのIDを出力
    for terminal in terminallist:
        if 'https://www.youtube.com/watch?v=' in terminal:
            youtubeID = terminal.split('https://www.youtube.com/watch?v=')[-1]
            return youtubeID
    return 0
```

## 工程6_mp3ファイルの移動
下記のコードでダウンロードしたmp3ファイルを特定のディレクトリに移動させます．
```python
import os 
from glob import glob
import subprocess

# mp3の移動
def move_mp3(year, rankn):
    # 保存ディレクトリの作成
    dl_dir = f"./mp3/{year}"
    os.makedirs(dl_dir, exist_ok=True)

    # mp3パス
    mp3_file1 = glob("./*.mp3")[0]

    import subprocess
    # ファイルの移動
    subprocess.run(["mv", mp3_file1, f"{dl_dir}/{str(rankn + 1).zfill(4)}_{os.path.basename(mp3_file1)}"])
```

## ダウンロードの実行
下記のコードでダウンロードを実行します．

ダウンロードの工程は下記の通りです．
1. DBの読み込み
2. 1970~2021年隔年で指定
3. 特定年代の音楽人気ランキングを出力
4. spotdlでダウンロード
5. youtubeのIDの出力
6. mp3ファイルの移動
7. DBに格納する情報を整理
8. download_tableに格納

```python
import sqlite3

# 工程1_DBの読み込み
con = sqlite3.connect('spotify_music.db')
# カーソルの設定
# https://www.postgresql.jp/document/9.2/html/plpgsql-cursors.html
cur = con.cursor()

# 工程2_1970~2021年隔年で指定
for year_rank in range(1970, 2022):
    # 工程3_特定年代の音楽人気ランキングを出力
    rank_df = year_music_ranking(year_rank)

    for rank_num in range(200):
        try:
            # 工程4_spotdlでダウンロード
            proc = subprocess.run(f"spotdl https://open.spotify.com/track/{rank_df['track_id'][rank_num]} > hoge.txt", shell=True)

            # 工程5_youtubeのIDの出力
            yid = output_youtubeID()

            # 工程6_mp3ファイルの移動
            move_mp3(year_rank, rank_num)

            # 工程7_DBに格納する情報を整理
            rank_info = [rank_df['track_id'][rank_num], 
                          rank_df['name'][rank_num], 
                          rank_df['release_date'][rank_num], 
                          rank_df['country'][rank_num], 
                          rank_df['popularity'][rank_num],
                          rank_num + 1,
                          yid]

            # 工程8_download_tableに格納
            cur.execute(f"INSERT INTO download_table VALUES ({rank_info});".replace('[', '').replace(']', ''))
            # テーブル変更を保存
            con.commit()

        except:
            print(f"ERROR track_")
    
# dbとカーソルを閉じる
cur.close()
con.close()
```

## まとめ
ここまでで，PythonでSpotifyAPIの情報から音楽をダウンロードしました．

## 参考サイト
[PythonでSpotify APIを使ってみる ~全ての音楽愛好家のためのSpotify API ep 1~](https://python-muda.com/python/spotify-api-ep-1/)

[PythonでSpotify API [情報の文字列検索]](https://qiita.com/EkatoPgm/items/289b2efcdb5af49843c1)

[Spotify 検索](https://support.spotify.com/jp/article/search/)

[Spotify API Search for Item](https://developer.spotify.com/documentation/web-api/reference/#/operations/search)

[ISO 3166-1 alpha-2 wiki](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)

[Spotify Web APIから分析用データセットをつくる](https://zenn.dev/yuriponx/articles/ccb87e276dc361)

[Billboard×Spotifyで「〇〇年代を代表する曲」を決めよう！](https://qiita.com/shionhonda/items/a44b563e8035fe9db259)

[Spotify.Tracks](https://hexdocs.pm/spotify_web_api/Spotify.Tracks.html)

[Pythonで2次元配列の重複行を一発で削除する](https://qiita.com/uuuno/items/b714d84ca2edbf16ea19)

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

