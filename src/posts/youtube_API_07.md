---
display: home
title: 'YouTube Data API を使って再生リストから動画の再生回数等の情報を取得する'
description: YouTube Data API を使って再生リストから動画の再生回数等の情報を取得します．
date: 2021-09-03
image: https://www.hamlet-engineer.com/image/youtubeAPI.jpeg
categories: 
  - Python
tags:
  - Python
  - jupyter
  - YouTube_Data_API
  - YouTube
---
<!-- https://www.hamlet-engineer.com -->
YouTube Data API を使って再生リストから動画の再生回数等の情報を取得します．

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

## モジュールのインストール


```python
!pip install google-api-python-client
```

## プレイリストの動画情報を取得
下記のコードで再生リストの情報を取得します．

本稿で取得する再生リストは以下の通りです．

https://www.youtube.com/playlist?list=PLDb67L4FP3ujetyC-iu1e3ybe2ErKfa69


```python
import datetime
import pandas as pd
from apiclient.discovery import build

#numに入れた数字×5件の情報を取得
#その他のパラメーターはAPIから情報を取得するパラメータと同じ
# 動画のタイトル等を抜粋()
def get_playlist_video_info(part, playlist_Id, maxResults):
    dic_list = []
    next_page_token = None

    #一度に5件しか取得できないため何度も繰り返して実行
    while 1:
        output = youtube.playlistItems().list(part=part,playlistId=playlist_Id,pageToken=next_page_token,maxResults=maxResults).execute()
        dic_list = dic_list + output['items']
        next_page_token = output.get('nextPageToken')
        
        if next_page_token is None:
            break

    df = pd.DataFrame(dic_list)
    df = df.rename(columns={'id': 'videoId'})
    #各動画毎に一意のvideoIdを取得
    df1 = pd.DataFrame(list(pd.DataFrame(list(df['snippet']))['resourceId']))['videoId']
    #各動画毎に一意のvideoIdを取得必要な動画情報だけ取得
    df2 = pd.DataFrame(list(df['snippet']))[['channelTitle','publishedAt','channelId','title','description','thumbnails']]
    
    ddf = pd.concat([df1,df2], axis = 1)

    return ddf

#videoIdを入力することで、その動画の具体的な再生回数やいいね数を取得する関数を作成
def get_statistics(id):
    statistics = youtube.videos().list(part = 'statistics', id = id).execute()['items'][0]['statistics']
    return statistics

#videoIdを入力することで、その動画の具体的な再生時間を取得する関数を作成
# https://qiita.com/kon2/items/f09def292c3b0be2bb8e
def get_contentDetails(id):
    contentDetails = youtube.videos().list(part = 'contentDetails', id = id).execute()['items'][0]['contentDetails']
    return contentDetails

def make_playlist_video_dataframe(YOUTUBE_API_KEY, playlist_Id, maxResults=50):
    # 動画情報の取得
    df_snippet = get_playlist_video_info(part='snippet',playlist_Id=playlist_Id, maxResults=maxResults)
    # 動画の再生回数等を取得
    df_static = pd.DataFrame(list(df_snippet['videoId'].apply(lambda x : get_statistics(x))))
    # 動画の再生時間等を取得
    df_contentDetails = pd.DataFrame(list(df_snippet['videoId'].apply(lambda x : get_contentDetails(x))))
    
    # データフレームの結合
    df_output = pd.concat([df_snippet,df_static,df_contentDetails], axis = 1)
    
    # スクレイピング日時を入力
    scrape_date = str(datetime.date.today()).replace('-','')
    df_output['scrape_date'] = scrape_date
    
    return df_output
```


```python
# 引数
YOUTUBE_API_KEY = 'AIzaSyBQnquVQbzDNxEnj18mNT17OeOHRAs2Wng'
playlist_Id = 'PLWbkonia8z_R_xrRVOcdxQJvRRAEtFxp5'
order = 'date'
maxResults = 10

# APIの取得
youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
# データフレーム実行
df_playlist = make_playlist_video_dataframe(YOUTUBE_API_KEY, playlist_Id, maxResults)

# 描画
display(df_playlist[0:3])
# 保存
# channelTitle = df_playlist['channelTitle'][0].replace(' ', '_')
# print(channelTitle)
# df_playlist.to_csv('./channel_csv/{0}_playlist_{1}.csv'.format(str(datetime.date.today()).replace('-',''), channelTitle), index=False)
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
      <th>videoId</th>
      <th>channelTitle</th>
      <th>publishedAt</th>
      <th>channelId</th>
      <th>title</th>
      <th>description</th>
      <th>thumbnails</th>
      <th>viewCount</th>
      <th>likeCount</th>
      <th>dislikeCount</th>
      <th>favoriteCount</th>
      <th>commentCount</th>
      <th>duration</th>
      <th>dimension</th>
      <th>definition</th>
      <th>caption</th>
      <th>licensedContent</th>
      <th>contentRating</th>
      <th>projection</th>
      <th>scrape_date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>DKpE4TfoEog</td>
      <td>メンタリスト DaiGo</td>
      <td>2020-03-09T02:57:13Z</td>
      <td>UCFdBehO71GQaIom4WfVeGSw</td>
      <td>人間関係に関する悩みに答えます【質疑応答】</td>
      <td>📘この動画内で紹介したおすすめ動画・ニコニコ動画は\n知識のNetflix【Dラボ】で見放題...</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/DK...</td>
      <td>158232</td>
      <td>2192</td>
      <td>84</td>
      <td>0</td>
      <td>8</td>
      <td>PT57M52S</td>
      <td>2d</td>
      <td>hd</td>
      <td>false</td>
      <td>True</td>
      <td>{}</td>
      <td>rectangular</td>
      <td>20210701</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Sdfn7S06zgg</td>
      <td>メンタリスト DaiGo</td>
      <td>2020-03-19T17:03:17Z</td>
      <td>UCFdBehO71GQaIom4WfVeGSw</td>
      <td>質疑応答！スキルアップとキャリアアップに関する質問に答えます【質疑応答】</td>
      <td>📘この動画内で紹介したおすすめ動画・ニコニコ動画は\n知識のNetflix【Dラボ】で見放題...</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/Sd...</td>
      <td>123418</td>
      <td>1516</td>
      <td>78</td>
      <td>0</td>
      <td>6</td>
      <td>PT1H4M44S</td>
      <td>2d</td>
      <td>hd</td>
      <td>false</td>
      <td>True</td>
      <td>{}</td>
      <td>rectangular</td>
      <td>20210701</td>
    </tr>
    <tr>
      <th>2</th>
      <td>5jK5IvJb8EU</td>
      <td>メンタリスト DaiGo</td>
      <td>2020-04-02T12:05:59Z</td>
      <td>UCFdBehO71GQaIom4WfVeGSw</td>
      <td>人生相談受けます【質疑応答】</td>
      <td>📘この動画内で紹介したおすすめ動画・ニコニコ動画は\n知識のNetflix【Dラボ】で見放題...</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/5j...</td>
      <td>128133</td>
      <td>1715</td>
      <td>77</td>
      <td>0</td>
      <td>7</td>
      <td>PT1H1M21S</td>
      <td>2d</td>
      <td>hd</td>
      <td>false</td>
      <td>True</td>
      <td>{}</td>
      <td>rectangular</td>
      <td>20210701</td>
    </tr>
  </tbody>
</table>
</div>


## 参考サイト
[【Python】YouTube Data API を使って、いろんな情報を取得してみた！](https://qiita.com/ryoya41/items/dd1fd4c1427ece787eea)

[YouTube Data API v3を使用して、YouTubeページと同じリストモジュールを作ってみた](https://liginc.co.jp/497428#:~:text=%E3%81%BE%E3%81%A8%E3%82%81-,YouTube%20Data%20API%E3%81%A8%E3%81%AF,%E3%81%99%E3%82%8B%E3%81%93%E3%81%A8%E3%81%8C%E3%81%A7%E3%81%8D%E3%81%BE%E3%81%99%E3%80%82)

[Youtube Data APIを使ってPythonでYoutubeデータを取得する](https://qiita.com/g-k/items/7c98efe21257afac70e9)

[Search: list | YouTube Data API | Google Developers](https://developers.google.com/youtube/v3/docs/search/list?hl=ja)

[youtube API get all playlist id from a channel : python](https://stackoverflow.com/questions/62347194/youtube-api-get-all-playlist-id-from-a-channel-python)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>