---
display: home
title: 'Python + CycleGanでオリジナルデータでの学習を実装する'
description: Python + CycleGanでオリジナルデータでの学習を実行します．本稿ではディアブロス(原種)とディアブロス亜種の変換を実施します．
date: 2021-03-29
image: https://www.hamlet-engineer.com/image/gan_mhw.png
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - CycleGan
  - GAN
---
Python + CycleGanでオリジナルデータでの学習を実装を目指して，本稿ではディアブロス(原種)とディアブロス亜種の変換を実施します．<br>
<!-- more -->

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

最終的に，実写モンハンのディアブロス亜種を原種に戻す試みをします．
![](/image/diablos_black.jpg)


## 目次
[[toc]]

## 作業ディレクトリのファイル構成
プロジェクトディレクトリはdiablos_ganとしています．度々，省略しています．
```
diablos_gan
├── /pytorch-CycleGAN-and-pix2pix
│   ├── /checkpoints <- 学習モデルの保存先
│   │   └── /diablos_gan
│   │       ├── /web <- 学習中の変換画像
│   │       ├── latest_net_G.pth <- テストで使う変換モデル
│   │       ├── latest_net_G_A.pth <- AからBへの変換モデル
│   │       └── latest_net_G_B.pth <- BからAへの変換モデル
│   ├── /results <- 出力される変換画像
│   │   └── /diablos_gan
│   ├── /datasets <- 学習データ
│   │   ├── diablos_gan.zip
│   │   └── /diablos_gan
│   │       ├── trainA
│   │       ├── testA
│   │       ├── trainB
│   │       └── testB
│   ├── requirements.txt
│   ├── train.py
│   ├── test.py
│   └── (省略)
└── diablos_gan.ipynb <- 実行用ノートブック
```

## オリジナルデータの学習
ディアブロスとディアブロス亜種の画像を準備して，オリジナルデータでの学習を実施します．

### 学習データの準備
ディアブロスとディアブロス亜種のGoogle画像検索をウェブスクレイピングして，準備しました．<br>
Google Driveでデータをやりとりする場合は，zipで圧縮したものをアップロードして，Colab上で回答した方がエラーも発生しづらくおすすめです．<br>
以下のコマンドでzipの解凍ができます．
```python
# ディレクトリの移動
%cd /content/drive/My\ Drive/diablos_gan/pytorch-CycleGAN-and-pix2pix/datasets
# 学習データの解凍
!unzip diablos_gan.zip > /dev/null
# データ数
# (trainA, testA) = (80, 16)
# (trainB, testB) = (80, 16)
```

### オリジナルデータの学習
以下のコマンドで学習を実行できます．<br>
```python
# ディレクトリの移動
%cd /content/drive/My\ Drive/diablos_gan/pytorch-CycleGAN-and-pix2pix
# オリジナルデータの学習
!python train.py --dataroot ./datasets/diablos_gan \
                 --n_epochs 300 \
                 --name diablos_gan \
                 --model cycle_gan \
                 --display_id 0 --gpu_ids 0
```

### オリジナルデータの学習モデルでテスト
ディアブロスとディアブロス亜種の画像を変換する学習モデルを作成しましたので，以下のコマンドでテストを実行します．<br>
--nameでは/checkpointsの中にある学習モデルのディレクトリ名を記述します．<br>
学習モデルの名前は`latest_net_G.pth`としてください．<br>
Aのデータ -> Bのデータに変換するモデルは`＊＊＊_G_A.pth`で，Bのデータ -> Aのデータに変換するのモデルは`＊＊＊_G_B.pth`です．<br>
※trainA・testAはディアブロス原種，trainB・testBはディアブロス亜種の画像となっています．<br>
<br>
変換画像は自動的に256x256の正方形に変換されて出力されます．オリジナルのサイズとアスペクト比を保持したい場合は， `--preprocess none`を追記してください．<br>
ただし，GPUの負荷もハンパなく重くなります．僕の場合は，1920x1280と1080x720はGPUのメモリーをオーバーして，640x480で動きました．

```python
# 現在ディレクトリ
# /content/drive/My\ Drive/diablos_gan/pytorch-CycleGAN-and-pix2pix

# 学習モデルの名前変更
!cp checkpoints/diablos_gan/latest_net_G_B.pth checkpoints/diablos_gan/latest_net_G.pth
# 学習モデルのテスト実行
!python test.py --dataroot datasets/diablos_gan/testB \
                --name diablos_gan \
                --results_dir ./results/diablos_gan/ \
                --preprocess none \
                --model test --no_dropout
```
### MHW版ディアブロス亜種の変換
MHW版ディアブロス亜種の変換前画像<br>
![](/image/mhw_real.png)

MHW版ディアブロス亜種の変換後画像<br>
![](/image/mhw_fake.png)

### 実写版ディアブロス亜種の変換
実写版ディアブロス亜種の変換前画像<br>
![](/image/diablos_real.png)

実写版ディアブロス亜種の変換後画像<br>
![](/image/diablos_fake.png)

## おまけ
最近発売したモンハンライズでは原種のディアブロスはでているので，イラストをディアブロス亜種に変換しました．

### MHR版ディアブロス(イラスト)の変換
MHR版ディアブロス(イラスト)の変換前画像<br>
![](/image/mhr_illust_real.png)

MHR版ディアブロス(イラスト)の変換後画像<br>
![](/image/mhr_illust_fake.png)


## まとめ
Python + CycleGanでオリジナルデータでの学習を兼ねて，ディアブロス(原種)とディアブロス亜種の変換を実施します<br>
たった80枚の学習画像でも結構できていましたが，もう少し精度が向上するように手を加えていきます．

## 参考サイト
[junyanz/pytorch-CycleGAN-and-pix2pix](https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix)<br>

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>