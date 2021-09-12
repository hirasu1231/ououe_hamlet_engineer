---
display: home
title: 'CNNのアルゴリズムを一通りまとめたdeepgazeについて整理する'
description: CNNのアルゴリズムを一通りまとめたdeepgazeについて整理します．
date: 2021-09-12
image: https://www.hamlet-engineer.com/image/ex_fasa_saliency_map.png
categories: 
  - Python
tags:
  - Python
  - jupyter
  - CNN
  - deepgaze
---
<!-- https://www.hamlet-engineer.com -->
CNNのアルゴリズムを一通りまとめたdeepgazeについて整理します．

今回はDockerで実装します．

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

## Deepgazeとは
> Deepgazeは、顔検出、頭のポーズの推定、分類に畳み込みニューラルネットワーク（CNN）を使用する、人間とコンピューターの相互作用、人の検出、追跡のためのライブラリです。人の注意の焦点は、頭の向きを見つけることで概算できます。これは、目が覆われている場合、またはユーザーがカメラから離れすぎて目の領域を適切な解像度で取得できない場合に特に役立ちます。目の領域が見える場合、視線の方向を推定することができます。これは、はるかに有益であり、FOAの良い指標を与えることができます。Deepgazeには、次の便利なパッケージが含まれています。<br>
- 頭のポーズの推定（Perspective-n-Point、畳み込みニューラルネットワーク）
- 顔検出（ハールカスケード）
- 肌と色の検出（範囲検出、逆投影）
- ヒストグラムベースの分類（ヒストグラム交差）
- 動き検出（フレーム差分、MOG、MOG2）
- モーショントラッキング（パーティクルフィルター）
- 顕著性マップ（FASA）

## Deepgazeのインストール

### Dockerの整理
DockerFileは下記の通りです．
```js
FROM jupyter/base-notebook:python-3.8.6

WORKDIR /work
USER root

RUN sudo apt-get update
RUN sudo apt-get install -y git
RUN sudo DEBIAN_FRONTEND="noninteractive" apt-get install -y libopencv-dev

RUN pip install --upgrade pip
RUN pip install jupyterlab
RUN pip install numpy
RUN pip install opencv-python
RUN pip install tensorflow

WORKDIR /home/$NB_USER/
USER $NB_USER
```

docker-compose.ymlは下記の通りです．
```js
version: "3.7"

services:
  deepgaze:
    # コンテナ名を明示的に指定する
    container_name: deepgaze_50
    build: .
    stdin_open: true
    tty: true
    ports:
      - 8050:8050 # for Dash
      - 50:8888 # for Jupyterlab
    volumes:
      - ./:/home/jovyan/work
    command:  sh -c 'jupyter lab'
```

### gitのダウンロード
dockerを起動します．jupyterLabは`http://127.0.0.1:50/?token=＊＊＊＊`で入ります．
```
docker-compose up --build
```

下記のコードでgitをコピーできます．
```python
# gitのコピー
git clone https://github.com/mpatacchiola/deepgaze.git

# セットアップ
cd deepgaze
python setup.py install
```

## Deepgazeの実行
ここでは，お試しで`/deepgaze/examples/ex_fasa_saliency_map/ex_fasa_saliency_map_images.py`を実行します．

コメントアウトしないと，Docker上で動かない箇所がありますので，下記のコードを参考にしてください．

```python
import numpy as np
import cv2
from timeit import default_timer as timer
from deepgaze.saliency_map import FasaSaliencyMapping 

def main():

    image_1 = cv2.imread("./horse.jpg")
    image_2 = cv2.imread("./car.jpg")
    image_3 = cv2.imread("./plane.jpg")
    image_4 = cv2.imread("./pear.jpg")

    # for each image the same operations are repeated
    my_map = FasaSaliencyMapping(image_1.shape[0], image_1.shape[1])  # init the saliency object
    start = timer()
    image_salient_1 = my_map.returnMask(image_1, tot_bins=8, format='BGR2LAB')  # get the mask from the original image
    image_salient_1 = cv2.GaussianBlur(image_salient_1, (3,3), 1)  # applying gaussin blur to make it pretty
    end = timer()
    cv2.imwrite("./horse_salient.jpg", image_salient_1)
    print("--- %s Image 1 tot seconds ---" % (end - start))

    my_map = FasaSaliencyMapping(image_2.shape[0], image_2.shape[1])
    start = timer()
    image_salient_2 = my_map.returnMask(image_2, tot_bins=8, format='BGR2LAB')
    image_salient_2 = cv2.GaussianBlur(image_salient_2, (3,3), 1)
    end = timer()
    cv2.imwrite("./car_salient.jpg", image_salient_2)
    print("--- %s Image 2 tot seconds ---" % (end - start))

    my_map = FasaSaliencyMapping(image_3.shape[0], image_3.shape[1])
    start = timer()
    image_salient_3 = my_map.returnMask(image_3, tot_bins=8, format='BGR2LAB')
    #image_salient_3 = cv2.GaussianBlur(image_salient_3, (3,3), 1)
    end = timer()
    cv2.imwrite("./plane_salient.jpg", image_salient_3)
    print("--- %s Image 3 tot seconds ---" % (end - start))

    my_map = FasaSaliencyMapping(image_4.shape[0], image_4.shape[1])
    start = timer()
    image_salient_4 = my_map.returnMask(image_4, tot_bins=8, format='BGR2LAB')
    image_salient_4 = cv2.GaussianBlur(image_salient_4, (3,3), 1)
    end = timer()
    cv2.imwrite("./pear_salient.jpg", image_salient_4)
    print("--- %s Image 4 tot seconds ---" % (end - start))

    # Creating stack of images and showing them on screen
    # original_images_stack = np.hstack((image_1, image_2, image_3, image_4))
    # saliency_images_stack = np.hstack((image_salient_1, image_salient_2, image_salient_3, image_salient_4))
    # saliency_images_stack = np.dstack((saliency_images_stack,saliency_images_stack,saliency_images_stack))
    # cv2.imshow("Original-Saliency", np.vstack((original_images_stack, saliency_images_stack)))

    # while True:
    #     if cv2.waitKey(33) == ord('q'):
    #         cv2.destroyAllWindows()
    #         break


if __name__ == "__main__":
    main()
```

下記のコードで実行します．
```python
cd /deepgaze/examples/ex_fasa_saliency_map
python ex_fasa_saliency_map_images.py
```

![](/image/pear.jpg)

![](/image/pear_salient.jpg)


## Deepgazeの実装済み機能

### 頭の姿勢の推定
![](/image/ex_cnn_head_pose_estimation_images.png)

### 色検出
![](/image/ex_color_detection_image.png)

### 皮膚検出
![](/image/ex_skin_detection_images.png)

### 顔検出
![](/image/ex_face_center_color_detection.png)

### コーナー検出
![](/image/ex_corner_detection.png)

### フレーム差分による動きの検出と追跡
![](/image/ex_diff_motion_detection_video.png)

### アルゴリズムによる動き検出と追跡の比較
![](/image/ex_motion_detectors_comparison_video.png)

### パーティクルフィルターによるモーショントラッキング
![](/image/ex_particle_filtering_object_tracking_video.png)

### 逆投影によるモーショントラッキング
![](/image/ex_multi_backprojection_hand_tracking_gaming.gif)

### カラーヒストグラムによる画像分類
![](/image/ex_color_classification_images.png)

### FASAアルゴリズム
![](/image/ex_fasa_saliency_map.png)


## 参考サイト
[brendan-rius/jupyter-c-kernel](https://github.com/brendan-rius/jupyter-c-kernel)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
