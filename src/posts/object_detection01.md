---
display: home
title: 'COCOデータセットをダウンロードし，特定のクラスを抽出する'
description: YOLO・SSDの物体検出の実施のために，COCOデータセットをダウンロードし，特定のクラスだけを抽出します．
date: 2021-02-21
image: https://www.hamlet-engineer.com/image/000000356387.jpg
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - 物体検出
  - YOLO
---
YOLO・SSDの物体検出の実施のために，まずCOCOデータセットをダウンロードし，特定のクラスだけを抽出します．<br>

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

COCOデータセットは物体検出・セグメーテーション等の学習に使え，無料で大量に公開されているデータセットです．<br>
プログラムはJupyter Notebook形式で作成しています．<br>
最終的に，Youtubeの[平成24年 元旦配達出発式](https://www.youtube.com/watch?v=wnRH3-CIk4I)のIDを振り分けるトラッキングも含めたバイクのカウントを実施します．

[[toc]]

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

## COCOデータセットのダウンロード
[mkocabas/coco.sh](https://gist.github.com/mkocabas/a6177fc00315403d31572e17700d7fd9)のcoco.shを実行し，COCOデータセットをダウンロードします．<br>
大容量データなので，ダウンロードに時間がかかります．<br>
[coco 公式HP](https://cocodataset.org/#download)からもダウンロードできます.
```
sh coco.sh
```

## ダウンロード後のファイル構成
```init
coco
├── annotations
│   ├── _deprecated-challenge2017
│   │   ├── train-ids.txt
│   │   └── val-ids.txt
│   ├── captions_train2017.json
│   ├── captions_val2017.json
│   ├── image_info_test-dev2017.json
│   ├── image_info_test2017.json
│   ├── image_info_unlabeled2017.json
│   ├── instances_train2017.json
│   ├── instances_val2017.json
│   ├── person_keypoints_train2017.json
│   ├── person_keypoints_val2017.json
│   ├── stuff_train2017_pixelmaps.zip
│   ├── stuff_train2017.json
│   ├── stuff_val2017_pixelmaps.zip
│   └── stuff_val2017.json
│
└── images
    ├── test2017
    ├── train2017
    ├── unlabeled2017
    └── val2017
```

## cocoのデータセットの整理
画像のアノテーション情報を取得し，cocoのデータセットの中からバイク(motorcycle)だけを抽出します．

### アノテーション情報からクラスIDを確認
jsonファイルから画像のアノテーション情報を取得し，クラスIDのリストからバイク(motorcycle)のクラスIDを確認します.<br>
そして，あとでdef文にまとめるために引数もどきを準備しています．
```python
import json

# 引数もどき
data_type = 'val' # train or val
year = 2017
coco_data_type = data_type + str(year)

# 画像のアノテーション情報を取得
jfile = './coco/annotations/instances_{}.json'.format(coco_data_type)
with open(jfile, "r") as fp:
    pic = json.load(fp)
    
# クラスIDのリストを取得
display(pic["categories"]) #jupyter用のprint文
# [{'supercategory': 'person', 'id': 1, 'name': 'person'},
#  {'supercategory': 'vehicle', 'id': 2, 'name': 'bicycle'},
#  {'supercategory': 'vehicle', 'id': 3, 'name': 'car'},
#  {'supercategory': 'vehicle', 'id': 4, 'name': 'motorcycle'},
#  ・
#  ・
#  ・
#  {'supercategory': 'indoor', 'id': 89, 'name': 'hair drier'},
#  {'supercategory': 'indoor', 'id': 90, 'name': 'toothbrush'}]
```

### アノテーション情報からバイクの物だけ抽出
jsonファイルからバイク(motorcycle)のクラスIDを確認したので，jsonファイルから更に画像ファイル名とBountingBoxの情報を取得します.<br>
画像ファイル名は，画像IDを12桁ゼロ埋めで格納されています．(111 -> 000000000111)
```python
import os
'''
 {'supercategory': 'vehicle', 'id': 4, 'name': 'motorcycle'}
'''

# 引数もどき
data_type = 'val' # train or val
year = 2017
pic = pic
category_ids = [4]

# ディレクトリの設定
coco_data_type = data_type + str(year)

for anno_info in pic["annotations"][0:1000]:
    # 入力画像名の抽出
    image_id = anno_info['image_id']
    filename = os.path.join(str(image_id).zfill(12) + '.jpg')
    coco_image_path = os.path.join('coco', 'images', coco_data_type, filename)
    # category_id:4-bike
    if anno_info['category_id'] in category_ids:
        # ファイル名, カテゴリー, bbox情報
        # bbox情報は[左上x座標, 左上y座標, 幅, 高さ]です
        print(coco_image_path, anno_info['category_id'], anno_info['bbox'])
        break
# coco/images/val2017/000000356387.jpg 4 [139.71, 265.98, 127.69, 66.1]
```
`000000356387.jpg`<br>
![](/image/000000356387.jpg)


## まとめ
ここまででYOLO・SSDの物体検出の実施のために，まずCOCOデータセットをダウンロードし，特定のクラスだけを抽出しました．<br>
次からはDarknetとKeras-yolov4の各々の入力形式に整理します．


## 参考サイト
[coco 公式HP](https://cocodataset.org/#download)<br>
[mkocabas/coco.sh](https://gist.github.com/mkocabas/a6177fc00315403d31572e17700d7fd9)<br>
[画像を扱う機械学習のためのデータセットまとめ](https://qiita.com/leetmikeal/items/7c0d23e39bf38ab8be23)<br>


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>