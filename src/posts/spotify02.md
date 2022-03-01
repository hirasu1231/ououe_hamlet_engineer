---
display: home
title: 'PythonでSpotify APIを使って楽曲の特徴情報を抽出する'
description: PythonでSpotify APIを使って曲の特徴情報を抽出します．
date: 2022-03-02
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
PythonでSpotify APIを使って楽曲の特徴情報を抽出します．

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
下記のコードで楽曲情報の抽出を実行します．

工程は下記の通りです．
1. SpotifyAPIの起動
2. 2000年の楽曲で検索
3. 楽曲IDを取得
4. `meta`に楽曲情報を格納

```python
import time
import spotipy
import pprint
from spotipy.oauth2 import SpotifyClientCredentials

# APIのIDとキー
MyID = "****************" #client ID
MySecret= "****************"  #client secret

# 工程1_spotifyAPI起動
ccm = SpotifyClientCredentials(client_id = MyID, client_secret = MySecret)
spotify = spotipy.Spotify(client_credentials_manager = ccm)

# 工程2_検索実行
year = 2000
result = spotify.search(q=f'year:{year}', limit=50, offset=0, type='track', market='JP')

# 工程3_楽曲IDをリストに格納
id_list = []
for track in result['tracks']['items']:
        id = track['id']
        id_list.append(id)
        
# 工程4_楽曲情報の抽出
meta = spotify.track(track_id)
```

## 楽曲特徴の抽出
下記のコードで楽曲特徴の抽出を実行します．

工程は下記の通りです．
1. SpotifyAPIの起動
2. 2000年の楽曲で検索
3. 楽曲IDをリストに格納
4. `spotify.audio_features()`で楽曲特徴を抽出

```python
import spotipy
import pprint
from spotipy.oauth2 import SpotifyClientCredentials

# APIのIDとキー
MyID = "****************" #client ID
MySecret= "****************"  #client secret

# 工程1_spotifyAPI起動
ccm = SpotifyClientCredentials(client_id = MyID, client_secret = MySecret)
spotify = spotipy.Spotify(client_credentials_manager = ccm)

# 工程2_検索実行
year = 2000
result = spotify.search(q=f'year:{year}', limit=50, offset=0, type='track', market='JP')

# 工程3_楽曲IDをリストに格納
id_list = []
for track in result['tracks']['items']:
        id = track['id']
        id_list.append(id)
        
# 工程4_楽曲特徴を抽出
features = spotify.audio_features(id_list)
pprint.pprint(features)


# 出力結果
# {'acousticness': 0.00239,
#   'analysis_url': 'https://api.spotify.com/v1/audio-analysis/3AJwUDP919kvQ9QcozQPxg',
#   'danceability': 0.429,
#   'duration_ms': 266773,
#   'energy': 0.661,
#   'id': '3AJwUDP919kvQ9QcozQPxg',
#   'instrumentalness': 0.000121,
#   'key': 11,
#   'liveness': 0.234,
#   'loudness': -7.227,
#   'mode': 1,
#   'speechiness': 0.0281,
#   'tempo': 173.372,
#   'time_signature': 4,
#   'track_href': 'https://api.spotify.com/v1/tracks/3AJwUDP919kvQ9QcozQPxg',
#   'type': 'audio_features',
#   'uri': 'spotify:track:3AJwUDP919kvQ9QcozQPxg',
#   'valence': 0.285},
```

## 楽曲特徴の整理
下記のコードで楽曲情報と楽曲特徴を1つのリストで整理させます．

```python
def getTrackFeatures(track_id, meta, features):
    name = meta['name']
    album = meta['album']['name']
    artist = meta['album']['artists'][0]['name']
    release_date = meta['album']['release_date']
    country = meta['external_ids']['isrc'][0:2]
    length = meta['duration_ms']
    popularity = meta['popularity']
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

    track = [track_id, name, album, artist, release_date, country, length, popularity, key, mode, danceability, acousticness, energy, instrumentalness, liveness, loudness, speechiness, tempo, time_signature, valence]
    return track
```

## 楽曲情報と特徴をcsvに出力
下記のコードで楽曲情報と特徴をcsvに出力します．

工程は下記の通りです．
1. SpotifyAPIの起動
2. 2000年の楽曲で検索
3. 楽曲IDを取得
4. `meta`に楽曲情報を格納
5. `spotify.audio_features()`で楽曲特徴を抽出
6. `getTrackFeatures`で楽曲情報と特徴をリスト化
7. リストからデータフレームへ変換

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

# 工程2_検索実行
year = 2000
result = spotify.search(q=f'year:{year}', limit=50, offset=0, type='track', market='JP')

tracks = []
for track in result['tracks']['items']:
  # 工程3_楽曲IDを取得
  track_id = track['id']
  time.sleep(0.5)
  # 工程4_楽曲情報の抽出
  meta = spotify.track(track_id)
  # 工程5_楽曲特徴の抽出
  features = spotify.audio_features(track_id)
  # 工程6_楽曲情報と特徴をリスト化
  track_info = getTrackFeatures(track_id, meta, features)
  tracks.append(track_info)

# 工程7_リスト→データフレーム&csv出力
# データフレームに格納
df = pd.DataFrame(tracks, columns = ['track_id', 'name', 'album', 'artist', 'release_date', 'country', 'length', 'popularity', 'key', 'mode', 'danceability', 'acousticness', 'energy', 'instrumentalness', 'liveness', 'loudness', 'speechiness', 'tempo', 'time_signature', 'valence'])
# お気に入り降順にソート
df.sort_values('popularity', ascending=False, inplace=True)
display(df.head())

```

## まとめ
ここまでで，PythonでSpotify APIを使って楽曲の特徴情報を抽出しました．

次回から，邦楽に限定して抽出を実行します．

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

