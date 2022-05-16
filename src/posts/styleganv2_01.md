---
display: home
title: '画像生成系のStyleGAN2でアニメ画像の生成を実行する'
description: 画像生成系のStyleGAN2でアニメ画像の生成を実行します．
date: 2022-05-16
image: https://www.hamlet-engineer.com/image/stylegan_sample.png
categories: 
  - OS
tags:
  - Python
  - Jupyter
  - StyleGAN2
  - GAN
---

<!-- https://www.hamlet-engineer.com -->
画像生成系のStyleGAN2でアニメ画像の生成を実行します．

最終目標として，StyleGAN2で新規ポケモンの生成を実施します．

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


## Google Driveと連携
Google ColabとGoogle Driveを連携させて，gitから[NVlabs/stylegan2](https://github.com/NVlabs/stylegan2)をダウンロードします．

```python
# Google ColabとGoogle Driveを連携
from google.colab import drive
drive.mount('/content/drive')
```

下記のコマンドで作業ディレクトリを作成します．
```python
%cd /content/drive/MyDrive/
# 作業ディレクトリを作成
!mkdir -p pachimon_trial
!ls
```

下記のコマンドでgitからクローンします．
```python
%%bash
# 作業ディレクトリへ移動
cd /content/drive/MyDrive/pachimon_trial
# gitのダウンロード
git clone https://github.com/NVlabs/stylegan2
!ls
```

## ライブラリのインストール
StyleGAN2はtensorflow1系で開発されているので，再インストールします．

```python
!pip install tensorflow==1.15
```

下記のコードでGPUが使用できるか，確認します．
```python
import tensorflow as tf

%cd /content/drive/MyDrive/pachimon_trial/stylegan2
# test
!nvcc test_nvcc.cu -o test_nvcc -run

print('Tensorflow version: {}'.format(tf.__version__) )
!nvidia-smi -L
print('GPU Identified at: {}'.format(tf.test.gpu_device_name()))

# 出力結果：
# /content/drive/MyDrive/mimic_gan/pachimon_trial/stylegan2
# CPU says hello.
# GPU says hello.
# Tensorflow version: 1.15.0
# GPU 0: Tesla P100-PCIE-16GB (UUID: GPU-82c27b31-d4ec-8dec-175e-c506a67ad547)
# GPU Identified at: /device:GPU:0
```

## 画像生成の実行

### 学習済みモデルのダウンロード
下記のコマンドでアニメ画像の学習済みモデルをダウンロードします．
```python
# ディレクトリの移動
%cd /content/drive/MyDrive/mimic_gan/pachimon/stylegan2
# アニメ画像の学習済みモデル
!gdown https://drive.google.com/u/0/uc?id=1uouxd9q6M4Gcbrve3R9Fi2qUpy9ZSCdG&export=download
!ls
```

### 画像生成の実行
下記のコマンドでアニメ画像の生成を実行します．

seeds を範囲指定することで生成枚数を増減でき，truncation-psi は0を中心として増減させるとより平均から遠ざかるようです．

数値選び参考: https://www.gwern.net/Faces#psitruncation-trick

```python
# ディレクトリの移動
%cd /content/drive/MyDrive/mimic_gan/pachimon/stylegan2
# 画像生成の実行
%run run_generator.py generate-images \
                        --seeds=1000000-1000100 \
                        --truncation-psi=0.8 \
                        --network=./2020-01-11-skylion-stylegan2-animeportraits-networksnapshot-024664.pkl
```

下記のコードで生成画像を表示します．
```python
from IPython.display import Image,display_jpeg,display_png
display_png(Image('results/00000-generate-images/seed1000000.png'))
```

![](/image/stylegan_sample.png)

## まとめ
画像生成系のStyleGAN2でアニメ画像の生成を実行しました．

次は，ポケモンの画像で新規ポケモンの生成を実行します．

## 参考サイト
[【簡単】StyleGAN2でアニメキャラの超高解像度生成を試す](https://qiita.com/ichii731/items/23a4b325d7f8c2a78e75)

[Google Colab で StyleGAN2 を利用して手間なく無限にアニメ顔を生成して幸せになろう](https://unyacat.net/2020/05/05/run-twdnev3/)

[GANの基礎からStyleGAN2まで](https://akichan-f.medium.com/gan%E3%81%AE%E5%9F%BA%E7%A4%8E%E3%81%8B%E3%82%89stylegan2%E3%81%BE%E3%81%A7-dfd2608410b3)

[parthsuresh/stylegan2-colab](https://github.com/parthsuresh/stylegan2-colab/blob/master/StyleGAN2_Google_Colab.ipynb)

[【StyleGAN入門】自前マシンでアニメの独自学習♬](https://qiita.com/MuAuan/items/aec7feabaa2f738ea82c)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

