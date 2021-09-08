---
display: home
title: 'C言語に対応したjupyter Labを実装する'
description: C言語に対応したjupyter Labを実装します．
date: 2021-09-09
image: https://www.hamlet-engineer.com/image/jupyter.png
categories: 
  - Python
tags:
  - Python
  - jupyter
  - Docker
  - C
---
<!-- https://www.hamlet-engineer.com -->
C言語に対応したjupyter Labを実装します．

今回はDockerで実装します．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

## ファイル構成
プロジェクトディレクトリはsegmentationとしています．度々，省略しています．
```
jupyter-c-kernel <- ここがDockerの/home/jovyan/workと同期します
└── docker-compose.yml
```


## C言語に対応したjupyter notebook

### docker-compose.ymlの作成
下記にC言語に対応したjupyter Labのdocker-compose.ymlを作成します．

下記のコードでは，JupyterLabで起動しています．
```js
version: "3"
services:
  jupyter_c_kernel:
    image: brendanrius/jupyter-c-kernel:latest
    stdin_open: true
    tty: true
    volumes:
      - ./:/home/jovyan/work
    ports:
      - 8050:8050 # for Dash
      - 75:8888 # for Jupyterlab
    command:
      sh -c 'pip install --upgrade pip && pip install jupyterlab && jupyter lab'
```

### dockerのコンテナの起動
下記のコードでdockerのコンテナの起動します．
```
docker-compose up
```

上記のコードでは，http://localhost:75/token=＊＊＊＊＊でjupyter notebookが起動します．


## 参考サイト
[brendan-rius/jupyter-c-kernel](https://github.com/brendan-rius/jupyter-c-kernel)


<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>