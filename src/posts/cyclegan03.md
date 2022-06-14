---
display: home
title: 'Python + CycleGanでオリジナルデータでの学習を実装する(番外編)'
description: Python + CycleGanでオリジナルデータでの学習について，追加情報を記述します．
date: 2021-12-18
image: https://www.hamlet-engineer.com/image/gan_mhw.png
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - CycleGAN
  - GAN
---
Python + CycleGanでオリジナルデータでの学習について，追加情報を記述します．<br>

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

最終的に，実写モンハンのディアブロス亜種を原種に戻す試みをします．
![](/image/diablos_black.jpg)

[[toc]]

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">


## 学習経過の観察
学習を止めないために「display_id 0」としているので、学習中にlossの変化をグラフで可視化できません。

そのため、本稿では`./checkpoints/＊＊＊/web/images`内にある各epochでの変換結果を見て、学習経過を観察します。

`./checkpoints/＊＊＊/web/images`内の画像は，下記の4種類が各epochでA・Bそれぞれで出力されます。
- ＊＊_real_A(or B).png：変換前の画像
- ＊＊_fake_A(or B).png：変換後の画像
- ＊＊_rec_A(or B).png：変換後の画像からモデルで復元した画像。real→fake→recという復元の流れとなる。復元できているほど良い。recはreconstruction(復元)を指す。
- ＊＊_idt_A(or B).png：A→B(or B→A)の変換にA(or B)の画像をいれた時の画像。画像が変換されず保持されていると良い。idtはidentity(同一性)を指す。

lossは、`./checkpoints/diablos_gan/loss_log.txt`に記述されています。そこで、loss_log.txtを読み込んでlossの可視化を実行します。

## CycleGANのloss
CycleGANのlossは下記の4種類です。
- Adversarial Loss「loss_D_A(or B)」：Discriminatorが本物画像を本物し、偽物画像を偽物と判別することを評価するloss
- Adversarial Loss「loss_G_A(or B)」：Generator(生成モデル)が生成した偽物の画像（A or B)をDiscriminator(判別モデル)に本物と判定させることを評価するloss
- Cycle Consistency Loss「loss_cycle_A(or B)」：real_A→fake_B(or real_B→fake_A)に変換した後に、fake_A→real_B(or fake_B→real_A)へと復元できるかを評価するloss(1番重要なloss)
- Identity Mapping Loss「loss_idt_A(or B)」：A→B(or B→A)の変換にA(or B)の画像をいれて、画像が変換されず保持されていることを評価するloss

## lossの観察
下記のコードでlossのグラフを閲覧することができますが、Google Colaboratoryでは今回グラフを表示するライブラリの「visdom」が機能しませんので、他の方法を使います。

```python
# ディレクトリの移動
%cd /content/drive/My\ Drive/diablos_gan/pytorch-CycleGAN-and-pix2pix
!python -m visdom.server
```

下記のコードでまず、グラフを描画できるようにデータ整理を実行します。
```python
# ディレクトリの移動
%cd /content/drive/My\ Drive/diablos_gan/pytorch-CycleGAN-and-pix2pix
```

```python
import pandas as pd

# lossのテキストファイル
loss_txt = "./checkpoints/diablos_gan/loss_log.txt"

# テキストファイルの読み込み
f = open(loss_txt, 'r')
datalist = f.readlines()
f.close()

# 2行目を辞書型に変換
dict_txt = datalist[1].replace(",", "").replace(": ", "\":").replace(" ", ", \"").replace(")", "").replace("(", "{\"").replace(", \"\n", "}")
loss_dict = eval(dict_txt) # 文字列でのコード実行
# データフレーム型に変換
df_loss = pd.DataFrame(loss_dict,index=[0,])

# 2行目以降の処理
for i in range(2, len(datalist)):
    # 2行目以降を辞書型に変換
    dict_txt = datalist[i].replace(",", "").replace(": ", "\":").replace(" ", ", \"").replace(")", "").replace("(", "{\"").replace(", \"\n", "}")
    loss_dict = eval(dict_txt) # 文字列でのコード実行
    # データフレーム型に変換
    df_dict = pd.DataFrame(loss_dict,index=[i-1,])
    # df_lossに結合
    df_loss = pd.concat([df_loss, df_dict], axis=0)

# indexを追加
df_loss = df_loss.reset_index()
display(df_loss.head())
```

下記のコードでlossの可視化を実行します。

出力結果より、「Cycle Consistency Loss(loss_cycle_A・loss_cycle_B)」を見ると、lossが徐々に下がる傾向にあるので、学習は進んでいることがわかります。

```python
import matplotlib.pyplot as plt
import seaborn as sns
sns.set(style='darkgrid')

# 4行2列のグラフを作成
fig, ((ax1, ax2), (ax3, ax4), (ax5, ax6), (ax7, ax8)) = plt.subplots(4, 2, figsize=(18,24))

# Adversarial Loss(D)
sns.lineplot(x='index', y='D_A', data=df_loss, ax=ax1).set_title('loss_D_A')
sns.lineplot(x='index', y='D_B', data=df_loss, ax=ax2).set_title('loss_D_B')
# Adversarial Loss(G)
sns.lineplot(x='index', y='G_A', data=df_loss, ax=ax3).set_title('loss_G_A')
sns.lineplot(x='index', y='G_B', data=df_loss, ax=ax4).set_title('loss_G_B')
# Cycle Consistency Loss
sns.lineplot(x='index', y='cycle_A', data=df_loss, ax=ax5).set_title('loss_cycle_A')
sns.lineplot(x='index', y='cycle_B', data=df_loss, ax=ax6).set_title('loss_cycle_B')
# Identity Mapping Loss
sns.lineplot(x='index', y='idt_A', data=df_loss, ax=ax7).set_title('loss_idt_A')
sns.lineplot(x='index', y='idt_B', data=df_loss, ax=ax8).set_title('loss_idt_B')

plt.show()
```

## 学習時の引数
下記に学習時の引数の意味を示します。
- dataroot：CycleGANで学習するデータセット
- n_epochs：初期学習率(0.0002)で学習するエポック数
- n_epochs_decay：学習率を下げるエポック数(n_epochsに加算されます)
- name：モデルを保存するための、`./checkpoints`の中でのディレクトリ名
- model：モデルの学習方法の指定
- display_id：学習経過の可視化の設定です。0にしないと、途中で学習が止まります。
- gpu_ids：使用するGPUのID
- no_dropout：デフォルトで`no_dropout`となります。過学習を防ぐドロップアウトを使用しないフラグ。テスト実行時も、モデル学習の設定に合わせる必要があります。

学習画像は、デフォルトで256x256の正方形に変換されます。

学習画像のサイズとアスペクト比を保持したい場合は、下記の引数で設定します。

- preprocess：前処理の設定です。デフォルトでは、256x256の正方形に変換されます。また、いくつかのフラグがありますが、noneにすると、変換画像のサイズとアスペクト比を保持されます。

ただし、「preprocess none」では、GPUの負荷も重くなり、他のモデルで「1920x1280」と「1080x720」の画像を変換した時は、ColabのハイメモリーGPUでもメモリーオーバーしました。

また、学習率への理解は、モデルを修正する幅と捉えてください。

下記のコードでは、初期学習率(0.0002)という一定の幅で10epoch分(n_epochs)だけモデルをざっくり修正していって、最後の100epoch分(n_epochs_decay)分は小さい幅で微調整の修正をするイメージです。


```python
# ディレクトリの移動
%cd /content/drive/My\ Drive/diablos_gan/pytorch-CycleGAN-and-pix2pix
# オリジナルデータの学習
!python train.py --dataroot ./datasets/diablos_gan \
                 --n_epochs  30 \
                 --n_epochs_decay 10 \
                 --name diablos_gan \
                 --model cycle_gan \
                 --display_id 0 --gpu_ids 0
```

## 学習を途中から再開する場合
学習を途中から再開する場合、下記のコードを参考にしてください。

下記のコードでは、「50epoch時点から100epochまで初期学習率で学習して、学習率を下げて更に50epoch分学習させる」場合を想定して記述しています。

下記に引数の意味を示します。
- epoch_count：途中から学習を開始するepoch数
- continue_train：途中から学習を始める場合のフラグ

```python
# ディレクトリの移動
%cd /content/drive/My\ Drive/diablos_gan/pytorch-CycleGAN-and-pix2pix
# オリジナルデータの学習
!python train.py --dataroot ./datasets/diablos_gan \
                 --n_epochs  100 \
                  --n_epochs_decay 50 \
                 --name diablos_gan \
                 --model cycle_gan \
                 --display_id 0 --gpu_ids 0 \
                 --epoch_count 50 --continue_train
```

## 変換時の引数
下記に変換時の引数の意味を示します。
- name：変換モデル名(/checkpointsの中にある変換モデルのディレクトリ名)。変換モデルの名前はlatest_net_G.pthとしてください。<br>
Aのデータ -> Bのデータに変換するモデルは`＊＊＊_G_A.pth`で、Bのデータ -> Aのデータに変換するのモデルは`＊＊＊_G_B.pth`です。<br>
※「Aのデータ」は白黒画像、「Bのデータ」はカラー画像です。
--results_dir：変換後の画像を格納するディレクトリ名(`./results_dirの引数/nameの引数/`に格納される)
- preprocess：前処理の設定です。デフォルトでは、256x256の正方形に変換されます。また、いくつかのフラグがありますが、noneにすると、変換画像のサイズとアスペクト比を保持されます。
- model：変換を実行する場合はtestと記述する。
- no_dropout：学習時で`no_dropout`となっています。過学習を防ぐドロップアウトを使用しないフラグ。テスト実行時も、モデル学習の設定に合わせる必要があります。

ただし、「preprocess none」では、GPUの負荷も重くなり、他のモデルで「1920x1280」と「1080x720」の画像を変換した時は、ColabのハイメモリーGPUでもメモリーオーバーしました。




## まとめ
Python + CycleGanでオリジナルデータでの学習について，追加情報を記述しました．

## 参考サイト
[junyanz/pytorch-CycleGAN-and-pix2pix](https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix)<br>

[PyTorch (15) CycleGAN (horse2zebra)](https://aidiary.hatenablog.com/entry/20180324/1521896184)

[浮世絵風の動画をつくってみる【CycleGAN】](https://farml1.com/cyclegan_ukiyoe_movie/)

[Python の eval と exec](https://qiita.com/kyoshidajp/items/57ae371b3f5d8a84fb13)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>