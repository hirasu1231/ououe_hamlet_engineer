---
display: home
title: 'Pythonで再生時間を変えずに音声のピッチを上げる方法'
description: Pythonで再生時間を変えずに音声のピッチを上げる方法を実装します．
date: 2022-06-15
image: https://www.hamlet-engineer.com/image/stylegan_sample.png
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - Audio
---

<!-- https://www.hamlet-engineer.com -->
Pythonで再生時間を変えずに音声のピッチを上げる方法を実装します．

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


## 音声のピッチを上げる
下記のコードで音声のピッチを上げます．

```python
from pydub import AudioSegment
from pydub.playback import play
from scipy.io import wavfile
import numpy as np
from scipy.signal import windows

#　入出力ファイルの指定
IN_WAVE_FILE = "test.wav"   # 16bit モノラル音声（前提）
OUT_WAVE_FILE = "out.wav"

PITCH = 1.25               # ピッチの倍率
N_TERM = 30                    # 標本化定理の近似項数
RATE = 1.0 / PITCH             # 再生速度の倍率


def resampling(data_in):
    """ リサンプリング （音を高く/低くするが再生時間も変わる）"""
    # wavの読み込み
    data_in = data_in.astype(np.float64)
    n_samples = len(data_in)

    n_samples_out = int(n_samples / PITCH)
    data_out = np.zeros(n_samples_out)

    for n in range(n_samples_out):
        analog_time = PITCH * n          # アナログ信号の時刻 t を求める
        digital_time = int(analog_time)  # 整数値に変換

        # 標本化定理に基づくアナログ信号復元によるリサンプリング
        sum_index = np.arange(digital_time - N_TERM // 2,
                              digital_time + N_TERM // 2 + 1)
        start_index = np.min(np.where(sum_index >= 0))
        end_index = np.max(np.where(sum_index <= n_samples))
        sinc_vector = np.sinc(analog_time - sum_index[start_index:end_index])
        data_out[n] = data_in[sum_index[start_index:end_index]].dot(sinc_vector)

    return data_out


def calc_autocorr(wave_data, corr_size, lag):
    """ 自己相関関数を計算する """
    autocorr = 0.0
    for i in range(corr_size):
        autocorr += wave_data[i] * wave_data[i + lag]

    return autocorr


def get_period(wave_data, period_min, period_max, corr_size):
    """ 相関関数のピーク位置に基づいて周期を計算する """
    corr_max = 0.0
    period = period_min

    for p in range(period_min, period_max):

        corr = calc_autocorr(wave_data, corr_size, p)  # 相関関数の計算

        # 相関関数のピークを求め、そのピーク位置を周期として取得する
        if corr > corr_max:
            corr_max = corr     # 相関関数のピーク値を更新
            period = p          # 周期を取得

    return period


def time_stretch(data_in, fs):
    """ タイムストレッチ (音の高さを変えずに再生時間を変更する) """

    # wavの読み込み
    data_in = data_in.astype(np.float64)
    n_samples = len(data_in)

    corr_size = int(fs * 0.01)    # 相関関数のサイズ 10ms
    min_period = int(fs * 0.005)  # 窓内における音データの周期の最小値 5ms
    max_period = int(fs * 0.02)   # 窓内における音データの周期の最大値 20ms

    offset_in = 0                # オーバーラップアドの開始位置 (入力側)
    offset_out = 0               # オーバーラップアドの開始位置 (出力側)

    data_out = np.zeros(int(n_samples / RATE) + 1)
    while (offset_in + max_period * 2 < n_samples):
        # 窓内の音データに対して(窓サイズ corr_size)、
        # 相関関数を利用することで音の周期を計算する
        period = get_period(data_in[offset_in:],
                            min_period, max_period, corr_size)

        if RATE >= 1.0:  # fast
            # オーバーラップアド（時間を縮める）
            window = windows.hann(2 * period)
            for n in range(period):
                data_out[offset_out + n] = \
                    data_in[offset_in + n] * window[period + n]
                data_out[offset_out + n] += \
                    data_in[offset_in + period + n] * window[n]
            del window

            # オーバーラップアドしていない音データをそのままコピー
            q = int(period / (RATE - 1.0) + 0.5)
            for n in range(period, n_samples):
                if n >= q:
                    break
                elif offset_in + period + n >= n_samples:
                    break
                else:
                    data_out[offset_out + n] = data_in[offset_in + period + n]

            offset_in += period + q
            offset_out += q
        else:  # slow
            # オーバーラップアドしていない音データをそのままコピー
            data_out[offset_out: offset_out + period] = \
                data_in[offset_in: offset_in + period]

            # オーバーラップアド（時間を伸ばす）
            window = windows.hann(2 * period)
            for n in range(period):
                data_out[offset_out + period + n] = \
                    data_in[offset_in + n] * window[n]
                data_out[offset_out + period + n] += \
                    data_in[offset_in + period + n] * window[period + n]
            del window

            # オーバーラップアドしていない音データをそのままコピー
            q = int(period * RATE / (1.0 - RATE) + 0.5)
            for n in range(period, n_samples):
                if n >= q:
                    break
                elif offset_in + period + n >= n_samples:
                    break
                else:
                    data_out[offset_out + period + n] = data_in[offset_in + n]

            offset_in += q
            offset_out += period + q

    return data_out


def pitch_shift():
    """ 再生時間を変えずに音の高さを変える """

    # wavの読み込み
    fs, data_in = wavfile.read(IN_WAVE_FILE)

    # リサンプリング
    data_out = resampling(data_in)

    # タイムストレッチ
    data_out = time_stretch(data_out, fs)

    # wavの書き込み
    data_out = data_out.astype(np.int16)
    wavfile.write(OUT_WAVE_FILE, fs, data_out)

if __name__ in '__main__':
    pitch_shift()
```

## まとめ
再生時間を変えずに音声のピッチを上げる方法を実装しました．


## 参考サイト
[tam17aki/ピッチシフト](https://gist.github.com/tam17aki/3826197d71c67b5df17bb6022f1b753a)

[簡易ボイスチェンジャーのスクリプトを改良：キー入力によるピッチの上下およびフォルマント調整機能](https://tam5917.hatenablog.com/entry/2019/04/30/112451)

[Pythonで音声録音・再生ができるPyAudioのインストール](https://self-development.info/python%E3%81%A7%E9%9F%B3%E5%A3%B0%E9%8C%B2%E9%9F%B3%E3%83%BB%E5%86%8D%E7%94%9F%E3%81%8C%E3%81%A7%E3%81%8D%E3%82%8Bpyaudio%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB/)

[pyaudioのインストールで詰んだ時の対処法](https://qiita.com/musaprg/items/34c4c1e0e9eb8e8cc5a1)

[pyaudio "save" wav file code example](https://newbedev.com/pyaudio-save-wav-file-code-example)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

