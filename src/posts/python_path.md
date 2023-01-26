---
display: home
title: 'Pythonでファイル・ディレクトリを確認する'
description: Pythonでファイル・ディレクトリを確認します．
date: 2023-1-27
image: https://www.hamlet-engineer.com/image/Python.png
categories: 
  - Python
tags:
  - memo
  - Python
  - kowaza0708
---
Pythonでファイル・ディレクトリを確認します．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ファイルがあるディレクトリ名を取得する
ファイルがあるディレクトリ名を取得します。

```python
import os

#フォルダパス取得
os.path.dirname(ファイルのフルパス)
#ファイル名取得
os.path.basename(ファイルのフルパス)
```

## ファイル・ディレクトリが存在するかの確認
ファイル・ディレクトリが存在するかの確認します。

```python
import os

# ファイルまたはディレクトリ（フォルダ）の存在確認
os.path.exists("ファイルのパス")

# ファイルの存在確認
os.path.isfile("パス")

# ディレクトリ（フォルダ）の存在確認
os.path.isdir("パス")
```

## まとめ
Pythonでファイル・ディレクトリを確認しました．

## 参考サイト
[os.path](https://note.nkmk.me/python-os-exists-isfile-isdir/)

[【Python】dirname・basenameでフォルダ名・ファイル名を取得](https://pg-chain.com/python-dirname-basename)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


