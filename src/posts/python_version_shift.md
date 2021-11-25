---
display: home
title: '複数のversionをインストールしてる中で，pythonのversionを切り替える'
description: 複数のversionをインストールしているpythonのversionを切り替えます
date: 2021-11-25
image: https://www.hamlet-engineer.com/image/Python.png
categories: 
  - Python
tags:
  - Python
  - jupyter
  - CNN
  - deepgaze
---
<!-- https://www.hamlet-engineer.com -->
複数のversionをインストールしているpythonのversionを切り替えます．

ここでは，ターミナルで使うpythonのversion(3.9.1)と，jupyterのversion(3.8.6)が違うので，ターミナルで使うpythonのversionを「3.9.1」から「3.8.6」に切り替えます．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

## 現在のpythonのversionを確認

### python
pythonでは，以下のコードでversionとディレクトリの確認を実行します．

```python
# versionの確認
python3 -V
# Python 3.9.1
# ディレクトリの確認
which python3
# /usr/local/bin/python3
```

上記のディレクトリはシンボリックリンクで結ばれているので，以下のコードでリンク先の確認もとる．

```python
ls -l /usr/local/bin/python3
# /usr/local/bin/python3 -> ＊＊＊＊/python@3.9/3.9.1/bin/python3
```

### jupyter notebook
jupyter notebookでは，以下のコードでversionとディレクトリの確認を実行します．
```python
import sys

# versionの確認
print(sys.version)
# ディレクトリの確認
print(sys.executable)
# 3.8.6
# ＊＊＊＊＊/python@3.8/bin/python3.8
```

## versionの切り替え

### シンボリックリンクの切断
下記のコードでシンボリックリンクの切断を実施します．
```python
unlink /usr/local/bin/python3
```

### シンボリックリンクの接続
下記のコードでシンボリックリンクの接続を実施します．
```python
ln -s ＊＊＊＊＊/python@3.8/bin/python3.8 /usr/local/bin/python3
# ln -s /usr/local/lib/python3.8/site-packages (/Library/Python/3.7/site-packages/
# ln -s /usr/local/lib/python3.8/site-packages (/Library/Python/3.7/site-packages/
```

### 切り替えの確認
下記のコードで切り替えの確認を実施します．
```python
python3 -V
# Python 3.8.6
ls -l /usr/local/bin/python3
# /usr/local/bin/python3 -> ＊＊＊＊＊/python@3.8/bin/python3.8
```

## まとめ
複数のversionをインストールしているpythonのversionを切り替えを実装しました．

## 参考サイト
[Jupyter notebookでPythonのバージョンを取り出してみたり](https://qiita.com/yossyyossy/items/4b20936e5ed544a79ce9)

[macOS CatalinaのPythonのデフォルトを3.x.xにする](https://ottan.xyz/posts/2020/04/macos-catalina-python3-default/)


<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>