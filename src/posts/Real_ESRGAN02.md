---
display: home
title: 'Real-ESRGANを用いて動画を高画質化する'
description: Real-ESRGANを用いた動画の高画質化を実施します．
date: 2021-11-03
image: https://www.hamlet-engineer.com/image/gegege.png
categories: 
  - Python
tags:
  - Python
  - jupyter
  - opencv
---
<!-- https://www.hamlet-engineer.com -->
Real-ESRGANを用いた動画の高画質化を実施します．<br>

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
プロジェクトディレクトリはBetterPictureとしています．度々，省略しています．
```init
BetterPicture
├── /Real-ESRGAN
│   ├── /inputs <- 入力
│   ├── /results <- 出力
│   ├── /experiments/pretrained_models <- 学習済みモデル
│   ├── gegege4OP.mp4 <- 動画
│   ├── video_realesrgan.py <- 実行スクリプト(新規作成)
│   └── (　省略)
└── BetterPicture.ipynb <- 実行用ノートブック
```

## Google Driveと連携
Google ColabとGoogle Driveを連携させて，gitから[xinntao/Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN.git)をダウンロードします．<br>

```python
# Google Driveと連携
from google.colab import drive
drive.mount('/content/drive')
```

```python
# ディレクトリの移動
%cd /content/drive/My\ Drive/BetterPicture
# gitのダウンロード
!git clone https://github.com/xinntao/Real-ESRGAN.git
%cd Real-ESRGAN
!ls
```

## モジュールのインストール
下記のコマンドでモジュールをインストールします．
```python
# ffmpeg
!apt-get install ffmpeg
!pip install pydub

!pip install basicsr

!pip install facexlib
!pip install gfpgan
!pip install -r requirements.txt
!python setup.py develop
```

## 学習済みモデルのダウンロード
下記のコードで学習済みモデルをダウンロードします．
```python
!wget https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth -P experiments/pretrained_models
!wget https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.2.4/RealESRGAN_x4plus_anime_6B.pth -P experiments/pretrained_models
```

## 変換画像のサイズを確認
Real-ESRGANは，縦・横で1000以上の画像だとメモリオーバーになる可能性があり，読み込みがきないようにしているため，動画のサイズを500＜h,w＜1000になるようにリサイズする必要があります．

下記に，opencvでリサイズするコードを記述します．

```python
import cv2

# 読み込み
path = './inputs/0014.jpg'
img = cv2.imread(path)

height = img.shape[0]
width = img.shape[1]
print(height, width)

# 縮小する(×0.5)場合
img2 = cv2.resize(img , (int(width*0.5), int(height*0.5)))
print(img2.shape[0], img2.shape[1])
# 保存(image2の場合)
# cv2.imwrite(path , img2)
# 179 179
# 89 89
```

## 動画の高画質化を実行
下記のコードでスクリプトを作成します．

本稿のスクリプトでは，入力動画のサイズを1/2にして読み込めるようにした後に，Real-ESRGANで4倍の画質に変換してます．

```python
%%writefile video_realesrgan.py
import argparse
import cv2
import glob
import os
from basicsr.archs.rrdbnet_arch import RRDBNet

from realesrgan import RealESRGANer

import subprocess
from pydub import AudioSegment

def video2audio(mp4_file):
  # mp3の変換
  mp3_file = mp4_file.replace('.mp4', '.mp3')
  cp = subprocess.run(['ffmpeg', '-y', '-i', mp4_file, '-acodec', 'libmp3lame', '-ab', '256k', mp3_file])
  # 音声ファイルの読み込み
  sound = AudioSegment.from_file(mp3_file, "mp3")
  time = sound.duration_seconds # 再生時間(秒)
  return mp3_file, time


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input_video', type=str, default='sample.mp4', help='Input image or folder')
    parser.add_argument(
        '--model_path',
        type=str,
        default='experiments/pretrained_models/RealESRGAN_x4plus.pth',
        help='Path to the pre-trained model')
    parser.add_argument('--output', type=str, default='results', help='Output folder')
    parser.add_argument('--netscale', type=int, default=4, help='Upsample scale factor of the network')
    parser.add_argument('--outscale', type=float, default=4, help='The final upsampling scale of the image')
    parser.add_argument('--suffix', type=str, default='out', help='Suffix of the restored image')
    parser.add_argument('--tile', type=int, default=0, help='Tile size, 0 for no tile during testing')
    parser.add_argument('--tile_pad', type=int, default=10, help='Tile padding')
    parser.add_argument('--pre_pad', type=int, default=0, help='Pre padding size at each border')
    parser.add_argument('--face_enhance', action='store_true', help='Use GFPGAN to enhance face')
    parser.add_argument('--half', action='store_true', help='Use half precision during inference')
    parser.add_argument('--block', type=int, default=23, help='num_block in RRDB')
    parser.add_argument(
        '--alpha_upsampler',
        type=str,
        default='realesrgan',
        help='The upsampler for the alpha channels. Options: realesrgan | bicubic')
    parser.add_argument(
        '--ext',
        type=str,
        default='auto',
        help='Image extension. Options: auto | jpg | png, auto means using the same extension as inputs')
    args = parser.parse_args()

    if 'RealESRGAN_x4plus_anime_6B.pth' in args.model_path:
        args.block = 6
    elif 'RealESRGAN_x2plus.pth' in args.model_path:
        args.netscale = 2

    model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=args.block, num_grow_ch=32, scale=args.netscale)

    upsampler = RealESRGANer(
        scale=args.netscale,
        model_path=args.model_path,
        model=model,
        tile=args.tile,
        tile_pad=args.tile_pad,
        pre_pad=args.pre_pad,
        half=args.half)

    if args.face_enhance:
        from gfpgan import GFPGANer
        face_enhancer = GFPGANer(
            model_path='https://github.com/TencentARC/GFPGAN/releases/download/v0.2.0/GFPGANCleanv1-NoCE-C2.pth',
            upscale=args.outscale,
            arch='clean',
            channel_multiplier=2,
            bg_upsampler=upsampler)
    os.makedirs(args.output, exist_ok=True)


    if os.path.isfile(args.input_video):
        # load video
        path = args.input_video
        cap = cv2.VideoCapture(path)

        # audio
        mp3_file, time = video2audio(path)

        # 動画情報の抽出(fps)
        for cap_fps in range(20,32):
            video_frame_count = cap.get(cv2.CAP_PROP_FRAME_COUNT) # フレーム数を取得する
            video_len_sec = video_frame_count / cap_fps        # 長さ（秒）を計算する
            # 誤差1秒以内
            if 1 > abs(time-video_len_sec):
              print("INPUT VIDEO FPS : {}".format(video_frame_count))
              break

        # video size
        cap_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        cap_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        # output video
        # output video name
        file_name = os.path.basename(path) 
        save_path = os.path.join(args.output, file_name.replace(".mp4", "_out_1.mp4"))
        # output video setting
        codec = cv2.VideoWriter_fourcc(*'XVID')
        out_cap_width = int(cap_width*args.outscale/2)
        out_cap_height= int(cap_height*args.outscale/2)
        # output video
        output_video = cv2.VideoWriter(save_path, codec, cap_fps, (out_cap_width,out_cap_height))

    else:
        print('No found {}'.format(args.input_video))

        
    while True:
        ret, frame = cap.read()

        if frame is None:
            print('Completed')
            break
        
        img = cv2.resize(frame , (int(cap_width*0.5), int(cap_height*0.5)))
        
        if len(img.shape) == 3 and img.shape[2] == 4:
            img_mode = 'RGBA'
        else:
            img_mode = None

        h, w = img.shape[0:2]
        if max(h, w) > 1000 and args.netscale == 4:
            import warnings
            warnings.warn('The input image is large, try X2 model for better performance.')
        if max(h, w) < 500 and args.netscale == 2:
            import warnings
            warnings.warn('The input image is small, try X4 model for better performance.')

        try:
            if args.face_enhance:
                _, _, output = face_enhancer.enhance(img, has_aligned=False, only_center_face=False, paste_back=True)
            else:
                output, _ = upsampler.enhance(img, outscale=args.outscale)
        except Exception as error:
            print('Error', error)
            print('If you encounter CUDA out of memory, try to set --tile with a smaller number.')

        output_video.write(output)
        
    cap.release()
    output_video.release()

    # 映像/音声の結合
    merge_path = save_path.replace("_out_1.mp4", "_out.mp4")
    cp = subprocess.run(['ffmpeg', '-y', '-i', save_path, '-i', mp3_file, '-c:v', 'copy', '-c:a', 'aac', '-map', '0:v:0', '-map', '1:a:0', merge_path])
    # ファイル削除
    os.remove(save_path)
    os.remove(mp3_file)


if __name__ == '__main__':
    main()
```

下記のコードで動画の高画質化を実行します．
```python
!python video_realesrgan.py --model_path experiments/pretrained_models/RealESRGAN_x4plus_anime_6B.pth --input_video gegege4OP.mp4
```

**変換前の動画**

<video width="640" height="360" controls>
  <source src="/video/gegege4OP.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video> 

**変換後の動画**

<video width="640" height="360" controls>
  <source src="/video/gegege4OP_out.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video> 

## まとめ
本稿では，上記のコードで動画の高画質化を実装しました．


## 参考サイト
[xinntao/Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN.git)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
