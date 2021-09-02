---
display: home
title: 'YouTube Data API を使ってチャンネルIDから動画の情報を取得する'
description: YouTube Data API を使ってチャンネルIDから動画の情報を取得します．
date: 2021-09-02
image: https://www.hamlet-engineer.com/image/youtubeAPI.jpeg
categories: 
  - Python
tags:
  - Python
  - jupyter
  - YouTube_Data_API
---
<!-- https://www.hamlet-engineer.com -->
YouTube Data API を使ってチャンネルIDから動画の情報を取得します．

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

## youtubeの情報を取得(複数の動画)
特定のキーワードで検索かけて，複数の動画の情報を取得します．

最終的には,DataFrameで出力します．

ここでは，以下の情報を取得します．
- video_id
- タイトル
- クレイピング日時
- 動画の公開日時
- チャンネルタイトル
- チャンネルID
- 概要欄
- サムネイル

## 特定のチャンネルの動画情報を取得
特定のチャンネルから動画情報を取得します．

チャンネルIDはyoutubeチャンネルページのURLの末尾の文字列に記載されています．

https://www.youtube.com/channel/{チャンネルID}

ここでは，こーじさんの情報を抽出します(https://www.youtube.com/channel/UCrkqNT0_Fd5_TIWdjey6K0A)．


[YouTubeのチャンネル情報を取得するためにYouTubeAPIを使ってみた。YouTubeAPIを使うには](https://note.com/saitohtm/n/nb9020547d037)



```python
import datetime
import pandas as pd
from apiclient.discovery import build

#numに入れた数字×5件の情報を取得
#その他のパラメーターはAPIから情報を取得するパラメータと同じ
# 動画のタイトル等を抜粋()
def get_channel_video_info(part, channel_Id, order, type, num):
    dic_list = []
    search_response = youtube.search().list(part=part,channelId=channel_Id,order=order,type=type)
    output = youtube.search().list(part=part,channelId=channel_Id,order=order,type=type).execute()

    #一度に5件しか取得できないため何度も繰り返して実行
    for i in range(num):        
        dic_list = dic_list + output['items']
        search_response = youtube.search().list_next(search_response, output)
        output = search_response.execute()

    df = pd.DataFrame(dic_list)
    #各動画毎に一意のvideoIdを取得
    df1 = pd.DataFrame(list(df['id']))['videoId']
    #各動画毎に一意のvideoIdを取得必要な動画情報だけ取得
    df2 = pd.DataFrame(list(df['snippet']))[['channelTitle','publishedAt','channelId','title','description','thumbnails']]
    
    ddf = pd.concat([df1,df2], axis = 1)
    
    # 日本時刻に修正+9hours
    ddf['publishedAt'] = pd.to_datetime(ddf['publishedAt']) + datetime.timedelta(hours=9)

    return ddf

#videoIdを入力することで、その動画の具体的な再生回数やいいね数を取得する関数を作成
def get_statistics(id):
    statistics = youtube.videos().list(part = 'statistics', id = id).execute()['items'][0]['statistics']
    return statistics

def make_channel_video_dataframe(YOUTUBE_API_KEY, channel_Id, order, num):
    # 動画情報の取得
    df_snippet = get_channel_video_info(part='snippet',channel_Id=channel_Id,order=order,type='video',num = num)
    # 動画の再生回数等を取得
    df_static = pd.DataFrame(list(df_snippet['videoId'].apply(lambda x : get_statistics(x))))
    
    # データフレームの結合
    df_output = pd.concat([df_snippet,df_static], axis = 1)
    
    # スクレイピング日時を入力
    scrape_date = str(datetime.date.today()).replace('-','')
    df_output['scrape_date'] = scrape_date
    
    return df_output
```


```python
# 引数
YOUTUBE_API_KEY = '＊＊＊＊＊＊＊＊＊＊＊＊'
channel_Id = 'UCrkqNT0_Fd5_TIWdjey6K0A'
order = 'date'
num = 2 #Max:75/day

# APIの取得
youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
# データフレーム実行とcsv出力
df_csv = make_channel_video_dataframe(YOUTUBE_API_KEY, channel_Id, order, num)
display(df_csv[0:3])
# df_csv.to_csv('./channel_csv/{0}_{1}.csv'.format(str(datetime.date.today()).replace('-',''), channel_Id), index=False)
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
      <th>scrape_date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>QCC3xzGELuw</td>
      <td>こーじ</td>
      <td>2021-06-29 20:43:53+00:00</td>
      <td>UCrkqNT0_Fd5_TIWdjey6K0A</td>
      <td>固定式ダイヤル錠の仕組みを解説【物理エンジン】</td>
      <td>使用ソフト ・Unity(メイン) ・Blender(3Dモデリング) ・Tinkercad...</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/QC...</td>
      <td>42725</td>
      <td>1310</td>
      <td>29</td>
      <td>0</td>
      <td>106</td>
      <td>20210701</td>
    </tr>
    <tr>
      <th>1</th>
      <td>iij0p63r0bM</td>
      <td>こーじ</td>
      <td>2021-06-27 23:59:28+00:00</td>
      <td>UCrkqNT0_Fd5_TIWdjey6K0A</td>
      <td>【物理エンジン】スケボーが曲がる仕組みを分かりやすく解説【凄い】</td>
      <td>使用ソフト ・Unity(メイン) ・Blender(3Dモデリング) ・Tinkercad...</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/ii...</td>
      <td>42126</td>
      <td>1516</td>
      <td>12</td>
      <td>0</td>
      <td>134</td>
      <td>20210701</td>
    </tr>
    <tr>
      <th>2</th>
      <td>iloc3Qp2AyM</td>
      <td>こーじ</td>
      <td>2021-06-24 17:53:11+00:00</td>
      <td>UCrkqNT0_Fd5_TIWdjey6K0A</td>
      <td>【ゴルフ打ちっ放し】２階３階からの飛距離は実際には何ヤードなのか？【物理エンジン】</td>
      <td>使用ソフト ・Unity(メイン) ・Blender(3Dモデリング) ・Tinkercad...</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/il...</td>
      <td>48782</td>
      <td>1174</td>
      <td>27</td>
      <td>0</td>
      <td>106</td>
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


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>