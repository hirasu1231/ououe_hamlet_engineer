---
display: home
title: 'pythonで音声からの文字起こしを実装する'
description: 本稿では，音声データからテキストに変換する文字起こしを実装します．
date: 2021-04-09
image: https://www.hamlet-engineer.com/image/mojiokoshi.png
categories: 
  - Python
tags:
  - Python
  - 音声
  - 文字起こし
---
本稿では，音声データからテキストに変換する文字起こしを実装します．<br>
<!-- more -->

まだ精神が病んでるので，時にyoutubeで人の話を聞いて，認知療法に役立てているのですが，聞いてから文字に起こすのが面倒くさくなり，実装し始めました．<br>
サンプルとして[コーパス開発センター音声・転記テキストサンプル](https://pj.ninjal.ac.jp/corpus_center/csj/sample.html)から
学会講演［音声］のサンプル音声(aps-smp.mp3)をダウンロードします．


## 事前準備
ここではSpeechRecognitionというモジュールを用いります．googleのAPIを間接的に利用します．<br>
[Speech-to-Text 公式API](https://cloud.google.com/speech-to-text/docs/libraries#client-libraries-install-python)

```
pip install SpeechRecognition
# Successfully installed SpeechRecognition-3.8.1
```

## 音声のファイル変換
サンプルコードでは読み込む拡張子が「.wav」となっているため，mp3 -> wavに変換します．<br>
ファイル変換はターミナル上でffmpegで実行します．

```
# ffmpegのインストール
apt-get install -y ffmpeg

# ファイルの変換
ffmpeg -i aps-smp.mp3 aps-smp.wav
```

## 音声のテキスト変換
以下のコードで音声からテキストに変換する文字起こしに実施します．
```python
# 音声のテキスト変換
import speech_recognition as sr
 
r = sr.Recognizer()
 
with sr.AudioFile("aps-smp.wav") as source:
    audio = r.record(source)
text = r.recognize_google(audio, language='ja-JP')
 
print(text)
```

## 今後のやりたいこと
短い音声ファイルではありますが，音声からの文字起こしはできました．<br>
今後は長い動画での文字起こし(できるだけ無料で)に実装したいです．


## 参考サイト
- [Pythonで音声からテキストへ変換](https://self-development.info/python%E3%81%A7%E9%9F%B3%E5%A3%B0%E3%81%8B%E3%82%89%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88%E3%81%B8%E5%A4%89%E6%8F%9B%E3%80%90speechrecognition%E3%80%91/)
- [MacでpythonのSpeechRecognitionを使って音声認識](https://qiita.com/seigot/items/62a85f1a561bb820532a)

## エラーコード
### エラーコード1
あまりに時間の長い音声ファイル(無料枠から外れる)を変換したり，言語として読み取れなかったりすると，以下のエラーが発生します．<br>
[recognize_google speech recognition broken pipe python](https://stackoverflow.com/questions/51757824/recognize-google-speech-recognition-broken-pipe-python)
```
RequestError: recognition connection failed: [Errno 32] Broken pipe
```
