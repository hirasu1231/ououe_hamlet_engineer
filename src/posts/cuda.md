---
display: home
title: 'CUDAとTensorFlow，PyTorchのversion対応について'
description: PythonでAI系をやっていると，CUDA・TensorFlow・PyTorchのversionの違いでつまずくことがありますので，version対応について記述します．
date: 2021-03-21
image: https://www.hamlet-engineer.com/image/cuda.jpg
categories: 
  - Python
tags:
  - Python
  - TensorFlow
  - PyTorch
  - CUDA
---
PythonでAI系をやっていると，CUDA・TensorFlow・PyTorchのversionの違いでつまずくことが結構あります．<br>
本稿では，CUDAとTensorFlow，PyTorchのver対応について記述します．


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

## TensorFlowとの対応表について
![](/image/CUDA_tf.png)

```
# GPUが使用できるかを確認
import TensorFlow as tf
device_name = tf.test.gpu_device_name()
if device_name != '/device:GPU:0':
  print('GPU device not found')
print('Found GPU at: {}'.format(device_name))
```

## PyTorchとの対応について
[PyTorchとCUDAの対応について](https://PyTorch.org/get-started/previous-versions/)
```
# GPUが使用できるかを確認
import torch
print(torch.CUDA.is_available())
```

## CUDA
CUDA ToolkitとNVIDIAドライバの各バージョンについて，以下の画像に示します．
![](/image/cuda_nvidia.png)

### 前準備
```
sudo apt update
sudo apt-get update
```

### Nvidiaドライバのインストール
Nvidiaドライバをインストールします．
該当ドライバのバージョンのインストールがうまくいかない場合は、バージョンを少しずつ下げてみるのがお勧めです．
```
sudo apt update
# インストール可能なドライバのバージョンを確認
apt-cache search 'nvidia-[0-9]+$'
# ドライバのインストール(ここではnvidia-361)
sudo apt-get install nvidia-361
```

また，Nvidiaの公式サイトからもドライバをインストールできます．
[NVIDIAドライバダウンロード](https://www.nvidia.co.jp/Download/index.aspx?lang=jp#)<br>
![](/image/nvidia_dl.png)

### CUDAのインストール
```
sudo apt-get update
sudo apt-get install build-essential
sudo apt-get install CUDA-10-0
```
### 実行環境の確認
以下のコードでCUDAのversionを確認します．<br>
`watch -n 0.5`はコードを回している間に，GPUの使用状況を見る場合にも便利です．
```
nvcc --version
```
以下のコードでgpuの使用状況を確認．
```
#0.5秒毎にnvidia-smiの情報を更新して表示する
watch -n 0.5 nvidia-smi
```

## 参考サイト
- [PyTorchインストール時のCUDAバージョンの選び方](https://katsuwosashimi.com/archives/742/how-to-choose-CUDA-version-PyTorch/)
- [TensorFlow GPU, CUDA, CuDNNのバージョン早見表](https://qiita.com/chin_self_driving_car/items/f00af2dbd022b65c9068)

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>