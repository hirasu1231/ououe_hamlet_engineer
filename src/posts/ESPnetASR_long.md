---
display: home
title: 'Python + ESPnetで長い音声データにおける日本語の文字起こし(ASR)を実装する'
description: Python + ESPnetで日本語の文字起こし(ASR)を実施します．
date: 2021-12-22
image: https://www.hamlet-engineer.com/image/mojiokoshi_AI.png
categories: 
  - Python
tags:
  - Python
  - jupyter
  - ESPnet
  - ASR
---
<!-- https://www.hamlet-engineer.com -->
Python + ESPnetで長い音声データにおける日本語の文字起こし(ASR)を実施します．<br>

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
├── /ASR_FILES
|   ├── okada.mp4 <- 文字起こし動画
|   └── /output/okada.txt <- 文字起こしたテキスト
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

## 長い音声データでのASR実行
実行過程は下記の通りです．
1. ライブラリのインポート
2. 動画データから音声データへ(mp4→wav)
3. wavファイルの分割(60sごとに)
4. 複数のwavファイルを順にテキストに変換
5. 0〜3をdefでまとめる
6. ASR実行

### ライブラリのインポート
```python
import wave
import struct
import math
import os
from scipy import fromstring, int16

import subprocess

import shutil
import glob

import soundfile
from espnet_model_zoo.downloader import ModelDownloader
from espnet2.bin.asr_inference import Speech2Text
```

### 動画データから音声データへ(mp4→wav)
ffmpegで動画から音声への変換を実行します．

ESPNetでは下記のwavファイルの設定でないと，ちゃんと文字起こしされません．
- Channel num :  1
- Sample width :  2
- Sampling rate :  16000

上記の設定を加味した変換は下記の通りとなります．

```python
# 音声ファイルへの変換
def mp4_to_wav(mp4f):
    wavf = mp4f.replace('.mp4', '.wav')
    subprocess.run(['ffmpeg', '-i', mp4f, '-ar', '16000', '-ac', '1', '-y', '-f', 'wav' ,wavf], 
                   encoding='utf-8', stdout=subprocess.PIPE)
    return wavf
```

### wavファイルの分割(60sごとに)
```python
# 音声ファイルの分割(デフォルト60秒)
def cut_wav_espnet(wavf,time=60):
    # timeの単位は[sec]
    # ファイルを読み出し
    wr = wave.open(wavf, 'r')

    # waveファイルが持つ性質を取得
    ch = wr.getnchannels()
    width = wr.getsampwidth()
    fr = wr.getframerate()
    fn = wr.getnframes()
    total_time = 1.0 * fn / fr
    integer = math.floor(total_time) # 小数点以下切り捨て
    t = int(time)  # 秒数[sec]
    frames = int(ch * fr * t)
    num_cut = int(integer//t)

    # waveの実データを取得し、数値化
    data = wr.readframes(wr.getnframes())
    wr.close()
    X = fromstring(data, dtype=int16)
    
    # wavファイルを削除
    os.remove(wavf)
    
    wavf_list = []
    for i in range(num_cut):
        # 出力データを生成
        output_dir = os.path.dirname(wavf) + '/output/cut_wav/'
        os.makedirs(output_dir,exist_ok=True)
        outf = output_dir + str(i).zfill(3) + '.wav'
        start_cut = i*frames
        end_cut = i*frames + frames
        Y = X[start_cut:end_cut]
        outd = struct.pack("h" * len(Y), *Y)

        # 書き出し
        ww = wave.open(outf, 'w')
        ww.setnchannels(ch)
        ww.setsampwidth(width)
        ww.setframerate(fr)
        ww.writeframes(outd)
        ww.close()
        
        # リストに追加
        wavf_list.append(outf)
    
    return wavf_list
```

### 複数のwavファイルを順にテキストに変換
```python
# 複数ファイルの音声のテキスト変換
def wavs_asr_espnet(wavf_list, asr_model):
    output_text = ''
    # 複数処理
    print('音声のテキスト変換')
    for wavf in wavf_list:
        # wavファイルの読み込み
        speech, _ = soundfile.read(wavf)
        # 音声のテキスト変換
        nbests = asr_model(speech)
        text, *_ = nbests[0]

        # 各ファイルの出力結果の結合
        output_text = output_text + text + '\n\n'
        # wavファイルを削除
        os.remove(wavf)
        print(wavf)
        
    return output_text
```
### 1〜4をdefでまとめる
```python
# mp4からwavへの変換から音声のテキスト変換まで
def mp4_asr_espnet(mp4f):
    # mp4のディレクトリ
    input_dir = os.path.dirname(mp4f)
    # 学習済みをダウンロードし、音声認識モデルを作成
    d = ModelDownloader()
    speech2text = Speech2Text(
            **d.download_and_unpack("kan-bayashi/csj_asr_train_asr_transformer_raw_char_sp_valid.acc.ave"),
            device="cuda"  # CPU で認識を行う場合は省略
            )

    # 出力ディレクトリ
    if os.path.exists(input_dir + '/output/cut_wav/'):
        shutil.rmtree(input_dir + '/output/cut_wav/')
        os.makedirs(input_dir + '/output/cut_wav/', exist_ok=True)
    else:
        os.makedirs(input_dir + '/output/cut_wav/', exist_ok=True)
    
    # 音声ファイルへの変換
    wav_file = mp4_to_wav(mp4f)
    
    # 音声ファイルの分割(デフォルト60秒)
    cut_wavs = cut_wav_espnet(wav_file)
    
    # 複数ファイルの音声のテキスト変換
    out_text = wavs_asr_espnet(cut_wavs, speech2text)
    
    # テキストファイルへの入力
    mp4f_name = os.path.basename(mp4f)
    txt_file = input_dir + '/output/' + mp4f_name.replace('.mp4', '.txt')
    print('テキスト出力')
    print(txt_file)
    f = open(txt_file, 'w')
    f.write(out_text)
    f.close()
```

### ASR実行
```python
mp4_files = glob.glob('./ASR_FILES/*.mp4')

for mp4_file in mp4_files:
    mp4_asr_espnet(mp4_file)
```

## まとめ
本稿では，Python + ESPnetで長い音声データにおける日本語の文字起こし(ASR)を実施しました．


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
