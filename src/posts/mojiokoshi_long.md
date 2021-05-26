---
display: home
title: 'pythonで長い音声・動画からの文字起こしを実装する'
description: 短い音声ファイルでの音声からの文字起こしはできましたので，本稿では長い音声・動画での文字起こし(できるだけ無料で)に実装したいです．
date: 2021-04-12
image: https://www.hamlet-engineer.com/image/mojiokoshi.png
categories: 
  - Python
tags:
  - Python
  - 音声
  - 文字起こし
---
短い音声ファイルでの音声からの文字起こしはできましたので，本稿では長い音声・動画での文字起こし(できるだけ無料で)に実装したいです．<br>

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

まだ精神が病んでるので，時にyoutubeで人の話を聞いて，認知療法に役立てているのですが，聞いてから文字に起こすのが面倒くさくなり，実装し始めました．<br>

サンプルとして[コーパス開発センター音声・転記テキストサンプル](https://pj.ninjal.ac.jp/corpus_center/csj/sample.html)から
学会講演［音声］のサンプル音声(aps-smp.mp3)をダウンロードします．

[[toc]]

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

## 事前準備
ここではSpeechRecognitionというモジュールを用いります．googleのAPIを間接的に利用します．<br>
[Speech-to-Text 公式API](https://cloud.google.com/speech-to-text/docs/libraries#client-libraries-install-python)

```init
pip install SpeechRecognition
# Successfully installed SpeechRecognition-3.8.1
```

## 音声のファイル変換
サンプルコードでは読み込む拡張子が「.wav」となっているため，mp3 -> wavに変換します．<br>

ファイル変換はpython上でffmpegを実行します．

```python
import subprocess

subprocess.run(['ffmpeg', '-i', 'aps-smp.mp3', 'aps-smp.wav'], encoding='utf-8', stdout=subprocess.PIPE)
```

## 長い音声のテキスト変換
SpeechRecognitionは最大で1分程度の音声ファイルしか変換できません．

そこで，30秒単位で音声・動画を分割して逐次的に文字起こしを実施し，その後一括で文字起こししたテキストを統合・整理します．

```python
import os
import glob
import shutil
import subprocess
import speech_recognition as sr

# 音声ファイルの分割
import wave
import math
import struct
from scipy import fromstring, int16

# mp4から音声ファイルへの変換
def mp4_to_wav(mp4f):
  wavf = mp4f.replace('.mp4', '.wav')
  subprocess.run(['ffmpeg', '-i', mp4f, wavf], 
                  encoding='utf-8', stdout=subprocess.PIPE)
  return wavf

# 音声ファイルの分割(デフォルト30秒)
def cut_wav(wavf,time=30):
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
  
  outf_list = []
  for i in range(num_cut):
      # 出力データを生成
      output_dir = 'output/cut_wav/'
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
      outf_list.append(outf)
  
  return outf_list

# 複数ファイルの音声のテキスト変換
def cut_wavs_str(outf_list):
  output_text = ''
  # 複数処理
  print('音声のテキスト変換')
  for fwav in outf_list:
      print(fwav)
      r = sr.Recognizer()
      
      # 音声->テキスト
      with sr.AudioFile(fwav) as source:
          audio = r.record(source)
      text = r.recognize_google(audio, language='ja-JP')
      
      # 各ファイルの出力結果の結合
      output_text = output_text + text + '\n'
      # wavファイルを削除
      os.remove(fwav)
      
  return output_text


# mp4からwavへの変換から音声のテキスト変換まで
def mp4_to_text(mp4f):
  # 出力ディレクトリ
  shutil.rmtree('output/cut_wav/')
  os.makedirs('output/cut_wav/', exist_ok=True)
  
  # 音声ファイルへの変換
  wav_file = mp4_to_wav(mp4f)
  
  # 音声ファイルの分割(デフォルト30秒)
  cut_wavs = cut_wav(wav_file)
  
  # 複数ファイルの音声のテキスト変換
  out_text = cut_wavs_str(cut_wavs)
  
  # テキストファイルへの入力
  mp4f_name = os.path.basename(mp4f)
  txt_file = 'output/' + mp4f_name.replace('.mp4', '.txt')
  print('テキスト出力')
  print(txt_file)
  f = open(txt_file, 'w')
  f.write(out_text)
  f.close()

# 変換の実行
mp4_to_text('＊＊＊＊＊＊.mp4')
```

## 参考サイト
- [Pythonで音声からテキストへ変換](https://self-development.info/python%E3%81%A7%E9%9F%B3%E5%A3%B0%E3%81%8B%E3%82%89%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88%E3%81%B8%E5%A4%89%E6%8F%9B%E3%80%90speechrecognition%E3%80%91/)
- [MacでpythonのSpeechRecognitionを使って音声認識](https://qiita.com/seigot/items/62a85f1a561bb820532a)


<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>