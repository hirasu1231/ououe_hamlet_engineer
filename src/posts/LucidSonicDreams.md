---
display: home
title: '音楽に合わせて画像を変化させる「Lucid Sonic Dreams」を実装する'
description: 音楽に合わせて画像を変化させる「Lucid Sonic Dreams」を実装します．
date: 2021-12-24
image: https://www.hamlet-engineer.com/image/LucidSonicDreams.jpeg
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - GAN
---
音楽に合わせて画像を変化させる「Lucid Sonic Dreams」を実装します．<br>

ここでは，ワンオクの「Broken_Heart_of_Gold」に合わせた動画を作成します．

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
プロジェクトディレクトリはLucidSonicDreamsとしています．度々，省略しています．
```
LucidSonicDreams
├── /LucidSonicDreams
|   ├── /Broken_Heart_of_Gold
|   |   ├── Broken_Heart_of_Gold.m4a
|   |   └── (省略)
|   └── (省略)
└── lucidsonicdreams.ipynb
```

## Google Driveと連携
Google ColabとGoogle Driveを連携させて，gitから[mikaelalafriz/lucid-sonic-dreams](https://github.com/mikaelalafriz/lucid-sonic-dreams.git)をダウンロードします．<br>

```python
# Google ColabとGoogle Driveを連携
from google.colab import drive
drive.mount('/content/drive')
```

```python
# ディレクトリの移動
%cd /content/drive/MyDrive/
# gitのダウンロード
!git clone https://github.com/Mukosame/Anime2Sketch.git
!ls
```

```python
# gitのクローン
%cd /content/drive/My\ Drive/music_generator/
git clone https://github.com/mikaelalafriz/lucid-sonic-dreams.git
# 作業ディレクトリへの移動
%cd LucidSonicDreams
!ls
```

## ライブラリのインストール
下記のコードでライブラリのインストールします．

```python
!pip install lucidsonicdreams
```

## 動画の作成

### スタイルの選択
スタイルを選択するには、**style**パラメータを使用します。このパラメータには、以下のいずれかを指定します。

* パッケージで提供されている有効なデフォルトスタイル名です。show_styles()**を実行すると、有効な値が表示されます。*Note: これらのスタイルはJustin Pinkneyによって[this repository](https://github.com/justinpinkney/awesome-pretrained-stylegan2)からロードされています。

* 事前に学習された StyleGAN ウェイトを含む .pkl ファイルへのパス。

* noise_batch と class_batch パラメータを受け取り、Pillow Image のリストを出力するカスタム関数 (**B.5** の例を参照)

```python
from lucidsonicdreams import show_styles 

# スタイル参照
show_styles()
```

### デフォルト設定の使用

本パッケージでは、オーディオトラックのファイルパス**とビデオ出力のファイル名**のみが必要な引数となるように設定されています。このコードスニペットは、"modern art "スタイルと他のすべてのデフォルト設定を使用して、ビデオの45秒間の低解像度プレビューを出力します。

ここで使用されている曲は、Basically Saturday Night**の**Chemical Loveです。公式のミュージックビデオは[ここ](https://youtu.be/Gi7oQrtyjKI)で見ることができますし、[Spotify](https://open.spotify.com/artist/46tGdhXAQbTvxVOGgy0Fqu?si=E8mUjbWbR2uiiMR2MUc_4w)で聴くこともできますよ。

コードを実行しなくても、[ここ](https://youtu.be/oGXfOmqFYTg)をクリックすれば、全編のサンプルビデオを見ることができます。

```python
from lucidsonicdreams import LucidSonicDream
from google.colab import files


L = LucidSonicDream(song = './Broken_Heart_of_Gold/Broken_Heart_of_Gold.m4a',
                    style = 'abstract photos')

L.hallucinate(file_name = './Broken_Heart_of_Gold/abstract_Broken_Heart_of_Gold.mp4')
              resolution = 360,
              start = 30, 
              duration = 45)
```

<video width="360" height="360" controls>
  <source src="/video/abstract_Broken_Heart_of_Gold.mp4" type="video/mp4">
</video> 

## チューニング・パラメータ - 仕組み

調整可能なパラメーターは30以上あり、音楽をどのようにビジュアル化するかについて、非常に柔軟に対応できます。しかし、ビジュアライザーがどのように機能するかを基本的に理解していれば、簡単に理解することができます。

### 仕組み

1. まず、出力画像に対応する入力ベクトルのバッチが初期化されます。これらのベクトル間の線形補間が生成され、これが「ベース」ベクトルとなります。
2. 3つのコンポーネントがオーディオに反応します。**Pulse**, **Motion**, **Class** です。これらは "基本 "ベクトルを適宜変更します。

  *   **Pulse**, これは文字通り、音楽のビートに合わせてビジュアルが「脈打つ」様子を指します。デフォルトでは、オーディオのパーカッシブな要素に反応するように設定されています。
  *   **Motion** 音楽によってビジュアルがどのように「押し出される」または「加速される」かを意味し、デフォルトではオーディオのハーモニックな要素に反応するように設定されています。
  *   Finally, **Class** , 生成された画像に表示されるオブジェクトのラベルを参照します（例えば、WikiArtスタイルの場合、クラスは、Van Gogh、Andy Warhol、Da Vinciなどを参照できます）。これは、オーディオのピッチに反応するように設定されており、各ノートがクラスの目立ち度をコントロールします。*注：* 利用可能なデフォルトのスタイルの中で、今のところクラスを使用しているのはWikiArtだけです。
3. 最後に、コントラストやフラッシュなどの追加効果を映像に加えます。これらはデフォルトではオーディオのパーカッシブな要素に反応するように設定されています。

### パラメータ

さて、パラメータは7つのカテゴリーに分けることで、簡単に理解することができます。初期化」、「パルス」、「モーション」、「クラス」、「エフェクト」、「ビデオ」、「その他」です。

これでもまだ圧倒されるという方は、まず、以下のチューニングを行うことをお勧めします。

**speed_fpm**, **pulse_react**, **motion_react** , **class_pitch_react**, 

上記のパラメータから構築していきます。これらのパラメータは、最大の違いをもたらします。

##### **初期化**

* **speed_fpm** (*Default: 12*) - FPMとは「Frames per Minute」の略です。これは、初期化されるイメージの数を決定するもので、多ければ多いほど、ビジュアルのモーフィングが速くなります。

もし， **speed_fpm = 0**, の場合、1つの画像だけが初期化され、その1つの画像がオーディオに反応します。この場合、オーディオの無音部分には動きがありません。

##### **パルスパラメータ**

*   **pulse_react** (*Default: 0.5*) - パルスの「強さ」を指定します。0～2の間で設定することをお勧めします。
*   **pulse_percussive** (*Default: True*) - もし，*pulse_harmonic*がFalseの時にTrueと指定した場合、pulseはオーディオのパーカッシブな要素に反応します。
*   **pulse_harmonic** (*Default: False*) - もし，*pulse_percussive*がFalseの時にTrueと指定した場合、パルスはオーディオのハーモニックな要素に反応します。

  *Note*: 両方のパラメータがTrueの場合、または両方のパラメータがFalseの場合、Pulseは変更されていない「全体」のオーディオに反応します。
*   **pulse_audio** - パルスの制御に使用する別のオーディオファイルへのパス。孤立したドラム/パーカッションのトラックを利用できる場合は、この方法をお勧めします。渡した場合、*pulse_percussive*と*pulse_harmonic*は無視されます。*Note:* このパラメータはLucidSonicDreamオブジェクトを定義する際に渡されます。

##### **モーションパラメータ**

*   **motion_react** (*0.5*), **motion_percussive** (*False*), **motion_harmonic** (*True*), and **motion_audio** - 単純に、上記のパルスパラメータの「動き」に相当するものです。 
*   **motion_randomness** (*Default: 0.5*)- 動きのランダム性の度合い。高い値を設定すると、同じ映像が繰り返し表示されるのを防ぐことができます。0から1の範囲で指定してください。
*   **truncation** (*Default: 1*) - 生成されるビジュアルの多様性をコントロールします。値が低いほどバラエティに富んでいます。*注意*。非常に低い値を設定すると、通常は「ぎらぎらした」ビジュアルになります。0から1の範囲で指定してください。

##### **クラスパラメータ** 

*(注：これらのパラメータの多くは、Matt Siegelman氏による[Deep Music Visualizer](https://github.com/msieg/deep-music-visualizer)プロジェクトに大きく影響されています)*

*   **classes** - 最大で12個の数値オブジェクトラベルのリスト。何もない場合は、12個のラベルがランダムに選択されます。
*   **dominant_classes_first** (*Default: False*)- Trueの場合、"classes "に渡されたリストは、降順で目立つようにソートされます。
*   **class_pitch_react** (*Default: 0.5*)- pulse_react、motion_reactに相当するクラスです。0～2の間で設定することをお勧めします。
*   **class_smooth_seconds** (*Default: 1*) - 各クラスのベクトル間をスムーズに補間するのにかかる秒数。この値が大きいほど、クラスの変化が「突然」ではなくなる。
*   **class_complexity** (*Default: 1*) - 
生成されるイメージの「complexity(複雑さ)」をコントロールします。低い値では、よりシンプルでありふれたイメージが生成され、高い値では、より複雑で奇妙なオブジェクトが生成される傾向があります。0〜1の間で設定することをお勧めします。
*   **class_shuffle_seconds** (*Default: None*) - ラベルとノートのマッピングを再構成するタイムスタンプを制御します。これは、使用するオーディオの音程の範囲が限られているが、より多くのクラスを表示したい場合に推奨されます。値に*n*という数字を指定すると、*n*秒ごとにクラスがシャッフルされます。値が数字のリストである場合、これらの数字はクラスがシャッフルされるタイムスタンプ（秒単位）として使用されます。
*   **class_shuffle_strength** (*Default: 0.5*) - クラスの再シャッフルの頻度を制御します。class_shuffle_secondsが指定された場合のみ適用されます。この値は0から1の間にしておくことをお勧めします。
*   **class_audio** - pulse_audioとmotion_audioに相当するクラスです。LucidSonicDreamオブジェクトを定義する際に渡されます。

##### **エフェクトパラメータ**

*   **contrast_strength** (*Default: 0.5*) - デフォルトのコントラスト効果の強さ。0～1の間で設定することをお勧めします。
*   **contrast_percussive** (*Default: True*) - trueの場合、オーディオのパーカッシブな要素に反応します。0から1の範囲でなければなりません。
*   **contrast_audio** - 以前の "audio "引数と同等のもの。LucidSonicDreamオブジェクトを定義する際に渡されます。

  *注*。これらの引数が何も渡されなかった場合、コントラスト効果は適用されません。

*   **flash_strength** (*0.5*), **flash_percussive** (*True*), and **flash_audio** - 前述の3つのパラメータに相当しますが、「フラッシュ」効果があります。これらの引数は0から1の間にしておくことをお勧めします。これらの引数が何も渡されない場合、フラッシュ効果は適用されません。
*   **custom_effects** - List of custom, user-defined effects to apply (See **B.4**)

##### **Video Parameters**

*   **resolution** - 自明のことです。トライアル」レンダリングには低解像度が推奨されます。何も渡されなかった場合は、修正されていない高解像度の画像が使用されます。
*   **start** (*Default: 0*) - 開始のタイムスタンプ（秒単位）
*   **duration** - ビデオの長さを秒単位で指定します。何も指定しない場合は、音声の長さが使用されます。
*   **output_audio** - ビデオの最終出力音声。song "パラメータが指定されている場合は、その音声を上書きします（**B.5**参照）
*   **fps** (*Default: 43*) - Video Frames Per Second. 
*   **save_frames** (*Default: False*) - trueの場合、すべての個別のビデオフレームをディスクに保存します。

##### **Other**

*   **batch_size** (*Default: 1*) - モデルに同時に供給されるベクターの数を決定します。一般的に、バッチサイズが大きいほど、明確に定義されていないイメージが出力されます。

### 例1：modern art
これはシンプルに、音に合わせて画像が変化します．

コードを実行しなくても、[ここ](https://youtu.be/ztWCMm9cExY)をクリックすれば、全編のサンプルビデオを見ることができます。

```python
L = LucidSonicDream('./Broken_Heart_of_Gold/Broken_Heart_of_Gold.m4a',
                    style = 'modern art')

L.hallucinate('./Broken_Heart_of_Gold/ModernArt_Broken_Heart_of_Gold.mp4',
              speed_fpm = 0,
              motion_percussive = True,
              motion_react = 0.8,
              contrast_strength = 0.5,
              flash_strength = 0.7)
```

<video width="360" height="360" controls>
  <source src="/video/ModernArt_Broken_Heart_of_Gold.mp4" type="video/mp4">
</video> 

### 例2：VisionaryArt.pkl
この例は、パルス、モーション、コントラスト、フラッシュの各反応を微妙に組み合わせて、全体的にトリッピーなスタイルを補完するシンプルな例です。

ここで使用されているスタイルウェイトは、**Jeremy Torman**氏によってトレーニングされたモデルから得られたものです。彼の作品は[Twitter](https://twitter.com/tormanjeremy)で見ることができますし、興味のある方は彼の[オリジナルのReddit投稿](https://www.reddit.com/r/deepdream/comments/leqwxs/stylegan2ada_pickle_file_in_comments_with_colab/)で詳細をご覧ください!

コードを実行しなくて元ネタのサンプルビデオを見るには[ここ](https://youtu.be/iEFqcMrszH0)をクリックしてください。

```python
# Download Style Weights 
# ! gdown --id 19hNptJSXji_9h7DMJBVlEMe-izWXvkYQ

L = LucidSonicDream(song = './Broken_Heart_of_Gold/Broken_Heart_of_Gold.m4a',
                    style = 'VisionaryArt.pkl')

L.hallucinate(file_name = './Broken_Heart_of_Gold/VisionaryArt_Broken_Heart_of_Gold.mp4',
              pulse_react = 1.2,
              motion_react = 0.7,
              contrast_strength = 0.5,
              flash_strength = 0.5)
```

<video width="360" height="360" controls>
  <source src="/video/VisionaryArt_Broken_Heart_of_Gold.mp4" type="video/mp4">
</video> 


## カスタムエフェクトの使用

エフェクト関数を定義し、それをEffectsGeneratorオブジェクトに渡すことで、独自のリアクティブなカスタムエフェクトをビデオに適用することができます（以下参照）。

エフェクト関数には、以下のパラメータを含める必要があります。

*   **array** - エフェクトが適用される画像配列を指します。
*   **strength** - pulse_react、contrast_strengthなどと同様の反応性パラメータ。
*   **amplitude** - ある時点でのオーディオの音量を指します。これを、エフェクトの「強さ」をコントロールするパラメータに掛けるだけです。

この関数は，出力画像を表す NumPy 配列を出力する必要があります．

この関数は，EffectsGenerator オブジェクトに渡され，次のようなパラメータを持ちます．

*   **func** - エフェクト機能
*   **audio** - エフェクトをコントロールするオーディオ
*   **strength** - 効果の強さ
*   **percussive** - Trueの場合、エフェクトはオーディオのパーカッシブな要素に反応します。

下の例で使われている曲は、**Ekali**のUnfaithです。フルトラックは[YouTube](https://youtu.be/8C4wgzP1KOI)または[Spotify](https://open.spotify.com/track/5UC6HF9VVgYMHQ7PcwcZNZ?si=hCIA2JMTQTC98zzPZfA3yQ)で聴くことができます。 

[ここ](https://youtu.be/V7jo281HSwM)をクリックすると、コードを実行することなくサンプルビデオを見ることができます。

```python
import numpy as np 
from skimage.transform import swirl
from lucidsonicdreams import EffectsGenerator
from lucidsonicdreams import LucidSonicDream

def swirl_func(array, strength, amplitude):
  swirled_image = swirl(array, 
                        rotation = 0, 
                        strength = 100 * strength * amplitude,
                        radius=650)
  return (swirled_image*255).astype(np.uint8)

swirl_effect = EffectsGenerator(swirl_func,
                                audio = './Broken_Heart_of_Gold/Broken_Heart_of_Gold.m4a', 
                                strength = 0.2, 
                                percussive = False)

L = LucidSonicDream('./Broken_Heart_of_Gold/Broken_Heart_of_Gold.m4a',
                    style = 'textures')

L.hallucinate('./Broken_Heart_of_Gold/textures_Broken_Heart_of_Gold.mp4',
              motion_react = 0.15,
              speed_fpm = 2,
              pulse_react = 1.5,
              contrast_strength = 1,
              flash_strength = 1, 
              custom_effects = [swirl_effect])
```

<video width="360" height="360" controls>
  <source src="/video/textures_Broken_Heart_of_Gold.mp4" type="video/mp4">
</video> 

## カスタム可視化関数の使用

最後に、StyleGANを使用せず、代わりにベクトルのバッチを取り込んでPillow画像を出力する任意のカスタム関数を定義することができます。この関数には、**noise_batch**と**class_batch**のパラメータが必要です。また、LucidSonicDreamオブジェクトを定義する際には、**num_possible_classes**と**input_size**を渡す必要があります。

以下の例では、Matt Siegelman氏による[Deep Music Visualizer](https://github.com/msieg/deep-music-visualizer)プロジェクトと同様に、事前に学習されたBigGANのPyTorch実装を用いてカスタム関数を定義しています。各クラスの数値ラベルは[こちら](https://gist.github.com/yrevar/942d3a0ac09ec9e5eb3a)にあります。

使用した曲は、Porter Robinson**の**Sea of Voicesです。この曲は[YouTube](https://www.youtube.com/watch?v=lSooYPG-5Rg)や[Spotify](https://open.spotify.com/track/2lNFWUrxuNaQsf5I1pDTPr?si=MsD7GJUsRma4mkyfjbEhJg)で聴くことができます。なお、ボーカルが動きに影響を与えないようにするため、入力には[インストゥルメンタルバージョン]（https://youtu.be/2Bo0JqTmVwg）を使用しています。

[こちら](https://youtu.be/_TJCql7O9kU?t=180)をクリックすると、コードを実行しなくても全編のサンプル映像を見ることができます。

```python
!pip install pytorch_pretrained_biggan

from pytorch_pretrained_biggan import BigGAN, convert_to_images
import torch

biggan = BigGAN.from_pretrained('biggan-deep-512')
biggan.to('cuda:0')

def biggan_func(noise_batch, class_batch):
  noise_tensor = torch.from_numpy(noise_batch).cuda()
  class_tensor = torch.from_numpy(class_batch).cuda()
  with torch.no_grad():
    output_tensor = biggan(noise_tensor.float(), class_tensor.float(), truncation = 1)
  return convert_to_images(output_tensor.cpu())

L = LucidSonicDream('./Broken_Heart_of_Gold/Broken_Heart_of_Gold.m4a',
                    style = biggan_func, 
                    input_shape = 128, 
                    num_possible_classes = 1000)

L.hallucinate('./Broken_Heart_of_Gold/biggan_Broken_Heart_of_Gold.mp4',
              output_audio = './Broken_Heart_of_Gold/Broken_Heart_of_Gold.m4a',
              speed_fpm = 3,
              classes = [13, 14, 22, 24, 301, 84, 99, 100, 134, 143, 393, 394],
              class_shuffle_seconds = 10, 
              class_shuffle_strength = 0.1,
              class_complexity = 0.5,
              class_smooth_seconds = 4,
              motion_react = 0.35,
              flash_strength = 1,
              contrast_strength = 1)
```

<video width="360" height="360" controls>
  <source src="/video/biggan_Broken_Heart_of_Gold.mp4" type="video/mp4">
</video> 

## 番外編：
※音楽ファイル(m4a, mp3, ex)1つでは，実行できないものです．

この例では、複数のオーディオトラックを使用し、パラメータをより細かく調整することで、より複雑な例となっています。この例では、パルス、クラス、コントラストの反応をより鮮明にするために、独立したオーディオトラックを利用しています。

注：WikiArtスタイルを使ったクラスの数値ラベルは[こちら](https://colab.research.google.com/github/Norod/my-colab-experiments/blob/master/WikiArt_Example_Generation_By_Peter_Baylies.ipynb)にあります。

[ここ](https://youtu.be/l-nGC-ve7sI)をクリックすると、コードを実行しなくてもフルレングスのサンプルビデオを見ることができます。

```python
# Main File(lucidsonicdreams_main.mp3)
!gdown --id 1Vc2yC2F5iO0ScC5F0CzF_YB1YPGI2uUP

# Pulse File(lucidsonicdreams_paule.mp3)
!gdown --id 1FY5MO6XqVu9abbdNQQY6C99RHxFGm36o

# Class File(lucidsonicdreams_class.mp3)
!gdown --id 1-qwcs8_Va58YqkHMdXDm9uef-RcH01gh
```


```python
L = LucidSonicDream(song = 'lucidsonicdreams_main.mp3',
                    pulse_audio = 'lucidsonicdreams_pulse.mp3',
                    class_audio = 'lucidsonicdreams_class.mp3',
                    contrast_audio = 'lucidsonicdreams_pulse.mp3',
                    style = 'wikiart')

L.hallucinate('lucidsonicdreams.mp4',
              resolution = 360,
              start = 32, 
              duration = 60, 
              pulse_react = 0.25,
              motion_react = 0,
              classes = [1,5,9,16,23,27,28,30,50,68,71,89],
              dominant_classes_first = True,
              class_shuffle_seconds = 8,
              class_smooth_seconds = 4,
              class_pitch_react = 0.2,
              contrast_strength = 0.3, 
              flash_strength = 0.1)
```

<video width="360" height="360" controls>
  <source src="/video/lucidsonicdreams.mp4" type="video/mp4">
</video> 

## まとめ
音楽に合わせて画像を変化させる「Lucid Sonic Dreams」を実装しました．<br>


## 参考サイト
[mikaelalafriz/lucid-sonic-dreams](https://github.com/mikaelalafriz/lucid-sonic-dreams.git)

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>