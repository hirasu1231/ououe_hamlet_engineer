---
display: home
title: 'Python + Google Colab + Spleeterで楽器と人の声を分離する音源分離を実装する'
description: Python + Google Colab + Spleeterで楽器と人の声を分離する音源分離を実装します．
date: 2021-09-08
image: https://www.hamlet-engineer.com/image/sound_separation.jpeg
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - Google_Colaboratory
  - Sound_Source_Separation
---

<!-- https://www.hamlet-engineer.com -->
Python + Google Colab + Spleeterで楽器と人の声を分離する音源分離を実装します．<br>

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

## Google Colabのファイル構成
プロジェクトディレクトリはsound-separationとしています．度々，省略しています．
```init
sound-separation
├── /spleeter
│   ├── /pretrained_models <- 学習済みモデル
│   ├── /output <- 分離後の音声
│   └── audio_example.mp3 <- サンプル音声
└── sound-separation.ipynb <- 実行用ノートブック
```

## Google Driveと連携
Google ColabとGoogle Driveを連携させて，作業ディレクトリのsound-separation/spleeterを作成します．<br>

```python
# Google ColabとGoogle Driveを連携
from google.colab import drive
drive.mount('/content/drive')
```

```python
# %%bash
# ディレクトリの移動
%cd /content/drive/My\ Drive/sound-separation
# 作業ディレクトリの作成
!mkdir spleeter
!ls
```

```python
%cd /content/drive/My\ Drive/sound-separation/spleeter
!ls
```

## ffmpeg，ibsndfileのインストール
オーディオファイルを扱うために，ffmpegとibsndfileをインストールします．

```python
!apt-get install ffmpeg
!apt-get install libsndfile-dev
```

## モジュールのインストール
下記のコードでモジュールをインストールします．

```python
!pip install spleeter
```
## サンプル音声のダウンロード
下記のコマンドでサンプル音声をダウンロードします．

```python
!wget https://github.com/deezer/spleeter/raw/master/audio_example.mp3
```

## Spleeterによる音響分離
下記のコードでSpleeterによる音響分離を実行します．

```python
from spleeter.separator import Separator
import os

# 出力結果の保存場所をあらかじめ作っておく
for i in (2, 4, 5):  # 2音源、4音源、5音源
    outdir_path = './output/' + str(i) + 'stems'
    os.makedirs(outdir_path, exist_ok=True)

# 分離対象となる音楽wav
# offlibertyでダウンロード
# https://soundcloud.com/ballforest/sample
input_audio = "audio_example.mp3"

# 初回実行時はモデルをダウンロードするため、「待ち」の時間がかかる
# 事前にダウンロードすることも可能 (pretrained_model/2stems などに保存)

# ボーカルとそれ以外に分離する(2音源)
separator_2stem = Separator('spleeter:2stems')
separator_2stem.separate_to_file(input_audio, "./output/2stems")

# ボーカル、ベース、ドラムとそれ以外に分離する(4音源)
separator_4stem = Separator('spleeter:4stems')
separator_4stem.separate_to_file(input_audio, "./output/4stems")

# ボーカル、ピアノ、ベース、ドラムとそれ以外に分離する(5音源)
separator_5stem = Separator('spleeter:5stems')
separator_5stem.separate_to_file(input_audio, "./output/5stems")
```

## 5音源での音響分離

### 音源

<audio src="/audio/audio_example/audio_example.mp3" controls></audio>

### 5音源での音響分離
**ヴォーカル**

<audio src="/audio/audio_example/vocals.wav" controls></audio>

**ドラム**

<audio src="/audio/audio_example/drums.wav" controls></audio>

**ピアノ**

<audio src="/audio/audio_example/piano.wav" controls></audio>

**ベース**

<audio src="/audio/audio_example/bass.wav" controls></audio>

**その他**

<audio src="/audio/audio_example/other.wav" controls></audio>

## まとめ
Pythonで楽器と人の声を分離する音源分離を実装しました．

## 参考サイト
[【Python/PyRoomAcoustics】ILRMAでブラインド音源分離](https://qiita.com/oozzZZZZ/items/496c44fcab879871a247)

[Spleeterを使って音源分離に挑戦](https://qiita.com/ObaShion/items/cf6fd0ede88b0c5187cb)

[NMFとMFCCで音源分離してみよう](https://keep-learning.hatenablog.jp/entry/2020/03/20/194403)




<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

