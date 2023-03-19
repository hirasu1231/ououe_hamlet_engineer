---
display: home
title: 'docker-composeでPythonとPostgreSQLを同時起動する'
description: docker-composeでPythonとPostgreSQLを同時起動します．
date: 2023-4-1
image: https://www.hamlet-engineer.com/image/postgres.png
categories: 
  - Python
tags:
  - Python
  - SQL
  - PostgreSQL
---
docker-composeでPythonとPostgreSQLを同時起動します．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## dockerの設定

### ファイル構成
```
project_dir
├── /db
│   ├── /psgl
│   └── Dockerfile
└── docker-compose.yml
```

### /db/DockerFile
```js
FROM postgres:14
RUN localedef -i ja_JP -c -f UTF-8 -A /usr/share/locale/locale.alias ja_JP.UTF-8
ENV LANG ja_JP.UTF-8
```

### ./docker-compose.yml

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
      - postgres
    # 最後にjupyterLabに接続するためのコマンドを実行する。
    command: start-notebook.sh --NotebookApp.token=''
```


## ライブラリのインストール
下記のコードでライブラリをインストールします．
```python
!sudo apt-get update
!sudo apt-get -y install libpq-dev gcc
!pip install psycopg2
```

## postgreSQLの操作

### postgreSQLの接続確認

```python
import os
import psycopg2

# DATABASE_URL='postgresql://postgre:postgre@localhost:5432/postgres'
DATABASE_URL='postgresql://postgre:postgre@workspace-postgres-1:5432/postgres'

def main():
    cursor = psycopg2.connect(DATABASE_URL)
    print(cursor)

if __name__ == '__main__':
    main()
```

### データベース一覧の確認
```python
import os
import psycopg2

# DATABASE_URL='postgresql://postgre:postgre@localhost:5432/postgres'
DATABASE_URL='postgresql://postgre:postgre@workspace-postgres-1:5432/postgres'

def main():
    # postgresの接続
    conn = psycopg2.connect(DATABASE_URL)
    print(conn.autocommit)
    cur = conn.cursor()
    
    # データベース一覧の確認
    cur.execute('SELECT datname FROM pg_database;')
    data = cur.fetchall() # 出力結果
    print(data)
    
    # dbとカーソルを閉じる
    cur.close()
    conn.close()

if __name__ == '__main__':
    main()
```

### データベースの作成

```python
import os
import psycopg2

# DATABASE_URL='postgresql://postgre:postgre@localhost:5432/postgres'
DATABASE_URL='postgresql://postgre:postgre@workspace-postgres-1:5432/postgres'

def main():
    # postgresの接続
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True # 操作の重複を防ぐ(databaseの操作)呪文
    cur = conn.cursor()
    
    # データベースの削除
    cur.execute('CREATE database db_test1')
    
    # データベース一覧の確認
    cur.execute('SELECT datname FROM pg_database;')
    data = cur.fetchall() # 出力結果
    print(data)
    
    # dbとカーソルを閉じる
    cur.close()
    conn.close()
    
if __name__ == '__main__':
    main()
```

### データベースの削除
```python
import os
import psycopg2

# DATABASE_URL='postgresql://postgre:postgre@localhost:5432/postgres'
DATABASE_URL='postgresql://postgre:postgre@workspace-postgres-1:5432/postgres'

def main():
    # postgresの接続
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True # 操作の重複を防ぐ(databaseの操作)呪文
    cur = conn.cursor()
    
    # データベースの作成
    cur.execute('DROP database db_test')
    
    # データベース一覧の確認
    cur.execute('SELECT datname FROM pg_database;')
    data = cur.fetchall() # 出力結果
    print(data)
    
    # dbとカーソルを閉じる
    cur.close()
    conn.close()
    
if __name__ == '__main__':
    main()
```

### テーブル一覧の表示

```python
import os
import psycopg2

# DATABASE_URL='postgresql://postgre:postgre@localhost:5432/postgres'
DATABASE_URL='postgresql://postgre:postgre@workspace-postgres-1:5432/postgres'

def main():
    # postgresの接続
    conn = psycopg2.connect(DATABASE_URL)
    print(conn.autocommit)
    cur = conn.cursor()
    
    # データベース一覧の確認
    query = '''
            SELECT t.* 
            FROM (
                SELECT TABLENAME,SCHEMANAME,'table' as TYPE from PG_TABLES
                UNION SELECT VIEWNAME,SCHEMANAME,'view' as TYPE from PG_VIEWS
            ) t
            WHERE TABLENAME LIKE LOWER('{0}') 
            and SCHEMANAME like LOWER('{1}') 
            and TYPE like LOWER('{2}')'''
    cur.execute(query)
    data = cur.fetchall() # 出力結果
    print(data)
    
    # dbとカーソルを閉じる
    cur.close()
    conn.close()

if __name__ == '__main__':
    main()
```

## まとめ
docker-composeでPythonとpostgreSQLを同時起動しました．

## 参考サイト

**docker compose**

[Dockerコンテナ上のPythonプログラムからPostgreSQLに接続する](https://qiita.com/sey323/items/a4875408a67cea6a8c52)

[日本語モードのPostgreSQL, pgAdmin4同時起動docker-compose.yaml](https://denor.jp/docker-compose%E3%81%A7%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%83%A2%E3%83%BC%E3%83%89%E3%81%AEpostgresql%E3%81%A8pgadmin4%E3%82%92%E8%B5%B7%E5%8B%95%E3%81%99%E3%82%8B%E3%81%AB%E3%81%AF)

[docker-composeでDjangoとPostgreSQLを連携した構築手順（VPS環境）](https://genchan.net/it/virtualization/docker/3951/)

[Docker Compose の depends_on の使い方まとめ](https://gotohayato.com/content/533/)

**Python + PostgreSQL**

[Pythonでpsycopg2を使用しPostgreSQLデータベースを作成する](https://laboratory.kazuuu.net/creating-a-postgresql-database-in-python-using-psycopg2/)

[CREATE DATABASE](https://www.postgresql.jp/document/8.3/html/sql-createdatabase.html)

[DROP DATABASE]((https://www.postgresql.jp/document/9.4/html/sql-dropdatabase.html)

[PythonでPostgreSQL(テーブル作成〜)](https://tabeta-log.blogspot.com/2018/08/pythonpostgresql.html)

[Python で PostgreSQL を操作してみよう！](https://www.gis-py.com/entry/py-postgre)

[PostgreSQLでオートコミットをオフにする方法 †](https://db.just4fun.biz/?PostgreSQL/auto+commit%E3%82%92off%E3%81%AB%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95)

[【 コピペでOK】９割の機能を網羅！PytonからPostgreSQLを扱うクラスを作ってみました。](https://resanaplaza.com/2021/09/15/%E3%80%90-%E3%82%B3%E3%83%94%E3%83%9A%E3%81%A7ok%E3%80%91%EF%BC%99%E5%89%B2%E3%81%AE%E6%A9%9F%E8%83%BD%E3%82%92%E7%B6%B2%E7%BE%85%EF%BC%81pyton%E3%81%8B%E3%82%89postgresql%E3%82%92%E6%89%B1%E3%81%86/)

[PostgreSQLでデータベースの一覧を取得する方法](https://lightgauge.net/database/postgresql/get-db-list)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


