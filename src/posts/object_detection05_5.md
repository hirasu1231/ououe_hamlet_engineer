---
display: home
title: 'Python + Google Colab + keras-yolo4でバイク検出を通常学習する'
description: COCOデータセットから特定のクラスの画像を抽出し，アノテーション情報を整形したので，keras-yolo4での通常学習を実施します．
date: 2021-03-02
image: https://www.hamlet-engineer.com/image/keras.png
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
COCOデータセットから特定のクラスの画像を抽出し，アノテーション情報を整形したので，keras-yolo4での通常学習を実施します．


<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

最終的に，Youtubeの[平成24年 元旦配達出発式](https://www.youtube.com/watch?v=wnRH3-CIk4I)のIDを振り分けるトラッキングも含めたバイクのカウントを実施します．

[[toc]]

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

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

### train.pyの書き換え
ダウンロードしたkeras-yolo4に移動して，train.pyの設定をイジって実行準備をします．<br>
annotation_train_pathとannotation_val_pathは学習・評価用のデータ，log_dirはモデルの出力先，classes_pathはクラスのリストを示します．
書き換えの箇所は、下記の通りです。

#### 書換箇所1:入力ファイルの変更
入力ファイルの設定を任意のファイルに変更します。

```python
def _main():
    (省略)
    # 書換箇所1:*入力ファイルの変更
    annotation_train_path = 'keras_bike/train.txt' 
    annotation_val_path = 'keras_bike/val.txt' 
    log_dir = 'logs/keras_bike/'
    classes_path = 'keras_bike/yolov4_bike.txt'  
    # 書換箇所1_END
```

#### 書換箇所2:学習済みモデルの流用(固定)設定
学習済みモデルをどの層まで固定するかを設定します。
固定する層の設定を変えたい場合は下記の箇所を書き換えてください。

```python
def _main():
    (省略)
    # 書換箇所2:学習済みモデルの流用(固定)設定
    # weights_path：重みの読み込み
    # load_pretrained：初期値として学習済みモデルを使用
    # freeze_body：固定の仕方の設定
    # 1:250層目の特徴量抽出層までを固定
    # 2:出力直前の3層前までを固定
    model, model_body = create_model(input_shape, anchors_stride_base, num_classes, load_pretrained=True, freeze_body=2, weights_path='yolo4_weight.h5')
    # 書換箇所2_END
```

#### 書換箇所3:評価データの設定
デフォルトのコードでは任意の評価データで入力できないので、下記の通りに書き換えます。

```python
def _main():
    (省略)
    # 書換箇所3:評価データの設定
    # eval_file='2012_val.txt' -> eval_file=annotation_val_path
    evaluation = Evaluate(model_body=model_body,
                          anchors=anchors, class_names=class_index,
                          score_threshold=0.05, tensorboard=logging,
                          weighted_average=True,
                          eval_file=annotation_val_path, log_dir=log_dir)
    # 書換箇所3_END
```

#### 書換箇所4:転移学習の設定
下記の箇所で転移学習の設定をできます。

転移学習は初期値の重み(学習済みモデル)の大部分を固定して，一部のみを学習する手法です．

今回は**通常学習のみ**なので「if False」とします。

任意に書き換える箇所は主に下記の通りです。

- batch_size：メモリオーバーの場合は少なくします
- epochs：学習回数
- initial_epoch：学習回数の初期値(何回目の学習か)を記述します。
```python
def _main():
    (省略)
    # 書換箇所4:転移学習の設定
    if False:
        model.compile(optimizer=Adam(lr=1e-3), loss={'yolo_loss': lambda y_true, y_pred: y_pred})

        batch_size = 16
        print('Train on {} samples, val on {} samples, with batch size {}.'.format(num_train, num_val, batch_size))
        model.fit_generator(data_generator_wrapper(lines_train, batch_size, anchors_stride_base, num_classes, max_bbox_per_scale, 'train'),
                steps_per_epoch=max(1, num_train//batch_size),
                epochs=10,
                initial_epoch=0,
                callbacks=[logging, checkpoint, evaluation])
    # 書換箇所4_END
```

#### 書換箇所5:通常学習の設定
下記の箇所で通常学習の設定をできます。

ここでの通常学習は初期値の重み(学習済みモデル)の全てを学習する手法をしめしています．

今回は**通常学習のみ**なので「if True」とします。

- batch_size：メモリオーバーの場合は少なくします
- epochs：学習回数
- initial_epoch：学習回数の初期値(何回目の学習か)を記述します。

```python
def _main():
    (省略)
    # 書換箇所5:通常学習の設定
    if True:
        for i in range(len(model.layers)):
            model.layers[i].trainable = True
        model.compile(optimizer=Adam(lr=1e-5), loss={'yolo_loss': lambda y_true, y_pred: y_pred}) # recompile to apply the change
        print('Unfreeze all of the layers.')

        batch_size = 4 # note that more GPU memory is required after unfreezing the body
        print('Train on {} samples, val on {} samples, with batch size {}.'.format(num_train, num_val, batch_size))
        model.fit_generator(data_generator_wrapper(lines_train, batch_size, anchors_stride_base, num_classes, max_bbox_per_scale, 'train'),
            steps_per_epoch=max(1, num_train//batch_size),
            epochs=65,
            initial_epoch=0,
            callbacks=[logging, checkpoint, reduce_lr, early_stopping, evaluation])
    # 書換箇所5_END
```

### 学習の実行
下記のコードで学習を実行します．
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
keras-yolo4でのバイク検出の通常学習を実施しましました．<br>
結構検出できていたので，次は，DEEPSORTによるトラッキング」・「FastMOTによるトラッキング」・「EfficientDet」を実施します．

## 参考サイト
[Ma-Dan/keras-yolo4](https://github.com/Ma-Dan/keras-yolo4)<br>
[Keras版 YOLOv4を動かしてみる。](https://ameblo.jp/sijukara-tama/entry-12641048746.html)<br>
[Windows 10上のDarknetでYolo v3をトレーニングしOpenCVから使ってみる](https://nixeneko.hatenablog.com/entry/2018/08/15/000000)<br>
[Python, OpenCVで画像ファイルの読み込み、保存（imread, imwrite）](https://note.nkmk.me/python-opencv-imread-imwrite/)<br>
[Python, OpenCVで図形描画（線、長方形、円、矢印、文字など）](https://note.nkmk.me/python-opencv-draw-function/)<br>
[FFmpegで動画をGIFに変換](https://qiita.com/wMETAw/items/fdb754022aec1da88e6e)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>