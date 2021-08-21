---
display: home
title: 'YouTube Data API を使って1つの動画から様々な情報を取得する'
description: YouTube Data API を使って1つの動画から様々な情報を取得します．
date: 2021-08-18
image: https://www.hamlet-engineer.com/image/youtubeAPI.jpeg
categories: 
  - Python
tags:
  - Python
  - jupyter
  - YouTube_Data_API
---
<!-- https://www.hamlet-engineer.com -->
YouTube Data API を使って1つの動画から様々な情報を取得します．

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

## YouTube Data APとは
> YouTubeが提供しているAPIで、動画やチャンネル、再生リストに関わる情報を取得して、自分のWebサイトやアプリケーションで使用することができます。<br>
公式のドキュメントが用意されているので、詳しくはこちらをご覧ください。<br>
https://developers.google.com/youtube/v3/getting-started?hl=ja<br>
引用元:[YouTube Data API v3を使用して、YouTubeページと同じリストモジュールを作ってみた](https://liginc.co.jp/497428#:~:text=%E3%81%BE%E3%81%A8%E3%82%81-,YouTube%20Data%20API%E3%81%A8%E3%81%AF,%E3%81%99%E3%82%8B%E3%81%93%E3%81%A8%E3%81%8C%E3%81%A7%E3%81%8D%E3%81%BE%E3%81%99%E3%80%82)

>YouTube が提供している API で、動画やチャンネルなど情報を取得して、自分の Web サイトやアプリケーションで使用することができます。<br>
一日あたりのAPI使用量（クォータ）の上限が10000になっているので、注意して使用してください。<br>
引用元:[【Python】YouTube Data API を使って、いろんな情報を取得してみた！](https://qiita.com/ryoya41/items/dd1fd4c1427ece787eea)

## APIのキーを取得
YouTube Data API使えるようになるために、APIのキーを取得します．

引用元:[【Python】YouTube Data API を使って、いろんな情報を取得してみた！](https://qiita.com/ryoya41/items/dd1fd4c1427ece787eea)

### Google Cloud Platformでプロジェクトを作成
>Google Cloud Platformからプロジェクトを作成します．<br>
プロジェクト名は任意で、 プロジェクトIDは忘れずに変更しましょう。<br>
![](/image/youtubeAPI_GCP1.png)

### YouTube Data API v３ を有効化
>作成したプロジェクトで，YouTube Data API を使用するため，有効にします．<br>
ここからプロジェクトを選択した後、有効にします．<br>
![](/image/youtubeAPI_GCP2.png)

### 認証情報の作成
>ここから API キーを作成します。<br>
作成した API キーは、実際に API を使う時に使用しますので、メモしておいてください。<br>
![](/image/youtubeAPI_GCP3.png)

## モジュールのインストール
```python
!pip install google-api-python-client
```

## youtubeの情報を取得(1つの動画)
上記でキーを取得したYouTube Data API を使って1つの動画から様々な情報を取得します．

最終的には,DataFrameで出力します．

ここでは，以下の情報を取得します．
- video_id
- タイトル
- クレイピング日時
- 動画の公開日時
- チャンネルタイトル
- チャンネルID
- サムネイル
- 再生回数
- goodボタン数
- badボタン数
- コメント数
- タグ


```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import datetime
import pandas as pd
from apiclient.discovery import build


# 動画のURL
URL = 'https://www.youtube.com/watch?v=FAa70E8uzG4'
video_id = URL.split('v=')[1]

# APIの起動
YOUTUBE_API_KEY = '＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊'
youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

# 動画情報のリクエスト
response = youtube.videos().list(part = 'snippet,statistics',
                                 id = video_id
                                ).execute()
# 動画情報の取得
item = response.get("items", [])[0]

# 動画情報の整理
# タイトル
title = item['snippet']['title']
# スクレイピング日時
scrape_date = str(datetime.date.today()).replace('-','')
# 公開日時
published_date = item['snippet']['publishedAt']
# チャンネルタイトル
channelTitle = item['snippet']['channelTitle']
# チャンネルID
channelId = item['snippet']['channelId']
# サムネイル
thumbnails_url = item['snippet']['thumbnails']['standard']['url']
# 再生回数
viewCount = item['statistics']['viewCount']
# goodボタン
likeCount = item['statistics']['likeCount']
# badボタン
dislikeCount = item['statistics']['dislikeCount']
# コメント数
commentCount = item['statistics']['commentCount']
# タグ
tags = item['snippet']['tags']
```


```python
# データフレーム化
_list = [[title, video_id, scrape_date, published_date, channelTitle, channelId, thumbnails_url, viewCount, likeCount, dislikeCount, commentCount, tags]]
df_info = pd.DataFrame(_list, columns=['title', 'video_id', 'scrape_date', 'published_date', 'channelTitle', 'channelId', 'thumbnails_url', 'viewCount', 'likeCount', 'dislikeCount', 'commentCount', 'tags'])
# 日本時刻に修正+9hours
df_info['publishedAt'] = pd.to_datetime(df_info['publishedAt']) + datetime.timedelta(hours=9)
display(df_info)

# csvに出力
# df_info.to_csv('{}_scape.csv'.format(scrape_date), index=False)
```


<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>title</th>
      <th>video_id</th>
      <th>scrape_date</th>
      <th>published_date</th>
      <th>channelTitle</th>
      <th>channelId</th>
      <th>thumbnails_url</th>
      <th>viewCount</th>
      <th>likeCount</th>
      <th>dislikeCount</th>
      <th>commentCount</th>
      <th>tags</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>エスパータイプはなぜ不遇？ガチ環境の強み・弱みを徹底解説【ポケモン剣盾】</td>
      <td>FAa70E8uzG4</td>
      <td>20210610</td>
      <td>2021-06-14T08:00:08Z</td>
      <td>ポケモンソルジャー【ポケソル】</td>
      <td>UCeQNXy1ReMSa1GuK7nhMvIA</td>
      <td>https://i.ytimg.com/vi/FAa70E8uzG4/sddefault.jpg</td>
      <td>47535</td>
      <td>604</td>
      <td>26</td>
      <td>349</td>
      <td>[ポケモン, ポケモン剣盾, ポケモンソード, ポケモンシールド, ソードシールド, ポケモ...</td>
    </tr>
  </tbody>
</table>
</div>


## 参考サイト
[【Python】YouTube Data API を使って、いろんな情報を取得してみた！](https://qiita.com/ryoya41/items/dd1fd4c1427ece787eea)

[YouTube Data API v3を使用して、YouTubeページと同じリストモジュールを作ってみた](https://liginc.co.jp/497428#:~:text=%E3%81%BE%E3%81%A8%E3%82%81-,YouTube%20Data%20API%E3%81%A8%E3%81%AF,%E3%81%99%E3%82%8B%E3%81%93%E3%81%A8%E3%81%8C%E3%81%A7%E3%81%8D%E3%81%BE%E3%81%99%E3%80%82)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>