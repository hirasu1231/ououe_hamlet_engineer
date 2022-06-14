---
display: home
title: 'PythonにおけるSQLiteの操作をまとめてみた'
description: PythonにおけるSQLiteの操作をまとめてます．
date: 2021-11-26
image: https://www.hamlet-engineer.com/image/sqlite.jpeg
categories: 
  - Python
tags:
  - Python
  - jupyter
  - SQLite
  - SQL
---

PythonにおけるSQLiteの操作をまとめてます．．<br>

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


## テーブル作成とデータ格納

```python
import sqlite3

# dbの読み込み(sample.dbは自動で作成される)
con = sqlite3.connect('sample.db')
# カーソルの設定
# https://www.postgresql.jp/document/9.2/html/plpgsql-cursors.html
cur = con.cursor()

# テーブル作成
# テーブル名 　データ型 unique　: 重複禁止のカラム作成
cur.execute('''CREATE TABLE sample_table
               (ID text unique, date text, title text)''')

# 格納データ
ID = 'mqRgDodGSEo'
date = '20210626'
title = 'もしギルガルドが弱体化されてなかったら'

# データの格納
cur.execute("INSERT INTO sample_table \
            VALUES ('{0}','{1}','{2}')".format(ID,
                                               date,
                                               title))
# テーブル変更を保存
con.commit()

# dbとカーソルを閉じる
cur.close()
con.close()
```

## テーブル情報の抽出

```python
import sqlite3

# dbの読み込み
con = sqlite3.connect('sample.db')
# カーソルの設定
# https://www.postgresql.jp/document/9.2/html/plpgsql-cursors.html
cur = con.cursor()

# テーブル情報の抽出
cur.execute('SELECT * FROM sample_table;')
data = cur.fetchall()
print(data)

# カラム名取得
names = list(map(lambda x: x[0], cur.description))
print(names)

# dbとカーソルを閉じる
cur.close()
con.close()
```

## テーブル自体を削除

```python
import sqlite3

# dbの読み込み
con = sqlite3.connect('sample.db')
# カーソルの設定
# https://www.postgresql.jp/document/9.2/html/plpgsql-cursors.html
cur = con.cursor()

# テーブルの削除
cur.execute('DROP TABLE sample_table;')

# テーブル変更を保存
con.commit()

# dbとカーソルを閉じる
cur.close()
con.close()
```

## テーブルの中身を削除

```python
import sqlite3

# dbの読み込み
con = sqlite3.connect('sample.db')
# カーソルの設定
# https://www.postgresql.jp/document/9.2/html/plpgsql-cursors.html
cur = con.cursor()

# テーブルの中身を削除
cur.execute('DELETE FROM output_video;')

# テーブル変更を保存
con.commit()

# dbとカーソルを閉じる
cur.close()
con.close()
```

## 参考サイト
[sqlite3 --- SQLite データベース](https://docs.python.org/ja/3/library/sqlite3.html)

[第39章PL/pgSQL - SQL手続き言語](https://www.postgresql.jp/document/9.2/html/plpgsql-cursors.html)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
