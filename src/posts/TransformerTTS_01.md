---
display: home
title: 'TransformerTTS + MelGANでテキストからの音声の生成を実装する'
description: TransformerTTS + MelGANでテキストからの音声の生成を実施します．
date: 2021-12-26
image: https://www.hamlet-engineer.com/image/TTS.jpeg
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - Text-to-Speech
  - Speech_Synthesis
  - TTS
---
TransformerTTS + MelGANでテキストからの音声の生成を実施します．<br>

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

## Google Colabのファイル構成
プロジェクトディレクトリはSpeech_Synthesisとしています．度々，省略しています．
```
Speech_Synthesis
├── /TransformerTTS
├── /melgan
└── TransformerTTS.ipynb <- 実行用ノートブック
```

## Google Driveと連携
Google ColabとGoogle Driveを連携させて，gitから[as-ideas/TransformerTTS](https://github.com/as-ideas/TransformerTTS.git)・[seungwonpark/melgan](https://github.com/seungwonpark/melgan.git)をダウンロードします．

```python
# Google ColabとGoogle Driveを連携
from google.colab import drive
drive.mount('/content/drive')
```

```python
# ディレクトリの移動
%cd /content/drive/My\ Drive/Speech_Synthesis
# gitのダウンロード
!git clone https://github.com/as-ideas/TransformerTTS.git
!git clone https://github.com/seungwonpark/melgan.git
!ls
```

## モジュールのインストール
下記のコードでモジュールのインストールします．

```python
!apt-get install -y espeak
!pip install -r TransformerTTS/requirements.txt
```

```python
%cd TransformerTTS
!git checkout c3405c53e435a06c809533aa4453923469081147
```

```python
# 作業ディレクトリへ移動
%cd /content/drive/My\ Drive/Speech_Synthesis/
!ls
```

## TransformerTTS
次のコードでTransformerの学習済みモデルの音声合成を実施します．

```python
# パスの整理
from pathlib import Path
MelGAN_path = 'melgan/'
TTS_path = 'TransformerTTS/'

import sys
sys.path.append(TTS_path)
```

```python
# 学習済みモデルのダウンロード
from model.factory import tts_ljspeech
from data.audio import Audio

model, config = tts_ljspeech()
audio = Audio(config)
```

```python
# 音声合成する文章の入力
sentence = 'Scientists at the CERN laboratory, say they have discovered a new particle.'
out_normal = model.predict(sentence)
```

```python
# wav音声データに変換
wav = audio.reconstruct_waveform(out_normal['mel'].numpy().T)

# wav音声データの出力
from scipy.io.wavfile import write
write('TransformerTTS_sample.wav', config['sampling_rate'], wav)
```

```python
# jupyter上で音声再生
import IPython.display as ipd

ipd.display(ipd.Audio(wav, rate=config['sampling_rate']))
```

<audio src="/audio/TransformerTTS_sample.wav" controls></audio>

```python
# 20%早く再生
sentence = 'Scientists at the CERN laboratory, say they have discovered a new particle.'
out = model.predict(sentence, speed_regulator=1.20)
wav = audio.reconstruct_waveform(out['mel'].numpy().T)
ipd.display(ipd.Audio(wav, rate=config['sampling_rate']))
```

```python
# 10%遅く再生
sentence = 'Scientists at the CERN laboratory, say they have discovered a new particle.'
out = model.predict(sentence, speed_regulator=.9)
wav = audio.reconstruct_waveform(out['mel'].numpy().T)
ipd.display(ipd.Audio(wav, rate=config['sampling_rate']))
```

## MelGAN
次のコードでMelGANの学習済みモデルの音声合成を実施します

```python
# 作業ディレクトリへ移動
%cd /content/drive/My\ Drive/Speech_Synthesis
!ls
```

```python
# パスの初期化
sys.path.remove(TTS_path)
sys.modules.pop('model')
```

```python
# 学習済みモデルの読み込み
sys.path.append(MelGAN_path)
import torch
import numpy as np

vocoder = torch.hub.load('seungwonpark/melgan', 'melgan')
vocoder.eval()

mel = torch.tensor(out_normal['mel'].numpy().T[np.newaxis,:,:])
```

```python
# 音声合成の実行
if torch.cuda.is_available():
    vocoder = vocoder.cuda()
    mel = mel.cuda()

with torch.no_grad():
    audio = vocoder.inference(mel)

# wav音声データの出力
from scipy.io.wavfile import write
write('melgan_sample.wav', 22050, audio.cpu().numpy())
```

```python
# jupyter上で音声再生
ipd.display(ipd.Audio(audio.cpu().numpy(), rate=22050))
```

<audio src="/audio/melgan_sample.wav" controls></audio>

## まとめ
英語ですが，TransformerTTS + MelGANでテキストからの音声の生成を実施しました．

次は，日本語のモデルを作成or実装します．

<br>


## 参考サイト
[sota/text-to-speech-synthesis-on-ljspeech](https://paperswithcode.com/sota/text-to-speech-synthesis-on-ljspeech)

[as-ideas/TransformerTTS](https://github.com/as-ideas/TransformerTTS)

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>