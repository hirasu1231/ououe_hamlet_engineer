---
display: home
title: 'Python + Google Colab + Darknet(Yolov4)でバイク検出を学習する'
description: COCOデータセットから特定のクラスの画像を抽出し，アノテーション情報を整形したので，Darknet(Yolov4)での学習を実施します．
date: 2021-02-25
image: /image/yolov4_post.png
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - 物体検出
  - YOLO
  - Darknet
  - Google Colab
---
COCOデータセットから特定のクラスの画像を抽出し，アノテーション情報を整形したので，Darknet(Yolov4)での学習を実施します．<br>
<!-- more -->

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

最終的に，Youtubeの[平成24年 元旦配達出発式](https://www.youtube.com/watch?v=wnRH3-CIk4I)のIDを振り分けるトラッキングも含めたバイクのカウントを実施します．

## Google Colabのファイル構成
プロジェクトディレクトリはpost_bikeとしています．度々，省略しています．
```
post_bike
├── /darknet
│   ├── darknet <- 学習実行ファイル
│   ├── /backup <- 学習モデルの保存先
│   │   ├── yolov4_bike_1000.weights
│   │   ├── yolov4_bike_2000.weights
│   │   ├── yolov4_bike_3000.weights
│   │   ├── yolov4_bike_4000.weights
│   │   ├── yolov4_bike_5000.weights
│   │   ├── yolov4_bike_best.weights
│   │   ├── yolov4_bike_last.weights
│   │   └── yolov4_bike_final.weights
│   ├── darknet4_bike.zip <- 学習データ解凍前
│   ├── /darknet4_bike <- 学習データ
│   ├── chart.png
│   ├── chart_yolov4_bike.png
│   ├── darknet_bike_video.py
│   ├── yolov4.weights
│   ├── yolov4.conv.137
│   ├── H240101_post.mp4 <- 元動画
│   ├── yolov4_post.mp4 <- 検出動画
│   └── (省略)
└── darknet4.ipynb <- 実行用ノートブック
```

## Darknet
### Darknetとは
C言語で書かれたオープンソースのニューラルネットフレームワークでインストールが容易で試しやすいです．

### darknetのダウンロード
Google ColabとGoogle Driveを連携させて，gitからdarknetをダウンロードします．
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
git clone https://github.com/AlexeyAB/darknet.git
```

### darknetの環境設定
ダウンロードしたdarknetのフォルダに移動して，darknetの設定をイジって環境構築します．<br>
Makefileは以下のように書き換えます．
```ini
# Makefile
GPU=1
CUDNN=1
CUDNN_HALF=1
OPENCV=1
AVX=0
OPENMP=0
LIBSO=1
```
Makefileを実行してdarknetの環境を整備します．<br>
一度Makefileを実行した後に，Makefileまたは.cファイルを書き換えて変更箇所を反映させたい場合は，`make clean`で初期化してから再度，Makefileを実行してください．
```python
%%bash
# ディレクトリの移動
cd /content/drive/MyDrive/post_bike/darknet/
# Makefileの実行
make
# Makefileの初期化
# make clean
```

僕の場合は，以下のような中途半端なテキストが帰ってきましたが，環境構築は正常にされていました．
```
~~~~~~~~~~~~~~~~~~~~
src/yolo_console_dll.cpp:201:62: warning: comparison between signed and unsigned integer expressions [-Wsign-compare]
                 int const max_width_3d = (text_size_3d.width > i.w + 2) ? text_size_3d.width : (i.w + 2);
                                           ~~~~~~~~~~~~~~~~~~~^~~~~~~~~
src/yolo_console_dll.cpp:183:15: warning: unused variable ‘colors’ [-Wunused-variable]
     int const colors[6][3] = { { 1,0,1 },{ 0,0,1 },{ 0,1,1 },{ 0,1,0 },{ 1,1,0 },{ 1,0,0 } };
               ^~~~~~
```

## darknetの起動チェック
正常に起動するか，デフォルトで入っている画像を検出させてチェックします．

### 初期重みのダウンロード
正常に起動するか，チェックするために，YOLOv4の学習済みモデルをダウンロードします．
```python
%%bash
# ディレクトリの移動
cd /content/drive/MyDrive/post_bike/darknet/
# 学習済みモデルの重みのダウンロード
wget https://github.com/AlexeyAB/darknet/releases/download/darknet_yolo_v3_optimal/yolov4.weights -O yolov4.weights 
```

### 学習済みモデルで検出
ダウンロードした学習済みモデルで1つの画像を検出します．
```python
# ディレクトリの移動
%cd /content/drive/MyDrive/post_bike/darknet/
#実行権限を付与
!chmod +x ./darknet
# 起動チェック
!./darknet detector test cfg/coco.data cfg/yolov4.cfg yolov4.weights data/person.jpg
```
person.jpgの検出結果
![](/image/result4.jpg)

## Darknet(Yolov4)での学習
環境構築も確認できたので，Darknet(Yolov4)でバイク検出の学習を実施します．

### 学習データのアップロード
僕の経験の話になりますが，Google Colabを使う場合は，zip圧縮してからGoogle Driveにアップロードして，Google Colabのノートブック上で解凍させた方がエラーもなく早い感じがするので，ここではそのコードをあげます．
```python
# ディレクトリの移動
%cd /content/drive/MyDrive/post_bike/darknet/
# 学習データの解凍
!unzip darknet4_bike.zip > /dev/null
```

### 学習の実行(Yolov4)
データの解凍も終わったので，重みの初期値として`yolov4.conv.137`を使い，学習を実行します．本稿は5000回で学習を終えます．<br>
学習(lossとmap)の様子は，chart_yolov4_bike.pngという画像ファイルで逐次出力されます．<br>
また，`-map`というコマンドにより，mapという評価データでどれほど的中しているかを示す数値もchart_yolov4_bike.pngの中に記述されます．<br>
train_log.txtとして学習時のログも保存しています．<br>
.cfgファイルと.dataファイルは自作データのものを読み込ませているか確認してください．

```python
# ディレクトリの移動
%cd /content/drive/MyDrive/post_bike/darknet/
# 実行権限を付与
!chmod +x ./darknet
# Yolov4の学習用の初期重み
!wget https://github.com/AlexeyAB/darknet/releases/download/darknet_yolo_v3_optimal/yolov4.conv.137 -O yolov4.conv.137

# 学習の実行(Yolov4)
# ドキュメント例：./darknet detector train data/obj.data yolo-obj.cfg yolov4.conv.137  -map
!./darknet detector train darknet4_bike/yolov4_bike.data darknet4_bike/yolov4_bike.cfg yolov4.conv.137 -dont_show -mjpeg_port 8090 -map > backup/train_log.txt
```
学習推移
![学習推移](/image/chart_yolov4_bike.png)

## 検出の実行
学習したモデルでYoutubeの[平成24年 元旦配達出発式](https://www.youtube.com/watch?v=wnRH3-CIk4I)の検出を実行します．<br>
デフォルトで用意されている`darknet_video.py`だと描画されるBountingBoxの線が薄い上に，検出スコアの文字が邪魔なので少し改変したコードを実行します．

```python
# darknet_bike_video.py
from ctypes import *
import random
import os
import cv2
import time
import darknet
import argparse
from threading import Thread, enumerate
from queue import Queue


def parser():
    parser = argparse.ArgumentParser(description="YOLO Object Detection")
    parser.add_argument("--input", type=str, default=0,
                        help="video source. If empty, uses webcam 0 stream")
    parser.add_argument("--out_filename", type=str, default="",
                        help="inference video name. Not saved if empty")
    parser.add_argument("--weights", default="yolov4.weights",
                        help="yolo weights path")
    parser.add_argument("--dont_show", action='store_true',
                        help="windown inference display. For headless systems")
    parser.add_argument("--ext_output", action='store_true',
                        help="display bbox coordinates of detected objects")
    parser.add_argument("--config_file", default="./cfg/yolov4.cfg",
                        help="path to config file")
    parser.add_argument("--data_file", default="./cfg/coco.data",
                        help="path to data file")
    parser.add_argument("--thresh", type=float, default=.25,
                        help="remove detections with confidence below this value")
    return parser.parse_args()


def str2int(video_path):
    """
    argparse returns and string althout webcam uses int (0, 1 ...)
    Cast to int if needed
    """
    try:
        return int(video_path)
    except ValueError:
        return video_path


def check_arguments_errors(args):
    assert 0 < args.thresh < 1, "Threshold should be a float between zero and one (non-inclusive)"
    if not os.path.exists(args.config_file):
        raise(ValueError("Invalid config path {}".format(os.path.abspath(args.config_file))))
    if not os.path.exists(args.weights):
        raise(ValueError("Invalid weight path {}".format(os.path.abspath(args.weights))))
    if not os.path.exists(args.data_file):
        raise(ValueError("Invalid data file path {}".format(os.path.abspath(args.data_file))))
    if str2int(args.input) == str and not os.path.exists(args.input):
        raise(ValueError("Invalid video path {}".format(os.path.abspath(args.input))))


def set_saved_video(input_video, output_video, size):
    fourcc = cv2.VideoWriter_fourcc(*"MJPG")
    fps = int(input_video.get(cv2.CAP_PROP_FPS))
    video = cv2.VideoWriter(output_video, fourcc, fps, size)
    return video


def video_capture(frame_queue, darknet_image_queue):
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame_resized = cv2.resize(frame_rgb, (width, height),
                                   interpolation=cv2.INTER_LINEAR)
        frame_queue.put(frame_resized)
        img_for_detect = darknet.make_image(width, height, 3)
        darknet.copy_image_from_bytes(img_for_detect, frame_resized.tobytes())
        darknet_image_queue.put(img_for_detect)
    cap.release()


def inference(darknet_image_queue, detections_queue, fps_queue):
    while cap.isOpened():
        darknet_image = darknet_image_queue.get()
        prev_time = time.time()
        detections = darknet.detect_image(network, class_names, darknet_image, thresh=args.thresh)
        detections_queue.put(detections)
        fps = int(1/(time.time() - prev_time))
        fps_queue.put(fps)
        print("FPS: {}".format(fps))
        darknet.print_detections(detections, args.ext_output)
        darknet.free_image(darknet_image)
    cap.release()
    
    
def bbox2points(bbox):
    """
    From bounding box yolo format
    to corner points cv2 rectangle
    """
    x, y, w, h = bbox
    xmin = int(round(x - (w / 2)))
    xmax = int(round(x + (w / 2)))
    ymin = int(round(y - (h / 2)))
    ymax = int(round(y + (h / 2)))
    return xmin, ymin, xmax, ymax
    
    
def draw_boxes(detections, image, colors):
    import cv2
    for label, confidence, bbox in detections:
        left, top, right, bottom = bbox2points(bbox)
        cv2.rectangle(image, (left, top), (right, bottom), [255, 0, 0], 2)
        # cv2.putText(image, "{} [{:.2f}]".format(label, float(confidence)),
        #             (left, top - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
        #             colors[label], 2)
    return image


def drawing(frame_queue, detections_queue, fps_queue):
    random.seed(3)  # deterministic bbox colors
    video = set_saved_video(cap, args.out_filename, (width, height))
    while cap.isOpened():
        frame_resized = frame_queue.get()
        detections = detections_queue.get()
        fps = fps_queue.get()
        if frame_resized is not None:
            image = draw_boxes(detections, frame_resized, class_colors)
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            if args.out_filename is not None:
                video.write(image)
            if not args.dont_show:
                cv2.imshow('Inference', image)
            if cv2.waitKey(fps) == 27:
                break
    cap.release()
    video.release()
    cv2.destroyAllWindows()


if __name__ == '__main__':
    frame_queue = Queue()
    darknet_image_queue = Queue(maxsize=1)
    detections_queue = Queue(maxsize=1)
    fps_queue = Queue(maxsize=1)

    args = parser()
    check_arguments_errors(args)
    network, class_names, class_colors = darknet.load_network(
            args.config_file,
            args.data_file,
            args.weights,
            batch_size=1
        )
    width = darknet.network_width(network)
    height = darknet.network_height(network)
    input_path = str2int(args.input)
    cap = cv2.VideoCapture(input_path)
    Thread(target=video_capture, args=(frame_queue, darknet_image_queue)).start()
    Thread(target=inference, args=(darknet_image_queue, detections_queue, fps_queue)).start()
    Thread(target=drawing, args=(frame_queue, detections_queue, fps_queue)).start()
```

以下のコードをGoogle Colabで実行します．
```python
# ディレクトリの移動
%cd /content/drive/MyDrive/post_bike/darknet/

# 動画での検出(yolov4)
!python darknet_bike_video.py \
--input H240101_post.mp4 \
--out_filename yolov4_post.mp4 \
--weights backup/yolov4_bike_best.weights \
--dont_show \
--config_file darknet4_bike/yolov4_bike.cfg \
--data_file darknet4_bike/yolov4_bike.data \
--thresh 0.5
```
Darknet(Yolov4)の検出結果<br>
![Darknet(Yolov4)の検出結果](/image/yolov4_post_md.gif)


## まとめ
Darknet(Yolov4)でバイク検出の学習を実施しましました．<br>
結構検出できていたので，次は，「keras-yoloでの転移学習」・「DEEPSORTによるトラッキング」・「FastMOTによるトラッキング」・「EfficientDet」を実施します．


## 参考サイト
[AlexeyAB/darknet](https://github.com/AlexeyAB/darknet)<br>
[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)<br>
[Google Colab上でdarknet（YOLO）を使って物体を数える【画像認識】](https://wakuphas.hatenablog.com/entry/2018/09/19/025941)<br>
[Darknet+YOLOによる物体検出](https://www.ois-yokohama.co.jp/oisblog2018/archives/3673)<br>
[Python, OpenCVで画像ファイルの読み込み、保存（imread, imwrite）](https://note.nkmk.me/python-opencv-imread-imwrite/)<br>
[Python, OpenCVで図形描画（線、長方形、円、矢印、文字など）](https://note.nkmk.me/python-opencv-draw-function/)<br>
[FFmpegで動画をGIFに変換](https://qiita.com/wMETAw/items/fdb754022aec1da88e6e)


## エラー集
実装するまでに発生したエラーを以下にまとめます．

### エラー1
Makefileを実行すると，以下のようなエラーが発生しました．Google ColabでGPU機能がOFFになっていたので，GPUの設定を見直しました．
```
# エラーメッセージ
./src/network_kernels.cu(364): warning: variable "l" was declared but never referenced

./src/network_kernels.cu: In function ‘float train_network_datum_gpu(network, float*, float*)’:
./src/network_kernels.cu:364:7: warning: variable ‘l’ set but not used [-Wunused-but-set-variable]
         layer l = net.layers[net.n - 1];
```

### エラー2
GPUのメモリーオーバーしていましたので．subdivisions(バッチの分割設定)の大きさを変更する．<br>
subdivisions=8 -> subdivisions=16 -> subdivisions=32
```
# エラーメッセージ
 CUDA-version: 10010 (11020), cuDNN: 7.6.5, CUDNN_HALF=1, GPU count: 1  
 OpenCV version: 3.2.0
max_batches: Using default '0'
 0 : compute_capability = 600, cudnn_half = 0, GPU: Tesla P100-PCIE-16GB 
・
・
・
CUDA Error: out of memory: File exists
darknet: ./src/utils.c:331: error: Assertion `0' failed.
```

### エラー3
libdarknet.soが存在しなかったので，makeの中身をLIBSO=1として環境を整備します．
```
OSError: ./libdarknet.so: cannot open shared object file: No such file or directory
```

### エラー4
学習過程のグラフを表示する別画面が表示できないので，Google Colabでは「--dont_show」と表示させないようにします．<br>
「chart_yolov4_bike.png」は保存されるので，大丈夫です．
```
Loading weights from yolov4.conv.137...Done! Loaded 137 layers from weights-file 
Unable to init server: Could not connect: Connection refused

(chart_yolov4_bike.png:526): Gtk-WARNING **: 12:49:27.135: cannot open display
```