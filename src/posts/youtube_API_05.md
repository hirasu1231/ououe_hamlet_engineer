---
display: home
title: 'YouTube Data API を使ってキーワード検索から動画の再生回数等の情報を取得し，可視化も実装する'
description: YouTube Data API を使ってキーワード検索から動画の再生回数等の情報を取得し，可視化も実装します．
date: 2021-08-30
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
YouTube Data API を使ってキーワード検索から動画の再生回数等の情報を取得し，可視化も実装します．

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

### youtubeの情報をDataFrame形式で取得(前回と一緒)
ここでは，特定キーワードを含むタイトルの動画を再生回数順でDataFrame形式で取得します．

また，任意の動画数分だけ取得できるようにもしています．


```python
import datetime
import pandas as pd
from apiclient.discovery import build

#numに入れた数字×5件の情報を取得
#その他のパラメーターはAPIから情報を取得するパラメータと同じ
# 動画のタイトル等を抜粋()
def get_video_info(part, q, order, type, num):
    dic_list = []
    search_response = youtube.search().list(part=part,q=q,order=order,type=type)
    output = youtube.search().list(part=part,q=q,order=order,type=type).execute()

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
```

## 再生回数等の情報を取得
上記のタイトル情報を整理したDataFrameに再生回数等の情報を追記します．
- 再生回数
- good数
- Bad数
- コメント数


```python
#videoIdを入力することで、その動画の具体的な再生回数やいいね数を取得する関数を作成
def get_statistics(id):
    statistics = youtube.videos().list(part = 'statistics', id = id).execute()['items'][0]['statistics']
    return statistics
```


```python
def make_video_dataframe(q, order, _type, num):
    # 動画情報の取得
    df_snippet = get_video_info(part='snippet',q=q,order=order,type=_type,num = num)
    # 動画の再生回数等を取得
    df_static = pd.DataFrame(list(df_snippet['videoId'].apply(lambda x : get_statistics(x))))
    
    # データフレームの結合
    df_output = pd.concat([df_snippet,df_static], axis = 1)
    
    # スクレイピング日時を入力
    scrape_date = str(datetime.date.today()).replace('-','')
    df_output['scrape_date'] = scrape_date
    
    return df_output
```

## コードの実行
以下のコードで実行します．


```python
# 引数
part='snippet'
q = 'ボードゲーム'
order = 'viewCount'
_type = 'video'
num = 10 #Max:75/day->75*5=375本/day

# APIの取得
YOUTUBE_API_KEY = 'AIzaSyCjNsPtyaDBn0_mOW0DbxNhU9BxkCrqPAs'
youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

# 情報をデータフレーム形式で取得
df_youtube = make_video_dataframe(q, order, _type, num)
display(df_youtube.head())

# csvに出力
# df_youtube.to_csv('BoardGame_scape.csv', index=False)
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
      <td>ASusE5qjoAg</td>
      <td>東海オンエア</td>
      <td>2019-05-31 20:58:15+00:00</td>
      <td>UCutJqz56653xV2wwSvut_hQ</td>
      <td>【目指せ商品化】文理対抗！ガチンコボードゲーム作り対決！</td>
      <td>東海オンエアってもう｢チャンネル登録してください｣とか｢高評価よろしくお願いします｣とか言わ...</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/AS...</td>
      <td>4936615</td>
      <td>127696</td>
      <td>1870</td>
      <td>0</td>
      <td>4431</td>
      <td>20210701</td>
    </tr>
    <tr>
      <th>1</th>
      <td>GzPq9KfVIj8</td>
      <td>東海オンエア</td>
      <td>2019-06-01 19:40:40+00:00</td>
      <td>UCutJqz56653xV2wwSvut_hQ</td>
      <td>【理系編】文理対抗！ガチンコボードゲーム作り対決！</td>
      <td>語尾が戻ってきました。うれしいです。 ｢だってばよ｣時代は、概要欄も一言くらいにとどめていた...</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/Gz...</td>
      <td>4834242</td>
      <td>180949</td>
      <td>1573</td>
      <td>0</td>
      <td>5015</td>
      <td>20210701</td>
    </tr>
    <tr>
      <th>2</th>
      <td>SgZzIrugEnU</td>
      <td>すごろくや公式チャンネル</td>
      <td>2019-10-04 00:59:53+00:00</td>
      <td>UC-eApqGqN0N_S2s2ARJgt-A</td>
      <td>すごろくやCM「ボードゲーム、おうちでやろう。」編</td>
      <td>Credits: Director : 清水貴栄 (DRAWING AND MANUAL) ...</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/Sg...</td>
      <td>2726310</td>
      <td>102</td>
      <td>12</td>
      <td>0</td>
      <td>2</td>
      <td>20210701</td>
    </tr>
    <tr>
      <th>3</th>
      <td>BNv7zbORfVM</td>
      <td>ジャニーズJr.チャンネル</td>
      <td>2019-08-07 21:45:00+00:00</td>
      <td>UC1cHlPIE-kqiPvpyYz2O8rQ</td>
      <td>Snow Man 【ボードゲーム】ベストアクトで演技力対決してみた！</td>
      <td>どうもSnow Manです！ 今回はボードゲームをやりまぁす。挑戦したゲームは、演技力が試さ...</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/BN...</td>
      <td>2704157</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>0</td>
      <td>3635</td>
      <td>20210701</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1y4_v6PnsOE</td>
      <td>Snow Man</td>
      <td>2020-05-13 19:30:00+00:00</td>
      <td>UCuFPaemAaMR8R5cHzjy23dQ</td>
      <td>Snow Man「リモートでボードゲームに挑戦」みんな顔が黒くなった！</td>
      <td>２年ぶりにあのゲームをやってみました。 しかもリモートスタイルで！ するとみんな...とんで...</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/1y...</td>
      <td>2428688</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>0</td>
      <td>8891</td>
      <td>20210701</td>
    </tr>
  </tbody>
</table>
</div>


## データフレームの可視化

### 日本語フォントのダウンロード
そのまま可視化すると，日本語が文字化けしてしまうため，以下のコードで日本語フォントのダウンロードを実施します．

日本語用のフォントは以下のURLからダウンロードします．

https://github.com/hirasu1231/matplotlib_japanese/blob/main/ipag.ttf


```python
import os
import pprint
import time
import urllib.error
import urllib.request
import json

def download_file(url, dst_path):
    try:
        with urllib.request.urlopen(url) as web_file:
            data = web_file.read()
            with open(dst_path, mode='wb') as local_file:
                local_file.write(data)
    except urllib.error.URLError as e:
        print(e)
        
# 日本語用のフォントのDL
download_file('https://github.com/hirasu1231/matplotlib_japanese/raw/main/ipag.ttf', 'ipag.ttf')
```

### データフレームの可視化
下記のコードで日本語設定を反映し，データフレームの可視化を実装します．

pandasでのプロットも実装しています．


```python
import matplotlib
import matplotlib.pyplot as plt
from matplotlib import font_manager

# 日本語のフォント設定
f = "ipag.ttf"
font_manager.fontManager.addfont(f) # フォントの追加
font_name = plt.matplotlib.font_manager.FontProperties(fname = f).get_name() # 追加フォント名
matplotlib.rc('font', family=font_name) # 追加フォントの設定

# データフレームの可視化
df_youtube['viewCount'] = df_youtube['viewCount'].astype(float)
df_youtube.groupby('title').sum().sort_values(by = 'viewCount', ascending = False).plot( kind='bar', y = 'viewCount', figsize = (25,10), fontsize = 20)
```

![](/image/youtube_api_05_graph.png)


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