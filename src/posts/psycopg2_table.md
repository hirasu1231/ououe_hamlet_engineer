---
display: home
title: 'Python(psycopg2) + PostgreSQLで作成テーブル一覧を作成する'
description: Python(psycopg2) + PostgreSQLで作成テーブル一覧を出力します。
date: 2023-4-1
image: https://www.hamlet-engineer.com/image/postgres.png
categories: 
  - Python
tags:
  - Python
  - psycopg2
  - PostgreSQL
  - SQL
---
Python(psycopg2) + PostgreSQLで作成テーブル一覧を出力します。

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## テーブル一覧を出力
テーブル一覧を出力します．

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
    
    # データベース一覧の確認
    cur.execute("select schemaname, tablename from pg_tables WHERE schemaname='public';")
    
    
    data = cur.fetchall() # 出力結果
    print(data)
    
    # dbとカーソルを閉じる
    cur.close()
    conn.close()
    
if __name__ == '__main__':
    main()
# [('public', 'spatial_ref_sys'), ('public', 'osm')]
```

## まとめ
Python(psycopg2) + PostgreSQLで作成テーブル一覧を出力しました．

## 参考サイト


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


