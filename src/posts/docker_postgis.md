---
display: home
title: 'Docker + Python + PostGISの環境構築を実施する'
description: Docker + Python + PostGISの環境構築を実施します．
date: 2023-2-11
image: https://www.hamlet-engineer.com/image/shp.png
categories: 
  - GIS
tags:
  - GIS
  - Python
  - Docker
---
Docker + Python + PostGISの環境構築を実施します．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## Dockerfile(PostGIS)
PostGISについては、Dockerfileを用意します。
```js
FROM postgres:14
ENV TZ Asia/Tokyo
RUN apt-get update && apt-get install locales dialog tzdata -y \
               && localedef -i ja_JP -c -f UTF-8 -A /usr/share/locale/locale.alias ja_JP.UTF-8 \
               && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata
ENV LANG ja_JP.UTF-8
RUN apt update \
    && apt-get install wget vim iputils-ping net-tools unzip less -y \
    && apt-get install postgresql-14-postgis-3 -y
RUN echo "create extension if not exists postgis;" > /docker-entrypoint-initdb.d/dbinit.sql
```

## docker-compose.yml
docker-composeでPythonと同時に起動させます。

```js
version: "3"
services:
  # postgres
  postgres:
      build: ./db
      ports:
        - "5432:5432"
      environment:
        POSTGRES_USER: postgre
        POSTGRES_PASSWORD: postgre
        LANG: ja_JP.UTF-8
      volumes:
        - ./db/psgl:/var/lib/postgresql/data

  notebook:
    # https://hub.docker.com/r/jupyter/datascience-notebookからimageをpullする
    image: jupyter/datascience-notebook
    # ポートの設定("ホスト：コンテナ")
    user: root
    ports:
      - "8888:8888"
    # 環境変数の設定
    environment:
      - JUPYTER_ENABLE_LAB=yes
      - "GRANT_SUDO=yes"
    # ボリューム(データの永続化の場所)の設定(ホスト:コンテナ)
    # ホスト内のworkディレクトリとコンテナ内の/home/jovyan/workディレクトリが紐づいているイメージ
    volumes:
      - ./:/home/jovyan/work
    # postgres -> notebook
    depends_on:
      - postgis
    # 最後にjupyterLabに接続するためのコマンドを実行する。
    command: start-notebook.sh --NotebookApp.token=''
```


## docker-composeの起動
下記のコマンドで起動します。
```
docker compose up -d
```

## PostGISの初期設定
PostGISを使えるようにするために、下記のコードを実行します。

これでPostGISの関数が使用できるようになります。

```python
import os
import psycopg2

# DATABASE_URL
DATABASE_URL='postgresql://postgre:postgre@workspace-postgres-1:5432/postgres'

def main():
    # postgresの接続
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True # 操作の重複を防ぐ(databaseの操作)呪文
    cur = conn.cursor()
    
    # postgisを拡張
    cur.execute("create extension if not exists postgis;")
    
    # dbとカーソルを閉じる
    cur.close()
    conn.close()
    
if __name__ == '__main__':
    main()
```


## まとめ
Docker + Python + PostGISの環境構築を実施しました．

## 参考サイト
[PythonでBigQueryの操作](https://blog.imind.jp/entry/2019/12/08/025818)

[BigQuery ↔ Pandas間で読み込み/書き込み](https://qiita.com/komiya_____/items/8fd900006bbb2ebeb8b8)

[[BigQuery] BigQueryのPython用APIの使い方 -テーブル作成編-](https://qiita.com/Hyperion13fleet/items/0e00f4070f623dacf92b)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


