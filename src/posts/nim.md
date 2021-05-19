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



[[toc]]

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


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>