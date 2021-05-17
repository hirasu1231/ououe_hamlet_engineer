---
display: home
title: 'Python + CycleGanで茶毛のウマをシマウマに変換する'
description: 画像生成系のCycleGanを実装します．Python + CycleGanで茶毛のウマをシマウマに変換します．
date: 2021-03-28
image: https://www.hamlet-engineer.com/image/cyclegan_zebra.png
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - CycleGan
  - GAN
---
画像生成系のCycleGanを実装します．Python + CycleGanで茶毛のウマをシマウマに変換します．<br>
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
│   │   └── /horse2zebra
│   │       └── latest_net_G.pth <- 学習モデル
│   │   └── /horse2zebra_pretrained
│   │       └── latest_net_G.pth <- 学習済みモデル
│   ├── /results <- 出力される変換画像
│   │   └── /horse2zebra
│   │   └── /horse2zebra_pretrained
│   ├── /datasets <- 学習データ
│   │   └── /horse2zebra
│   ├── /scripts <- モデルのダウンロード
│   │   └── download_cyclegan_model.sh
│   ├── /datasets <- データセットのダウンロード
│   │   └── download_cyclegan_dataset.sh
│   ├── requirements.txt
│   ├── train.py
│   ├── test.py
│   └── (省略)
└── diablos_gan.ipynb <- 実行用ノートブック
```

## pytorch-CycleGAN-and-pix2pix
### pytorch-CycleGAN-and-pix2pixのダウンロード
Google ColabとGoogle Driveを連携させて，gitから[junyanz/pytorch-CycleGAN-and-pix2pix](https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix)をダウンロードします．<br>

```python
 # Google ColabとGoogle Driveを連携
from google.colab import drive
drive.mount('/content/drive')
```

```python
%%bash
# ディレクトリの移動
cd /content/drive/My\ Drive/diablos_gan
# gitのダウンロード
git clone https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix.git
```

## CycleGANのデモ
起動チェックのため，茶毛ウマ->シマウマ，シマウマ->茶毛ウマへ色を変換する学習済みモデルを実行します

### 学習済みモデルをダウンロード
以下のコマンドで，学習済みモデルをダウンロードします．<br>
学習済みモデルは， `./checkpoints/horse2zebra_pretrained/latest_net_G.pth`として格納されています．

```python
# ディレクトリの移動
%cd /content/drive/My\ Drive/diablos_gan/pytorch-CycleGAN-and-pix2pix
# 学習済みモデルをダウンロード
!bash ./scripts/download_cyclegan_model.sh horse2zebra
```

### データセットをダウンロード
以下のコマンドで，シマウマと茶毛ウマのデータセットをダウンロードします．<br>
データセットは，./datasets/horse2zebraに格納されます．<br>
trainA・testAは茶毛ウマ，trainB・testBはシマウマの画像となっています．
```python
# 現在ディレクトリ
# /content/drive/My\ Drive/diablos_gan/pytorch-CycleGAN-and-pix2pix

# データセットをダウンロード
!bash ./datasets/download_cyclegan_dataset.sh horse2zebra
```

### モジュールのダウンロード
以下のコマンドで，モジュールをダウンロードします．<br>
```python
# 現在ディレクトリ
# /content/drive/My\ Drive/diablos_gan/pytorch-CycleGAN-and-pix2pix

# モジュールのダウンロード
!pip install -r requirements.txt
```

### デモの実行
以下のコマンドで，学習済みモデルからテストを実行します．<br>
--datarootはCucleganで変換するデータセット，--nameは/checkpointsの中で使用したいモデルが格納されているディレクトリ名です．(/checkpoints/ --nameの引数 /latest_net_G.pth)
```python
# 現在ディレクトリ
# /content/drive/My\ Drive/diablos_gan/pytorch-CycleGAN-and-pix2pix

# デモの実行
!python test.py --dataroot datasets/horse2zebra/testA \
                --name horse2zebra_pretrained \
                --model test --no_dropout
```

学習済みモデルでの変換前画像<br>
![](/image/pretrain_house1.png)

学習済みモデルでの変換後画像<br>
![](/image/pretrain_house2.png)

## CycleGANの学習
先ほどダウンロードしたシマウマとウマのデータセットから，CycleGANの学習します．<br>
google colabで実行する場合は，`--display_id 0`と設定しておかないと学習が途中で止まります．
```python
# 現在ディレクトリ
# /content/drive/My\ Drive/diablos_gan/pytorch-CycleGAN-and-pix2pix

# 学習実行
!python train.py --dataroot ./datasets/horse2zebra \
                 --n_epochs 50 \
                 --name horse2zebra \
                 --model cycle_gan \
                 --display_id 0 \
                 --gpu_ids 0
```

### 学習モデルのテスト
以下のコマンドで学習のテストができます．<br>
--nameでは/checkpointsの中にある学習モデルのディレクトリ名を記述します．<br>
学習モデルの名前は`latest_net_G.pth`としてください．<br>
Aのデータ -> Bのデータに変換するモデルは`＊＊＊_G_A.pth`で，Bのデータ -> Aのデータに変換するのモデルは`＊＊＊_G_B.pth`です．<br>
※trainA・testAはウマ，trainB・testBはシマウマの画像となっています．

```python
# 現在ディレクトリ
# /content/drive/My\ Drive/diablos_gan/pytorch-CycleGAN-and-pix2pix

# 学習モデルの名前変更
!cp checkpoints/horse2zebra/latest_net_G_A.pth checkpoints/horse2zebra/latest_net_G.pth
# 学習モデルのテスト実行
!python test.py --dataroot datasets/horse2zebra/testA \
                --name horse2zebra \
                --results_dir ./results/ \
                --model test --no_dropout
```

学習モデル(50エポック)での変換前画像<br>
![](/image/train_house1.png)

学習モデル(50エポック)での変換後画像<br>
![](/image/train_house2.png)

## まとめ
画像生成系のCycleGanを実装し，茶毛のウマをシマウマに変換しました．<br>
今度は，ディアブロス亜種->ディアブロスに変換するモデルを実装します．

## 参考サイト
[junyanz/pytorch-CycleGAN-and-pix2pix](https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix)<br>

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>