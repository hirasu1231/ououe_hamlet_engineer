---
display: home
title: 'DockerでQGISがインストールされたコンテナ(Ubuntu20.04)を作成し起動する'
description: DockerでQGISがインストールされたコンテナ(Ubuntu20.04)を作成し起動します．
date: 2022-01-12
image: https://www.hamlet-engineer.com/image/qgis_sever_top.png
categories: 
  - QGIS
tags:
  - QGIS
  - Docker
---

<!-- https://www.hamlet-engineer.com -->
DockerでQGISがインストールされたコンテナ(Ubuntu20.04)を作成し起動します．


<!-- more -->

[[toc]]

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

## ファイル構成
```
qgis_docker
├── /workspace
├── docker-compose.yml
└── DockerFile
```


## Dockerfileの作成
下記のサイトのDockerfileから一部を書き換えます．

[DockerでQGISとXfce、TigerVNCがインストールされたコンテナ(Ubuntu20.04)を作成する](http://serverarekore.blogspot.com/2020/12/dockerqgisxfcetigervncubuntu2004.html)

書き換えは，下記の通りです．
**QGISのキーを入力**
```
  && apt-key adv --keyserver keyserver.ubuntu.com --recv-key 46B5721DBBD2996A \<br>
```

**gnome-screensaver前にアップデート**
```
  && apt-get update \
  && apt-get -y install gnome-screensaver \
```

**DockerFile**
```
from ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
run apt-get update \
    && apt-get -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" upgrade \
    && apt-get install -y language-pack-ja-base language-pack-ja \
    && ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && echo 'Asia/Tokyo' > /etc/timezone \
    && locale-gen ja_JP.UTF-8 \
    && echo 'LC_ALL=ja_JP.UTF-8' > /etc/default/locale \
    && echo 'LANG=ja_JP.UTF-8' >> /etc/default/locale
env LANG=ja_JP.UTF-8 \
    LANGUAGE=ja_JP.UTF-8 \
    LC_ALL=ja_JP.UTF-8
run apt-get -y install \
        xubuntu-desktop \
        xfce4-terminal \
        tigervnc-standalone-server \
        expect \
        fcitx-mozc \
        fonts-ipafont-gothic \
        fonts-ipafont-mincho \
        vim \
        gvfs-bin \
        xdg-utils \
    && wget -qO - https://qgis.org/downloads/qgis-2020.gpg.key | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/qgis-archive.gpg --import \
    && chmod a+r /etc/apt/trusted.gpg.d/qgis-archive.gpg \
    && echo "deb http://qgis.org/debian focal main" >> /etc/apt/sources.list \
    && apt-key adv --keyserver keyserver.ubuntu.com --recv-key 46B5721DBBD2996A \
    && apt-get update \
    && apt-get -y install qgis python-qgis qgis-plugin-grass \
    && apt-get -y install unzip \
    && wget http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/cultural/ne_110m_admin_0_countries.zip \
    && unzip ne_110m_admin_0_countries.zip \
    && apt-get -y remove --purge light-locker \
    && apt-get update \
    && apt-get -y install gnome-screensaver \
    && im-config -n fcitx \
    && apt-get clean \
    && rm -rf /var/cache/apt/archives/* \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -g 1000 ubuntu \
    && useradd -d /home/ubuntu -m -s /bin/bash -u 1000 -g 1000 ubuntu \
    && echo 'ubuntu:ubuntu' | chpasswd \
    && echo "ubuntu ALL=NOPASSWD: ALL" >> /etc/sudoers \
    && echo 'spawn "tigervncpasswd"' >> /tmp/initpass \
    && echo 'expect "Password:"' >> /tmp/initpass \
    && echo 'send "ubuntu\\r"' >> /tmp/initpass \
    && echo 'expect "Verify:"' >> /tmp/initpass \
    && echo 'send "ubuntu\\r"' >> /tmp/initpass \
    && echo 'expect "Would you like to enter a view-only password (y/n)?"' >> /tmp/initpass \
    && echo 'send "n\\r"' >> /tmp/initpass \
    && echo 'expect eof' >> /tmp/initpass \
    && echo 'exit' >> /tmp/initpass \
    && sudo -u ubuntu -H /bin/bash -c '/usr/bin/expect /tmp/initpass' \
    && mkdir -p /home/ubuntu/.vnc \
    && chown ubuntu:ubuntu /home/ubuntu/.vnc \
    && echo '#!/bin/sh' >> /home/ubuntu/.vnc/xstartup \
    && echo 'export LANG=ja_JP.UTF-8' >> /home/ubuntu/.vnc/xstartup \
    && echo 'export LC_ALL=ja_JP.UTF-8' >> /home/ubuntu/.vnc/xstartup \
    && echo 'export XMODIFIERS=@im=fcitx' >> /home/ubuntu/.vnc/xstartup \
    && echo 'export GTK_IM_MODULE=fcitx' >> /home/ubuntu/.vnc/xstartup \
    && echo 'fcitx -r -d &' >> /home/ubuntu/.vnc/xstartup \
    && echo 'exec startxfce4' >> /home/ubuntu/.vnc/xstartup \
    && chmod +x /home/ubuntu/.vnc/xstartup \
    && mkdir -p /home/ubuntu/data \
    && chown -R ubuntu:ubuntu /home/ubuntu/data

expose 5901
volume ["/home/ubuntu/data"]
```

## docker-compose
docker-compose.ymlを作成します．

**docker-compose.yml**
```
version: "3"
services:
  qgis_vnc:
    build:
      context: .
      dockerfile: Dockerfile
    user: 1000:1000
    ports:
      - 5901:5901
    tty: true
    privileged: true
    volumes:
      - ./workspace:/home/ubuntu/data 
    working_dir: /home/ubuntu/data 
    command: /usr/bin/vncserver :1 -localhost no -geometry 1152x864 -alwaysshared -fg
```

## コンテナの起動
下記のコードでimage構築，コンテナ起動，コンテナ停止を実行します．
```
# image構築
docker-compose build --no-cache

# コンテナ起動
docker-compose up -d

# コンテナ停止
docker-compose stop
```

## サーバーに接続
Finderのメニューバーの「移動→サーバへ接続→vnc://localhost:5901」へ接続します．

パスワードはubuntuです．

[](/image/qgis_sever.png)


## まとめ
ここまでで，DockerでQGISがインストールされたコンテナ(Ubuntu20.04)を作成し起動までしました．

## 参考サイト
[DockerでQGISとXfce、TigerVNCがインストールされたコンテナ(Ubuntu20.04)を作成する](http://serverarekore.blogspot.com/2020/12/dockerqgisxfcetigervncubuntu2004.html)

[QGIS Documentation 18.2.5. コンテナ化された配備](https://docs.qgis.org/3.10/ja/docs/user_manual/working_with_ogc/server/containerized_deployment.html)

[Error adding qgis.org repository public key to apt keyring](https://gis.stackexchange.com/questions/332245/error-adding-qgis-org-repository-public-key-to-apt-keyring)

[apt : Ubuntu 20.04にgnome-control-centerをインストールする方法](https://www.fixes.pub/ubuntu/713313.html)

[docker-compose `up` とか `build` とか `start` とかの違いを理解できていなかったのでまとめてみた](https://qiita.com/tegnike/items/bcdcee0320e11a928d46)

[Dockerで実行ユーザーとグループを指定する](https://qiita.com/acro5piano/items/8cd987253cb205cefbb5)

[Docker でユーザ名を指定してコンテナを起動する](https://qiita.com/syoyo/items/6fa6597b7a6625000e33)

[docker-compose の ports 指定まとめ](https://qiita.com/tksugimoto/items/23fcce1b067661e8aa46)

[Dockerへvnc接続する](https://qiita.com/seigot/items/eef9da58c74eb080617b)

[Dockerコンテナの内部IPアドレスを確認する方法](https://qiita.com/ponsuke0531/items/7e8e5081993a30afdc4a)

[kartoza/docker-qgis-desktop](https://github.com/kartoza/docker-qgis-desktop)

[rafdouglas/qgis_desktop_docker](https://github.com/rafdouglas/qgis_desktop_docker)

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

