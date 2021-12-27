---
display: home
title: 'TransformerTTS + MelGANでテキストからの音声の生成の学習を実装する(学習編)'
description: TransformerTTS + MelGANでテキストからの音声の生成の学習を実施します．
date: 2021-12-27
image: https://www.hamlet-engineer.com/image/TTS.jpeg
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - Text-to-Speech
  - 音声合成
  - 読み上げ
---
TransformerTTS + MelGANでテキストからの音声の生成の学習を実施します．<br>

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
!pip unstall tqdm
!pip install tqdm==4.40.1
```

```python
# 作業ディレクトリへ移動
%cd /content/drive/My\ Drive/Speech_Synthesis/
!ls
```

## 学習データ(LJSpeech)
本稿では，LJSpeechというデータを使用します．
> LJSpeech は、keithito さんによって2017年に公開された、単一女性話者によって録音された24時間程度の英語音声コーパスです。なぜ近年よく使われて始めているのかと言うと（2019年6月時点でGoogle scholarで27件の引用）、End-to-end 音声合成の研究に用いるデータセットとして、LJSpeechは最もといっていいほど手軽に手に入るからだと考えています。LJSpeech は public domainで配布されており、利用に制限もありませんし、企業、教育機関、個人など様々な立場から自由に使用することができます。End-to-end 音声合成（厳密にはseq2seq モデルの学習）は一般に大量のデータが必要なことが知られていますが、その要件も満たしていることから、特にEnd-to-end音声合成の研究で用いられている印象を受けます。最近だと、FastSpeech: Fast, Robust and Controllable Text to Speech にも使われていましたね。<br>引用元:[LJSpeech は価値のあるデータセットですが、ニューラルボコーダの品質比較には向かないと思います](https://r9y9.github.io/blog/2019/06/11/ljspeech/)


## 学習データのダウンロード
下記のコードで学習データをダウンロードします．
```init
データディレクトリ名
├── metadata.csv
└── /wavs <- 音声データ
        ├── LJ007-oo48.wav
        └── (省略)
```

metadata.csvは各wavファイルのセリフが格納されている．区切り文字は`|`となっている．

下記にmetadata.csvの中身の例を示す．

```
# ファイル名|セリフ1|セリフ2
# セリフ1==セリフ2
LJ001-0001|Printing, in the only sense with which we are at present concerned, differs from most if not from all the arts and crafts represented in the Exhibition|Printing, in the only sense with which we are at present concerned, differs from most if not from all the arts and crafts represented in the Exhibition
LJ001-0002|in being comparatively modern.|in being comparatively modern.
LJ001-0003|For although the Chinese took impressions from wood blocks engraved in relief for centuries before the woodcutters of the Netherlands, by a similar process|For although the Chinese took impressions from wood blocks engraved in relief for centuries before the woodcutters of the Netherlands, by a similar process
LJ001-0004|produced the block books, which were the immediate predecessors of the true printed book,|produced the block books, which were the immediate predecessors of the true printed book,
```

下記のコードで学習データをダウンロードします．

```python
%cd /content/drive/My\ Drive/Speech_Synthesis/TransformerTTS
!wget https://data.keithito.com/data/speech/LJSpeech-1.1.tar.bz2
!tar -jxvf LJSpeech-1.1.tar.bz2 -> null
!ls
```

## configファイルの作成
下記のコードで学習の設定を整理したファイル`config/training_config.yaml`を作成します．
```python
# analyze_pdf_text_bert.pyの書き込み
%%writefile config/training_config.yaml
paths:
  # PATHS: change accordingly
  wav_directory: 'LJSpeech-1.1/wavs' # path to directory cointaining the wavs
  metadata_path: 'LJSpeech-1.1/metadata.csv'  # name of metadata file under wav_directory
  log_directory: 'LJSpeech-1.1/logs'   # weights and logs are stored here
  train_data_directory: 'LJSpeech-1.1/train'   # training data is stored here

naming:
  data_name: ljspeech # raw data naming for default data reader (select function from data/metadata_readers.py)
  audio_settings_name: MelGAN_default
  text_settings_name: Stress_NoBreathing
  aligner_settings_name: alinger_extralayer_layernorm
  tts_settings_name: tts_swap_conv_dims

# TRAINING DATA SETTINGS
training_data_settings:
  n_test: 100
  mel_start_value: .5
  mel_end_value: -.5
  max_mel_len: 1_200
  min_mel_len: 80
  bucket_boundaries: [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1200] # mel bucketing
  bucket_batch_sizes: [64, 42, 32, 25, 21, 18, 16, 14, 12, 6, 1]
  val_bucket_batch_size: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1]

# AUDIO SETTINGS
audio_settings:
  sampling_rate: 22050
  n_fft: 1024
  mel_channels: 80
  hop_length: 256
  win_length: 1024
  f_min: 0
  f_max: 8000
  normalizer: MelGAN                 # which mel normalization to use from utils.audio.py [MelGAN or WaveRNN]

  # SILENCE CUTTING
  trim_silence_top_db: 60
  trim_silence: False
  trim_long_silences: True
  # Params for trimming long silences, from https://github.com/resemble-ai/Resemblyzer/blob/master/resemblyzer/hparams.py
  vad_window_length: 30      # In milliseconds
  vad_moving_average_width: 8
  vad_max_silence_length: 12
  vad_sample_rate: 16000

  # Wav normalization
  norm_wav: True
  target_dBFS: -30
  int16_max: 32767

text_settings:
  # TOKENIZER
  phoneme_language: 'en-us'
  with_stress: True                  # use stress symbols in phonemization
  model_breathing: false           # add a token for the initial breathing

aligner_settings:
  # ARCHITECTURE
  decoder_model_dimension: 256
  encoder_model_dimension: 256
  decoder_num_heads: [4, 4, 4, 4, 1]  # the length of this defines the number of layers
  encoder_num_heads: [4, 4, 4, 4]  # the length of this defines the number of layers
  encoder_feed_forward_dimension: 512
  decoder_feed_forward_dimension: 512
  decoder_prenet_dimension: 256
  encoder_prenet_dimension: 256
  encoder_max_position_encoding: 10000
  decoder_max_position_encoding: 10000

  # LOSSES
  stop_loss_scaling: 8

  # TRAINING
  dropout_rate: 0.1
  decoder_prenet_dropout: 0.1
  learning_rate_schedule:
    - [0, 1.0e-4]
  reduction_factor_schedule:
    - [0, 10]
    - [80_000, 5]
    - [100_000, 2]
    - [130_000, 1]
  max_steps: 260_000
  force_encoder_diagonal_steps: 500
  force_decoder_diagonal_steps: 7_000
  extract_attention_weighted: False # weighted average between last layer decoder attention heads when extracting durations
  debug: False

  # LOGGING
  validation_frequency: 5_000
  weights_save_frequency: 5_000
  train_images_plotting_frequency: 1_000
  keep_n_weights: 2
  keep_checkpoint_every_n_hours: 12
  n_steps_avg_losses: [100, 500, 1_000, 5_000]  # command line display of average loss values for the last n steps
  prediction_start_step: 10_000 # step after which to predict durations at validation time
  prediction_frequency: 5_000
  test_stencences:
    - aligner_test_sentences.txt

tts_settings:
  # ARCHITECTURE
  decoder_model_dimension: 384
  encoder_model_dimension: 384
  decoder_num_heads: [2, 2, 2, 2, 2, 2]  # the length of this defines the number of layers
  encoder_num_heads: [2, 2, 2, 2, 2, 2]  # the length of this defines the number of layers
  encoder_feed_forward_dimension: null
  decoder_feed_forward_dimension: null
  encoder_attention_conv_filters: [1536, 384]
  decoder_attention_conv_filters: [1536, 384]
  encoder_attention_conv_kernel: 3
  decoder_attention_conv_kernel: 3
  encoder_max_position_encoding: 2000
  decoder_max_position_encoding: 10000
  encoder_dense_blocks: 0
  decoder_dense_blocks: 0
  transposed_attn_convs: True  # if True, convolutions after MHA are over time.

  # STATS PREDICTORS ARCHITECTURE
  duration_conv_filters: [256, 226]
  pitch_conv_filters: [256, 226]
  duration_kernel_size: 3
  pitch_kernel_size: 3

  # TRAINING
  predictors_dropout: 0.1
  dropout_rate: 0.1
  learning_rate_schedule:
    - [0, 1.0e-4]
  max_steps: 100_000
  debug: False

  # LOGGING
  validation_frequency: 5_000
  prediction_frequency: 5_000
  weights_save_frequency: 5_000
  weights_save_starting_step: 5_000
  train_images_plotting_frequency: 1_000
  keep_n_weights: 5
  keep_checkpoint_every_n_hours: 12
  n_steps_avg_losses: [100, 500, 1_000, 5_000]  # command line display of average loss values for the last n steps
  prediction_start_step: 4_000
  text_prediction:
    - test_sentences.txt
```

## 学習の実行(Aligner Model)

### Step1 データセットの作成(約5時間)
```python
# ディレクトリの移動
%cd /content/drive/My\ Drive/Speech_Synthesis/TransformerTTS

# データセットの作成
!python create_training_data.py --config config/training_config.yaml
```

### Step2 学習実行(約20時間)
```python
!python train_aligner.py --config config/training_config.yaml
```

## 学習の実行(TTS Model)

### Step1 alignmentデータセットの計算(約20時間)
```python
# ディレクトリの移動
%cd /content/drive/My\ Drive/Speech_Synthesis/TransformerTTS

!python extract_durations.py --config config/training_config.yaml
```

### Step2 学習実行(約30時間)
```python
# ディレクトリの移動
%cd /content/drive/My\ Drive/Speech_Synthesis/TransformerTTS

!python train_tts.py --config config/training_config.yaml
```


## TransformerTTSの実行
次のコードでTransformerの学習済みモデルの音声合成を実施します．

```python
# パスの整理
from pathlib import Path
MelGAN_path = 'melgan/'
TTS_path = 'TransformerTTS/'

# モジュールのインポート先を追加
import sys
sys.path.append(TTS_path)

from model.models import ForwardTransformer
from data.audio import Audio
from scipy.io.wavfile import write
import IPython.display as ipd

# 学習モデルの読み込み
model = ForwardTransformer.load_model('TransformerTTS/LJSpeech-1.1/logs/ljspeech/tts_swap_conv_dims.alinger_extralayer_layernorm/weights/step_100000/')
audio = Audio.from_config(model.config)

# 音声合成する文章の入力
sentence = 'Scientists at the CERN laboratory, say they have discovered a new particle.'
out_normal = model.predict(sentence)

# wav音声データに変換
wav = audio.reconstruct_waveform(out_normal['mel'].numpy().T)

# wav音声データの出力
write('TransformerTTS_LJSpeech_100000.wav', model.config['sampling_rate'], wav)

# wavの再生
ipd.display(ipd.Audio(wav, rate=model.config['sampling_rate']))
```

<audio src="/audio/TransformerTTS_LJSpeech_100000.wav" controls></audio>


## MelGAN
次のコードでMelGANの学習済みモデルの音声合成を実施します．

```python
# 作業ディレクトリへ移動
%cd /content/drive/My\ Drive/Speech_Synthesis
!ls
```

```python
# パスの初期化
sys.path.remove(TTS_path)
sys.modules.pop('model')

# 学習済みモデルの読み込み
sys.path.append(MelGAN_path)
import torch
import numpy as np

vocoder = torch.hub.load('seungwonpark/melgan', 'melgan')
vocoder.eval()

mel = torch.tensor(out_normal['mel'].numpy().T[np.newaxis,:,:])

# 音声合成の実行
if torch.cuda.is_available():
    vocoder = vocoder.cuda()
    mel = mel.cuda()

with torch.no_grad():
    audio = vocoder.inference(mel)

# wav音声データの出力
from scipy.io.wavfile import write
write('melgan_LJSpeech_100000.wav', 22050, audio.cpu().numpy())

# jupyter上で音声再生
ipd.display(ipd.Audio(audio.cpu().numpy(), rate=22050))
```

<audio src="/audio/melgan_LJSpeech_100000.wav" controls></audio>

## まとめ
英語ですが，TransformerTTS + MelGANでテキストからの音声の生成の学習を実施しました．

次は，日本語のモデルを作成or実装したかったのですが，学習時にバックエンドで使用するespeakがデフォルトで日本語に対応していないため，抜本的な対策が必要となります．

本稿の内容で続けるか，別のモデルを使用します．

<br>


## 参考サイト
[sota/text-to-speech-synthesis-on-ljspeech](https://paperswithcode.com/sota/text-to-speech-synthesis-on-ljspeech)

[as-ideas/TransformerTTS](https://github.com/as-ideas/TransformerTTS)

[LJSpeech は価値のあるデータセットですが、ニューラルボコーダの品質比較には向かないと思います](https://r9y9.github.io/blog/2019/06/11/ljspeech/)

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>