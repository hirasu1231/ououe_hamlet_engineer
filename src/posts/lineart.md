---
display: home
title: 'Python + Opencvでアニメをラフ画のような線画に変換する'
description: Python + Opencvでアニメをラフ画のような線画への変換を実施します．
date: 2021-11-19
image: https://www.hamlet-engineer.com/image/lineart.png
categories: 
  - Python
tags:
  - Python
  - jupyter
  - OpenCV
---
<!-- https://www.hamlet-engineer.com -->
Python + Opencvでアニメをラフ画のような線画への変換を実施します．<br>

<!-- more -->

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

[[toc]]

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">


## Google Colabのファイル構成
プロジェクトディレクトリはpdf_translate_bertとしています．度々，省略しています．
```init
lineart
├── /pdf_translate_bert
└── lineart.ipynb <- 実行用ノートブック
```

## Google Driveと連携
Google ColabとGoogle Driveを連携させて，作業ディレクトリを作成します．<br>

```python
# Google Driveと連携
from google.colab import drive
drive.mount('/content/drive')
```

```python
# 作業ディレクトリの作成
%cd /content/drive/MyDrive/
!mkdir -p lineart
%cd lineart
!ls
```

## モジュールのインストール
下記のコマンドでモジュールをインストールします．
```python
# ffmpeg
!apt-get install ffmpeg
# pip
!pip install pydub
```

## 線画への変換を実行
変換は下記の工程で実行します．

1. 音声ファイル(mp3)の作成

2. フレーム数の設定

3. 線画動画の出力(音声なし)

4. 線画動画と音声ファイルの結合

```python
import os
import cv2
import numpy as np
import subprocess
from pydub import AudioSegment
```

### 音声ファイル(mp3)の作成
下記のコードで音声ファイル(mp3)を作成します．

```python
# 入力動画
mp4_file = 'jujutsukaisen_op.mp4'

# mp3の変換
mp3_file = mp4_file.replace('.mp4', '.mp3')
cp = subprocess.run(['ffmpeg', '-y', '-i', mp4_file, '-acodec', 'libmp3lame', '-ab', '256k', mp3_file])
# 音声ファイルの読み込み
sound = AudioSegment.from_file(mp3_file, "mp3")
time = sound.duration_seconds # 再生時間(秒)
print(time)
```


### フレーム数の設定
下記のコードで動画のフレーム数の設定します．

```python
# 動画の読み込み
vid = cv2.VideoCapture(mp4_file)
# 動画情報の抽出(fps)
for vid_fps in range(20,32):
    video_frame_count = vid.get(cv2.CAP_PROP_FRAME_COUNT) # フレーム数を取得する
    video_len_sec = video_frame_count / vid_fps         # 長さ（秒）を計算する
    # 誤差1秒以内
    if 1 > abs(time-video_len_sec):
        break
print(vid_fps, abs(time-video_len_sec))
```

### 線画動画の出力(音声なし)
下記のコードで線画動画の出力します．(音声なし)

```python
# 出力動画の設定
sub_file = mp4_file.replace('.mp4','_sub.mp4')
codec = cv2.VideoWriter_fourcc(*'XVID')
vid_width,vid_height= int(vid.get(cv2.CAP_PROP_FRAME_WIDTH)), int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT))
out = cv2.VideoWriter(sub_file, codec, vid_fps, (vid_width,vid_height))

# 近傍(線画)の設定
# 線画の設定は下記の数値を変更して，調整してください．
n = 5
neiborhood24 = np.ones((n, n), np.uint8)

while True:
    _, frame = vid.read()
    if frame is None:
        print('Completed')
        break
        
    # 線画化
    # グレースケールで画像を読み込む
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # 白い部分を膨張させる.
    dilated = cv2.dilate(gray, neiborhood24, iterations=1)
    # 差をとる.
    diff = cv2.absdiff(dilated, gray)
    # 白黒反転
    contour = 255 - diff
    # 出力
    out.write(cv2.cvtColor(contour, cv2.COLOR_BGR2RGB))
    
    if cv2.waitKey(1) == ord('q'):
        break

vid.release()
out.release()
```

### 線画動画と音声ファイルの結合
下記のコードで線画動画と音声ファイルを結合します．

```python
# 映像/音声の結合
cp = subprocess.run(['ffmpeg', '-y', '-i', sub_file, '-i', mp3_file, '-c:v', 'copy', '-c:a', 'aac', '-map', '0:v:0', '-map', '1:a:0', mp4_file.replace('.mp4','_cv2.mp4')])
# ファイル削除
os.remove(sub_file)
os.remove(mp3_file)
```

変換結果

<video width="640" height="400" controls>
  <source src="/video/jujutsukaisen_op.mov" type="video/mp4">
  Your browser does not support the video tag.
</video> 

## まとめ
本稿では，上記のコードでアニメの線画化を実装しました．


## 参考サイト
[モルフォロジー変換](http://labs.eecs.tottori-u.ac.jp/sd/Member/oyamada/OpenCV/html/py_tutorials/py_imgproc/py_morphological_ops/py_morphological_ops.html)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
