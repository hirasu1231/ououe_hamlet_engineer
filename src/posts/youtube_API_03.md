---
display: home
title: 'YouTube Data API を使って動画の再生回数等の情報を取得する'
description: YouTube Data API を使って動画の再生回数等の情報を取得します．
date: 2021-08-26
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
YouTube Data API を使って動画の再生回数等の情報を取得します．

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

    # 日本時刻に修正+9hours
    df_output['publishedAt'] = pd.to_datetime(df_output['publishedAt']) + datetime.timedelta(hours=9)
    
    return df_output
```

## コードの実行
以下のコードで実行します．


```python
# 引数
part='snippet'
q = 'ボードゲーム'
order = 'date'
_type = 'video'
num = 10 #Max:75/day->75*5=375本/day

# APIの取得
YOUTUBE_API_KEY = '＊＊＊＊＊＊＊＊＊＊＊＊'
youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

# 情報をデータフレーム形式で取得
df_youtube = make_video_dataframe(q, order, _type, num)
display(df_youtube.head())

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
      <td>k955sk9AOug</td>
      <td>ただのハセベ</td>
      <td>2021-06-16T20:59:12Z</td>
      <td>UCc308oE3ONLKlHWyh2BYsig</td>
      <td>【たまるば】ボードゲームアリーナ。ニムトやってみました！★</td>
      <td>5月31日分の配信です。 今回は「ボードゲームアリーナ」をたまるばの４人でやっていきます。 ...</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/k9...</td>
      <td>2</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>20210617</td>
    </tr>
    <tr>
      <th>1</th>
      <td>4ZEVCDBfTUo</td>
      <td>エレクリ放送局</td>
      <td>2021-06-16T19:47:33Z</td>
      <td>UCPo0NkhoaqJAbsDxFiEwAlw</td>
      <td>【ラジオ】りんとら＆ぺんぎんぬでボードゲーム雑談ラジオ【エレクリラジオ#3】【作業用】</td>
      <td>タイムスタンプ(目次)～ 配信後に更新します この企画では、りんとらと毎回変わるゲストがボー...</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/4Z...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>20210617</td>
    </tr>
    <tr>
      <th>2</th>
      <td>jf-OpbwFDvo</td>
      <td>はるGameカンパニー</td>
      <td>2021-06-16T16:57:05Z</td>
      <td>UCoNouSqOoyy2PmPMcweQKLg</td>
      <td>【ボードゲーム】コードネームする！【連想】【コラボ配信】</td>
      <td>今回２回目のプレイですが、前回よりも更に楽しんでいこうと思います！ 年越（主催者様） Twi...</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/jf...</td>
      <td>7</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>20210617</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Ai3u1Axmzvg</td>
      <td>ソレイユ・ソレル / soleil soler</td>
      <td>2021-06-16T16:50:34Z</td>
      <td>UCqN_ItttzXou1G8-rhKDQNA</td>
      <td>【世界のアソビ大全51】なかなか終わらないボードゲーム！？！？それが、ルドー！！！ローズとコ...</td>
      <td>NPCには負けないぞっっ！！！ ♪コラボ相手♪ ローズ・ロアンヌ(Land project)...</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/Ai...</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>20210617</td>
    </tr>
    <tr>
      <th>4</th>
      <td>_mS8Ml-Opk4</td>
      <td>縁側ボードゲーム</td>
      <td>2021-06-16T13:29:17Z</td>
      <td>UCyRwYeUzCvkNYBcEdnZ0J0g</td>
      <td>「ヘックメック」ボードゲームプレイ動画</td>
      <td>ヘックメックを４人で遊んでいます 扇風機がうるさかったり解説が高速だったりしてすみません.</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/_m...</td>
      <td>9</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>NaN</td>
      <td>20210617</td>
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