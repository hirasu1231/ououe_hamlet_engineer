---
display: home
title: 'YouTube Data API を使ってキーワード検索から動画のタイトル等の情報を取得する'
description: YouTube Data API を使ってキーワード検索から動画のタイトル等の情報を取得します．
date: 2021-08-21
image: https://www.hamlet-engineer.com/image/youtubeAPI.jpeg
categories: 
  - Python
tags:
  - Python
  - jupyter
  - YouTube_Data_API
---
<!-- https://www.hamlet-engineer.com -->
YouTube Data API を使ってキーワード検索から動画のタイトル等の情報を取得します．

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

## youtubeの情報を取得(1つの動画)
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

### youtubeの情報をJson形式で取得
ここでは，特定キーワードを含むタイトルの動画を再生回数順でJson形式で取得します．
- part:取得情報(snippet)
- q：キーワード
- order：ソートする項目
    - date：リソースを作成日の新しい順に並べます。
    - rating：リソースを評価の高い順に並べます。
    - relevance：リソースを検索クエリの関連性が高い順に並べます。このパラメータのデフォルト値です。
    - title：リソースをタイトルのアルファベット順に並べます。
    - videoCount：アップロード動画の番号順（降順）にチャンネルを並べます。
    - viewCount：リソースを再生回数の多い順に並べます。
- type：検索対象のタイプ(channel・playlist・video)


```python
import datetime
import pandas as pd
from apiclient.discovery import build

YOUTUBE_API_KEY = 'AIzaSyCjNsPtyaDBn0_mOW0DbxNhU9BxkCrqPAs'

youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

search_response = youtube.search().list(
    part='snippet',
    #検索したい文字列を指定
    q='ボードゲーム',
    #視聴回数が多い順に取得
    order='viewCount',
    type='video',
    ).execute()

# 1度に取得できる数
print('json_length：{}'.format(len(search_response['items'])))
# Json形式での情報
display(search_response['items'][0])
```

    json_length：5



    {'kind': 'youtube#searchResult',
     'etag': 'WPSsGnBDDsoYs6kDsziwxAeQx-0',
     'id': {'kind': 'youtube#video', 'videoId': 'ASusE5qjoAg'},
     'snippet': {'publishedAt': '2019-05-31T11:58:15Z',
      'channelId': 'UCutJqz56653xV2wwSvut_hQ',
      'title': '【目指せ商品化】文理対抗！ガチンコボードゲーム作り対決！',
      'description': '東海オンエアってもう｢チャンネル登録してください｣とか｢高評価よろしくお願いします｣とか言わなくなっちゃったけど、やっぱり言ったほうがいいってばよ？ チャンネル登録 ...',
      'thumbnails': {'default': {'url': 'https://i.ytimg.com/vi/ASusE5qjoAg/default.jpg',
        'width': 120,
        'height': 90},
       'medium': {'url': 'https://i.ytimg.com/vi/ASusE5qjoAg/mqdefault.jpg',
        'width': 320,
        'height': 180},
       'high': {'url': 'https://i.ytimg.com/vi/ASusE5qjoAg/hqdefault.jpg',
        'width': 480,
        'height': 360}},
      'channelTitle': '東海オンエア',
      'liveBroadcastContent': 'none',
      'publishTime': '2019-05-31T11:58:15Z'}}


### youtubeの情報をDataFrame形式で取得
ここでは，特定キーワードを含むタイトルの動画を再生回数順でDataFrame形式で取得します．

また，任意の動画数分だけ取得できるようにもしています．


```python
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


```python
# 引数
part='snippet'
q = 'ボードゲーム'
order = 'date'
type = 'video'
num = 10 #Max:75/day->75*5=375本/day

# APIの取得
YOUTUBE_API_KEY = '＊＊＊＊＊＊＊＊＊＊＊＊'
youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

# 情報をデータフレーム形式で取得
df_youtube = get_video_info(part, q, order, type, num)
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
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>4o2iX-BVcUQ</td>
      <td>アジトベル 恵比寿のボードゲームカフェ</td>
      <td>2021-06-15T23:00:04Z</td>
      <td>UC3FA3Kz65VhfkuVQJWMyOAw</td>
      <td>【おすすめボードゲーム】そこにそんなに⁉とんでもないところにこだわったボードゲーム3選【028】</td>
      <td>製作者の愛を感じる♪ ▽△▽△▽△▽△▽△▽△▽△▽△▽△▽△▽△▽△ ☆アジトベル 恵比寿...</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/4o...</td>
    </tr>
    <tr>
      <th>1</th>
      <td>e7JziFcyAyY</td>
      <td>hobby again</td>
      <td>2021-06-15T18:57:41Z</td>
      <td>UC2lXqscjLeLc7F0H_4GKTug</td>
      <td>アナと雪の女王２　ストーリーボードゲーム　王国のひみつ　ディズニー　エポック社　買う前の確認...</td>
      <td>かうまえのかくにんようだよ.</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/e7...</td>
    </tr>
    <tr>
      <th>2</th>
      <td>mCdnSLRLl38</td>
      <td>LAP Youtube</td>
      <td>2021-06-15T16:49:40Z</td>
      <td>UCB-rg55VHCylqGcJAiDBt1Q</td>
      <td>【居酒屋eラジオ】おもしろボードゲーム＆Knockout City</td>
      <td>福岡女子 タレント3人がお酒を片手に #生配信 おしゃべりや #ゲーム やっちゃいます！ 女...</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/mC...</td>
    </tr>
    <tr>
      <th>3</th>
      <td>cDWKV7l9NbI</td>
      <td>きたこしちゃんねる</td>
      <td>2021-06-15T14:54:52Z</td>
      <td>UCQD1KbDFa25mnfUnF6ldzXw</td>
      <td>【 #ボドこし 74】カートグラファー【バーチャルゲームカフェ】ボードゲームで遊ぼうよ！</td>
      <td>1人から100人で遊べる？！紙ペンゲーム カートグラファーのご紹介&amp;ソロプレイ配信です。 当...</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/cD...</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1Lx9rBOS150</td>
      <td>sangenya</td>
      <td>2021-06-15T12:17:26Z</td>
      <td>UCUTG51hFXQavzdyAYmdN9XA</td>
      <td>ボードゲーム制作 作業配信 五稜郭 0.10.2</td>
      <td>マイクはありません。 https://twitter.com/toshi_kadota Mu...</td>
      <td>{'default': {'url': 'https://i.ytimg.com/vi/1L...</td>
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