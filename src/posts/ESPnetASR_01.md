---
display: home
title: 'Python + ESPnetで日本語の文字起こし(ASR)を実装する'
description: Python + ESPnetで日本語の文字起こし(ASR)を実施します．
date: 2021-11-20
image: https://www.hamlet-engineer.com/image/mojiokoshi_AI.png
categories: 
  - Python
tags:
  - Python
  - jupyter
  - ESPnet
  - ASR
  - 文字起こし
---
<!-- https://www.hamlet-engineer.com -->
Python + ESPnetで日本語の文字起こし(ASR)を実施します．<br>

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
プロジェクトディレクトリはASRとしています．度々，省略しています．

本稿では，[岡田斗司夫さんの切り抜き動画](https://www.youtube.com/watch?v=us6ClXxB9uY)を文字起こしします．

```init
ASR
├── okada.mp4 <- 文字起こし動画
├── okada.wav <- 文字起こし音声
├── 01_okada.wav <- 0~60秒までの音声
└── ESPnetASR.ipynb <- 実行用ノートブック
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
!mkdir -p ASR
%cd ASR
!ls
```

## モジュールのインストール
下記のコマンドでモジュールをインストールします．
```python
# ffmpeg
!apt-get install ffmpeg
# pip
!pip install torch
!pip install espnet_model_zoo
```

## 動画から音声へ変換
ffmpegで動画から音声への変換を実行します．

ESPNetでは下記のwavファイルの設定でないと，ちゃんと文字起こしされません．
- Channel num :  1
- Sample width :  2
- Sampling rate :  16000

上記の設定を加味した変換は下記の通りとなります．また，あまりに音声データが長いと，メモリーが足りずプログラムが止まるので，本稿では60秒の長さで文字起こしします．

```python
# 動画→音声
!ffmpeg -i "okada.mp4" -ar 16000 -ac 1 -y -f wav "okada.wav"
# 音声の切り抜き
!ffmpeg -i okada.wav -ss 0 -t 60 -y 01_okada.wav
```

### 文字起こしの実行
下記のコードで文字起こしを実行します．

```python
import soundfile
from espnet_model_zoo.downloader import ModelDownloader
from espnet2.bin.asr_inference import Speech2Text

# 学習済みをダウンロードし、音声認識モデルを作成
d = ModelDownloader()
speech2text = Speech2Text(
        **d.download_and_unpack("kan-bayashi/csj_asr_train_asr_transformer_raw_char_sp_valid.acc.ave"),
        device="cuda"  # CPU で認識を行う場合は省略
    )

# 音声ファイル読み込み
fname = '01_okada.wav'
speech, _ = soundfile.read(fname)  # 認識させたい音声ファイルを指定

# 認識結果の取得と表示
nbests = speech2text(speech)
text, *_ = nbests[0]
print(text)
# ＮＨＫのですねあの先週ですね東京ミラクルの第三種ですねえー最近の商品アニメっていう海が放映されたんですけども
```

## まとめ
本稿では，ESPNetによる文字起こしを実装しました．


## 参考サイト
[ESPnet2で始めるEnd-to-End音声処理](https://kan-bayashi.github.io/asj-espnet2-tutorial/#%E3%83%AC%E3%82%B7%E3%83%94%E3%81%AE%E6%A7%8B%E9%80%A0)

[複雑な音声処理タスクを一気通貫で実装できる! ESPnetの概念と特徴について](https://tech.fusic.co.jp/posts/2021-08-03-espnet/)

[簡単に作れるTTSモデル：ESPnetを用いたつくよみちゃんTTSモデル作成](https://tech.fusic.co.jp/posts/2021-08-20-ml-espnet-tts-2/)

[ESPnet による音声認識入門 ～ESPnet Model Zoo 編～](https://tech.retrieva.jp/entry/2020/12/23/170645)

[End-to-End音声処理ツールキットESPnetの紹介](https://qiita.com/kan-bayashi/items/536acaf165344a6d6460)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
