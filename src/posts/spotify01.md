---
display: home
title: 'PythonでSpotify APIを使ってみる'
description: PythonでSpotify APIを使ってみます．
date: 2022-03-01
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
PythonでSpotify APIを使ってみます．

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

## APIの登録とキーの取得
[Spotifyの公式サイト]()に登録してAPIのキーを取得します．
```python
# APIのIDとキー
MyID = "****************"
MySecret= "****************"
```

## ライブラリのインストール
APIの登録が済みましたら，Spotify APIを使用するためのライブラリをインストールします．
```python
!pip install spotipy
```

## デモの実行
下記のコードでデモを実行し，Spotify APIが正常に使用できるかを確認します．

下記のコードでは，特定のアーティストの曲を検索しています．この際，アーティストIDを事前に調べる必要があります．

アーティストIDはSpotifyでアーティスト名前で検索した時のURLに記載されています．
```python
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

# APIのIDとキー
MyID = "****************" #client ID
MySecret= "****************"  #client secret

# APIの起動
ccm = SpotifyClientCredentials(client_id = MyID, client_secret = MySecret)
spotify = spotipy.Spotify(client_credentials_manager = ccm)

# spotifyの検索キー
lz_uri = 'spotify:artist:36QJpDe2go2KgaRleHCDTp'
# アーティストIDが36QJpDe2go2KgaRleHCDTpの曲を検索
results = spotify.artist_top_tracks(lz_uri)

for track in results['tracks'][:1]:
    print('track    : ' + track['name'])
    print('audio    : ' + track['preview_url'])
    print('cover art: ' + track['album']['images'][0]['url'])
    print()

# 出力結果
# track    : Stairway to Heaven - Remaster
# audio    : https://p.scdn.co/mp3-preview/8226164717312bc411f8635580562d67e191a754?cid=166c222168b241028889782d08d8071e
# cover art: https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a982d086afc69
```

## SpotifyAPIの検索機能
`spotify.search()`を使用することで，アーティスト・曲のIDがわからなくてもSpotifyで検索することができます．

`spotify.search()`の引数は下記の通りです．
- q - 検索項目．ここでは2000年の曲を知りたいので，`year:2000`とします．
- limit - 抽出する情報の上限値です．無料枠だと，50が最大値です．
- offset - 抽出する情報で最初の何個をとばすか指定します．
- type - 抽出する情報のタイプを指定します．タイプは下記の通りです．
  - artist：アーティスト
  - album：アルバム
  - track：曲
  - playlist：プレイリスト
- market - 検索する音楽市場の国をIDで指定します．IDは[ISO 3166-1 alpha-2 wiki](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)で確認できます．

さらに，詳細が知りたい場合は，[公式ドキュメント](https://support.spotify.com/jp/article/search/)を参照してください．

```python
import spotipy
import pprint
from spotipy.oauth2 import SpotifyClientCredentials

# APIのIDとキー
MyID = "****************" #client ID
MySecret= "****************"  #client secret

# spotifyAPI起動
ccm = SpotifyClientCredentials(client_id = MyID, client_secret = MySecret)
spotify = spotipy.Spotify(client_credentials_manager = ccm)

# 検索実行
result = spotify.search(q='year:2000', limit=10, offset=0, type='track', market=None)

id_list = []
for track in result['tracks']['items']:
        id = track['id']
        id_list.append(id)
        
# 曲の特徴リスト
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

## まとめ
ここまでで，PythonでSpotify APIを使ってみました．

次回から，曲の特徴の抽出等を実行します．

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

