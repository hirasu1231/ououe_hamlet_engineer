---
display: home
title: 'Python + ESPNetをオリジナルデータで学習する(データ生成編) '
description: Python + ESPNetでCityscapesデータセットから人のみを抽出して，仮のオリジナルデータを生成します．
date: 2021-03-17
image: https://www.hamlet-engineer.com/image/color_mask_image.png
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - ESPNet
  - セマンティックセグメンテーション
---
セマンティックセグメンテーションの中で軽いモデルであるESPNetv2を実装します．<br>
本稿ではCityscapesデータセットから人のみを抽出して，仮のオリジナルデータで学習に向けて，データ生成を実施します．<br>
<!-- more -->

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

最終的に，人以外の背景を着色して，zoomのバーチャル背景機能のようなクロマキー合成を実装したいです．<br>
![](/image/zoom.jpg)



[[toc]]

## 作業ディレクトリのファイル構成
ここでは，作業ディレクトリのsegmentation/EdgeNets/vision_datasetsのファイル構成を以下に示します．
```
segmentation/EdgeNets/vision_datasets
├── /cityscapes
├── /human_city <- 仮オリジナルデータ
│   ├── train.txt
│   ├── val.txt
│   ├── /images
│   │   ├── /train
│   │   │   └── オリジナル画像
│   │   └── /val
│   │       └── オリジナル画像
│   └── /annotations
│       ├── /train
│       │   └── マスキング画像
│       └── /val
│           └── マスキング画像
│ 
└── create_data.ipynb <- データ生成用ノートブック
```

## オリジナルデータの学習データセット
今回はCityscapesデータセットから人だけを抽出して，仮オリジナルデータとします．<br>
オリジナルデータでESPNetv2を学習する場合は，データセットのファイル構成は以下の通りです．<br>
ここでは，データセット名前をhuman_cityとしています．<br>
```
/human_city
├── train.txt
├── /images
│   ├── /train
│   │   └── オリジナル画像
│   └── /val
│       └── オリジナル画像
├── val.txt
└── /annotations
    ├── /train
    │   └── マスキング画像
    └── /val
        └── マスキング画像
```

オリジナル画像は実際の風景画像で，マスキング画像はクラスのIDに応じたRGBでマスキングした画像です．<br>
例として，背景はRGB=(0, 0, 0)，人のクラスIDが1とするならば人の領域はRGB=(1, 1, 1)，車のクラスIDが2とするならば車の領域はRGB=(2, 2, 2)として，マスキング画像を作成する．<br>
RGB=(0, 0, 0)の領域とRGB=(1, 1, 1)の領域は肉眼では判別不可能なので，最初は確認のためRGB=(0, 0, 255)など目立つ色で作成して，学習用に色を置換する方が個人的にお勧めします．<br>

オリジナル画像<br>
![](/image/original_image.png)<br>

人をRGB=(1, 1, 1)のマスキング画像(学習用)<br>
※肉眼じゃわからん・・・
![](/image/R1.png)<br>

人をRGB=(255, 0, 0)のマスキング画像(確認用)<br>
![](/image/R255.png)

## 仮オリジナルデータの生成
Cityscapesデータセットから人だけを抽出して，仮オリジナルデータを生成します．<br>
Cityscapesデータセットのダウンロードは，[Python, ESPNetでCityscapesデータセットでSemantic Segmentationの学習を実施する](https://hirasu1231.github.io/hamlet_engineer/posts/2021/03/15/segmentation01.html)を参照ください．

### 作業ディレクトリの移動
作業ディレクトリは，Cityscapesデータセットのダウンロードで自動で生成される/EdgeNets/vision_datasetsとしています．
```python
# Google ColabとGoogle Driveを連携
from google.colab import drive
drive.mount('/content/drive')
```

```python
# ディレクトリの移動
%cd /content/drive/My\ Drive/segmentation/EdgeNets/vision_datasets
```

### Cityscapesデータセットの整理
仮オリジナルデータの生成について，Cityscapesデータセットからオリジナル画像とカラーマスキング画像を使用します．<br>
Cityscapesデータセットは，オリジナル画像とカラーマスキング画像は，以下の画像名となっています．<br>
```
オリジナル画像：/cityscapes/leftImg8bit/train or val/＊/＊_leftImg8bit.png
カラーマスキング画像：/cityscapes/gtFine/train or val/＊/＊_gtFine_color.png
```

オリジナル画像<br>
![](/image/original_image.png)<br>

カラーマスキング画像<br>
![](/image/color_mask_image.png)


### 入力画像のリスト作成
画像を読み込ませるために，画像パスリストのtxtファイルも作成する必要があります．(train.txt, val.txt)
```
# train.txt, val.txt
# オリジナル画像, マスキング画像
train/rgb/zurich_000072_000019_leftImg8bit.png,train/label/zurich_000072_000019_gtFine_color.png
train/rgb/zurich_000003_000019_leftImg8bit.png,train/label/zurich_000003_000019_gtFine_color.png
train/rgb/zurich_000116_000019_leftImg8bit.png,train/label/zurich_000116_000019_gtFine_color.png
train/rgb/zurich_000119_000019_leftImg8bit.png,train/label/zurich_000119_000019_gtFine_color.png
train/rgb/zurich_000032_000019_leftImg8bit.png,train/label/zurich_000032_000019_gtFine_color.png
```

### 仮オリジナルデータ生成の工程
人を抽出する工程は，カラーマスキング画像の色を，人以外をBGR(0, 0, 0)，人をBGR(1, 1, 1)に置換して実施してます．<br>
カラー画像で特定の色を置換する場合は，本サイトの「[Python, OpenCVで指定した色の抽出と別の色への置換を実装する](https://hirasu1231.github.io/hamlet_engineer/posts/2021/03/16/color-replace.html)」を参照ください．<br>
以下のコードでは一通りの工程をdef文でまとめました．
```python
import os
import glob
import shutil
import cv2
import numpy as np

# 学習データセットのディレクトリの作成
def make_dataset_dir(dataset_name):
    os.makedirs('{}/images/train/'.format(dataset_name), exist_ok=True) # 訓練用オリジナル画像
    os.makedirs('{}/annotations/train/'.format(dataset_name), exist_ok=True) # 訓練用マスキング画像
    os.makedirs('{}/images/val/'.format(dataset_name), exist_ok=True) # 評価用オリジナル画像
    os.makedirs('{}/annotations/val/'.format(dataset_name), exist_ok=True) # 評価用マスキング画像

# オリジナル画像をコピー
def copy_org_image(color_image_path, data_type, dataset_name):
    # カラーマスキング画像の名前
    color_name = os.path.basename(color_image_path)
    # データのディレクトリ名(データを取得した都市名)
    city_name = color_name.split('_')[0]
    
    # オリジナル画像の名前とパス
    org_name = color_name.replace('_gtFine_color.png', '_leftImg8bit.png')
    org_path = './cityscapes/leftImg8bit/{0}/{1}/{2}'.format(data_type, city_name, org_name)
    # オリジナル画像をコピー
    shutil.copy(org_path, './{0}/images/{1}/{2}'.format(dataset_name, data_type, org_name))
    return '{0}/{1}'.format(data_type, org_name)

# 画像の特定の色を抽出
def color_extract(cv2_img, color1):
    # BGRでの色抽出
    bgrLower = np.array(color1) # 抽出する色の下限(BGR)
    bgrUpper = np.array(color1) # 抽出する色の上限(BGR)
    img_mask = cv2.inRange(cv2_img, bgrLower, bgrUpper) # BGRからマスクを作成
    ex_img = cv2.bitwise_and(cv2_img, cv2_img, mask=img_mask) # 元画像とマスクを合成
    
    return ex_img

# 画像の特定の色を別の色に置換
def color_replace(ex_img, color1, color2):
    before_color = color1
    after_color = color2
    ex_img[np.where((ex_img == before_color).all(axis=2))] = after_color
    
    return ex_img

# 学習用マスキング画像を出力
def replace_masking(cv2_img, data_type, dataset_name, color1, color2):
    # 学習用マスキング画像を生成
    ex_img = color_extract(cv2_img, color1)
    mask_img = color_replace(ex_img, color1, color2)
    # グレースケール化
    mask_img_gray = cv2.cvtColor(mask_img, cv2.COLOR_BGR2GRAY)
    # マスキング画像の出力
    color_name = os.path.basename(color_image)
    mask_path = './{0}/annotations/{1}/{2}'.format(dataset_name, data_type, color_name)
    cv2.imwrite(mask_path, mask_img_gray)
    return '{0}/{1}'.format(data_type, color_name)

# パスリストのtxtファイル作成
def create_txtfile(txt_path, txt, txt_flag):
    # 新規作成
    if not txt_flag:
        with open(txt_path, mode='w') as f:
            f.write(txt)
    # 追記
    else:
        with open(txt_path, mode='a') as f:
            f.write(txt)
    return 1
```

### 仮オリジナルデータ生成の実行
以下のコードで仮オリジナルデータ生成を実行します．<br>
[cityscapesScripts/cityscapesscripts/helpers/labels.py](https://github.com/mcordts/cityscapesScripts/blob/master/cityscapesscripts/helpers/labels.py)より人のマスキングのRGBは(220, 20, 60)となります．<br>
カラーマスキング画像を読み込んで，人のRGB=(220, 20, 60)の箇所があれば，学習用データセットとして整形するようにしています．

```python
import os
import glob
import cv2
import numpy as np

# 学習データセットのディレクトリの作成
dataset_name = 'human_city'
make_dataset_dir(dataset_name)

# Cityscapes
data_type = 'train'
# カラーマスキング
color_images = glob.glob('./cityscapes/gtFine/{}/*/*_gtFine_color.png'.format(data_type))
    
# 人のマスキングカラー(BGR)
human_color = [60, 20, 220]
label_color = [1, 1, 1]

txt_flag = 0
for color_image in color_images:
    # カラーマスキング画像の読み込み
    img = cv2.imread(color_image)
    
    # 人の色があるか，判定
    if len(img[np.where((img == human_color).all(axis=2))]) > 0:
        # 学習用マスキング画像を出力
        txt_mask_path = replace_masking(img, data_type, dataset_name, human_color, label_color)
        # オリジナル画像をコピー
        txt_org_path = copy_org_image(color_image, data_type, dataset_name)
        # パスリストのtxtファイル作成
        txt_path = './{0}/{1}.txt'.format(dataset_name, data_type)
        txt = '{0},{1}\n'.format(txt_org_path, txt_mask_path)
        txt_flag = create_txtfile(txt_path, txt, txt_flag)
```

## まとめ
Cityscapesデータセットから人のみを抽出して，仮のオリジナルデータで学習に向けて，データ生成を実施しました．<br>
次回からは本稿の仮オリジナルデータでの学習を実施します．


## 参考サイト
[sacmehta/EdgeNets](https://github.com/sacmehta/EdgeNets)<br>
[sacmehta/EdgeNets/README_Segmentation.md](https://github.com/sacmehta/EdgeNets/blob/master/README_Segmentation.md)
[ESPNetで自作データセットを学習してセグメンテーション](https://qiita.com/tokyokuma/items/37b1370ea7c84399fbb9)<br>
[【python/OpenCV】画像の特定の色を抽出する方法](https://rikoubou.hatenablog.com/entry/2019/02/21/190310)<br>
[PIL/Pillowで画像の色を高速に置換する](https://qiita.com/pashango2/items/d6dda5f07109ee5b6163)<br>
[【OpenCV】 forループを使わずに指定した色を別の色に変更する](http://ni4muraano.hatenablog.com/entry/2017/05/15/000000)

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>