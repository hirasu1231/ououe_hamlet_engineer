---
display: home
title: 'Thin-Plate-Spline-Motion-Modelを実行して，写真を無理やり動かしてみる'
description: Thin-Plate-Spline-Motion-Modelを実行して，写真を無理やり動かしてみる
date: 2023-4-4
image: https://www.hamlet-engineer.com/image/TPSMM00.png
categories: 
  - Python
tags:
  - Python
  - SOTA
  - Image_Generation
---
Thin-Plate-Spline-Motion-Modelを実行して，写真を無理やり動かしてみます．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## Google Driveと連携
Google ColabとGoogle Driveを連携させます．

```python
# Google ColabとGoogle Driveを連携
from google.colab import drive
drive.mount('/content/drive')
```

```python
# 作業ディレクトリの作成
!mkdir -p /content/drive/MyDrive/SOTA/ThinPlateSplineMotionModel
# 作業ディレクトリの移動
%cd /content/drive/MyDrive/SOTA/ThinPlateSplineMotionModel
!ls
```

## 論文のダウンロードと翻訳
下記のコードで，論文のダウンロードと翻訳を実行します．

### ライブラリのインストール

```python
!apt-get update
!apt install chromium-chromedriver
!cp /usr/lib/chromium-browser/chromedriver /usr/bin

!pip install selenium
```

```python
!pip install -U easynmt
!pip install fitz
!pip install PyMuPDF==1.16.14
```

### 論文のダウンロードと翻訳
論文のダウンロードと翻訳を実行します．

`arxiv_download_translate.py`は[]()を参照してください．

```python
!python arxiv_download_translate.py "2203.14367v2"
```

### 論文の概要(多分に推測を含む)
動画の動きを静止画像にトレースして，アニメーションを作成することは，近年でも研究されてきたが，動画と静止画像に大きな差があれば，アニメーションのトレースがうまく機能しないことが課題でした．

上記の論文では，下記の工夫により前述の問題の解決を目指しました．
- 薄板スプライン運動推定(おそらく，スプライン補完の発展系)により，ソース画像の特徴マップ(顔や口元かな)を出力の特徴マップ(顔や口元だと思う)を動かす
- 多解像度閉鎖マスク(解像度を上げつつ，閉じたマスキングをする？)を活用して，欠落した領域をより現実的に復元する
- ネットワークがする作業の明確な分割を確保するために、補完(復元)機能の損失を別で算出した

## 動画化の実装

### gitのクローン

```python
# クローン
!git clone https://github.com/yoyo-nb/Thin-Plate-Spline-Motion-Model.git
# 移動
%cd Thin-Plate-Spline-Motion-Model
```

## 学習済みモデルのダウンロード


```python
!mkdir checkpoints
!wget -c https://cloud.tsinghua.edu.cn/f/da8d61d012014b12a9e4/?dl=1 -O checkpoints/vox.pth.tar
#!wget -c https://cloud.tsinghua.edu.cn/f/483ef53650b14ac7ae70/?dl=1 -O checkpoints/ted.pth.tar
#!wget -c https://cloud.tsinghua.edu.cn/f/9ec01fa4aaef423c8c02/?dl=1 -O checkpoints/taichi.pth.tar
#!wget -c https://cloud.tsinghua.edu.cn/f/cd411b334a2e49cdb1e2/?dl=1 -O checkpoints/mgif.pth.tar
```

## デモの実行
下記のコードはモデルの設定です．

```python
import torch

# モデルの設定
device = torch.device('cuda:0')
# 使用する学習済みモデル
dataset_name = 'vox' # ['vox', 'taichi', 'ted', 'mgif']
# 動かしたい画像
source_image_path = './assets/source.png'
# トレースする動画
driving_video_path = './assets/driving.mp4'
# 出力動画の名前
output_video_path = './generated.mp4'

# 設定ファイル
config_path = 'config/vox-256.yaml'
# 使用する学習済みモデルのファイル
checkpoint_path = 'checkpoints/vox.pth.tar'
# 補完の仕方
predict_mode = 'relative' # ['standard', 'relative', 'avd']
# より良い結果を出力(時間　がかかる)
find_best_frame = False 

pixel = 256 # for vox, taichi and mgif, the resolution is 256*256
if(dataset_name == 'ted'): # for ted, the resolution is 384*384
    pixel = 384

if find_best_frame:
  !pip install face_alignment
```


動かしたい画像とトレースしたい動画の入力と確認を実装します．

```python
import imageio
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from skimage.transform import resize
from IPython.display import HTML
import warnings
import os
warnings.filterwarnings("ignore") # 警告は無視

# 動かしたい画像を読み込み
source_image = imageio.imread(source_image_path)
# トレースする動画の読み込み
reader = imageio.get_reader(driving_video_path)
# 画像の整形
source_image = resize(source_image, (pixel, pixel))[..., :3]

# FPSを設定
fps = reader.get_meta_data()['fps']
# 動画をフレーム毎で格納(上のFPSを使う)
driving_video = []
try:
    for im in reader:
        driving_video.append(im)
except RuntimeError:
    pass
reader.close()
# フレームリストをリザイズ
driving_video = [resize(frame, (pixel, pixel))[..., :3] for frame in driving_video]

# Colabで2つの動画を並べて再生
def display(source, driving, generated=None):
    fig = plt.figure(figsize=(8 + 4 * (generated is not None), 6))

    ims = []
    for i in range(len(driving)):
        cols = [source]
        cols.append(driving[i])
        if generated is not None:
            cols.append(generated[i])
        im = plt.imshow(np.concatenate(cols, axis=1), animated=True)
        plt.axis('off')
        ims.append([im])

    ani = animation.ArtistAnimation(fig, ims, interval=50, repeat_delay=1000)
    plt.close()
    return ani
    
# 動画を再生
HTML(display(source_image, driving_video).to_html5_video())
```

<video width="560" height="240" controls>
  <source src="/video/TPSMM02.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video> 

デモの設定を呼び出す．

```python
from demo import load_checkpoints
inpainting, kp_detector, dense_motion_network, avd_network = load_checkpoints(config_path = config_path, checkpoint_path = checkpoint_path, device = device)
```

下記のコードでトレースを実行します．

```python
from demo import make_animation
from skimage import img_as_ubyte

# 最高品質でのトレース
if predict_mode=='relative' and find_best_frame:
    from demo import find_best_frame as _find
    i = _find(source_image, driving_video, device.type=='cpu')
    print ("Best frame: " + str(i))
    driving_forward = driving_video[i:]
    driving_backward = driving_video[:(i+1)][::-1]
    predictions_forward = make_animation(source_image, driving_forward, inpainting, kp_detector, dense_motion_network, avd_network, device = device, mode = predict_mode)
    predictions_backward = make_animation(source_image, driving_backward, inpainting, kp_detector, dense_motion_network, avd_network, device = device, mode = predict_mode)
    predictions = predictions_backward[::-1] + predictions_forward[1:]
else:
    # まあまあの品質のトレース
    predictions = make_animation(source_image, driving_video, inpainting, kp_detector, dense_motion_network, avd_network, device = device, mode = predict_mode)

# 出力動画の保存
imageio.mimsave(output_video_path, [img_as_ubyte(frame) for frame in predictions], fps=fps)

# 動画を再生
HTML(display(source_image, driving_video, predictions).to_html5_video())
```

<video width="560" height="240" controls>
  <source src="/video/TPSMM03.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video> 

## オリジナルデータの実行

岸田さんの画像でやってみます．

![](/image/TPSMM01.jpeg)

変更する箇所の最初の読み込みの部分のみです．

```python
import torch

# モデルの設定
device = torch.device('cuda:0')
# 使用する学習済みモデル
dataset_name = 'vox' # ['vox', 'taichi', 'ted', 'mgif']
# 動かしたい画像
source_image_path = './assets/Fumio_Kishida_20211004.jpeg'
# トレースする動画
driving_video_path = './assets/driving.mp4'
# 出力動画の名前
output_video_path = './kishida_generated.mp4'

# 設定ファイル
config_path = 'config/vox-256.yaml'
# 使用する学習済みモデルのファイル
checkpoint_path = 'checkpoints/vox.pth.tar'
# 補完の仕方
predict_mode = 'relative' # ['standard', 'relative', 'avd']
# より良い結果を出力(時間がかかる)
find_best_frame = False 

pixel = 256 # for vox, taichi and mgif, the resolution is 256*256
if(dataset_name == 'ted'): # for ted, the resolution is 384*384
    pixel = 384

if find_best_frame:
  !pip install face_alignment
```

<video width="560" height="240" controls>
  <source src="/video/TPSMM04.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video> 

## まとめ
Thin-Plate-Spline-Motion-Modelを実行して，写真を無理やり動かしてみました．

## 参考サイト
[SOTA thin-plate-spline-motion-mode](https://paperswithcode.com/paper/thin-plate-spline-motion-model-for-image)

[arxiv thin-plate-spline-motion-mode](https://arxiv.org/abs/2203.14367v2)

[yoyo-nb/thin-plate-spline-motion-model](https://github.com/yoyo-nb/thin-plate-spline-motion-model)

[colab demo](https://colab.research.google.com/drive/1DREfdpnaBhqISg0fuQlAAIwyGVn1loH_?usp=sharing)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


