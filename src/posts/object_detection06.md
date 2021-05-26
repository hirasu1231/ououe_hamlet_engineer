---
display: home
title: 'Python + Google Colab + keras-yolo4でバイク検出を転移学習する'
description: COCOデータセットから特定のクラスの画像を抽出し，アノテーション情報を整形したので，keras-yolo4での転移学習を実施します．
date: 2021-03-02
image: https://www.hamlet-engineer.com/image/tenni.png
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - 物体検出
  - YOLO
  - トラッキング
  - Google Colab
  - Keras
---
COCOデータセットから特定のクラスの画像を抽出し，アノテーション情報を整形したので，keras-yolo4での転移学習を実施します．


<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

最終的に，Youtubeの[平成24年 元旦配達出発式](https://www.youtube.com/watch?v=wnRH3-CIk4I)のIDを振り分けるトラッキングも含めたバイクのカウントを実施します．

[[toc]]

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

## Google Colabのファイル構成
プロジェクトディレクトリはpost_bikeとしています．度々，省略しています．
```
post_bike
├── /keras-yolo4
│   ├── /logs <- 学習モデルの保存先
│   │   └── /keras_bike
│   ├── keras_bike.zip <- 学習データ解凍前
│   ├── /keras_bike <- 学習データ
│   ├── decode_np.py
│   ├── test.py
│   ├── test_video.py
│   ├── yolov4.weights
│   ├── yolo4_weight.h5
│   ├── H240101_post.mp4 <- 元動画
│   ├── keras_post.mp4 <- 検出動画
│   └── (省略)
└── keras-yolo4.ipynb <- 実行用ノートブック
```

## 転移学習
>転移学習とは、ある領域の知識を別の領域の学習に適用させる技術です。<br>
たとえば大量の犬の画像データと少量の猫の画像データがあり、犬の種類判別モデルと猫の種類判別モデルを作成する場合、通常の機械学習では下図の左側のように犬と猫別々でモデルを作成します。しかしこのとき、猫の画像は少ないので猫の種類判別モデルは判別精度が低い可能性があります。そこで下図の右側のように、犬の種類判別の課題から得られた知識を猫の種類判別モデルに適応させる転移学習を行うことで、判別精度の向上を図ることができます。<br>
引用元:[転移学習とは | メリット・デメリット・ファインチューニングの意味](https://ledge.ai/transfer-learning/#:~:text=%E8%BB%A2%E7%A7%BB%E5%AD%A6%E7%BF%92%E3%81%A8%E3%81%AF%E3%80%81%E3%81%82%E3%82%8B,%E3%81%AB%E9%81%A9%E7%94%A8%E3%81%95%E3%81%9B%E3%82%8B%E6%8A%80%E8%A1%93%E3%81%A7%E3%81%99%E3%80%82)

本稿では，出力される1つ前の層(Yolov4では3つある)までを固定して，残りを学習させています．


## keras-yolo4
### keras-yolo4のダウンロード
Google ColabとGoogle Driveを連携させて，gitからkeras-yolo4をダウンロードします．
```python
# Google ColabとGoogle Driveを連携
from google.colab import drive
drive.mount('/content/drive')
```
```python
%%bash
# ディレクトリの移動
cd drive/MyDrive/post_bike/
# gitのダウンロード
git clone https://github.com/Ma-Dan/keras-yolo4.git
```

## keras-yolo4の起動チェック
正常に起動するか，デフォルトで入っている画像を検出させてチェックします．

### 初期重みのダウンロード
今回は起動するかチェックするために，YOLOv4学習済みのパラメータをダウンロードします．
```python
# ディレクトリの移動
%cd /content/drive/MyDrive/post_bike/keras-yolo4/
# 初期重みをダウンロード
!wget https://github.com/AlexeyAB/darknet/releases/download/darknet_yolo_v3_optimal/yolov4.weights
```

### モジュールのインストール
keras-yolo4に応じて，モジュールをインストールします．
```python
!pip install keras==2.2.0
!pip install tensorflow==1.15.0
!pip install tensorflow-gpu==1.15.0
!pip install keras-applications==1.0.7
```

### 重みの変換
darknet用の重みをkerasで使えるように変換します．(yolov4.weights -> yolo4_weight.h5)
```python
# ディレクトリの移動
%cd /content/drive/MyDrive/post_bike/keras-yolo4/
# 重みの変換
!python convert.py
```

### テストの実行
GPUが認識しているかの確認後，検出が実行しkeras-yolo4が正常に起動するか確認します．
```python
import tensorflow as tf

# GPUの起動確認
device_name = tf.test.gpu_device_name()
if device_name != '/device:GPU:0':
  print('GPU device not found')
print('Found GPU at: {}'.format(device_name))
# Found GPU at: /device:GPU:0
```

test.pyを以下の記述に変更して実行してください．
```python
# test.pyの36-38行目
model_path = 'yolo4_weight.h5'
anchors_path = 'model_data/yolo4_anchors.txt'
classes_path = 'model_data/coco_classes.txt'

# test.pyの61-行目をコメントアウト
# while True:
#     # img = input('Input image filename:')
#     try:
#         image = cv2.imread(img)
#     except:
#         print('Open Error! Try again!')
#         continue
#     else:
#         image, boxes, scores, classes = _decode.detect_image(image, True)
#         cv2.imshow('image', image)
#         cv2.waitKey(0)
#         cv2.destroyAllWindows()

# yolo4_model.close_session()

# 追記
image = cv2.imread('person.jpg')
image, boxes, scores, classes = _decode.detect_image(image, True)
cv2.imwrite('person_result.jpg',image)
```
```python
# ディレクトリの移動
%cd /content/drive/MyDrive/post_bike/keras-yolo4/
# テスト用画像のダウンロード
!wget https://github.com/AlexeyAB/darknet/blob/master/data/person.jpg?raw=true -O person.jpg
# テスト(person.jpg)
!python test.py
```
person.jpgの検出結果<br>
![](/image/keras_person_result.jpg)

## keras-yolo4での学習
keras-yolo4も起動も確認できたので，keras-yolo4でバイク検出の学習を実施します．

### 学習データのアップロード
僕の経験の話になりますが，Google Colabを使う場合は，zip圧縮してからGoogle Driveにアップロードして，Google Colabのノートブック上で解凍させた方がエラーもなく早い感じがするので，ここではそのコードをあげます．
```python
# ディレクトリの移動
%cd /content/drive/MyDrive/post_bike/darknet/
# 学習データの解凍
!unzip darknet4_bike.zip > /dev/null
```

### 学習の実行
ダウンロードしたkeras-yolo4に移動して，train.pyの設定をイジって実行準備をします．<br>
annotation_train_pathとannotation_val_pathは学習・評価用のデータ，log_dirはモデルの出力先，classes_pathはクラスのリストを示す．
```python
# train.py
# 26-29行目
annotation_train_path = 'keras_bike/train.txt' 
annotation_val_path = 'keras_bike/val.txt' 
log_dir = 'logs/keras_bike/'
classes_path = 'keras_bike/yolov4_bike.txt'  

# 51行目
# weights_path：重みの読み込み
# freeze_body：固定の仕方の設定
# 1:250層目の特徴量抽出層までを固定
# 2:出力直前の3層前までを固定
model, model_body = create_model(input_shape, anchors_stride_base, num_classes, load_pretrained=False, freeze_body=2, weights_path='yolo4_weight.h5')

# 58行目
# eval_file='2012_val.txt' -> eval_file=annotation_val_path
evaluation = Evaluate(model_body=model_body, anchors=anchors, class_names=class_index, score_threshold=0.05, tensorboard=logging, weighted_average=True, eval_file=annotation_val_path, log_dir=log_dir)

# 127-128行目
# 固定する層の指定
if freeze_body in [1, 2]:
  # Freeze darknet53 body or freeze all but 3 output layers.
  num = (250, len(model_body.layers)-3)[freeze_body-1]
  for i in range(num): model_body.layers[i].trainable = False
  print('Freeze the first {} layers of total {} layers.'.format(num, len(model_body.layers)))
```
```python
# ディレクトリの移動
%cd /content/drive/MyDrive/post_bike/keras-yolo4/
# 学習の実行
!python train.py
```

## バイク検出の実行
学習(約5時間)が終わったので，出力された最終の重み`logs/keras_bike/ep063-loss12.063.h5`でtest_video.pyを作成しバイク検出を実施します．
```python
# test_video.py
import os
import colorsys

import numpy as np
from keras import backend as K
from keras.models import load_model
from keras.layers import Input

from yolo4.model import yolo_eval, yolo4_body
from yolo4.utils import letterbox_image

from PIL import Image, ImageFont, ImageDraw
from timeit import default_timer as timer
import cv2

from decode_np import Decode


def get_class(classes_path):
    classes_path = os.path.expanduser(classes_path)
    with open(classes_path) as f:
        class_names = f.readlines()
    class_names = [c.strip() for c in class_names]
    return class_names

def get_anchors(anchors_path):
    anchors_path = os.path.expanduser(anchors_path)
    with open(anchors_path) as f:
        anchors = f.readline()
    anchors = [float(x) for x in anchors.split(',')]
    return np.array(anchors).reshape(-1, 2)

if __name__ == '__main__':
    print('Please visit https://github.com/miemie2013/Keras-YOLOv4 for more complete model!')

    model_path = 'logs/keras_bike/ep063-loss12.063.h5'
    anchors_path = 'model_data/yolo4_anchors.txt'
    classes_path = 'keras_bike/yolov4_bike.txt'

    class_names = get_class(classes_path)
    anchors = get_anchors(anchors_path)

    num_anchors = len(anchors)
    num_classes = len(class_names)

    model_image_size = (608, 608)

    # 分数阈值和nms_iou阈值
    conf_thresh = 0.2
    nms_thresh = 0.45

    yolo4_model = yolo4_body(Input(shape=model_image_size+(3,)), num_anchors//3, num_classes)

    model_path = os.path.expanduser(model_path)
    assert model_path.endswith('.h5'), 'Keras model or weights must be a .h5 file.'

    yolo4_model.load_weights(model_path)

    _decode = Decode(conf_thresh, nms_thresh, model_image_size, yolo4_model, class_names)
    
    # 入力動画
    input_video = 'H240101_post.mp4'
    output_video = 'keras_post.mp4'
    # 出力動画
    vid = cv2.VideoCapture(input_video)
    codec = cv2.VideoWriter_fourcc(*'XVID')
    vid_fps = int(round(vid.get(cv2.CAP_PROP_FPS),0))
    vid_width,vid_height = int(vid.get(cv2.CAP_PROP_FRAME_WIDTH)), int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT))
    out = cv2.VideoWriter(output_video, codec, vid_fps, (vid_width, vid_height))
    
    while True:
        _, img = vid.read()
        if img is None:
            print('Completed')
            break
        # 高さと幅
        height, width, _ = img.shape
        # 検出
        img_out, boxes, scores, classes = _decode.detect_image(img, True)
        # 出力動画に書き込み
        out.write(img_out)
        
        if cv2.waitKey(1) == ord('q'):
            break
    
vid.release()
out.release()
```
以下のコードをGoogle Colabで実行します．
```python
# ディレクトリの移動
%cd /content/drive/MyDrive/post_bike/keras-yolo4/
# 学習の実行
!python test_video.py
```
keras-yolo4の検出結果<br>
![keras-yolo4の検出結果](/image/keras_post_md.gif)


## まとめ
keras-yolo4でのバイク検出の転移学習を実施しましました．<br>
結構検出できていたので，次は，DEEPSORTによるトラッキング」・「FastMOTによるトラッキング」・「EfficientDet」を実施します．

## 参考サイト
[Ma-Dan/keras-yolo4](https://github.com/Ma-Dan/keras-yolo4)<br>
[Keras版 YOLOv4を動かしてみる。](https://ameblo.jp/sijukara-tama/entry-12641048746.html)<br>
[Windows 10上のDarknetでYolo v3をトレーニングしOpenCVから使ってみる](https://nixeneko.hatenablog.com/entry/2018/08/15/000000)<br>
[Python, OpenCVで画像ファイルの読み込み、保存（imread, imwrite）](https://note.nkmk.me/python-opencv-imread-imwrite/)<br>
[Python, OpenCVで図形描画（線、長方形、円、矢印、文字など）](https://note.nkmk.me/python-opencv-draw-function/)<br>
[FFmpegで動画をGIFに変換](https://qiita.com/wMETAw/items/fdb754022aec1da88e6e)


<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>