---
display: home
title: 'Nimが対応したJupyterLabをDockerでインストールする'
description: Nimが扱えるJupyterLabをDockerにインストールします．
date: 2021-02-20
image: https://www.hamlet-engineer.com/image/nim.png
categories: 
  - Nim
tags:
  - Nim
  - Jupyter
  - Docker
---
Nimが扱えるJupyterLabをDockerにインストールします．

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

## インストール
[tsutomu7/nim](https://hub.docker.com/r/tsutomu7/nim/)のイメージをdocker-composeでPullします．<br>
僕はdocker-compose.ymlを以下のように記述しました．
```
version: "3"
services:
  jupyter:
    image: tsutomu7/nim:latest
    # user: root
    volumes:
      - ./:/root/work
    ports:
      - "88:8888" # for Jupyterlab
```
コンテナが立ち上がったら http://localhost:88/ にアクセスすると Jupyter Lab が開きます．<br>
```
$ mkdir jupyter-nim
$ cd jupyter-nim
$ touch docker-compose.yml
# 中身記述後
$ docker-compose up
```

## まとめ
Nimが扱えるJupyterLabをDockerにインストールしました．<br>
あとは，少しずつ遊んでいきます．

## 参考サイト
[Jupyterでnimを使おう](https://qiita.com/SaitoTsutomu/items/f79257430e2d8fcb9196)<br>
[tsutomu7/nim](https://hub.docker.com/r/tsutomu7/nim/)<br>
[Jupyter notebookでNimを使い，グラフの可視化まで](https://qiita.com/SatoshiTerasaki/items/281c578c47f8ee497f3c)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>