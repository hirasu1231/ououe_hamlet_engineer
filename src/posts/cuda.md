---
display: home
title: 'CUDAとTensorFlow，PyTorchのversion対応について'
description: PythonでAI系をやっていると，CUDA・TensorFlow・PyTorchのversionの違いでつまずくことがありますので，version対応について記述します．
date: 2021-03-21
image: /image/cuda.jpg
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