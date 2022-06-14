---
display: home
title: 'pytorch-grad-camでCAM(Class Activation Mapping)を実装する'
description: pytorch-grad-camでCAM(Class Activation Mapping)を実施します．
date: 2022-01-17
image: https://www.hamlet-engineer.com/image/dog_cam.png
categories: 
  - Python
tags:
  - Python
  - jupyter
  - CAM
  - GradCAM
---

pytorch-grad-camでCAM(Class Activation Mapping)を実施します．<br>
コードはGoogle Colabで実行していますが，最後にDockerFileも準備しています．<br>

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

## Google Colabのファイル構成
プロジェクトディレクトリはpytorch_CAMとしています．度々，省略しています．
```init
pytorch_CAM
├── /pytorch-grad-cam
│   ├── /examples
│   │   └── both.png <- テスト画像
│   └── (省略)
└── pytorch_CAM.ipynb <- 実行用ノートブック
```

## Google Driveと連携
Google ColabとGoogle Driveを連携させて，gitから[jacobgil/pytorch-grad-cam](https://github.com/jacobgil/pytorch-grad-cam.git)をダウンロードします．


```python
# Google ColabとGoogle Driveを連携
from google.colab import drive
drive.mount('/content/drive')
```

```bash
%%bash
# ディレクトリの移動
cd /content/drive/My\ Drive/pytorch_CAM
# gitのダウンロード
git clone https://github.com/jacobgil/pytorch-grad-cam.git
ls
```

## モジュールのインストール
ここでは，モジュールのインストールを実施します．


```python
!pip install --upgrade pip
!pip install dataclasses==0.6
!pip install dicom-factory==0.0.3
!pip install numpy==1.19.5
!pip install Pillow==8.1.1
!pip install torch==1.7.1
!pip install torchvision==0.8.2
!pip install typing-extensions==3.7.4.3
!pip install ttach
!pip install tqdm
!pip install opencv-python
!pip install ipywidgets
!pip install matplotlib
!pip install grad-cam
```

## サンプルの実行
CAMが起動できるかを確認するために，下記のサンプルコードで実行します．

```python
%cd /content/drive/My\ Drive/pytorch_CAM/pytorch-grad-cam
!ls examples/
```


```python
from pytorch_grad_cam import GradCAM, ScoreCAM, GradCAMPlusPlus, AblationCAM, XGradCAM, EigenCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
from torchvision.models import resnet50

from pytorch_grad_cam.utils.image import show_cam_on_image, deprocess_image, preprocess_image

model = resnet50(pretrained=True)
target_layer = model.layer4[-1]

# データ入力
import cv2
import numpy as np
rgb_img = cv2.imread('examples/both.png', 1)[:, :, ::-1]
rgb_img = np.float32(rgb_img) / 255
input_tensor = preprocess_image(rgb_img, mean=[0.485, 0.456, 0.406], 
                                             std=[0.229, 0.224, 0.225])
# Note: input_tensor can be a batch tensor with several images!

# Construct the CAM object once, and then re-use it on many images:
cam = GradCAM(model=model, target_layer=target_layer, use_cuda=True)

# If target_category is None, the highest scoring category
# will be used for every image in the batch.
# target_category can also be an integer, or a list of different integers
# for every image in the batch.
target_category = None

# You can also pass aug_smooth=True and eigen_smooth=True, to apply smoothing.
grayscale_cam = cam(input_tensor=input_tensor, target_category=target_category)

# In this example grayscale_cam has only one image in the batch:
grayscale_cam = grayscale_cam[0, :]
visualization = show_cam_on_image(rgb_img, grayscale_cam)
```


```python
# 結果を表示
import numpy as np
import matplotlib.pyplot as plt

plt.imshow(visualization, vmin=0, vmax=255, interpolation='none')
plt.show()
```
    
![png](/image/dog_cam.png)
    
## DockerFile

### DockerFile
```js
# gradcam-yolov2
FROM jupyter/base-notebook:python-3.8.6

WORKDIR /work

USER root

RUN sudo apt-get update
RUN sudo apt-get install -y git
RUN sudo DEBIAN_FRONTEND="noninteractive" apt-get install -y libopencv-dev


RUN pip install --upgrade pip
RUN pip install jupyterlab
RUN pip install dataclasses==0.6
RUN pip install dicom-factory==0.0.3
RUN pip install numpy==1.19.5
RUN pip install Pillow==8.1.1
RUN pip install torch==1.7.1
RUN pip install torchvision==0.8.2
RUN pip install typing-extensions==3.7.4.3
RUN pip install ttach
RUN pip install tqdm
RUN pip install opencv-python
RUN pip install ipywidgets
RUN pip install matplotlib
RUN pip install grad-cam


WORKDIR /home/$NB_USER/

USER $NB_USER
```

### docker-compose.yml
```js
version: "3"
services:
  gradcam:
    container_name: gradcam_60
    build: .
    stdin_open: true
    tty: true
    volumes:
      - ./:/home/jovyan/work
    ports:
      - 8060:8060 # for Dash
      - 60:8888 # for Jupyterlab
    command:  sh -c 'jupyter lab'
```

### 実行コード
DockerFileとdocker-compose.ymlが存在するディレクトリで下記のコードを実行すると，環境が構築されます．

jupyterのURLは`http://127.0.0.1:60/lab?token=＊＊＊＊`となります．

```py
# 構築用
docker-compose up --build
# 起動用
docker-compose up
```

## まとめ
ここでは，CAMの実行できる環境の下作りを実施しました．

次からは，torchvision外からのモデルでも実行できるようにします．



## 参考サイト
[jacobgil/pytorch-grad-cam](https://github.com/jacobgil/pytorch-grad-cam.git)

[pytorch-gradcamで簡単にGrad-CAMを行う](https://qiita.com/bamboo-nova/items/082f71b96b9aca0d5df5)

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
