---
display: home
title: 'Python + ESPnetで日本語の音声合成(TTS)を実装する'
description: Python + ESPnetで日本語の音声合成(TTS)を実施します．
date: 2022-7-24
image: https://www.hamlet-engineer.com/image/tts_2.jpeg
categories: 
  - Python
tags:
  - Python
  - jupyter
  - ESPnet
  - TTS
  - Text_To_Speech
---
<!-- https://www.hamlet-engineer.com -->
Python + ESPnetで日本語の音声合成(TTS)を実施します．<br>

<!-- more -->

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

[[toc]]

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


## Google Colabのファイル構成
プロジェクトディレクトリはASRとしています．度々，省略しています．

本稿では，[岡田斗司夫さんの切り抜き動画](https://www.youtube.com/watch?v=us6ClXxB9uY)を文字起こしします．

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
# 作業ディレクトリの作成
%cd /content/drive/MyDrive/
!mkdir -p ASR
%cd ASR
!ls
```

## モジュールのインストール
下記のコマンドでモジュールをインストールします．
```python
# pip
!pip install torch
!pip install espnet_model_zoo
!pip install pyopenjtalk
```

### 音声合成の実行
下記のコードで音声合成を実行します．

```python
import os
import numpy as np
import soundfile
import torch
from espnet2.bin.tts_inference import Text2Speech
from espnet2.utils.types import str_or_none


# 読み上げ言語設定
lang = 'Japanese'
tag = 'kan-bayashi/jsut_full_band_vits_prosody' 
vocoder_tag = 'none' 

# モデル読み込み
text2speech = Text2Speech.from_pretrained(
    model_tag=str_or_none(tag),
    vocoder_tag=str_or_none(vocoder_tag),
    device="cuda",
    # Only for Tacotron 2 & Transformer
    threshold=0.5,
    # Only for Tacotron 2
    minlenratio=0.0,
    maxlenratio=10.0,
    use_att_constraint=False,
    backward_window=1,
    forward_window=3,
    # Only for FastSpeech & FastSpeech2 & VITS
    speed_control_alpha=1.0,
    # Only for VITS
    noise_scale=0.333,
    noise_scale_dur=0.333,
)

# 日本語の音声作成
txt = '日本語の音声作成'
with torch.no_grad():
    wav = text2speech(txt)["wav"]

# wav出力
wav_cpu = wav.cpu().numpy()
soundfile.write(f"./output.wav", 
                wav_cpu, text2speech.fs, "PCM_16")
```

### 音声合成の実行(PDF)
下記のコードで音声合成(PDF)を実行します．
```python
import fitz
import csv
import json
from tqdm import tqdm

import os
import numpy as np
import soundfile
import torch
from espnet2.bin.tts_inference import Text2Speech
from espnet2.utils.types import str_or_none

# 音声ディレクトリ
os.makedirs("./TheElementsOfComputingSystems/", exist_ok=True)

# 読み上げ言語設定
lang = 'Japanese'
tag = 'kan-bayashi/jsut_full_band_vits_prosody' 
vocoder_tag = 'none' 

# モデル読み込み
text2speech = Text2Speech.from_pretrained(
    model_tag=str_or_none(tag),
    vocoder_tag=str_or_none(vocoder_tag),
    device="cuda",
    # Only for Tacotron 2 & Transformer
    threshold=0.5,
    # Only for Tacotron 2
    minlenratio=0.0,
    maxlenratio=10.0,
    use_att_constraint=False,
    backward_window=1,
    forward_window=3,
    # Only for FastSpeech & FastSpeech2 & VITS
    speed_control_alpha=1.0,
    # Only for VITS
    noise_scale=0.333,
    noise_scale_dur=0.333,
)


# PDF読み込み
input_path = './コンピュータシステムの理論と実装.pdf'
doc = fitz.open(input_path)

# 章別
section_pages = [7, 11, 19, 29, 39, 65, 79, 
                 97, 123, 149, 171, 205,
                 229, 261, 287, 315, 353,
                 357, 377, 399, 411]

# 本文抽出
idx = 1
pno = 0
flag = 0
for page in tqdm(doc):
    # 最初の数ページを飛ばす
    if pno < (section_pages[0]-1):
        pno += 1
        continue
    # 本文抽出
    blocklist = page.getText('blocks')
    for block in blocklist:
        txt = block[4].replace('\n', '').replace('\r', '').replace('·', '')

        try:
            # 日本語訳の音声作成
            with torch.no_grad():
                wav = text2speech(txt)["wav"]
            # wavの結合
            wav_cpu = wav.cpu().numpy()
            if not flag:
                wav_out = wav_cpu
                flag = 1
            else:
                wav_out = np.block([wav_out, wav_cpu])
        except:
            print(f"Page{pno} Error: , {txt}")

    pno += 1
    # wav出力
    print(pno, idx, idx == len(section_pages))
    if pno==(section_pages[idx]-1):
        print(pno, f"./TheElementsOfComputingSystems/{str(idx).zfill(3)}_section.wav")
        soundfile.write(f"./TheElementsOfComputingSystems/{str(idx).zfill(3)}_section.wav", 
                        wav_out, text2speech.fs, "PCM_16")
        idx += 1
        flag = 0
    # 最後の出力
    if idx == len(section_pages):
        break

# 18 2 False
# 18 ./TheElementsOfComputingSystems/002_section.wav
#   4%|▍         | 18/416 [00:43<16:04,  2.42s/it]18 3 True
```

## まとめ
本稿では，ESPNetによる文字起こしを実装しました．


## 参考サイト
[ESPnet2で始めるEnd-to-End音声処理](https://kan-bayashi.github.io/asj-espnet2-tutorial/#%E3%83%AC%E3%82%B7%E3%83%94%E3%81%AE%E6%A7%8B%E9%80%A0)

[複雑な音声処理タスクを一気通貫で実装できる! ESPnetの概念と特徴について](https://tech.fusic.co.jp/posts/2021-08-03-espnet/)

[簡単に作れるTTSモデル：ESPnetを用いたつくよみちゃんTTSモデル作成](https://tech.fusic.co.jp/posts/2021-08-20-ml-espnet-tts-2/)

[ESPnet による音声認識入門 ～ESPnet Model Zoo 編～](https://tech.retrieva.jp/entry/2020/12/23/170645)

[End-to-End音声処理ツールキットESPnetの紹介](https://qiita.com/kan-bayashi/items/536acaf165344a6d6460)


<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
