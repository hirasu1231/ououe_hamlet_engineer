---
display: home
title: 'COCOデータセットをDarknet(Yolov4)で学習できるように整形する'
description: COCOデータセットから特定のクラスを抽出できるようにしたので，Darknet(Yolov4)で学習できるように整形します．
date: 2021-02-22
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
COCOデータセットから特定のクラスを抽出できるようにしたので，Darknet(Yolov4)で学習できるように整形します．<br>
<!-- more -->

プログラムはJupyter Notebook形式で作成しています．<br>
最終的に，Youtubeの[平成24年 元旦配達出発式](https://www.youtube.com/watch?v=wnRH3-CIk4I)のIDを振り分けるトラッキングも含めたバイクのカウントを実施します．

## ダウンロード後のファイル構成
```
dataset
├── ./coco
│   ├── /annotations
│   └── /images
├── check <- 確認用(BountingBoxの描画)
│   └── darknet4_bike
│       ├── /train
│       └── /val
├── darknet4_bike <- 学習用
│   ├── /train
│   │   └── (省略)
│   └── /val
│       ├── 000000356387.jpg
│       ├── 000000356387.txt
│       └── (省略)
└── dataset_darknet.ipynb <- 実行用ノートブック
```

## アノテーション情報をdarknetの入力形式に整形
darknetで学習させる場合は，BountingBoxの情報を同じディレクトリ内に画像と同じ名前でtxtファイルとして格納します．<br>
格納する情報は「category_id, x_center, y_center, width, height」のセットとなります．<br>
x_center, y_center, width, heightは画像の幅と高さに対するフロート値となりますので，JSONファイル
格納されているBountingBoxの情報からの変換を実施します．(0.0〜1.0)

```
※フロート値の算出：<x> = <絶対値_x> / <画像の横幅>
※ または<height> = <絶対値_BountingBoxの高さ> / <画像の高さ>
※<x_center> <y_center>は長方形の中心です（左上隅ではありません）
1 0.716797 0.395833 0.216406 0.147222
0 0.687109 0.379167 0.255469 0.158333
1 0.420312 0.395833 0.140625 0.166667
```

```python
def convert(size, box):
    dw = 1./size[0]
    dh = 1./size[1]
    x = (box[0] + box[1])/2.0
    y = (box[2] + box[3])/2.0
    w = box[1] - box[0]
    h = box[3] - box[2]
    x = x*dw
    w = w*dw
    y = y*dh
    h = h*dh
    return (x,y,w,h)
```

## txtファイルに格納する要素を作成
txtファイルに格納する要素を作成します．<br>
```
※フロート値の算出：<x> = <絶対値_x> / <画像の横幅>
※ または<height> = <絶対値_BountingBoxの高さ> / <画像の高さ>
※<x_center> <y_center>は長方形の中心です（左上隅ではありません）
1 0.716797 0.395833 0.216406 0.147222
0 0.687109 0.379167 0.255469 0.158333
1 0.420312 0.395833 0.140625 0.166667
```

```python
import shutil
from PIL import Image

# 引数もどき
data_type = 'val'
year = 2017
coco_image_path
category_ids = [4]
category_id = anno_info['category_id']
bbox = anno_info['bbox']

# ディレクトリの設定
coco_data_type = data_type + str(year)

# 画像の規格
im = Image.open(coco_image_path)
w= int(im.size[0])
h= int(im.size[1])

# クラスIDの修正
cls_id = category_ids.index(4)

# BountingBoxの情報
xtl, ytl, width, height = bbox
b = (int(float(xtl)), int(float(xtl)+float(width)), int(float(ytl)), int(float(ytl)+float(height)))
bb = convert((w,h), b)
print(bb)
# (0.406, 0.891044776119403, 0.256, 0.2)

bbox_txt = str(cls_id) + " " + " ".join([str(a) for a in bb])+'\n'
print(bbox_txt)
# '0 0.406 0.891044776119403 0.256 0.2\n'
```

## 整形したアノテーション情報をtxtファイルに格納
darknetで学習できるように変換したBountingBoxの情報を同じディレクトリ内に画像と同じ名前でtxtファイルとして格納します．
```python
# 引数もどき
data_type = 'val'
year = 2017

coco_image_path
category_id = anno_info['category_id']
bbox = anno_info['bbox']
category_ids = [4]
bbox_txt

# 出力先ディレクトリを作成
coco_data_type = data_type + str(year)
project_dir = 'darknet4_bike'
output_dir = os.path.join(project_dir, data_type)
os.makedirs(output_dir, exist_ok=True)

# 出力時のファイル操作
# 出力ファイルのパス(txtとimage)
txt_path = os.path.join(output_dir, filename.replace('.jpg','.txt'))
image_path = os.path.join(output_dir, filename)
print(txt_path)
# 存在していなければtextファイルを新規作成
if not os.path.exists(txt_path):
    txt_file = open(txt_path, "w")
    # 画像ファイルのコピー
    shutil.copyfile(coco_image_path, image_path)
else:
    txt_file = open(txt_path, "a")
    
# bboxの情報をtxtに書き込む
txt_file.write(bbox_txt)

# txtファイルの書き込み終了
txt_file.close()
# darknet4_bike/val/000000356387.txt
```

## スクリプト化
上記の工程をスプリプトします．「アノテーション情報からバイクの物だけ抽出」はfor文が入っているため，一番最後にします．
```python
import os
import json
import shutil
from PIL import Image

# アノテーション情報をdarknetの入力形式に変換
def convert(size, box):
    dw = 1./size[0]
    dh = 1./size[1]
    x = (box[0] + box[1])/2.0
    y = (box[2] + box[3])/2.0
    w = box[1] - box[0]
    h = box[3] - box[2]
    x = x*dw
    w = w*dw
    y = y*dh
    h = h*dh
    return (x,y,w,h)


# txtファイルに格納する要素を作成
def coco_bbox_txt(coco_image_path, anno_info, category_ids):
    # 画像の規格
    im = Image.open(coco_image_path)
    w= int(im.size[0])
    h= int(im.size[1])
    
    # jsonの情報取得
    category_id = anno_info['category_id']
    bbox = anno_info['bbox']

    # クラスIDの修正
    cls_id = category_ids.index(category_id)

    # BountingBoxの情報
    xtl, ytl, width, height = bbox
    b = (int(float(xtl)), int(float(xtl)+float(width)), int(float(ytl)), int(float(ytl)+float(height)))
    bb = convert((w,h), b)
    bbox_txt = str(cls_id) + " " + " ".join([str(a) for a in bb])+'\n'
    return bbox_txt


# 整形したアノテーション情報をtxtファイルに格納
def write_txt(project_dir, data_type, coco_image_path, bbox_txt):
    # 出力先ディレクトリを作成
    output_dir = os.path.join(project_dir, data_type)

    # 出力時のファイル操作
    # 出力ファイルのパス(txtとimage)
    txt_path = os.path.join(output_dir, filename.replace('.jpg','.txt'))
    image_path = os.path.join(output_dir, filename)
    # 存在していなければtextファイルを新規作成
    if not os.path.exists(txt_path):
        txt_file = open(txt_path, "w")
        # 画像ファイルのコピー
        shutil.copyfile(coco_image_path, image_path)
    else:
        txt_file = open(txt_path, "a")

    # bboxの情報をtxtに書き込む
    txt_file.write(bbox_txt)

    # txtファイルの書き込み終了
    txt_file.close()
    return txt_path


# 実行文
# 引数
data_type = 'train'
year = 2017
category_ids = [4]
project_dir = 'darknet4_bike'

# ディレクトリの設定
darknet_dir = os.path.join(project_dir, data_type)
os.makedirs(darknet_dir, exist_ok=True)
coco_data_type = data_type + str(year)

# jsonの読み込み
jfile = './coco/annotations/instances_{}.json'.format(coco_data_type)
with open(jfile, "r") as fp:
    pic = json.load(fp)
for anno_info in pic["annotations"]:
    # 入力画像名の抽出
    image_id = anno_info['image_id']
    filename = os.path.join(str(image_id).zfill(12) + '.jpg')
    coco_image_path = os.path.join('coco', 'images', coco_data_type, filename)
    # category_id:4-bike
    if anno_info['category_id'] in category_ids:
        # texに格納するアノテーション情報を整理
        bbox_txt = coco_bbox_txt(coco_image_path, anno_info, category_ids)
        # txtファイルに書き込み
        write_txt(project_dir, data_type, coco_image_path, bbox_txt)

print('完了')
```

## BountingBoxを描画してアノテーション情報の確認
出力したテキストファイルを元に，BountingBoxを描画してアノテーション情報の確認を実施します．
```python
import os
import cv2
import glob
import copy

# coco_data_type = 'val'
coco_data_type = 'train'

project_dir = 'darknet4_bike'

# 画像リストを取得
image_paths = glob.glob(os.path.join(project_dir, coco_data_type, '*.jpg'))
check_dir = os.path.join('check', project_dir, coco_data_type)
os.makedirs(check_dir, exist_ok=True)

# BountingBoxを描画
for image_path in image_paths:
    filename = os.path.basename(image_path)
    # 画像の読み込み
    im = cv2.imread(image_path)
    im_draw = im.copy()
    h, w, c = im.shape
    # bboxの情報を読み込み
    txt_path = image_path.replace('.jpg', '.txt')
    txt_file = open(txt_path, "r")
    bbox_list = txt_file.readlines()
    
    for bbox in bbox_list:
        bb_cx, bb_cy, bb_w, bb_h = bbox.replace('\n', '').split(' ')[1:]
        bb_cx, bb_cy, bb_w, bb_h = float(bb_cx)*w, float(bb_cy)*h, float(bb_w)*w, float(bb_h)*h
        tlx, tly, brx, bry = int(bb_cx-bb_w/2), int(bb_cy-bb_h/2), int(bb_cx+bb_w/2), int(bb_cy+bb_h/2)
    
        # 四角を描画(左上, 右下)
        im_draw = cv2.rectangle(im_draw, (tlx, tly), (brx, bry), (0, 0, 255), thickness=2)
    # 画像の書き込み
    cv2.imwrite(os.path.join(check_dir, filename), im_draw )
    txt_file.close()
```
`000000356387.jpg(BountingBox付)`<br>
![](/image/000000356387_bb.jpg)

## まとめ
COCOデータセットから特定のクラスを抽出できるようにしたので，darknet(Yolov4)で学習できるように整形しました．<br>
次では，Darknetの学習時に必要な設定ファイルを作成します．

## 参考サイト
[AlexeyAB/darknet](https://github.com/AlexeyAB/darknet)<br>
[Google Colab上でdarknet（YOLO）を使って物体を数える【画像認識】](https://wakuphas.hatenablog.com/entry/2018/09/19/025941)<br>
[Python, OpenCVで画像ファイルの読み込み、保存（imread, imwrite）](https://note.nkmk.me/python-opencv-imread-imwrite/)<br>
[Python, OpenCVで図形描画（線、長方形、円、矢印、文字など）](https://note.nkmk.me/python-opencv-draw-function/)