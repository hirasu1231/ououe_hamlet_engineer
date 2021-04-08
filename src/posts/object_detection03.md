---
display: home
title: 'Darknet(Yolov4)で学習させるためのcfgファイル等を作成する'
description: COCOデータセットから特定のクラスを抽出・学習形式に整形ましたので，そのデータでdarknet(Yolov4)で学習を実施します．
date: 2021-02-24
image: /image/000000356387_bb.jpg
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
COCOデータセットから特定のクラスの抽出・学習形式への整形を実施しましたので，学習に用いる画像のパスを示すtxtファイルやモデルのネットワークを示すcfgファイル等を作成します．<br>
<!-- more -->

プログラムはJupyter Notebook形式で作成しています．<br>
最終的に，Youtubeの[平成24年 元旦配達出発式](https://www.youtube.com/watch?v=wnRH3-CIk4I)のIDを振り分けるトラッキングも含めたバイクのカウントを実施します．

## ファイル構成
プロジェクトディレクトリはpost_bikeとしています．
```
post_bike
├── ./darknet
│   ├── /annotations
│   └── /images
├── check
│   └── darknet4_bike
│       ├── /train
│       └── /val
├── darknet4_bike
│   ├── /train
│   │   └── (省略)
│   ├── /val
│   │   ├── 000000356387.jpg
│   │   ├── 000000356387.txt
│   │   └── (省略)
│   ├── train.txt <- 新規
│   ├── val.txt <- 新規
│   ├── yolov4_bike.data <- 新規
│   └──  yolov4_bike.cfg <- 新規
└── darknet4.ipynb <- 実行用ノートブック
```

## 学習時に使う画像のパスリストを作成
学習時，評価時に使う画像のパスリスト(.txt)を作成します．

```python
import os
import glob

# 引数もどき
project_dir = 'darknet4_bike'

# 学習用と評価用
for data_type in ['train', 'val']:
    # ディレクトリ内の画像のパスを取得
    image_paths = glob.glob(os.path.join(project_dir, data_type, '*.jpg'))

    # テキストファイルの書き込み
    txt_path = os.path.join(project_dir, data_type + '.txt')
    txt_file = open(txt_path, "w")

    for image_path in image_paths:
        # txtに書き込む
        txt_file.write(image_path+ '\n')

    txt_file.close()
# train.txt
# darknet4_bike/train/000000162083.jpg
# darknet4_bike/train/000000041128.jpg
# darknet4_bike/train/000000246833.jpg
```

## darknetの設定ファイルの作成
yolov4のconfigファイル(.cfg)，学習するクラス名を記述するnameファイル(.names)，学習時に読み込むファイルの場所を記述するdataファイル(.data)を作成します．

### namesファイル(.names)の作成
nameファイル(.names)は検出のクラス名を記述するファイルです．<br>
本稿では1クラスしかありませんが，他クラスの場合は「[COCOデータセットをdarknet(Yolov4)で学習できるように整形する](https://hirasu1231.github.io/hamlet_engineer/posts/2021/02/22/object-detection02.html)」で作成したtxtファイル(BountingBox情報)のクラスIDに応じて，改行してください．
```ini
# sample.name
# txtファイル(BountingBox情報)のクラスIDをcarを0,
# truckを1,bikeを2としていた場合
car
truck
bike
```
```ini
# yolov4_bike.name
bike
```

うっかり，ミスることが多かったのでプログラムを書きました．
```python
import os

# namesファイル(.names)の作成
def make_namesfile(name_path, class_list):
    # .dataの作成
    name_file = open(name_path, "w")
    for _class in class_list:
        # .dataの書き込む
        name_file.write(_class+ '\n')
    # txtファイルの書き込み終了
    name_file.close()

# 引数
project_dir = 'darknet4_bike'
name_path = os.path.join(project_dir, 'yolov4_bike.names')
class_list = ['bike']
# 実行
make_namesfile(name_path, class_list)
```

### dataファイル(.data)の作成
dataファイル(.data)は検出するクラス数，学習・評価用画像リスト等の学習時に用いるファイルの場所を記述するファイルです．
```
# yolov4_bike.data
classes = 1
train = darknet4_bike/train.txt
valid = darknet4_bike/val.txt
names = darknet4_bike/yolov4_bike.names
backup = backup
eval = eval
```
これも，うっかりミスることが多かったのでプログラムを書きました．
```python
import os

def make_datafile(data_path, project_dir):
    # .nameの読み込み
    name_path = data_path.replace('.data', '.names')
    name_file = open(name_path, "r")
    reader = name_file.read()
    name_num = len(reader.split('\n')[:-1])
    
    # .dataの作成
    data_file = open(data_path, "w")
    # .dataの書き込み
    # classes
    data_file.write('classes = {}\n'.format(name_num))
    # train
    data_file.write('train = {}\n'.format(os.path.join(project_dir, 'train.txt')))
    # valid
    data_file.write('valid = {}\n'.format(os.path.join(project_dir, 'val.txt')))
    # names
    data_file.write('names = {}\n'.format(name_path))
    # backup
    data_file.write('backup = backup\n')
    # eval
    data_file.write('eval = eval')
    
    # txtファイルの書き込み終了
    data_file.close()

# 引数
project_dir = 'darknet4_bike'
data_path = os.path.join(project_dir, 'yolov4_bike.data')
# 実行   
make_datafile(data_path, project_dir)
```

### configファイル(.cfg)の作成
configファイル(.cfg)は学習時に用いるモデルのネットワーク設定を記述するファイルです．<br>
configファイル(.cfg)は[AlexeyAB/darknet](https://github.com/AlexeyAB/darknet)で公開されているyolov4.cfgの一部を書き換えて作成します．
```
# yolov4.cfgのダウンロード
wget https://raw.githubusercontent.com/AlexeyAB/darknet/master/cfg/yolov4.cfg -O yolov4.cfg
```
僕は基本的に以下の箇所を書き換えています．
```ini
[net]
# 6-9行目
# GPUのメモリーオーバーが発生した場合，subdivisionsを2倍にしたり，
# width,heightを小さくする．
batch=64
subdivisions=8
width=608
height=608

# 20行目
# max_batchesは最大の学習回数
max_batches=2000

# [yolo]の1つ手前の[convolutional]
# 3箇所ある
[convolutional]
# 961，1049，1137行目
# filters= (class数+5)*3 = (1+5)*3 =18
filters=18

# 3箇所ある
[yolo]
# 968，1056，1144行目
# クラス数
classes=1
```

これも，うっかりミスることが多かったのでプログラムを書きました．
```python
# configファイルの書き換え
def config_replace(cfg_reader, item, element):
    # 書き換えの先頭
    start = cfg_reader.find('\n{}'.format(item)) + 1
    # 書き換えの後尾
    end = cfg_reader.find('\n', start)
    # 書き換え
    cfg_reader = cfg_reader[:start] + "{0}={1}".format(item, element) + cfg_reader[end:]
    return cfg_reader

def config_filters_replace(cfg_reader, classes):
    # [yolo]の場所
    yolo_spans = [m.span() for m in re.finditer('yolo', cfg_reader)]
    print(yolo_spans)
    # 3箇所でfillterの書き換え
    for i in range(len(yolo_spans)):
        yolo_spans = [m.span() for m in re.finditer('yolo', cfg_reader)]
        syolo, eyolo = yolo_spans[i]
        print(cfg_reader[syolo:eyolo])
        # 書き換えの先頭
        start = cfg_reader.rfind('\nfilters', 0, syolo) + 1
        # 書き換えの後尾
        end = cfg_reader.find('\n', start)
        # 書き換え
        cfg_reader = cfg_reader[:start] + "filters={}".format((classes + 5)*3) + cfg_reader[end:]
        print("filters={}".format((classes + 5)*3))
    return cfg_reader

# .cfgのテキストの書き換え
# 引数もどき
size = 608
max_batch = 2000
cfg_name = 'yolov4.cfg'
outcfg_name = cfg_name.replace('yolov4', 'yolov4_bike')

# .cfgの読み込み
cfg_file = open(cfg_name, "r")
cfg_reader = cfg_file.read()

# .namesの読み込み
names_path = os.path.join(project_dir, 'yolov4_bike.names')
names_file = open(names_path, "r")
reader = names_file.read()
classes_lsit = reader.split('\n')
classes_lsit.remove('')
classes = len(classes_lsit)

# .cfgの書き換え
# width
cfg_reader = config_replace(cfg_reader, 'width', size)
# height
cfg_reader = config_replace(cfg_reader, 'height', size)
# max_batches(学習回数)
cfg_reader = config_replace(cfg_reader, 'max_batches', max_batch)
# filters
cfg_reader = config_filters_replace(cfg_reader, classes)
# classes(coco:80クラス前提)
cfg_reader = cfg_reader.replace('classes=80', 'classes={}'.format(classes))

# .cfgの保存(上書き)
project_dir = 'darknet4_bike'
cfg_outpath = os.path.join(project_dir, outcfg_name)
cfg_outfile = open(cfg_outpath, "w")
# 書き込み
cfg_outfile.write(cfg_reader)
cfg_outfile.close()
```

## まとめ
ここまでで，configファイル(.cfg),nameファイル(.names),dataファイル(.data)を作成しました．<br>
次では，実際にDarknetの学習を実施します．

## 参考サイト
[AlexeyAB/darknet](https://github.com/AlexeyAB/darknet)<br>
[Google Colab上でdarknet（YOLO）を使って物体を数える【画像認識】](https://wakuphas.hatenablog.com/entry/2018/09/19/025941)<br>
[Windows 10上のDarknetでYolo v3をトレーニングしOpenCVから使ってみる](https://nixeneko.hatenablog.com/entry/2018/08/15/000000)<br>
[Python, OpenCVで画像ファイルの読み込み、保存（imread, imwrite）](https://note.nkmk.me/python-opencv-imread-imwrite/)<br>
[Python, OpenCVで図形描画（線、長方形、円、矢印、文字など）](https://note.nkmk.me/python-opencv-draw-function/)