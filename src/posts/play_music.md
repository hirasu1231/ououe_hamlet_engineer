---
display: home
title: 'Pythonで音楽を演奏する'
description: Pythonで音楽を演奏します．
date: 2023-3-31
image: https://www.hamlet-engineer.com/image/midi.jpeg
categories: 
  - Python
tags:
  - Python
  - 音楽
  - MIDI
---
Pythonで音楽を演奏します．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ライブラリのインストール
下記のコードでライブラリをインストールします．
```python
# !apt-get install -y pulseaudio
# !apt-get update
# !apt-get install libasound-dev libportaudio2 libportaudiocpp0 portaudio19-dev -y
!pip install pyaudio
```

## Pythonで音を鳴らしてみよう
音声を出力するための処理をプログラム内で行います。

音は波形になっているため、音階をHz(ヘルツ)というもので表します。

ここでは、サイン波で整形して、音を出力・再生します。

### 既存の音楽を入出力

```python
from pydub import AudioSegment

#ファイル読み込み
sound = AudioSegment.from_file("./data/music/ウォーターランド.m4a", "m4a")

#配列データ取り出し
samples = np.array(sound.get_array_of_samples())

#読み込んだ配列データから新しいAudioSegmentを作成
test = AudioSegment(
                    samples.astype("int16").tobytes(), 
                    sample_width=sound.sample_width, 
                    frame_rate=sound.frame_rate, 
                    channels=sound.channels,
                    )

#保存
test.export("./data/music/test.mp3", format="mp3")
```


### テキトーな音を出力

```python
from pydub import AudioSegment
import numpy as np

#配列データ取り出し
samples=np.sin(np.arange(50000)/20)

#サイン波を-32768から32767の整数値に変換(signed 16bit pcmへ)
stream = np.array([int(x * 32767.0) for x in samples])

#読み込んだ配列データから新しいAudioSegmentを作成
test = AudioSegment(
                    stream.astype("int16").tobytes(), 
                    sample_width=2, 
                    frame_rate=44100, 
                    channels=1,
                    )
#保存
test.export("./data/music/sample.mp3", format="mp3")
```

### YOASOBI「夜に駆ける」を演奏する
下記のサイトで音階を周波数で変換する。

https://tomari.org/main/java/oto.html

```python
import pyaudio
import numpy as np

#サンプリングレートを定義
RATE=44100

#BPMや音長を定義
BPM=120
L1=(60/BPM*4)
L2,L4,L8=(L1/2,L1/4,L1/8)

#ドレミ...の周波数を定義
C,C_s,D,D_s,E,F,F_s,G,G_s,A,A_s,B,C2,D2,D2_s=(
    261.626,277.183,293.665,311.127,329.628,
    349.228,369.994,391.995,415.305,440.000,466.164,
    493.883,523.251,587.330,622.254
)

#サイン波を生成
def tone(freq,length,gain):
    slen=int(length*RATE)
    t=float(freq)*np.pi*2/RATE
    return np.sin(np.arange(slen)*t)*gain

#配列データ取り出し
stream = tone(G,L8,1.0)
stream = np.append(stream, tone(A_s,L8,1.0))
stream = np.append(stream, tone(C2,L4,1.0))
stream = np.append(stream, tone(G_s,L8,1.0))
stream = np.append(stream, tone(G,L8,1.0))
stream = np.append(stream, tone(F,L8,1.0))
stream = np.append(stream, tone(D_s,L8,1.0))
stream = np.append(stream, tone(F,L8,1.0))
stream = np.append(stream, tone(C2,L8,1.0))
stream = np.append(stream, tone(A_s,L8,1.0))
stream = np.append(stream, tone(C2,L8,1.0))
stream = np.append(stream, tone(G,L8,1.0))
stream = np.append(stream, tone(F,L8,1.0))
stream = np.append(stream, tone(D_s,L4,1.0))
stream = np.append(stream, tone(C,L8,1.0))
stream = np.append(stream, tone(A_s,L8,1.0))
stream = np.append(stream, tone(G_s,L8,1.0))
stream = np.append(stream, tone(G,L8,1.0))
stream = np.append(stream, tone(F,L8,1.0))
stream = np.append(stream, tone(D_s,L8,1.0))
stream = np.append(stream, tone(D,L8,1.0))
stream = np.append(stream, tone(D_s,L8,1.0))
stream = np.append(stream, tone(F,L8,1.0))
stream = np.append(stream, tone(G_s,L8,1.0))
stream = np.append(stream, tone(G,L8,1.0))
stream = np.append(stream, tone(F,L8,1.0))
stream = np.append(stream, tone(G,L8,1.0))
stream = np.append(stream, tone(C2,L8,1.0))
stream = np.append(stream, tone(A_s,L4,1.0))
stream = np.append(stream, tone(G,L8,1.0))
stream = np.append(stream, tone(A_s,L8,1.0))
stream = np.append(stream, tone(C2,L4,1.0))
stream = np.append(stream, tone(G_s,L8,1.0))
stream = np.append(stream, tone(G,L8,1.0))
stream = np.append(stream, tone(F,L8,1.0))
stream = np.append(stream, tone(D2,L8,1.0))
stream = np.append(stream, tone(C2,L8,1.0))
stream = np.append(stream, tone(A_s,L8,1.0))
stream = np.append(stream, tone(A_s,L8,1.0))
stream = np.append(stream, tone(C2,L8,1.0))
stream = np.append(stream, tone(D2,L8,1.0))
stream = np.append(stream, tone(D2_s,L4,1.0))
stream = np.append(stream, tone(G,L8,1.0))
stream = np.append(stream, tone(F,L8,1.0))
stream = np.append(stream, tone(D_s,L4,1.0))
stream = np.append(stream, tone(C,L8,1.0))
stream = np.append(stream, tone(D_s,L8,1.0))
stream = np.append(stream, tone(G_s,L8,1.0))
stream = np.append(stream, tone(G,L8,1.0))
stream = np.append(stream, tone(D_s,L8,1.0))
stream = np.append(stream, tone(F,L8,1.0))
stream = np.append(stream, tone(D_s,L4,1.0))

#サイン波を-32768から32767の整数値に変換(signed 16bit pcmへ)
stream = np.array([int(x * 32767.0) for x in stream])

#読み込んだ配列データから新しいAudioSegmentを作成
test = AudioSegment(
                    stream.astype("int16").tobytes(), 
                    sample_width=2, 
                    frame_rate=44100, 
                    channels=1,
                    )
#保存
test.export("./data/music/yoru_ni_kakeru.mp3", format="mp3")
```


## まとめ
Pythonで音楽を演奏しました．

## 参考サイト
[Pythonで音楽を演奏するレシピ](https://axross-recipe.com/recipes/429)

[jiaaro/pydub](https://github.com/jiaaro/pydub/blob/master/API.markdown)

[NumpyのarrayからPydubのAudioSegmentを作成する](https://own-search-and-study.xyz/2017/11/19/numpy%E3%81%AEarray%E3%81%8B%E3%82%89pydub%E3%81%AEaudiosegment%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B/)

[【Audio入門】Sin波の合成でメロディや音声を再現・再生してみる♬](https://qiita.com/MuAuan/items/ef4da6167d13cbf56e78)

[PyAudioの基本メモ2 音声入出力](https://takeshid.hatenadiary.jp/entry/2016/01/10/153503)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


