---
display: home
title: 'Python, OpenCVで好きな動画ファイルからフレームを切り出して保存します'
description: Python, OpenCVを用いて，任意の秒数単位で動画のフレームを画像として出力するコードを作成します．
date: 2021-03-13
image: https://www.hamlet-engineer.com/image/opencv.png
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - OpenCV
---
Python, OpenCVを用いて，任意の秒数単位で動画のフレームを画像として出力するコードを作成します．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

※注意：完全な趣味です・・・<br>
先日，[ゴジラSPの新予告映像](https://www.youtube.com/watch?v=xVv3kouh4is)が解禁されました．そこには新規カットや新しい怪獣が多くあり，最初は動画いちいち一時停止してチェックしていましたが，面倒でしたので，上記のコードを作成します．<br>

[[toc]]

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

## ファイル構成
プロジェクトディレクトリはframe_mp4としています．度々，省略しています．
```
frame_mp4
├── /frame
│   └── /ゴジラSP <- 出力
│       ├── ゴジラSP_0001.jpg
│       ├── ゴジラSP_0002.jpg
│       ├── ゴジラSP_0003.jpg
│       └── (省略)
├── /video  <- 入力一括
├── ゴジラSP.mp4  <- 入力
└── frame_mp4.ipynb <- 実行用ノートブック
```

## 動画ファイルからフレームを保存
以下のコードで動画ファイルからフレームを切り出して保存します．
```python
import cv2
import os
import math
from glob import glob

def save_frames(video_path, second=1/2):
    # 動画の読み込み
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        return
    
    # 動画ファイル名でディレクトリを作成
    basename = os.path.basename(video_path).split('.', 1)[0]
    out_dir = os.path.join('frame', basename)
    os.makedirs(out_dir, exist_ok=True)
    # 0埋め用
    digit = len(str(int(cap.get(cv2.CAP_PROP_FRAME_COUNT))))
    
    # fpsの数値を出力
    fps = cap.get(cv2.CAP_PROP_FPS)//1
    n = -1
    f = 1
    
    # 任意の秒ごとに出力
    while True:
        ret, frame = cap.read()
        if ret:
            n += 1
            fs = int((f-1)*fps*second)
            if n == int(fs):
                out_name = '{}_{}.{}'.format(basename, str(f).zfill(digit), 'jpg')
                out_file = os.path.join(out_dir, out_name)
                cv2.imwrite(out_file, frame)
                f += 1
        else:
            return
```

実行する際は以下のコードを使います．
```python
# 0.5秒単位でフレームを保存
save_frames('ゴジラSP.mp4', second=1/2)
```

また，特定のディレクトリ内(ここでは/video)にmp4ファイルをまとめておいて，一括で処理したい場合は，以下のコードを使います．
```python
# 特定のディレクトリ内のmp4ファイルを全て読み込む
input_dir = './video'
files = glob(os.path.join(input, '*.mp4'))
for file in files:
    save_frames(file, second=1/2)
```

実行後は，以下のようになります．(./frame/ゴジラSP/)<br>
![](/image/frame_mp4.png)

## まとめ
完全な趣味となりましたが，[ゴジラSPの新予告映像](https://www.youtube.com/watch?v=xVv3kouh4is)のフレームを画像として出力するコードを作成しました．<br>
いやあ，快適にチェックできて眼福です!!

## 参考サイト
[Python, OpenCVで動画ファイルからフレームを切り出して保存](https://note.nkmk.me/python-opencv-video-to-still-image/)

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>