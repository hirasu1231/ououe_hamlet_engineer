---
display: home
title: '学習済みモデルで白黒映画をカラー映画に変換する(1)'
description: Ryan Dahl氏が作成した学習済みモデルで白黒映画をカラー映画に変換します．．
date: 2023-3-26
image: https://www.hamlet-engineer.com/image/macacon.jpeg
categories: 
  - Python
tags:
  - Python
  - jupyter
---
<!-- https://www.hamlet-engineer.com -->
YouTube Data API を使って再生リストから動画の再生回数等の情報を取得します．

<!-- more -->

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

[[toc]]

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

## Google Colabのファイル構成
プロジェクトディレクトリはcolor_videoとしています．度々，省略しています．
```init
color_video
├── /macacon
│   ├── colorize.tfmodel <- 学習済みモデル
│   ├── macacon.py
│   ├── macacon.sh
│   ├── godzilla.mp4 <- 変換前動画
│   ├── output_godzilla.mp4 <- 変換後動画
│   └── (省略)
└── macacon.ipynb <- 実行用ノートブック
```

## Google Driveと連携
Google ColabとGoogle Driveを連携させて，gitから[Eiji-Kb/macacon](https://github.com/Eiji-Kb/macacon)をダウンロードします．<br>

```python
# Google ColabとGoogle Driveを連携
from google.colab import drive
drive.mount('/content/drive')
```

```python
%%bash
# ディレクトリの移動
cd /content/drive/My\ Drive/color_video/
# gitのダウンロード
git clone https://github.com/Eiji-Kb/macacon.git
ls
```

## 学習済みモデルのダウンロード
Dahl氏Automatic Colorization をダウンロードしてください．

http://tinyclouds.org/colorize/

## モジュールのインストール
今回はtensorflowの1系を使うので，version指定でインストールします．

```python
!pip install tensorflow==1.15
```

## 変換の実行

### コードの一部修正
コードに誤りがあるため，下記の箇所を修正します．

```python
# 修正前
# File "./macacon.py", line 10, in <module>
parser.add_argument("inputMovie", type=file) 
```

```python
# 修正後
# File "./macacon.py", line 10, in <module>
parser.add_argument("inputMovie", type=argparse.FileType('r')) 
```

```python
# ディレクトリの移動
%cd /content/drive/My\ Drive/color_video/macacon
!ls
```

```python
# macacon.pyの書き込み
%%writefile macacon.py
import tensorflow as tf
import numpy as np
import cv2
import argparse
import time

start_time = time.time()

parser = argparse.ArgumentParser() 
parser.add_argument("inputMovie", type=argparse.FileType('r')) 
parser.add_argument("outputMovie") 
parser.add_argument("-m", const=1, nargs="?")
parser.add_argument("-c", default=0, type=float, nargs="?") 
args = parser.parse_args()
inputMovie = args.inputMovie
outputMovie = args.outputMovie

cap = cv2.VideoCapture(inputMovie.name)

heightInputMovie = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
widthInputMovie = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
FPS = cap.get(cv2.CAP_PROP_FPS)
allFrames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

print ("Width  =", widthInputMovie)
print ("Height =", heightInputMovie)
print ("FPS =", FPS)
print ("Frames =", allFrames)

fourcc = "XVID"
out = cv2.VideoWriter(outputMovie, cv2.VideoWriter_fourcc(*fourcc), FPS, (widthInputMovie,heightInputMovie))

with open("colorize.tfmodel", mode='rb') as f:
	fileContent = f.read()

graph_def = tf.GraphDef()
graph_def.ParseFromString(fileContent)
grayscale = tf.placeholder("float", [1, 224, 224, 1])
tf.import_graph_def(graph_def, input_map={ "grayscale": grayscale }, name='')


with tf.Session() as sess:

	for frameNo in range(1, allFrames+1):

		print ("Frame no =", frameNo)
	
		ret, frame = cap.read()

		if ret == True:

			frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
			frame_rgb = (frame_rgb / 255.).astype(np.float32)
			frame_lab = cv2.cvtColor(frame_rgb, cv2.COLOR_RGB2Lab)
			frame_lab_l = frame_lab[:,:,0]
			frame_rgb_vgg = cv2.resize(frame_rgb, (224, 224))
			frame_rgb_vgg_gray = cv2.cvtColor(frame_rgb_vgg, cv2.COLOR_RGB2GRAY).reshape(1, 224, 224, 1)
			inferred_rgb = sess.graph.get_tensor_by_name("inferred_rgb:0")
			inferred_batch = sess.run(inferred_rgb, feed_dict={ grayscale: frame_rgb_vgg_gray })
			foward_rgb = cv2.resize(inferred_batch[0], (widthInputMovie, heightInputMovie), interpolation=cv2.INTER_CUBIC)
			frame_lab = cv2.cvtColor(foward_rgb, cv2.COLOR_RGB2Lab)
			if args.c:
				frame_lab *= args.c
			frame_lab_out = np.concatenate((frame_lab_l[:,:,np.newaxis], frame_lab[:,:,1,np.newaxis], frame_lab[:,:,2,np.newaxis]), axis=2) 
			frame_rgb_out = cv2.cvtColor(frame_lab_out, cv2.COLOR_Lab2RGB)
			frame_rgb_out = (frame_rgb_out * 255).astype(np.uint8)
			cvFrame = cv2.cvtColor(frame_rgb_out, cv2.COLOR_RGB2BGR)
			out.write(cvFrame)

			if args.m:
				cv2.imshow('frame', cvFrame)

		if cv2.waitKey(1) & 0xFF == ord('q'):
			break

	cap.release()
	out.release()
	cv2.destroyAllWindows()

	print ("Elapsed time:{0:.2f}".format(time.time() - start_time) + "sec")
```

### 変換の実行
以下のコマンドで白黒動画からカラー動画への変換を試みます．

本来，python上で変換を実施すると音声が付与されません．

しかし，ffmpegによる音声付与も一括でしてくれる`macacon.sh`が作成されているので，それを実行します．

変換する動画はゴジラ1954の一部シーンです．

```python
# 音声なし
!python ./macacon.py godzilla.mp4 output_godzilla.mp4
# 音声あり
!sh ./macacon.sh godzilla.mp4 output_godzilla.mp4
```


<video width="720" height="480" controls>
  <source src="/video/output_godzilla.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video> 


## まとめ
かなり古い学習済みモデルで白黒からカラーへの変換を実施しました．

やはり，ゴジラというものが存在しないので，くっきり白黒が残ってました．

他のモデルも使ってみて，転移学習でゴジラの画像も学習させてみようと思います．


## 参考サイト
[Eiji-Kb/macacon](https://github.com/Eiji-Kb/macacon)

[macacon　ディープラーニングで白黒動画をカラー化して楽しむOpenCVラッパー](https://eiji-kb.hatenablog.com/entry/2016/07/10/000839)


## エラー集
### エラーコード1
```python
  File "./macacon.py", line 36, in <module>
    graph_def = tf.GraphDef()
AttributeError: module 'tensorflow' has no attribute 'GraphDef'
```

tensorflow2系に存在しないコードを使おうとしているので，tensorflow1系にダウングレードする必要がある．


<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
