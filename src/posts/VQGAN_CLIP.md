---
display: home
title: 'VQGAN + CLIPでテキストから画像の生成'
description: VQGAN + CLIPでテキストから画像を生成します．
date: 2022-02-22
image: https://www.hamlet-engineer.com/image/vqgan_apple.png
categories: 
  - Python
tags:
  - Python
  - jupyter
  - VQGAN
  - CLIP
---
<!-- https://www.hamlet-engineer.com -->
VQGAN + CLIPでテキストから画像を生成します．<br>

<!-- more -->

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

[[toc]]


## Google Colabのファイル構成
プロジェクトディレクトリはvqganとしています．度々，省略しています．

```init
ASR
├── okada.mp4 <- 文字起こし動画
├── okada.wav <- 音声合成
├── 01_okada.wav <- 0~60秒までの音声
└── ESPnetTTS.ipynb <- 実行用ノートブック
```

## Google Driveと連携
Google ColabとGoogle Driveを連携させて，作業ディレクトリを作成します．<br>

```python
# Google Driveと連携
from google.colab import drive
drive.mount('/content/drive')
```

```python
# 作業ディレクトリへ移動
%cd /content/drive/My\ Drive/
!mldir -p vqgan
%cd vqgan
!ls
```

## VAGANのダウンロード
下記のコードでVAGANのダウンロードを実行します．
```python
!git clone 'https://github.com/nerdyrodent/VQGAN-CLIP'
%cd VQGAN-CLIP
!git clone 'https://github.com/openai/CLIP'
!git clone 'https://github.com/CompVis/taming-transformers'
```

## ライブラリのインストール
下記のコマンドでライブラリをインストールします．

```python
# pip
!pip install torch==1.9.0+cu111 torchvision==0.10.0+cu111 torchaudio==0.9.0 -f https://download.pytorch.org/whl/torch_stable.html
!pip install torchtext==0.10.1
```

```python
# 作業ディレクトリへ移動
%cd /content/drive/My\ Drive/vqgan/VQGAN-CLIP
!ls

!pip install ftfy regex tqdm omegaconf pytorch-lightning
!pip install kornia
!pip install imageio-ffmpeg   
!pip install einops          
!mkdir -p steps
!pip install torch_optimizer
```

## 学習済みモデルのダウンロード
下記のコードで学習済みモデルをダウンロードします．
```python
# 作業ディレクトリへ移動
%cd /content/drive/My\ Drive/vqgan/VQGAN-CLIP
!mkdir -p checkpoints

!curl -L -o checkpoints/vqgan_imagenet_f16_16384.yaml -C - 'https://heibox.uni-heidelberg.de/d/a7530b09fed84f80a887/files/?p=%2Fconfigs%2Fmodel.yaml&dl=1' #ImageNet 16384
!curl -L -o checkpoints/vqgan_imagenet_f16_16384.ckpt -C - 'https://heibox.uni-heidelberg.de/d/a7530b09fed84f80a887/files/?p=%2Fckpts%2Flast.ckpt&dl=1' #ImageNet 16384
```

## デモの実行
デモとして，下記のコードで「A painting of an apple in a fruit bowl(フルーツボウルに入ったりんごの絵)」を生成します．
```python
# 作業ディレクトリへ移動
%cd /content/drive/My\ Drive/vqgan/VQGAN-CLIP

!python generate.py -p "A painting of an apple in a fruit bowl | psychedelic | surreal:0.5 | weird:0.25"
```

下記のコードで画像を表示します．
```python
# 作業ディレクトリへ移動
%cd /content/drive/My\ Drive/vqgan/VQGAN-CLIP
# 画像の表示
from IPython.display import Image,display_png
display_png(Image('output.png'))
```

![](image/vqgan_apple.png)

## テキストから画像を生成
下記のコードでテキストから画像を生成します．

ここでは，各テキストから10枚の画像を生成します．また，テキストごとにディレクトリを作成して，格納します．

```python
import os
import subprocess

# 
os.makedirs('generated', exist_ok=True)

# 新規ディレクトリ
word = 'Night of the Beast Hunt'
dir_name = word.replace(' ', '_')
os.makedirs('generated/'+dir_name, exist_ok=True)

for idx in range(10):
  # 生成実行
  pros = subprocess.run(["python", "generate.py", "-p", "'{}'".format(word)],stdout = subprocess.PIPE, stderr = subprocess.PIPE)

  # 生成実行
  idx = str(idx).zfill(3)
  pros = subprocess.run(["mv", "output.png", "generated/{0}/{1}.png".format(dir_name, idx)],stdout = subprocess.PIPE, stderr = subprocess.PIPE)
  print(f'generated ID: {idx}')
```

## まとめ
VQGAN + CLIPでテキストから画像を生成しました．

次は，テキストの生成も自動化してみます．


## 参考サイト
[nerdyrodent/VQGAN-CLIP](https://github.com/nerdyrodent/VQGAN-CLIP)

[VQGAN + CLIPを使用してテキストプロンプトから画像を生成する方法—完全な非技術的なチュートリアル。](https://ichi.pro/vqgan-clip-o-shiyoshite-tekisutopuronputo-kara-gazo-o-seiseisuru-hoho-kanzenna-hi-gijutsuteki-na-chu-toriaru-180393998087085)

[ImportError：/usr/local/lib/python3.7/dist-packages/torchtext/_torchtext.so](https://github.com/facebookresearch/d2go/issues/71)

[Torchtext not compatible with torch version 1.9.0.dev20210601+cu113](https://github.com/pytorch/text/issues/1320)



<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
