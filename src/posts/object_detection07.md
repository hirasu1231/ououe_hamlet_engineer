---
display: home
title: 'Python + Google Colab + yolov4-deepsortでバイクをカウントする'
description: バイク検出のモデルを作成いたしましたので，DeepSortというトラッキング(物体追跡)を使いIDを振り分けることでバイクカウントを実施します．
date: 2021-03-04
image: /image/count_bike.png
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - 物体検出
  - YOLO
  - トラッキング
  - Google Colab
---
バイク検出のモデルを作成いたしましたので，DeepSortというトラッキング(物体追跡)を使い，Youtubeの[平成24年 元旦配達出発式](https://www.youtube.com/watch?v=wnRH3-CIk4I)のバイクをカウントします．<br>
<!-- more -->

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

## Google Colabのファイル構成
プロジェクトディレクトリはpost_bikeとしています．度々，省略しています．
```
post_bike
├── /yolov4-deepsort
│   ├── /checkpoints
│   │   └── /yolov4-416
│   │       └── saved_model.pb
│   ├── /outputs
│   │   └── demo.mp4
│   ├── /data
│   │   └── yolov4.weights
│   ├── /core
│   │   └── config.py
│   ├── /deep_sort
│   │   └── tracker.py
│   ├── /post_bike_weight <- 独自モデル
│   │   ├── yolov4_bike.names
│   │   └── /darknet
│   │       ├── /yolov4_bike_best.pb
│   │       └── yolov4_bike_best.weights
│   ├── object_tracker.py
│   ├── object_tracker_bike.py <- バイクカウンター
│   ├── H240101_post.mp4 <- 入力動画
│   ├── darknet_ds_post.mp4 <- 検出動画
│   ├── count_darknet_ds_post.mp4 <- カウント動画
│   └── (省略)
└── yolov4-deepsort.ipynb <- 実行用ノートブック
```

## DeepSort
>DeepSortは人物のトラッキングを行う機械学習モデルです。人物にIDをつけてトラッキングすることができます。<br>
従来、トラッキングでは、カルマンフィルタを使用したSortというアルゴリズムが使用されていました。YOLO v3で検出したバウンディングボックスを使用して、フレームの前後で近い大きさと近い動きのバウンディングボックスを対応づけることで、人物にIDをつけてトラッキングします。<br>
しかし、Sortでは、人物が物体の影に隠れて、再び現れた場合に違うIDがつけられてしまうという問題がありました。DeepSortでは、人物の類似性を比較するAIモデルを使用することで、この問題を解決し、人物のIDのスイッチングを減少させることができます。<br>
引用元:[DeepSort : 人物のトラッキングを行う機械学習モデル](https://medium.com/axinc/deepsort-%E4%BA%BA%E7%89%A9%E3%81%AE%E3%83%88%E3%83%A9%E3%83%83%E3%82%AD%E3%83%B3%E3%82%B0%E3%82%92%E8%A1%8C%E3%81%86%E6%A9%9F%E6%A2%B0%E5%AD%A6%E7%BF%92%E3%83%A2%E3%83%87%E3%83%AB-e8cb7410457c)


## yolov4-deepsort
### yolov4-deepsortのダウンロード
Google ColabとGoogle Driveを連携させて，gitからyolov4-deepsortをダウンロードします．
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
git clone https://github.com/theAIGuysCode/yolov4-deepsort.git
```


## yolov4-deepsortの起動チェック
正常に起動するか，デフォルトで入っている動画を検出させてチェックします．

### 初期重みのダウンロード
今回は起動するかチェックするために，YOLOv4学習済みのパラメータをダウンロードします．
```python
# ディレクトリの移動
%cd /content/drive/MyDrive/post_bike/yolov4-deepsort/data/
# 初期重みをダウンロード
!wget https://github.com/AlexeyAB/darknet/releases/download/darknet_yolo_v3_optimal/yolov4.weights
```

### モジュールのインストール
yolov4-deepsortに応じて，モジュールをインストールします．
```python
# ディレクトリの移動
%cd /content/drive/MyDrive/post_bike/yolov4-deepsort/
# TensorFlow GPU
!pip install -r requirements-gpu.txt
```
## 重みの変換
darknet用の重みをtensorflowで使えるように変換します．(./data/yolov4.weight -> ./checkpoints/yolov4-416/saved_model.pb)
```python
# ディレクトリの移動
%cd /content/drive/MyDrive/post_bike/yolov4-deepsort/
# darknet weights to tensorflow model
!python save_model.py --model yolov4 
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
object_tracker.pyを実行してdemoの検出を実施します．
```python
# ディレクトリの移動
%cd /content/drive/MyDrive/post_bike/yolov4-deepsort/
# 検出を実行
!python object_tracker.py --video ./data/video/test.mp4 --output ./outputs/demo.mp4 --model yolov4 --dont_show
```

`./outputs/demo.mp4`<br>
![](/image/demo.gif)



## yolov4-deepsortで検出
yolov4-deepsortも起動も確認できたので，yolov4-deepsortでトラッキング付きでバイク検出を実施し，バイクのカウントに向けての問題点等を整理します．<br>
今回はわりと安定して検出できたDarknetの重みを使用します．<br>

### 学習モデルの変換
Darknetで学習したモデルをtfモデルに変換します．本稿では，独自で学習したモデルをいれるために，新たなディレクトリを作成します．
```python
# ディレクトリの移動
%cd /content/drive/MyDrive/post_bike/yolov4-deepsort/
# 独自モデル用のディレクトリ作成
!mkdir -p ./post_bike_weight/darknet
!mkdir -p ./post_bike_weight/keras
!ls post_bike_weight
```

darknetからtfモデルに変換します．<br>
クラスがデフォルトでcocoの80クラスに設定されているので，`core/config.py`を更新します．<br>
`yolov4_bike.names`は[Darknet(Yolov4)で学習させるためのcfgファイル等を作成する](https://hirasu1231.github.io/hamlet_engineer/posts/2021/02/24/object-detection03.html)で作成したファイルです．
```python
# core/config.py
# 14行目を更新
__C.YOLO.CLASSES = "./post_bike_weight/yolov4_bike.names"
```
```python
# ディレクトリの移動
%cd /content/drive/MyDrive/post_bike/yolov4-deepsort/
# darknet weights to tensorflow model
!python save_model.py \
              --weights ./post_bike_weight/darknet/yolov4_bike_best.weights \
              --output ./post_bike_weight/darknet/yolov4_bike_best.pb \
              --input_size 608 \
              --model yolov4 \
# 確認
!ls post_bike_weight/darknet/

#  出力
# yolov4_bike_best.pb  yolov4_bike_best.weights
```

### yolov4-deepsortで検出
以下のコードでyolov4-deepsortでトラッキング付きでバイク検出を実施します．
```python
# ディレクトリの移動
%cd /content/drive/MyDrive/post_bike/yolov4-deepsort/
# 検出を実行
!python object_tracker.py \
            --weights  ./post_bike_weight/darknet/yolov4_bike_best.pb \
            --size 608 \
            --video H240101_post.mp4 \
            --output darknet_ds_post.mp4 \
            --model yolov4 \
            --iou 0.45 \
            --score 0.50 \
            --dont_show
!ls
# darknet_ds_post.mp4
```
`darknet_ds_post.mp4`<br>
![](/image/maxage60_df_gif.gif)

## yolov4-deepsortでバイクをカウント
yolov4-deepsortでトラッキング付きでバイク検出を実施しましたので，バイクのカウントに向けての問題点等を整理します．<br>
動画の両端に左赤，右緑の検出線を描画し，Bounding Boxが検出線を通過したらバイクをカウントするようにします．

### 課題1：バイクが半分見切れたりした際に，IDが変化する
IDの振る際に検出物の特徴も考慮しているため，半分見切れることで検出物の特徴が変化したためIDが振り直されたと思われます．<br>
検出線と交差したBounding Boxの内，Bounding Boxの座標が動画のフレーム外，または極端に左端・右端に近い場合はカウントしないものとします．
![](/image/kadai1.png)<br>


### 課題2：バイクの全体像が写っていてもIDが急に変化する
DeepSortがデフォルトの60フレーム先までの軌跡を等速直線運動で予測するので，停止線付近のバイクでも予測軌跡上にあれば，郵便局倉庫の入口付近で検出されたID:156に上書きされて検出されます．<br>
![](/image/kadai2.png)<br>
今回は，両端での検出を実施するために，予測軌跡を描くフレーム数をデフォルトで60フレーム先から15フレーム先に変更する．<br>
`./deep_sort/tracker.py`の40行目 max_age=15<br>
```python
# ./deep_sort/tracker.p
# 40行目
def __init__(self, metric, max_iou_distance=0.7, max_age=15, n_init=3):
```


### 課題3：バイクのが重なり合って，奥側のバイクが検出できない．
画角が低くバイクのが重なり合って，奥側のバイクが検出されません．<br>
![](/image/kadai3.png)<br>
以下の3案から考慮し最善と思われる案1を採用します，
- (○)案1:検出線をバイクが重なりにくいところに設置する
    - 停止線の付近ではバイクの重なりが多く検出もれが多くなります．検出動画からすると，左は出口専用の看板付近，右は黄色ポールの付近に鉛直方向に描画するのが良いと思われます．
![](/image/an_1.png)<br>
<br>
- (△)案2:検出を線ではなく領域とする．
    - 検出物であるバイクの重なりが多い本動画では領域で検出すると，重なりが取れた後にIDが変化し，過剰にカウントされる可能性があるため，あまり良い案とは思えません．
    - 重なりが取れた後のID変化を防ぐために，max_ageの数値を大きくすることも考えられますが，本動画ではバイクの移動距離が短く予測軌跡が特定の場所で留まることが多いため，どちらにしろ，過剰にカウントされる可能性があります．
![](/image/an_2.png)<br>
<br>
- (△)案3:検出線を動画の端と駐車場の出口で複数用意する．
    - 案2と同様に，重なりが取れた後にIDが変化し過剰にカウントされる可能性があるため，あまり良い案とは思えない．
![](/image/an_3.png)<br>

### カウントの条件
カウントする条件をif文を記述し，リストにIDを追加するようにする．条件は以下ようにしました．
- Bounding Boxが検出線を交差する．
- リストに追加済みのIDは追加しない．
- Bounding Boxが動画のフレーム外にある場合はリストに追加しない．

以下はカウントの条件を考慮して，バイクをカウントするコードを簡単に示したものです．
```python
# 線分p1-p2と線分p3-p4の交差
# p1 =  (0, 0)
def intersect(p1, p2, p3, p4):
    tc1 = (p1[0] - p2[0]) * (p3[1] - p1[1]) + (p1[1] - p2[1]) * (p1[0] - p3[0])
    tc2 = (p1[0] - p2[0]) * (p4[1] - p1[1]) + (p1[1] - p2[1]) * (p1[0] - p4[0])
    td1 = (p3[0] - p4[0]) * (p1[1] - p3[1]) + (p3[1] - p4[1]) * (p3[0] - p1[0])
    td2 = (p3[0] - p4[0]) * (p2[1] - p3[1]) + (p3[1] - p4[1]) * (p3[0] - p2[0])
    return tc1*tc2<0 and td1*td2<0

# カウントリスト
# 右の検出線
rd1, rd2 = (1700, 250), (1700, height)
right_conter = []
# 左の検出線
ld1, ld2 = (250, 250), (250, height)
left_conter = []

# while video is running(動画のフレームごとで検出)
while True:
    '''
    (省略)
    DeepSortでBounding Boxの座標を取得するコード
    bbox = [左上のx座標, 左上のy座標, 右下のx座標, 右下のy座標]
    '''

    # Bounding Boxの座標
    tr, lb = (int(bbox[0]), int(bbox[1])), (int(bbox[2]), int(bbox[3]))
    
    # 右側カウンター
    # Bounding Boxと検出線の交差するかどうか
    r_bb_cross = intersect(tr, lb, rd1, rd2)
    # 新規のIDかどうか
    r_added = track.track_id not in right_conter
    # Bounding Boxが動画のフレーム外にあるか
    r_not_video = tr[0]>0 or lb[0]<width
    # 条件を照査
    if r_bb_cross and r_added and r_not_video:
        right_conter.append(track.track_id)
    
    # 左側カウンター
    # Bounding Boxと検出線の交差するかどうか
    l_bb_cross = intersect(tr, lb, ld1, ld2)
    # 新規のIDかどうか
    l_added = track.track_id not in left_conter
    # Bounding Boxが動画のフレーム外にあるか
    l_not_video = tr[0]>0 or lb[0]<width
    # 条件を照査
    if l_bb_cross and l_added and l_not_video:
        left_conter.append(track.track_id)
    
    # バイクカウントの様子を描画
    # 左の検出線
    cv2.line(frame, ld1, ld2, (0, 255, 0), thickness=2)
    cv2.putText(frame, "LEFT : {}".format(len(left_conter)),(150, 230),0, 1, (0, 255, 0),2)
    
    # 右の検出線
    cv2.line(frame, rd1, rd2, (255, 0, 0), thickness=2)
    cv2.putText(frame, "RIGHT : {}".format(len(right_conter)),(1600, 230),0, 1, (255, 0, 0),2)
```

### yolov4-deepsortでバイクをカウント
独自で設定したカウントの条件を`object_tracker.py`に組み込んだ`object_tracker_bike.py`を作成します．
```python
# object_tracker_bike.py
import os
# comment out below line to enable tensorflow logging outputs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import time
import tensorflow as tf
physical_devices = tf.config.experimental.list_physical_devices('GPU')
if len(physical_devices) > 0:
    tf.config.experimental.set_memory_growth(physical_devices[0], True)
from absl import app, flags, logging
from absl.flags import FLAGS
import core.utils as utils
from core.yolov4 import filter_boxes
from tensorflow.python.saved_model import tag_constants
from core.config import cfg
from PIL import Image
import cv2
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.compat.v1 import ConfigProto
from tensorflow.compat.v1 import InteractiveSession
# deep sort imports
from deep_sort import preprocessing, nn_matching
from deep_sort.detection import Detection
from deep_sort.tracker import Tracker
from tools import generate_detections as gdet
flags.DEFINE_string('framework', 'tf', '(tf, tflite, trt')
flags.DEFINE_string('weights', './checkpoints/yolov4-416',
                    'path to weights file')
flags.DEFINE_integer('size', 416, 'resize images to')
flags.DEFINE_boolean('tiny', False, 'yolo or yolo-tiny')
flags.DEFINE_string('model', 'yolov4', 'yolov3 or yolov4')
flags.DEFINE_string('video', './data/video/test.mp4', 'path to input video or set to 0 for webcam')
flags.DEFINE_string('output', None, 'path to output video')
flags.DEFINE_string('output_format', 'XVID', 'codec used in VideoWriter when saving video to file')
flags.DEFINE_float('iou', 0.45, 'iou threshold')
flags.DEFINE_float('score', 0.50, 'score threshold')
flags.DEFINE_boolean('dont_show', False, 'dont show video output')
flags.DEFINE_boolean('info', False, 'show detailed info of tracked objects')
flags.DEFINE_boolean('count', False, 'count objects being tracked on screen')


# 線分p1-p2と線分p3-p4の交差
# p1 =  (0, 0)
def intersect(p1, p2, p3, p4):
    tc1 = (p1[0] - p2[0]) * (p3[1] - p1[1]) + (p1[1] - p2[1]) * (p1[0] - p3[0])
    tc2 = (p1[0] - p2[0]) * (p4[1] - p1[1]) + (p1[1] - p2[1]) * (p1[0] - p4[0])
    td1 = (p3[0] - p4[0]) * (p1[1] - p3[1]) + (p3[1] - p4[1]) * (p3[0] - p1[0])
    td2 = (p3[0] - p4[0]) * (p2[1] - p3[1]) + (p3[1] - p4[1]) * (p3[0] - p2[0])
    return tc1*tc2<0 and td1*td2<0

def main(_argv):
    # Definition of the parameters(検出の閾値)
    max_cosine_distance = 0.4
    nn_budget = None
    nms_max_overlap = 1.0
    
    # initialize deep sort(deep sortの初期化)
    model_filename = 'model_data/mars-small128.pb'
    encoder = gdet.create_box_encoder(model_filename, batch_size=1)
    # calculate cosine distance metric
    metric = nn_matching.NearestNeighborDistanceMetric("cosine", max_cosine_distance, nn_budget)
    # initialize tracker
    tracker = Tracker(metric)

    # load configuration for object detector(検出の設定)
    config = ConfigProto()
    config.gpu_options.allow_growth = True
    session = InteractiveSession(config=config)
    STRIDES, ANCHORS, NUM_CLASS, XYSCALE = utils.load_config(FLAGS)
    input_size = FLAGS.size
    video_path = FLAGS.video

    # load tflite model if flag is set(モデルの読み込み)
    if FLAGS.framework == 'tflite':
        interpreter = tf.lite.Interpreter(model_path=FLAGS.weights)
        interpreter.allocate_tensors()
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()
        print(input_details)
        print(output_details)
    # otherwise load standard tensorflow saved model
    else:
        saved_model_loaded = tf.saved_model.load(FLAGS.weights, tags=[tag_constants.SERVING])
        infer = saved_model_loaded.signatures['serving_default']

    # begin video capture(入力動画の読み込み)
    try:
        vid = cv2.VideoCapture(int(video_path))
    except:
        vid = cv2.VideoCapture(video_path)

    out = None

    # get video ready to save locally if flag is set(出力動画の設定)
    if FLAGS.output:
        # by default VideoCapture returns float instead of int
        width = int(vid.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = int(vid.get(cv2.CAP_PROP_FPS))
        codec = cv2.VideoWriter_fourcc(*FLAGS.output_format)
        out = cv2.VideoWriter(FLAGS.output, codec, fps, (width, height))
        
    # カウントリスト
    # 右の検出線
    rd1, rd2 = (1700, 250), (1700, height)
    right_conter = []
    # 左の検出線
    ld1, ld2 = (250, 250), (250, height)
    left_conter = []
    
    frame_num = 0
    # while video is running(動画のフレームごとで検出)
    while True:
        return_value, frame = vid.read()
        if return_value:
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image = Image.fromarray(frame)
        else:
            print('Video has ended or failed, try a different video format!')
            break
        
        # if frame_num > 600:
        #     break
        
        frame_num +=1
        print('Frame #: ', frame_num)
        frame_size = frame.shape[:2]
        image_data = cv2.resize(frame, (input_size, input_size))
        image_data = image_data / 255.
        image_data = image_data[np.newaxis, ...].astype(np.float32)
        start_time = time.time()

        # run detections on tflite if flag is set
        if FLAGS.framework == 'tflite':
            interpreter.set_tensor(input_details[0]['index'], image_data)
            interpreter.invoke()
            pred = [interpreter.get_tensor(output_details[i]['index']) for i in range(len(output_details))]
            # run detections using yolov3 if flag is set
            if FLAGS.model == 'yolov3' and FLAGS.tiny == True:
                boxes, pred_conf = filter_boxes(pred[1], pred[0], score_threshold=0.25,
                                                input_shape=tf.constant([input_size, input_size]))
            else:
                boxes, pred_conf = filter_boxes(pred[0], pred[1], score_threshold=0.25,
                                                input_shape=tf.constant([input_size, input_size]))
        else:
            batch_data = tf.constant(image_data)
            pred_bbox = infer(batch_data)
            for key, value in pred_bbox.items():
                boxes = value[:, :, 0:4]
                pred_conf = value[:, :, 4:]

        boxes, scores, classes, valid_detections = tf.image.combined_non_max_suppression(
            boxes=tf.reshape(boxes, (tf.shape(boxes)[0], -1, 1, 4)),
            scores=tf.reshape(
                pred_conf, (tf.shape(pred_conf)[0], -1, tf.shape(pred_conf)[-1])),
            max_output_size_per_class=50,
            max_total_size=50,
            iou_threshold=FLAGS.iou,
            score_threshold=FLAGS.score
        )

        # convert data to numpy arrays and slice out unused elements
        num_objects = valid_detections.numpy()[0]
        bboxes = boxes.numpy()[0]
        bboxes = bboxes[0:int(num_objects)]
        scores = scores.numpy()[0]
        scores = scores[0:int(num_objects)]
        classes = classes.numpy()[0]
        classes = classes[0:int(num_objects)]

        # format bounding boxes from normalized ymin, xmin, ymax, xmax ---> xmin, ymin, width, height
        original_h, original_w, _ = frame.shape
        bboxes = utils.format_boxes(bboxes, original_h, original_w)

        # store all predictions in one parameter for simplicity when calling functions
        pred_bbox = [bboxes, scores, classes, num_objects]

        # read in all class names from config
        class_names = utils.read_class_names(cfg.YOLO.CLASSES)

        # by default allow all classes in .names file
        allowed_classes = list(class_names.values())
        
        # custom allowed classes (uncomment line below to customize tracker for only people)
        #allowed_classes = ['person']

        # loop through objects and use class index to get class name, allow only classes in allowed_classes list
        names = []
        deleted_indx = []
        for i in range(num_objects):
            class_indx = int(classes[i])
            class_name = class_names[class_indx]
            if class_name not in allowed_classes:
                deleted_indx.append(i)
            else:
                names.append(class_name)
        names = np.array(names)
        count = len(names)
        if FLAGS.count:
            cv2.putText(frame, "Objects being tracked: {}".format(count), (5, 35), cv2.FONT_HERSHEY_COMPLEX_SMALL, 2, (0, 255, 0), 2)
            print("Objects being tracked: {}".format(count))
        # delete detections that are not in allowed_classes
        bboxes = np.delete(bboxes, deleted_indx, axis=0)
        scores = np.delete(scores, deleted_indx, axis=0)

        # encode yolo detections and feed to tracker
        features = encoder(frame, bboxes)
        detections = [Detection(bbox, score, class_name, feature) for bbox, score, class_name, feature in zip(bboxes, scores, names, features)]

        #initialize color map
        cmap = plt.get_cmap('tab20b')
        colors = [cmap(i)[:3] for i in np.linspace(0, 1, 20)]

        # run non-maxima supression
        boxs = np.array([d.tlwh for d in detections])
        scores = np.array([d.confidence for d in detections])
        classes = np.array([d.class_name for d in detections])
        indices = preprocessing.non_max_suppression(boxs, classes, nms_max_overlap, scores)
        detections = [detections[i] for i in indices]       

        # Call the tracker
        tracker.predict()
        tracker.update(detections)

        # update tracks
        for track in tracker.tracks:
            if not track.is_confirmed() or track.time_since_update > 1:
                continue 
            bbox = track.to_tlbr()
            class_name = track.get_class()
            
            # draw bbox on screen(Bounding Boxの描画)
            color = colors[int(track.track_id) % len(colors)]
            color = [i * 255 for i in color]
            cv2.rectangle(frame, (int(bbox[0]), int(bbox[1])), (int(bbox[2]), int(bbox[3])), color, 2)
            cv2.rectangle(frame, (int(bbox[0]), int(bbox[1]-30)), (int(bbox[0])+(len(class_name)+len(str(track.track_id)))*17, int(bbox[1])), color, -1)
            cv2.putText(frame, class_name + "-" + str(track.track_id),(int(bbox[0]), int(bbox[1]-10)),0, 0.75, (255,255,255),2)
            
            # Bounding Boxの座標
            tr, lb = (int(bbox[0]), int(bbox[1])), (int(bbox[2]), int(bbox[3]))
            
            # 右側カウンター
            # Bounding Boxと検出線の交差するかどうか
            r_bb_cross = intersect(tr, lb, rd1, rd2)
            # 新規のIDかどうか
            r_added = track.track_id not in right_conter
            # Bounding Boxが動画のフレーム外にあるか
            r_not_video = tr[0]>0 or lb[0]<width
            # 条件を照査
            if r_bb_cross and r_added and r_not_video:
                right_conter.append(track.track_id)
            
            # 左側カウンター
            # Bounding Boxと検出線の交差するかどうか
            l_bb_cross = intersect(tr, lb, ld1, ld2)
            # 新規のIDかどうか
            l_added = track.track_id not in left_conter
            # Bounding Boxが動画のフレーム外にあるか
            l_not_video = tr[0]>0 or lb[0]<width
            # 条件を照査
            if l_bb_cross and l_added and l_not_video:
                left_conter.append(track.track_id)
            

        # if enable info flag then print details about each track
            if FLAGS.info:
                print("Tracker ID: {}, Class: {},  BBox Coords (xmin, ymin, xmax, ymax): {}".format(str(track.track_id), class_name, (int(bbox[0]), int(bbox[1]), int(bbox[2]), int(bbox[3]))))
                
        # バイクカウントの様子を描画
        # 左の検出線
        cv2.line(frame, ld1, ld2, (0, 255, 0), thickness=2)
        cv2.putText(frame, "LEFT : {}".format(len(left_conter)),(150, 230),0, 1, (0, 255, 0),2)
        
        # 右の検出線
        cv2.line(frame, rd1, rd2, (255, 0, 0), thickness=2)
        cv2.putText(frame, "RIGHT : {}".format(len(right_conter)),(1600, 230),0, 1, (255, 0, 0),2)

        # calculate frames per second of running detections
        fps = 1.0 / (time.time() - start_time)
        print("FPS: %.2f" % fps)
        result = np.asarray(frame)
        result = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        
        if not FLAGS.dont_show:
            cv2.imshow("Output Video", result)
        
        # if output flag is set, save video file
        if FLAGS.output:
            out.write(result)
        if cv2.waitKey(1) & 0xFF == ord('q'): break
    cv2.destroyAllWindows()

if __name__ == '__main__':
    try:
        app.run(main)
    except SystemExit:
        pass

```

独自で設定したカウントの条件を組み込んだ`object_tracker_bike.py`を実行します．
```python
# ディレクトリの移動
%cd /content/drive/MyDrive/post_bike/yolov4-deepsort/
# 検出を実行
!python object_tracker_bike.py \
            --weights  ./post_bike_weight/darknet/yolov4_bike_best.pb \
            --size 608 \
            --video H240101_post.mp4 \
            --output count_darknet_ds_post.mp4 \
            --model yolov4 \
            --iou 0.45 \
            --score 0.50 \
            --dont_show
```

`count_darknet_ds_post.mp4`<br>
![](/image/count_gif.gif)

### yolov4-deepsortでバイクをカウント結果
yolov4-deepsortでバイクをカウント結果は，実際のものと左右ともに2台の誤差がありました．<br>
バイクが2台重なって検出されなかったり，バイクが見切れた際に前部と後部で別のIDが振られるなどした過検出が見られました．<br>
`自分でカウントした結果`
- 左(自分で)　バイク72台
- 左(yolov4)　バイク系70台
- 右(自分で)　バイク系62台
- 右(yolov4)　バイク系60台


## まとめ
yolov4-deepsortでバイクのカウントを実施しました．<br>
今回のように，画角が低いカメラ位置だとバイクの重複がありますので，少々カウントミスがありました．<br>
また，時間をかけて傾向を見てみたいと思います．<br>


## 参考サイト
[theAIGuysCode/yolov4-deepsort](https://github.com/theAIGuysCode/yolov4-deepsort)<br>
[Pythonのdequeでキュー、スタック、デック（両端キュー）を扱う](https://note.nkmk.me/python-collections-deque/)<br>
[DeepSort : 人物のトラッキングを行う機械学習モデル](https://medium.com/axinc/deepsort-%E4%BA%BA%E7%89%A9%E3%81%AE%E3%83%88%E3%83%A9%E3%83%83%E3%82%AD%E3%83%B3%E3%82%B0%E3%82%92%E8%A1%8C%E3%81%86%E6%A9%9F%E6%A2%B0%E5%AD%A6%E7%BF%92%E3%83%A2%E3%83%87%E3%83%AB-e8cb7410457c)<br>
[TensorFlow2でDeepSORTを使用したオブジェクトトラッキング](https://ichi.pro/tensorflow-2-de-deepsort-o-shiyoshita-obujyekuto-torakkingu-259490015275855)
