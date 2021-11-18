---
display: home
title: 'Python + CycleGAN-VC2で音質変換を実装する'
description: Clubhouseの影響で音質系に興味を持ちました．本稿では，Python + CycleGAN-VC2で音質変換を実施します．
date: 2021-08-31
image: https://www.hamlet-engineer.com/image/VC.png
categories: 
  - Python
tags:
  - Python
  - Google Colab
  - Jupyter
  - CycleGan
  - GAN
  - 音声変換
---

Clubhouseの影響で音質系に興味を持ちました．本稿では，Python + CycleGAN-VC2で音質変換を実施します．<br>

<!-- more -->

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

最終的に，日本語のオリジナルデータでの実装を目指します．

[[toc]]

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

## Google Colabのファイル構成
プロジェクトディレクトリはCycleGAN-VC2としています．度々，省略しています．
```init
CycleGAN-VC2
├── /Pytorch-CycleGAN-VC2
│   ├── /data
│   │   ├── /vcc2016_training <- 学習データ
│   │   ├── /evaluation_all <- 評価データ
│   │   └── /converted_sound <- 変換したデータ
│   ├── /cache
│   │   ├── coded_sps_A_norm.pickle <- 前処理後のデータ
│   │   ├── coded_sps_B_norm.pickle <- 前処理後のデータ
│   │   ├── logf0s_normalization.npz <- 前処理後のデータ
│   │   ├── mcep_normalization.npz <- 前処理後のデータ
│   │   └── /0523_model_checkpoint <- モデルの保存先
│   │        └── _CycleGAN_CheckPoint <- 出力最新モデル
│   ├── train.py
│   ├── test.py
│   ├── download.py
│   └── (省略)
└── Pytorch_CycleGAN_VC2.ipynb <- 実行用ノートブック
```

## Google Driveと連携
Google ColabとGoogle Driveを連携させて，gitから[TaiChunYen/Pytorch-CycleGAN-VC2](https://github.com/TaiChunYen/Pytorch-CycleGAN-VC2)をダウンロードします．<br>


```python
# Google ColabとGoogle Driveを連携
from google.colab import drive
drive.mount('/content/drive')
```

```bash
%%bash
# ディレクトリの移動
cd /content/drive/My\ Drive/CycleGAN-VC2
# gitのダウンロード
# git clone https://github.com/TaiChunYen/Pytorch-CycleGAN-VC2.git
ls
```


## モジュールのインストール
以下のコード実装で必要なモジュールのインストールをインストールします．


```python
!pip install pyworld
!pip install librosa==0.7.2
!pip install numba==0.48.0
```


### GPU起動の確認
以下のコードでGPUが起動するか確認します．


```python
import os
import torch

# os.environ["CUDA_VISIBLE_DEVICES"] = "3"

print('===========================')
print(torch.__version__)
print(torch.cuda.current_device())
if torch.cuda.is_available():
    print(torch.cuda.is_available())
    print('GPU available')
else:
    print(torch.cuda.is_available())
    print('Please set GPU via Edit -> Notebook Settings.')
```


## 学習データの準備(サンプルデータ)
サンプルデータとして，vcc2016という公開データからダウンロードして，学習データ・評価データを用意しました．

gitのままだとエラーが発生したので，download.pyに以下のコードを追記してください．
```python
# download.pyの31行目付近
def maybe_download(filename, url, destination_dir, expected_bytes=None, force=False):
    import ssl
    ssl._create_default_https_context = ssl._create_unverified_context
```

以下のコードで，データのダウンロードをします．

```python
!python download.py --download_dir ./download --data_dir ./data --datasets vcc2016
```


## preprocess(前処理)
学習にあたり，以下のコードで前処理を実装します．

音声データwavを学習できるように，numpy形式へ変換します．


```python
!python preprocess_training.py --train_A_dir ./data/vcc2016_training/SF1 \
                               --train_B_dir ./data/vcc2016_training/TM1 \
                               --cache_folder ./cache/
```


## train.pyの上書き
train.pyで自分が使いやすいように，変更します．

以下のコード(%%writefile ***.py)で，train.pyの上書きを実施します．


```python
# train.pyの書き込み
%%writefile train.py

import os
import numpy as np
import argparse
import torch
import time
import librosa
import pickle

import preprocess
from trainingDataset import trainingDataset
from model_VC2 import Generator, Discriminator


class CycleGANTraining:
    def __init__(self,
                 logf0s_normalization,
                 mcep_normalization,
                 coded_sps_A_norm,
                 coded_sps_B_norm,
                 model_checkpoint,
                 num_epochs,
                 save_epoch,
                 stock_epoch,
                 validation_A_dir,
                 output_A_dir,
                 validation_B_dir,
                 output_B_dir,
                 restart_training_at=None):
        self.start_epoch = 0
        self.num_epochs = num_epochs #10000
        self.mini_batch_size = 16
        self.dataset_A = self.loadPickleFile(coded_sps_A_norm)
        self.dataset_B = self.loadPickleFile(coded_sps_B_norm)
        self.device = torch.device(
            'cuda' if torch.cuda.is_available() else 'cpu')

        # Speech Parameters
        logf0s_normalization = np.load(logf0s_normalization)
        self.log_f0s_mean_A = logf0s_normalization['mean_A']
        self.log_f0s_std_A = logf0s_normalization['std_A']
        self.log_f0s_mean_B = logf0s_normalization['mean_B']
        self.log_f0s_std_B = logf0s_normalization['std_B']

        mcep_normalization = np.load(mcep_normalization)
        self.coded_sps_A_mean = mcep_normalization['mean_A']
        self.coded_sps_A_std = mcep_normalization['std_A']
        self.coded_sps_B_mean = mcep_normalization['mean_B']
        self.coded_sps_B_std = mcep_normalization['std_B']

        # Generator and Discriminator
        self.generator_A2B = Generator().to(self.device)
        self.generator_B2A = Generator().to(self.device)
        self.discriminator_A = Discriminator().to(self.device)
        self.discriminator_B = Discriminator().to(self.device)

        # Loss Functions
        criterion_mse = torch.nn.MSELoss()

        # Optimizer
        g_params = list(self.generator_A2B.parameters()) + \
            list(self.generator_B2A.parameters())
        d_params = list(self.discriminator_A.parameters()) + \
            list(self.discriminator_B.parameters())

        # Initial learning rates
        self.generator_lr = 0.0002
        self.discriminator_lr = 0.0001

        # Learning rate decay
        self.generator_lr_decay = self.generator_lr / 200000
        self.discriminator_lr_decay = self.discriminator_lr / 200000

        # Starts learning rate decay from after this many iterations have passed
        self.start_decay = 12500

        self.generator_optimizer = torch.optim.Adam(
            g_params, lr=self.generator_lr, betas=(0.5, 0.999))
        self.discriminator_optimizer = torch.optim.Adam(
            d_params, lr=self.discriminator_lr, betas=(0.5, 0.999))

        # To Load save previously saved models
        self.modelCheckpoint = model_checkpoint
        os.makedirs(model_checkpoint, exist_ok=True)

        # Validation set Parameters
        self.validation_A_dir = validation_A_dir
        self.output_A_dir = output_A_dir
        self.validation_B_dir = validation_B_dir
        self.output_B_dir = output_B_dir

        # Storing Discriminatior and Generator Loss
        self.generator_loss_store = []
        self.discriminator_loss_store = []

        self.file_name = 'log_store_non_sigmoid.txt'
        
        # Setting save model epch 
        self.save_epoch = save_epoch
        self.stock_epoch = stock_epoch

        if restart_training_at is not None:
            # Training will resume from previous checkpoint
            self.start_epoch = self.loadModel(restart_training_at)
            print("Training resumed")

    def adjust_lr_rate(self, optimizer, name='generator'):
        if name == 'generator':
            self.generator_lr = max(
                0., self.generator_lr - self.generator_lr_decay)
            for param_groups in optimizer.param_groups:
                param_groups['lr'] = self.generator_lr
        else:
            self.discriminator_lr = max(
                0., self.discriminator_lr - self.discriminator_lr_decay)
            for param_groups in optimizer.param_groups:
                param_groups['lr'] = self.discriminator_lr

    def reset_grad(self):
        self.generator_optimizer.zero_grad()
        self.discriminator_optimizer.zero_grad()

    def train(self):
        # Training Begins
        for epoch in range(self.start_epoch, self.num_epochs+1):
            start_time_epoch = time.time()

            # Constants
            cycle_loss_lambda = 10
            identity_loss_lambda = 5
            #if epoch>20:#
                #cycle_loss_lambda = 15#
                #identity_loss_lambda = 0#

            # Preparing Dataset
            n_samples = len(self.dataset_A)

            dataset = trainingDataset(datasetA=self.dataset_A,
                                      datasetB=self.dataset_B,
                                      n_frames=128)
            train_loader = torch.utils.data.DataLoader(dataset=dataset,
                                                       batch_size=self.mini_batch_size,
                                                       shuffle=True,
                                                       drop_last=False)

            for i, (real_A, real_B) in enumerate(train_loader):

                num_iterations = (
                    n_samples // self.mini_batch_size) * epoch + i
                # print("iteration no: ", num_iterations, epoch)

                if num_iterations > 10000:
                    identity_loss_lambda = 0
                if num_iterations > self.start_decay:
                    self.adjust_lr_rate(
                        self.generator_optimizer, name='generator')
                    self.adjust_lr_rate(
                        self.generator_optimizer, name='discriminator')

                real_A = real_A.to(self.device).float()
                real_B = real_B.to(self.device).float()

                # Generator Loss function

                fake_B = self.generator_A2B(real_A)
                cycle_A = self.generator_B2A(fake_B)

                fake_A = self.generator_B2A(real_B)
                cycle_B = self.generator_A2B(fake_A)

                identity_A = self.generator_B2A(real_A)
                identity_B = self.generator_A2B(real_B)

                d_fake_A = self.discriminator_A(fake_A)
                d_fake_B = self.discriminator_B(fake_B)

                # Generator Cycle loss
                cycleLoss = torch.mean(
                    torch.abs(real_A - cycle_A)) + torch.mean(torch.abs(real_B - cycle_B))

                # Generator Identity Loss
                identiyLoss = torch.mean(
                    torch.abs(real_A - identity_A)) + torch.mean(torch.abs(real_B - identity_B))

                # Generator Loss
                generator_loss_A2B = torch.mean((1 - d_fake_B) ** 2)
                generator_loss_B2A = torch.mean((1 - d_fake_A) ** 2)

                # Total Generator Loss
                generator_loss = generator_loss_A2B + generator_loss_B2A + \
                    cycle_loss_lambda * cycleLoss + identity_loss_lambda * identiyLoss
                self.generator_loss_store.append(generator_loss.item())

                # Backprop for Generator
                self.reset_grad()
                generator_loss.backward()

                # if num_iterations > self.start_decay:  # Linearly decay learning rate
                #     self.adjust_lr_rate(
                #         self.generator_optimizer, name='generator')

                self.generator_optimizer.step()

                # Discriminator Loss Function

                # Discriminator Feed Forward
                d_real_A = self.discriminator_A(real_A)
                d_real_B = self.discriminator_B(real_B)

                generated_A = self.generator_B2A(real_B)
                d_fake_A = self.discriminator_A(generated_A)

                generated_B = self.generator_A2B(real_A)
                d_fake_B = self.discriminator_B(generated_B)

                # Loss Functions
                d_loss_A_real = torch.mean((1 - d_real_A) ** 2)
                d_loss_A_fake = torch.mean((0 - d_fake_A) ** 2)
                d_loss_A = (d_loss_A_real + d_loss_A_fake) / 2.0

                d_loss_B_real = torch.mean((1 - d_real_B) ** 2)
                d_loss_B_fake = torch.mean((0 - d_fake_B) ** 2)
                d_loss_B = (d_loss_B_real + d_loss_B_fake) / 2.0

                # Final Loss for discriminator
                d_loss = (d_loss_A + d_loss_B) / 2.0
                self.discriminator_loss_store.append(d_loss.item())

                # Backprop for Discriminator
                self.reset_grad()
                d_loss.backward()

                # if num_iterations > self.start_decay:  # Linearly decay learning rate
                #     self.adjust_lr_rate(
                #         self.discriminator_optimizer, name='discriminator')

                self.discriminator_optimizer.step()
                if num_iterations % 50 == 0:
                    store_to_file = "Iter:{}\t Generator Loss:{:.4f} Discrimator Loss:{:.4f} \tGA2B:{:.4f} GB2A:{:.4f} G_id:{:.4f} G_cyc:{:.4f} D_A:{:.4f} D_B:{:.4f}".format(
                        num_iterations, generator_loss.item(), d_loss.item(), generator_loss_A2B, generator_loss_B2A, identiyLoss, cycleLoss, d_loss_A, d_loss_B)
                    print("Iter:{}\t Generator Loss:{:.4f} Discrimator Loss:{:.4f} \tGA2B:{:.4f} GB2A:{:.4f} G_id:{:.4f} G_cyc:{:.4f} D_A:{:.4f} D_B:{:.4f}".format(
                        num_iterations, generator_loss.item(), d_loss.item(), generator_loss_A2B, generator_loss_B2A, identiyLoss, cycleLoss, d_loss_A, d_loss_B))
                    self.store_to_file(store_to_file)
            end_time = time.time()
            store_to_file = "Epoch: {} Generator Loss: {:.4f} Discriminator Loss: {}, Time: {:.2f}\n\n".format(
                epoch, generator_loss.item(), d_loss.item(), end_time - start_time_epoch)
            self.store_to_file(store_to_file)
            print("Epoch: {} Generator Loss: {:.4f} Discriminator Loss: {}, Time: {:.2f}\n\n".format(
                epoch, generator_loss.item(), d_loss.item(), end_time - start_time_epoch))
                
                
            if epoch % self.save_epoch == 0 and epoch != 0:
                # Save the Entire model
                print("Saving model Checkpoint  ......")
                store_to_file = "Saving model Checkpoint  ......"
                self.store_to_file(store_to_file)
                self.saveModelCheckPoint(epoch, '{}'.format(
                    self.modelCheckpoint + '_CycleGAN_CheckPoint'))
                if epoch % self.stock_epoch == 0 and epoch != 0:
                    self.saveModelCheckPoint(epoch, '{}'.format(
                        self.modelCheckpoint + '_CycleGAN_CheckPoint' + str(epoch)))
                print("Model Saved!")

            if epoch % self.save_epoch == 0 and epoch != 0:
                # Validation Set
                validation_start_time = time.time()
                self.validation_for_A_dir()
                self.validation_for_B_dir()
                validation_end_time = time.time()
                store_to_file = "Time taken for validation Set: {}".format(
                    validation_end_time - validation_start_time)
                self.store_to_file(store_to_file)
                print("Time taken for validation Set: {}".format(
                    validation_end_time - validation_start_time))

    def validation_for_A_dir(self):
        num_mcep = 24
        sampling_rate = 16000
        frame_period = 5.0
        n_frames = 128
        validation_A_dir = self.validation_A_dir
        output_A_dir = self.output_A_dir

        print("Generating Validation Data B from A...")
        for file in os.listdir(validation_A_dir):
            filePath = os.path.join(validation_A_dir, file)
            wav, _ = librosa.load(filePath, sr=sampling_rate, mono=True)
            wav = preprocess.wav_padding(wav=wav,
                                         sr=sampling_rate,
                                         frame_period=frame_period,
                                         multiple=4)
            f0, timeaxis, sp, ap = preprocess.world_decompose(
                wav=wav, fs=sampling_rate, frame_period=frame_period)
            f0_converted = preprocess.pitch_conversion(f0=f0,
                                                       mean_log_src=self.log_f0s_mean_A,
                                                       std_log_src=self.log_f0s_std_A,
                                                       mean_log_target=self.log_f0s_mean_B,
                                                       std_log_target=self.log_f0s_std_B)
            coded_sp = preprocess.world_encode_spectral_envelop(
                sp=sp, fs=sampling_rate, dim=num_mcep)
            coded_sp_transposed = coded_sp.T
            coded_sp_norm = (coded_sp_transposed -
                             self.coded_sps_A_mean) / self.coded_sps_A_std
            coded_sp_norm = np.array([coded_sp_norm])

            if torch.cuda.is_available():
                coded_sp_norm = torch.from_numpy(coded_sp_norm).cuda().float()
            else:
                coded_sp_norm = torch.from_numpy(coded_sp_norm).float()

            coded_sp_converted_norm = self.generator_A2B(coded_sp_norm)
            coded_sp_converted_norm = coded_sp_converted_norm.cpu().detach().numpy()
            coded_sp_converted_norm = np.squeeze(coded_sp_converted_norm)
            coded_sp_converted = coded_sp_converted_norm * \
                self.coded_sps_B_std + self.coded_sps_B_mean
            coded_sp_converted = coded_sp_converted.T
            coded_sp_converted = np.ascontiguousarray(coded_sp_converted)
            decoded_sp_converted = preprocess.world_decode_spectral_envelop(
                coded_sp=coded_sp_converted, fs=sampling_rate)
            wav_transformed = preprocess.world_speech_synthesis(f0=f0_converted,
                                                                decoded_sp=decoded_sp_converted,
                                                                ap=ap,
                                                                fs=sampling_rate,
                                                                frame_period=frame_period)
            librosa.output.write_wav(path=os.path.join(output_A_dir, os.path.basename(file)),
                                     y=wav_transformed,
                                     sr=sampling_rate)

    def validation_for_B_dir(self):
        num_mcep = 24
        sampling_rate = 16000
        frame_period = 5.0
        n_frames = 128
        validation_B_dir = self.validation_B_dir
        output_B_dir = self.output_B_dir

        print("Generating Validation Data A from B...")
        for file in os.listdir(validation_B_dir):
            filePath = os.path.join(validation_B_dir, file)
            wav, _ = librosa.load(filePath, sr=sampling_rate, mono=True)
            wav = preprocess.wav_padding(wav=wav,
                                         sr=sampling_rate,
                                         frame_period=frame_period,
                                         multiple=4)
            f0, timeaxis, sp, ap = preprocess.world_decompose(
                wav=wav, fs=sampling_rate, frame_period=frame_period)
            f0_converted = preprocess.pitch_conversion(f0=f0,
                                                       mean_log_src=self.log_f0s_mean_B,
                                                       std_log_src=self.log_f0s_std_B,
                                                       mean_log_target=self.log_f0s_mean_A,
                                                       std_log_target=self.log_f0s_std_A)
            coded_sp = preprocess.world_encode_spectral_envelop(
                sp=sp, fs=sampling_rate, dim=num_mcep)
            coded_sp_transposed = coded_sp.T
            coded_sp_norm = (coded_sp_transposed -
                             self.coded_sps_B_mean) / self.coded_sps_B_std
            coded_sp_norm = np.array([coded_sp_norm])

            if torch.cuda.is_available():
                coded_sp_norm = torch.from_numpy(coded_sp_norm).cuda().float()
            else:
                coded_sp_norm = torch.from_numpy(coded_sp_norm).float()

            coded_sp_converted_norm = self.generator_B2A(coded_sp_norm)
            coded_sp_converted_norm = coded_sp_converted_norm.cpu().detach().numpy()
            coded_sp_converted_norm = np.squeeze(coded_sp_converted_norm)
            coded_sp_converted = coded_sp_converted_norm * \
                self.coded_sps_A_std + self.coded_sps_A_mean
            coded_sp_converted = coded_sp_converted.T
            coded_sp_converted = np.ascontiguousarray(coded_sp_converted)
            decoded_sp_converted = preprocess.world_decode_spectral_envelop(
                coded_sp=coded_sp_converted, fs=sampling_rate)
            wav_transformed = preprocess.world_speech_synthesis(f0=f0_converted,
                                                                decoded_sp=decoded_sp_converted,
                                                                ap=ap,
                                                                fs=sampling_rate,
                                                                frame_period=frame_period)
            librosa.output.write_wav(path=os.path.join(output_B_dir, os.path.basename(file)),
                                     y=wav_transformed,
                                     sr=sampling_rate)

    def savePickle(self, variable, fileName):
        with open(fileName, 'wb') as f:
            pickle.dump(variable, f)

    def loadPickleFile(self, fileName):
        with open(fileName, 'rb') as f:
            return pickle.load(f)

    def store_to_file(self, doc):
        doc = doc + "\n"
        with open(self.file_name, "a") as myfile:
            myfile.write(doc)

    def saveModelCheckPoint(self, epoch, PATH):
        torch.save({
            'epoch': epoch,
            'generator_loss_store': self.generator_loss_store,
            'discriminator_loss_store': self.discriminator_loss_store,
            'model_genA2B_state_dict': self.generator_A2B.state_dict(),
            'model_genB2A_state_dict': self.generator_B2A.state_dict(),
            'model_discriminatorA': self.discriminator_A.state_dict(),
            'model_discriminatorB': self.discriminator_B.state_dict(),
            'generator_optimizer': self.generator_optimizer.state_dict(),
            'discriminator_optimizer': self.discriminator_optimizer.state_dict()
        }, PATH)

    def loadModel(self, PATH):
        checkPoint = torch.load(PATH)
        self.generator_A2B.load_state_dict(
            state_dict=checkPoint['model_genA2B_state_dict'])
        self.generator_B2A.load_state_dict(
            state_dict=checkPoint['model_genB2A_state_dict'])
        self.discriminator_A.load_state_dict(
            state_dict=checkPoint['model_discriminatorA'])
        self.discriminator_B.load_state_dict(
            state_dict=checkPoint['model_discriminatorB'])
        self.generator_optimizer.load_state_dict(
            state_dict=checkPoint['generator_optimizer'])
        self.discriminator_optimizer.load_state_dict(
            state_dict=checkPoint['discriminator_optimizer'])
        epoch = int(checkPoint['epoch']) + 1
        self.generator_loss_store = checkPoint['generator_loss_store']
        self.discriminator_loss_store = checkPoint['discriminator_loss_store']
        return epoch


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Train CycleGAN using source dataset and target dataset")

    logf0s_normalization_default = './cache/logf0s_normalization.npz'
    mcep_normalization_default = './cache/mcep_normalization.npz'
    coded_sps_A_norm = './cache/coded_sps_A_norm.pickle'
    coded_sps_B_norm = './cache/coded_sps_B_norm.pickle'
    model_checkpoint = './cache/model_checkpoint/'
    # resume_training_at = './cache/model_checkpoint/_CycleGAN_CheckPoint'
    resume_training_at = None

    validation_A_dir_default = './data/vcc2016_training/evaluation_all/SF1/'
    output_A_dir_default = './data/vcc2016_training/converted_sound/SF1'

    validation_B_dir_default = './data/vcc2016_training/evaluation_all/TF2/'
    output_B_dir_default = './data/vcc2016_training/converted_sound/TF2/'

    parser.add_argument('--logf0s_normalization', type=str,
                        help="Cached location for log f0s normalized", default=logf0s_normalization_default)
    parser.add_argument('--mcep_normalization', type=str,
                        help="Cached location for mcep normalization", default=mcep_normalization_default)
    parser.add_argument('--coded_sps_A_norm', type=str,
                        help="mcep norm for data A", default=coded_sps_A_norm)
    parser.add_argument('--coded_sps_B_norm', type=str,
                        help="mcep norm for data B", default=coded_sps_B_norm)
    parser.add_argument('--model_checkpoint', type=str,
                        help="location where you want to save the model", default=model_checkpoint)
    parser.add_argument('--resume_training_at', type=str,
                        help="Location of the pre-trained model to resume training",
                        default=resume_training_at)
    parser.add_argument('--num_epochs', type=int,
                        help="Max epochs for trainning", default=5000)
    parser.add_argument('--save_epoch', type=int,
                        help="Save model epoch for trainning", default=100)
    parser.add_argument('--stock_epoch', type=int,
                        help="Stock model for trainning", default=1000)
    parser.add_argument('--validation_A_dir', type=str,
                        help="validation set for sound source A", default=validation_A_dir_default)
    parser.add_argument('--output_A_dir', type=str,
                        help="output for converted Sound Source A", default=output_A_dir_default)
    parser.add_argument('--validation_B_dir', type=str,
                        help="Validation set for sound source B", default=validation_B_dir_default)
    parser.add_argument('--output_B_dir', type=str,
                        help="Output for converted sound Source B", default=output_B_dir_default)

    argv = parser.parse_args()

    logf0s_normalization = argv.logf0s_normalization
    mcep_normalization = argv.mcep_normalization
    coded_sps_A_norm = argv.coded_sps_A_norm
    coded_sps_B_norm = argv.coded_sps_B_norm
    model_checkpoint = argv.model_checkpoint
    resume_training_at = argv.resume_training_at
    
    num_epochs = argv.num_epochs
    save_epoch = argv.save_epoch
    stock_epoch = argv.stock_epoch

    validation_A_dir = argv.validation_A_dir
    output_A_dir = argv.output_A_dir
    validation_B_dir = argv.validation_B_dir
    output_B_dir = argv.output_B_dir
    
    os.makedirs(output_A_dir, exist_ok=True)
    os.makedirs(output_B_dir, exist_ok=True)

    # Check whether following cached files exists
    if not os.path.exists(logf0s_normalization) or not os.path.exists(mcep_normalization):
        print(
            "Cached files do not exist, please run the program preprocess_training.py first")

    cycleGAN = CycleGANTraining(logf0s_normalization=logf0s_normalization,
                                mcep_normalization=mcep_normalization,
                                coded_sps_A_norm=coded_sps_A_norm,
                                coded_sps_B_norm=coded_sps_B_norm,
                                model_checkpoint=model_checkpoint,
                                num_epochs=num_epochs,
                                save_epoch=save_epoch,
                                stock_epoch=stock_epoch,
                                validation_A_dir=validation_A_dir,
                                output_A_dir=output_A_dir,
                                validation_B_dir=validation_B_dir,
                                output_B_dir=output_B_dir,
                                restart_training_at=resume_training_at)
    cycleGAN.train()
```



## 学習時の設定
途中経過モデルの出力については，モデルの容量が3GBと重いため，「学習最新の重みの更新はこまめに，途中経過の重みの出力はざっくりと」がおすすめです．

例：学習最新の重みの更新は100回ずつ・途中経過の重みの出力は1000回ずつ

## サンプルデータの学習
以下のコードでサンプルデータの学習を実行します．

ここでは「男の声から女の声へ」，または「女の声から男の声へ」の変換を学習しています．

学習済みモデルを読み込む場合は，--resume_training_atで重みを指定する．


```python
# !python train.py
#  --resume_training_at ./cache/0523_model_checkpoint/_CycleGAN_CheckPoint \
# 学習済みモデルの学習再開
!python train.py --logf0s_normalization ./cache/logf0s_normalization.npz --mcep_normalization ./cache/mcep_normalization.npz \
                 --coded_sps_A_norm ./cache/coded_sps_A_norm.pickle --coded_sps_B_norm ./cache/coded_sps_B_norm.pickle \
                 --model_checkpoint ./cache/0523_model_checkpoint/ \
                 --num_epochs 5000 --save_epoch 100 --stock_epoch 1000 \ \
                 --validation_A_dir ./data/evaluation_all/SF1/ --output_A_dir ./data/converted_sound/SF1/ \
                 --validation_B_dir ./data/evaluation_all/TM1/ --output_B_dir ./data/converted_sound/TM1/
```


## test.pyの上書き
test.pyで自分が使いやすいように，変更します．

以下のコードで，test.pyの上書きを実施します．


```python
# test.pyの書き込み
%%writefile test.py

import os
import numpy as np
import argparse
import torch
import time
import librosa
import pickle

import preprocess
from trainingDataset import trainingDataset
from model_VC2 import Generator, Discriminator

class CycleGANTest:
    def __init__(self,
                 logf0s_normalization,
                 mcep_normalization,
                 model_checkpoint,
                 validation_A_dir,
                 output_A_dir,
                 validation_B_dir,
                 output_B_dir):

        logf0s_normalization = np.load(logf0s_normalization)
        self.log_f0s_mean_A = logf0s_normalization['mean_A']
        self.log_f0s_std_A = logf0s_normalization['std_A']
        self.log_f0s_mean_B = logf0s_normalization['mean_B']
        self.log_f0s_std_B = logf0s_normalization['std_B']

        mcep_normalization = np.load(mcep_normalization)
        self.coded_sps_A_mean = mcep_normalization['mean_A']
        self.coded_sps_A_std = mcep_normalization['std_A']
        self.coded_sps_B_mean = mcep_normalization['mean_B']
        self.coded_sps_B_std = mcep_normalization['std_B']

        self.validation_A_dir = validation_A_dir
        self.output_A_dir = output_A_dir
        
        self.validation_B_dir = validation_B_dir
        self.output_B_dir = output_B_dir

        self.device = torch.device(
            'cuda' if torch.cuda.is_available() else 'cpu')
            
        self.generator_A2B = Generator().to(self.device)
        self.generator_A2B.eval()
        
        self.generator_B2A = Generator().to(self.device)
        self.generator_B2A.eval()

        checkPoint = torch.load(model_checkpoint)
        self.generator_A2B.load_state_dict(
            state_dict=checkPoint['model_genA2B_state_dict'])
        self.generator_B2A.load_state_dict(
            state_dict=checkPoint['model_genB2A_state_dict'])
        print("load model checkpoint finish!")

    # A->B
    def validation_for_A_dir(self):
        num_mcep = 24
        sampling_rate = 16000
        frame_period = 5.0
        n_frames = 128
        validation_A_dir = self.validation_A_dir
        output_A_dir = self.output_A_dir

        print("Generating Test Data B from A...")
        for file in os.listdir(validation_A_dir):
            filePath = os.path.join(validation_A_dir, file)
            wav, _ = librosa.load(filePath, sr=sampling_rate, mono=True)
            wav = preprocess.wav_padding(wav=wav,
                                         sr=sampling_rate,
                                         frame_period=frame_period,
                                         multiple=4)
            f0, timeaxis, sp, ap = preprocess.world_decompose(
                wav=wav, fs=sampling_rate, frame_period=frame_period)
            f0_converted = preprocess.pitch_conversion(f0=f0,
                                                       mean_log_src=self.log_f0s_mean_B,
                                                       std_log_src=self.log_f0s_std_B,
                                                       mean_log_target=self.log_f0s_mean_A,
                                                       std_log_target=self.log_f0s_std_A)
            coded_sp = preprocess.world_encode_spectral_envelop(
                sp=sp, fs=sampling_rate, dim=num_mcep)
            coded_sp_transposed = coded_sp.T
            coded_sp_norm = (coded_sp_transposed -
                             self.coded_sps_B_mean) / self.coded_sps_B_std
            coded_sp_norm = np.array([coded_sp_norm])

            if torch.cuda.is_available():
                coded_sp_norm = torch.from_numpy(coded_sp_norm).cuda().float()
            else:
                coded_sp_norm = torch.from_numpy(coded_sp_norm).float()

            coded_sp_converted_norm = self.generator_A2B(coded_sp_norm)
            coded_sp_converted_norm = coded_sp_converted_norm.cpu().detach().numpy()
            coded_sp_converted_norm = np.squeeze(coded_sp_converted_norm)
            coded_sp_converted = coded_sp_converted_norm * \
                self.coded_sps_B_std + self.coded_sps_B_mean
            coded_sp_converted = coded_sp_converted.T
            coded_sp_converted = np.ascontiguousarray(coded_sp_converted)
            decoded_sp_converted = preprocess.world_decode_spectral_envelop(
                coded_sp=coded_sp_converted, fs=sampling_rate)
            wav_transformed = preprocess.world_speech_synthesis(f0=f0_converted,
                                                                decoded_sp=decoded_sp_converted,
                                                                ap=ap,
                                                                fs=sampling_rate,
                                                                frame_period=frame_period)
            librosa.output.write_wav(path=os.path.join(output_A_dir, os.path.basename(file)),
                                     y=wav_transformed,
                                     sr=sampling_rate)
        print("finish!")
        
    
    # B->A
    def validation_for_B_dir(self):
        num_mcep = 24
        sampling_rate = 16000
        frame_period = 5.0
        n_frames = 128
        validation_B_dir = self.validation_B_dir
        output_B_dir = self.output_B_dir

        print("Generating Test Data A from B...")
        for file in os.listdir(validation_B_dir):
            filePath = os.path.join(validation_B_dir, file)
            wav, _ = librosa.load(filePath, sr=sampling_rate, mono=True)
            wav = preprocess.wav_padding(wav=wav,
                                         sr=sampling_rate,
                                         frame_period=frame_period,
                                         multiple=4)
            f0, timeaxis, sp, ap = preprocess.world_decompose(
                wav=wav, fs=sampling_rate, frame_period=frame_period)
            f0_converted = preprocess.pitch_conversion(f0=f0,
                                                       mean_log_src=self.log_f0s_mean_B,
                                                       std_log_src=self.log_f0s_std_B,
                                                       mean_log_target=self.log_f0s_mean_A,
                                                       std_log_target=self.log_f0s_std_A)
            coded_sp = preprocess.world_encode_spectral_envelop(
                sp=sp, fs=sampling_rate, dim=num_mcep)
            coded_sp_transposed = coded_sp.T
            coded_sp_norm = (coded_sp_transposed -
                             self.coded_sps_B_mean) / self.coded_sps_B_std
            coded_sp_norm = np.array([coded_sp_norm])

            if torch.cuda.is_available():
                coded_sp_norm = torch.from_numpy(coded_sp_norm).cuda().float()
            else:
                coded_sp_norm = torch.from_numpy(coded_sp_norm).float()

            coded_sp_converted_norm = self.generator_B2A(coded_sp_norm)
            coded_sp_converted_norm = coded_sp_converted_norm.cpu().detach().numpy()
            coded_sp_converted_norm = np.squeeze(coded_sp_converted_norm)
            coded_sp_converted = coded_sp_converted_norm * \
                self.coded_sps_A_std + self.coded_sps_A_mean
            coded_sp_converted = coded_sp_converted.T
            coded_sp_converted = np.ascontiguousarray(coded_sp_converted)
            decoded_sp_converted = preprocess.world_decode_spectral_envelop(
                coded_sp=coded_sp_converted, fs=sampling_rate)
            wav_transformed = preprocess.world_speech_synthesis(f0=f0_converted,
                                                                decoded_sp=decoded_sp_converted,
                                                                ap=ap,
                                                                fs=sampling_rate,
                                                                frame_period=frame_period)
            librosa.output.write_wav(path=os.path.join(output_B_dir, os.path.basename(file)),
                                     y=wav_transformed,
                                     sr=sampling_rate)
        print("finish!")



if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Test CycleGAN")

    logf0s_normalization_default = '../cache/logf0s_normalization.npz'
    mcep_normalization_default = '../cache/mcep_normalization.npz'
    # coded_sps_A_norm = '../cache/coded_sps_A_norm.pickle'
    # coded_sps_B_norm = '../cache/coded_sps_B_norm.pickle'
    model_checkpoint = '../cache/model_checkpoint/'
    resume_training_at = '../cache/model_checkpoint/_CycleGAN_CheckPoint'
    resume_training_at = None

    validation_A_dir_default = None
    output_A_dir_default = None

    validation_B_dir_default = None
    output_B_dir_default = None

    parser.add_argument('--logf0s_normalization', type=str,
                        help="Cached location for log f0s normalized", default=logf0s_normalization_default)
    parser.add_argument('--mcep_normalization', type=str,
                        help="Cached location for mcep normalization", default=mcep_normalization_default)
    parser.add_argument('--model_checkpoint', type=str,
                        help="location where your model", default=model_checkpoint)
    parser.add_argument('--test_A_dir', type=str,
                        help="test set for sound source A", default=validation_A_dir_default)
    parser.add_argument('--output_A_dir', type=str,
                        help="output for converted Sound Source A", default=output_A_dir_default)
    parser.add_argument('--test_B_dir', type=str,
                        help="test set for sound source B", default=validation_B_dir_default)
    parser.add_argument('--output_B_dir', type=str,
                        help="output for converted Sound Source B", default=output_B_dir_default)

    argv = parser.parse_args()

    logf0s_normalization = argv.logf0s_normalization
    mcep_normalization = argv.mcep_normalization
    model_checkpoint = argv.model_checkpoint
    
    # Aのデータ
    validation_A_dir = argv.test_A_dir
    output_A_dir = argv.output_A_dir
    
    # Bのデータ
    validation_B_dir = argv.test_B_dir
    output_B_dir = argv.output_B_dir

    cycleGAN = CycleGANTest(logf0s_normalization=logf0s_normalization,
                                mcep_normalization=mcep_normalization,
                                model_checkpoint=model_checkpoint,
                                validation_A_dir=validation_A_dir,
                                output_A_dir=output_A_dir,
                                validation_B_dir=validation_B_dir,
                                output_B_dir=output_B_dir)
                                
    # A->Bへの変換
    if validation_A_dir:
        os.makedirs(output_A_dir, exist_ok=True)
        cycleGAN.validation_for_A_dir()
    
    # B->Aへの変換
    if validation_B_dir:
        os.makedirs(output_B_dir, exist_ok=True)
        cycleGAN.validation_for_B_dir()
```

## 音質変換の実行
学習(約2日)が終わったので，出力された最終の重み`./cache/0523_model_checkpoint/_CycleGAN_CheckPoint`でtest.pyを実行し，「男の声から女の声へ」の音質変換を実施します．


```python
!python test.py --logf0s_normalization ./cache/logf0s_normalization.npz --mcep_normalization ./cache/mcep_normalization.npz \
                --test_A_dir ./data/evaluation_all/TM1/ --output_A_dir ./data/test_converted_sound_400/TM1 \
                --model_checkpoint ./cache/0523_model_checkpoint/_CycleGAN_CheckPoint400
```
変換結果

<video width="640" height="400" controls>
  <source src="/video/man_woman_vc.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video> 


## まとめ
vcc2016のサンプルデータで，音質変換を実施します．<br>

学習のデータ数が162個の数秒の音声データでもうまく変換ができていました．

出来はまあまあでした．

次は，オリジナルデータでの学習を実装します

## 参考サイト
[jackaduma/CycleGAN-VC2](https://github.com/jackaduma/CycleGAN-VC2)

[TaiChunYen/Pytorch-CycleGAN-VC2](https://github.com/TaiChunYen/Pytorch-CycleGAN-VC2)



## エラー集

### エラー1
download.pyでSSLの証明でエラーが発生した．

以下のコードを追記した．
```python
# download.pyの31行目付近
def maybe_download(filename, url, destination_dir, expected_bytes=None, force=False):
    import ssl
    ssl._create_default_https_context = ssl._create_unverified_context
```

参考:https://github.com/Cadene/pretrained-models.pytorch/issues/193

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
