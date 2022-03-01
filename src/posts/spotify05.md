---
display: home
title: 'PythonでSpotify APIを使って1970年から2021年までの楽曲情報を抽出する'
description: PythonでSpotify APIを使って1970年から2021年までの楽曲情報を抽出しDBに格納します．
date: 2022-03-05
image: https://www.hamlet-engineer.com/image/spotify.png
categories: 
  - Python
tags:
  - Python
  - jupyter
  - Spotify
  - Spotify_API
  - API
---

<!-- https://www.hamlet-engineer.com -->
PythonでSpotify APIを使って1970年から2021年までの楽曲情報を抽出しDBに格納します．

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

[]()

## 楽曲情報の抽出
楽曲情報の抽出は下記のサイトを参考にしてください．

[]()

## DBの作成
本稿では，下記のDBを作成します．
- info_table：楽曲情報を格納
- feature_table：楽曲特徴を格納

### info_tableの作成
下記のコードでinfo_tableを作成します．
```python
import sqlite3

# dbの読み込み(sample.dbは自動で作成される)
con = sqlite3.connect('spotify_music.db')
# カーソルの設定
# https://www.postgresql.jp/document/9.2/html/plpgsql-cursors.html
cur = con.cursor()

# テーブル1:info_table(楽曲の情報)の作成
# テーブル名 　データ型 unique　: 重複禁止のカラム作成
cur.execute('''CREATE TABLE info_table
               (track_id text unique, 
               name text,
               album text,
               artist text,
               release_date date,
               country text,
               length int,
               popularity int)
               ''')

# テーブル変更を保存
con.commit()

# dbとカーソルを閉じる
cur.close()
con.close()
```

### feature_tableの作成
下記のコードでfeature_tableを作成します．
```python
import sqlite3

# dbの読み込み(sample.dbは自動で作成される)
con = sqlite3.connect('spotify_music.db')
# カーソルの設定
# https://www.postgresql.jp/document/9.2/html/plpgsql-cursors.html
cur = con.cursor()

# テーブル2:feature_table(楽曲の特徴情報)の作成
# テーブル名 　データ型 unique　: 重複禁止のカラム作成
cur.execute('''CREATE TABLE feature_table
               (track_id text unique, 
               key int,
               mode int,
               danceability float,
               acousticness float,
               energy float,
               instrumentalness float,
               liveness float,
               loudness float,
               speechiness float,
               tempo float,
               time_signature int,
               valence float)
               ''')

# テーブル変更を保存
con.commit()

# dbとカーソルを閉じる
cur.close()
con.close()
```

## 楽曲情報の整理
楽曲情報と楽曲特徴を別のテーブルに格納するために，下記のコードで楽曲情報と楽曲特徴を整理します．

```python
def getTrackInfo(track_id, meta):
    name = meta['name']
    album = meta['album']['name']
    artist = meta['album']['artists'][0]['name']
    release_date = meta['album']['release_date']
    country = meta['external_ids']['isrc'][0:2]
    length = meta['duration_ms']
    popularity = meta['popularity']

    track_info = [track_id, name, album, artist, release_date, country, length, popularity]
    return track_info

def getTrackFeatures(track_id, features):
    key = features[0]['key']
    mode = features[0]['mode']
    danceability = features[0]['danceability']
    acousticness = features[0]['acousticness']
    energy = features[0]['energy']
    instrumentalness = features[0]['instrumentalness']
    liveness = features[0]['liveness']
    loudness = features[0]['loudness']
    speechiness = features[0]['speechiness']
    tempo = features[0]['tempo']
    time_signature = features[0]['time_signature']
    valence = features[0]['valence']

    track_features = [track_id, key, mode, danceability, acousticness, energy, instrumentalness, liveness, loudness, speechiness, tempo, time_signature, valence]
    return track_features
```

## 1970年から2021年までの楽曲情報を抽出
下記のコードで邦楽情報の抽出を実行します．

工程は下記の通りです．
1. SpotifyAPIの起動
2. 検索年を指定(1970~2021)
3. offsetを指定
4. 検索実行
5. 楽曲IDを取得(external_idsなしは省く)
6. `meta`に楽曲情報に入力
7. `external_ids`より邦楽か判定する(external_idsなしは省く)
8. 楽曲情報を整理
9. info_table(楽曲情報)に格納
10. `spotify.audio_features()`で楽曲特徴を抽出
11. 楽曲特徴を整理
12. feature_table(楽曲特徴)に格納

```python
import time
import spotipy
import pprint
import pandas as pd
from spotipy.oauth2 import SpotifyClientCredentials

# APIのIDとキー
MyID = "****************" #client ID
MySecret= "****************"  #client secret


# 工程1_spotifyAPI起動
ccm = SpotifyClientCredentials(client_id = MyID, client_secret = MySecret)
spotify = spotipy.Spotify(client_credentials_manager = ccm)

# 工程2_検索年を指定(1970~2021)
for year in range(2004, 2022):
    # 工程3_offsetを指定
    for num in range(0, 1000, 50):
        # 工程4_検索実行
        result = spotify.search(q=f'year:{year}', limit=50, offset=num, type='track', market='JP')

        for track in result['tracks']['items']:
            # 工程5_楽曲IDを取得
            track_id = track['id']
            time.sleep(0.5)
            # 工程6_楽曲情報の抽出
            meta = spotify.track(track_id)
            # 工程7_邦楽判定(external_idsなしは省く)
            if len(meta['external_ids'])==0:
                continue
            if not meta['external_ids']['isrc'][0:2] == 'JP':
                continue
                
            try:
                # 工程8_楽曲情報を整理
                meta_info = getTrackInfo(track_id, meta)
                # 工程9_info_table(楽曲情報)に格納
                cur.execute(f"INSERT INTO info_table VALUES ({meta_info});".replace('[', '').replace(']', ''))
            except:
                print(f"ERROR info_table :{track_id}")
                
            try:
                # 工程10_楽曲特徴の抽出
                features = spotify.audio_features(track_id)
                # 工程11_楽曲特徴を整理
                features_info = getTrackFeatures(track_id, features)
                # 工程12_feature_table(楽曲特徴)に格納
                cur.execute(f"INSERT INTO feature_table VALUES ({features_info});".replace('[', '').replace(']', ''))
            except:
                print(f"ERROR feature_table :{track_id}")

            # テーブル変更を保存
            con.commit()

# dbとカーソルを閉じる
cur.close()
con.close()
```

## まとめ
ここまでで，PythonでSpotify APIを使って1970年から2021年までの楽曲情報を抽出しDBに格納しました．

次回から，楽曲をyoutubeで検索してダウンロードまで実行します．

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

