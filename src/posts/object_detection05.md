---
display: home
title: 'Python + keras-yolo4で学習させるためにデータを整形する'
description: COCOデータセットから特定のクラスの抽出・Pythonのkeras-yolo4の学習形式への整形を実施します．
date: 2021-02-28
image: https://www.hamlet-engineer.com/image/keras.png
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - 物体検出
  - YOLO
  - Keras
---
COCOデータセットから特定のクラスの抽出・[keras-yolo4](https://github.com/Ma-Dan/keras-yolo4)の学習形式への整形を実施します．<br>
<!-- more -->

プログラムはJupyter Notebook形式で作成しています．<br>
COCOデータセットから特定のクラスの抽出は[COCOデータセットをダウンロードし，特定のクラスを抽出する](https://hirasu1231.github.io/hamlet_engineer/posts/2021/02/21/object-detection01.html)で記述しています．<br>
最終的に，Youtubeの[平成24年 元旦配達出発式](https://www.youtube.com/watch?v=wnRH3-CIk4I)のIDを振り分けるトラッキングも含めたバイクのカウントを実施します．

## ファイル構成
プロジェクトディレクトリはpost_bikeとしています．
```
post_bike
├── /coco
│   ├── /annotations
│   └── /images
├── /keras_bike <- 新規
│   ├── /train
│   │   └── (省略)
│   ├── /val
│   │   ├── 000000356387.jpg
│   │   ├── 000000000086.jpg
│   │   ├── 000000000529.jpg
│   │   └── (省略)
│   ├── train.txt
│   ├── val.txt
│   └── yolov4_bike.txt
└── dataset_keras.ipynb <- 実行用ノートブック
```

## アノテーション情報をkeras-yolo4の入力形式に整形
kerasで学習させる場合は，BountingBoxの情報をtrain.txt・val.txtとして格納します．<br>
コードはノートブック形式です．
格納する情報は「画像のpath,右上x1,右上y1,左上x1,左上y1,クラスid1 右上x2,右上y2,左上x2,左上y2,クラスid2」のセットとなります．<br>
座標の数値は絶対値です．<br>
```init
# 画像のpath 右上x1,右上y1,左上x1,左上y1,クラスid1 右上x2,右上y2,左上x2,左上y2,クラスid2
path/to/img1.jpg 50,100,150,200,0 30,50,200,120,3
path/to/img2.jpg 120,300,250,600,2
```
```python
import os
import shutil
import pandas as pd
'''
 {'supercategory': 'vehicle', 'id': 4, 'name': 'motorcycle'}
'''

# 引数もどき
data_type = 'val' #train or val
year = 2017
category_ids = [4]

# ディレクトリの設定
coco_data_type = data_type + str(year)
project_dir = 'keras_bike'
output_dir = os.path.join(project_dir, data_type)
os.makedirs(output_dir, exist_ok=True)

# txtファイルの作成
txt_path = os.path.join(project_dir, '{}.txt'.format(data_type))
txt_file = open(txt_path, "w")

# 画像のアノテーション情報を取得
jfile = './coco/annotations/instances_{}.json'.format(coco_data_type)
with open(jfile, "r") as fp:
    pic = json.load(fp)

# アノテーション情報を画像IDでソート
anno_infos = pic['annotations']
anno_infos = sorted(anno_infos, key=lambda x: x['image_id'])

flag = 0
image_before_id = 0
for anno_info in anno_infos:
    # category_id:4-bike
    if anno_info['category_id'] in category_ids:
        # 画像IDの抽出
        image_id = anno_info['image_id']
        
        # 画像IDが変われば改行する
        if image_before_id != image_id:
            if flag != 0:
                # bboxの情報をtxtに書き込む
                txt_file.write(info_txt)
                txt_file.write('\n')
                
            # 最初の画像ID以外なら1
            # txtファイルを1行目から改行されるのを防ぐ
            flag = 1
            
            # 入力画像名の抽出
            filename = os.path.join(str(image_id).zfill(12) + '.jpg')
            coco_image_path = os.path.join('coco', 'images', coco_data_type, filename)
            copy_image_path = os.path.join(project_dir, data_type, filename)
            # 画像ファイルのコピー
            shutil.copyfile(coco_image_path, copy_image_path)
            
            # txtファイルに画像名を追記
            info_txt = ''
            info_txt = info_txt + copy_image_path
            image_before_id = image_id
            
        # bbox情報を追加
        # バウンティングボックス
        xtl, ytl, width, height = anno_info['bbox']
        bbox = (int(float(xtl)), int(float(ytl)), int(float(xtl)+float(width)), int(float(ytl)+float(height)))
        info_txt = info_txt + ' ' + ','.join([str(int(a)) for a in bbox])
        # クラスIDの修正・追加
        cls_id = category_ids.index(anno_info['category_id'])
        info_txt = info_txt + ',' + str(cls_id)
        
txt_file.close()

# ./keras_bike/val.txt
# keras_bike/val/000000007386.jpg 51,12,600,400,0
# keras_bike/val/000000007816.jpg 240,152,467,360,0
# keras_bike/val/000000008211.jpg 141,161,252,310,0
# keras_bike/val/000000011149.jpg 0,68,136,350,0
# keras_bike/val/000000011511.jpg 483,50,530,100,0
# keras_bike/val/000000013177.jpg 0,14,240,422,0
# keras_bike/val/000000017207.jpg 0,234,24,302,0
# keras_bike/val/000000018737.jpg 254,159,592,407,0
# keras_bike/val/000000019109.jpg 16,255,95,395,0 71,253,155,385,0 142,257,191,376,0 186,271,320,366,0 312,251,372,354,0 361,256,404,348,0 430,252,490,338,0 378,249,461,344,0 559,250,612,325,0 592,269,620,314,0 600,260,639,297,0 283,250,340,349,0 457,251,527,336,0 216,234,582,350,0
```

## まとめ
COCOデータセットから特定のクラスの抽出・[keras-yolo4](https://github.com/Ma-Dan/keras-yolo4)の学習形式への整形を実施しました．<br>
次では，実際にkeras-yolo4の学習を実施します．


## 参考サイト
[Ma-Dan/keras-yolo4](https://github.com/Ma-Dan/keras-yolo4)<br>
[Keras版 YOLOv4を動かしてみる。](https://ameblo.jp/sijukara-tama/entry-12641048746.html)<br>
[Windows 10上のDarknetでYolo v3をトレーニングしOpenCVから使ってみる](https://nixeneko.hatenablog.com/entry/2018/08/15/000000)<br>
[Python, OpenCVで画像ファイルの読み込み、保存（imread, imwrite）](https://note.nkmk.me/python-opencv-imread-imwrite/)<br>
[Python, OpenCVで図形描画（線、長方形、円、矢印、文字など）](https://note.nkmk.me/python-opencv-draw-function/)