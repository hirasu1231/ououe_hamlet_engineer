---
display: home
title: 'PythonでMIDIデータを扱う'
description: PythonでMIDIデータを扱います．
date: 2023-4-2
image: https://www.hamlet-engineer.com/image/midi.jpeg
categories: 
  - Python
tags:
  - Python
  - 音楽
  - MIDI
---
PythonでMIDIデータを扱います．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## MIDIファイルとは

>MIDIとは「Musical Instrument Digital Interface」の略です。音楽データを格納したファイル形式の一つですが、mp3やwavと大きく異なるのは、音そのものではなく、音符、音色などの「情報」を格納しているだけという点です。 今回扱ったMIDIデータというのは、音楽の演奏情報をデータ化し、電子楽器やパソコンで再生できるようにしたものです。また、電子楽器に内蔵されている曲（ソング）データもMIDIデータです。 MIDIデータは、楽器の演奏や練習、カラオケやBGMなどに、便利に利用できます。 さらにDAWソフトに接続することで、録音を行い作曲をすることもできます。 MIDIデータは演奏練習を目的に使用されることが多いです。また、.wavという形式とは異なり、メッセージ内容を直接確認することができるので、時系列データとして扱う研究や解析に適しています。 MIDIは鍵盤楽器だけでなく、電子ドラムでも用いることが可能です。テンポを一定に保つ練習支援などにも役立てられたりしています。<br>
<br>
>音楽の解析を行うプログラムや研究は多く存在しますが、今回はMIDIデータに着目してみました。 MIDIデータはフリーで公開されているものや自身で作成したものなどを用いるのがベストです。MIDIデータは著作物になるので、怪しいサイトからダウンロードすることは控えましょう。

出典：[Pythonで音楽を演奏するレシピ](https://axross-recipe.com/recipes/429)

## ライブラリのインストール
下記のコードでライブラリをインストールします．
```python
!sudo apt-get update
!sudo apt-get install -y fluidsynth
!pip install midi2audio
!pip install mido
```

また、midiファイルの変換に下記のファイルをダウンロードします。また、「FluidR3_GM.sf2」から「font.sf2」に変換します。

[FluidR3_GM.sf2](https://ja.osdn.net/projects/sfnet_androidframe/downloads/soundfonts/FluidR3_GM.sf2/)

## MIDIデータの作成

### 単音のMIDIデータ
まずは単音のMIDIデータを作成してみます。

Message,MidiFile,MidiTrack …オブジェクトの設定を行う。

MIDIFileの読み取り、書き込み、及び再生に使用できるオブジェクトです。

新しいファイルの作成をする際は、MessageとMidiTrackも必要になります。

​
**mido.Messageの動作**
- note_on：鍵盤を押す,押し続ける
- note_off：鍵盤を離す
​
**mido.Messageの引数＿**
- note:音階_note=60(C3, ド)
- velocity:音の強さ(音量)
- time:時間(ミリ秒)

```python
import mido
from mido import Message,MidiFile,MidiTrack

# MIDIファイルの出力
mid=MidiFile()
track=MidiTrack()
mid.tracks.append(track)

# MIDIの音色を指定
track.append(Message('program_change', program=12, time=0))

# C3(note=60, ド)の音を、指定の音量と時間で再生
# ノート(音階)を60(ドの音)に指定、ベロシティ(音の強さ)を64，時間は60s，デルタタイムは32ミリ秒
# 鍵盤を押しているのがノート・オン(note_on)
track.append(Message('note_on', note=60, velocity=64, time=32))
# 盤を離す動作に該当するのがノート・オフ(note_off)
# ノート番号60(ドの音)を127の強さで行う。デルタタイムは32ミリ秒
track.append(Message('note_off', note=60, velocity=127, time=32))

# 完ぺきに鍵盤を離す場合は
# ノート・オンのベロシティが0になるか、ノート・オフのベロシティが127になるかのどちらかということになります

# 出力
out_file = './midi/new_song.mid'
mid.save(out_file)

# 音楽ファイルの変換
# サウンドフォントを指定する
fs = FluidSynth(sound_font='font.sf2')
# 入力するmidiファイルとアウトプットファイル
fs.midi_to_audio(out_file, out_file.replace('.mid', '.mp3'))
```

<audio src="/audio/new_song.mp3" controls></audio>

<!-- <video width="560" height="240" controls>
  <source src="/video/sample.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>  -->

### テンポを指定したMIDIファイル
テンポを指定したMIDIファイルを生成します。

**mido.MetaMessageの動作**
- set_tempo

**mido.MetaMessageの引数**
- tempo：拍をどれくらいの速さで打つか
    - mido.bpm2tempo()：bpm2tempoでBPMをテンポ時間(1拍あたりの時間：マイクロ秒)

**mido.Messageの動作**
- note_on：鍵盤を押す,押し続ける
- note_off：鍵盤を離す

**mido.Messageの引数**
- note:音階_note=60(C3, ド)
- velocity:音の強さ(音量)
- time:時間(ミリ秒)

```python
import mido
from mido import Message, MidiFile, MidiTrack, MetaMessage

mid = MidiFile()
track = MidiTrack()
mid.tracks.append(track)

# テンポを指定
track.append(MetaMessage('set_tempo', tempo=mido.bpm2tempo(120)))

track.append(Message('note_on', note=60, velocity=64, time=0))
track.append(Message('note_off', note=60, time=480))
track.append(Message('note_on', note=60+4, velocity=64, time=0))
track.append(Message('note_off', note=60+4, time=480))
track.append(Message('note_on', note=60+7, velocity=64, time=0))
track.append(Message('note_off', note=60+7, time=480))

# 出力
out_file = './midi/newtempo_song.mid'
mid.save(out_file)

# 音楽ファイルの変換
# サウンドフォントを指定する
fs = FluidSynth(sound_font='font.sf2')
# 入力するmidiファイルとアウトプットファイル
fs.midi_to_audio(out_file, out_file.replace('.mid', '.mp3'))
```

<audio src="/audio/newtempo_song.mp3" controls></audio>

### 複数音を鳴らすMIDIデータ

**mido.MetaMessageの動作**
- set_tempo

**mido.MetaMessageの引数**
- tempo：拍をどれくらいの速さで打つか
    - mido.bpm2tempo()：bpm2tempoでBPMをテンポ時間(1拍あたりの時間：マイクロ秒)

**mido.Messageの動作**
- note_on：鍵盤を押す,押し続ける
- note_off：鍵盤を離す

**mido.Messageの引数**
- note:音階_note=60(C3, ド)
- velocity:音の強さ(音量)
- time:時間(ミリ秒)

```python
import mido
from mido import Message, MidiFile, MidiTrack, MetaMessage
from midi2audio import FluidSynth

mid = MidiFile()
track1 = MidiTrack()
track2 = MidiTrack()

# トラックの生成
mid.tracks.append(track1)
mid.tracks.append(track2)

# テンポを指定
track1.append(MetaMessage('set_tempo', tempo=mido.bpm2tempo(120)))
track2.append(MetaMessage('set_tempo', tempo=mido.bpm2tempo(120)))

# 音を順番に鳴らすため、デルタタイムの数字をずらしてある
track1.append(Message('note_on', note=64, velocity=60, time=0))
track1.append(Message('note_on', note=64+7, velocity=60, time=0))
track1.append(Message('note_off', note=64, time=480))
track1.append(Message('note_off', note=64+7, time=0))

track2.append(Message('note_on', note=64+4, velocity=60, time=40))
track2.append(Message('note_off', note=64+4, time=480))

# 出力
out_file = './midi/new_anysong.mid'
mid.save(out_file)

# 音楽ファイルの変換
# サウンドフォントを指定する
fs = FluidSynth(sound_font='font.sf2')
# 入力するmidiファイルとアウトプットファイル
fs.midi_to_audio(out_file, out_file.replace('.mid', '.mp3'))
```

<audio src="/audio/new_anysong.mp3" controls></audio>

## MIDIデータの読み込み
```python
import mido
mid = mido.MidiFile('./midi/newtempo_song.mid')

for msg in mid.tracks[0]:
    if msg.type == 'note_on':
        print(msg)
        
# note_on channel=0 note=60 velocity=64 time=0
# note_on channel=0 note=64 velocity=64 time=0
# note_on channel=0 note=67 velocity=64 time=0
```

```python
import mido
mid = mido.MidiFile('./midi/newtempo_song.mid')
for track in mid.tracks[0]:
    print(track)
    print("--------------------------------------")
    
# MetaMessage('set_tempo', tempo=500000, time=0)
# --------------------------------------
# note_on channel=0 note=60 velocity=64 time=0
# --------------------------------------
# note_off channel=0 note=60 velocity=64 time=480
# --------------------------------------
# note_on channel=0 note=64 velocity=64 time=0
# --------------------------------------
# note_off channel=0 note=64 velocity=64 time=480
# --------------------------------------
# note_on channel=0 note=67 velocity=64 time=0
# --------------------------------------
# note_off channel=0 note=67 velocity=64 time=480
# --------------------------------------
# MetaMessage('end_of_track', time=0)
# --------------------------------------
```


## まとめ
PythonでMIDIデータを扱いました．

## 参考サイト
[Pythonで音楽を演奏するレシピ](https://axross-recipe.com/recipes/429)

[MIDI FILE NAVIGATOR](https://windy-vis.com/art/download/midi_files.html)

[Midoを使ってPythonでmidiを読み込む](https://hjp.hatenablog.com/entry/2021/03/01/213026)

[Meta Message Types](https://mido.readthedocs.io/en/latest/meta_message_types.html)

[Midoを使ってPythonでMIDIを扱ってみよう](https://qiita.com/tjsurume/items/75a96381fd57d5350971)

[Python MidoでのMIDIファイル生成方法メモ](https://tattyamm.blog.jp/archives/5761686.html)

[偏ったDTM用語辞典 > BPM ビーピーエム](https://www.g200kg.com/jp/docs/dic/bpm.html)

[MIDIテンポを理解する](https://www.audiokinetic.com/ja/library/2017.1.9_6501/?source=Help&id=understanding_midi_tempo)

[FluidR3_GM.sf2](https://ja.osdn.net/projects/sfnet_androidframe/downloads/soundfonts/FluidR3_GM.sf2/)

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


