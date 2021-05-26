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

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

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


<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>