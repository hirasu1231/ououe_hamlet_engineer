---
display: home
title: 'PDFを1ページずつ画像データに変換する'
description: PDFを1ページずつ画像データに変換します．
date: 2023-3-31
image: https://www.hamlet-engineer.com/image/pdf.png
categories: 
  - Python
tags:
  - 小ネタ
  - Python
  - PDF
---
PDFを1ページずつ画像データに変換します．

<!-- https://www.hamlet-engineer.com -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ライブラリのインストール
下記のコードでライブラリをインストールします．
```python
!pip install PyMuPDF
```
## PDFを1ページずつ画像データに変換

### データの読み込み
```python
import os
import cv2
import fitz
import csv
import json
from PIL import Image
from tqdm import tqdm

# データの読み込み
pdf_path = "./20211206_DS_jisyu.pdf"
doc = fitz.open(pdf_path)

# 保存作ディレクトリの作成
dir_name = os.path.basename(pdf_path).split('.')[0]
dir_name = f"./image/{dir_name}"
os.makedirs(dir_name, exist_ok=True)
```

### PDFの変換

```python
width = 600
zoom_x = 0.8  # horizontal zoom
zoom_y = 0.8  # vertical zoom
mat = fitz.Matrix(zoom_x, zoom_y)  # zoom factor 2 in each dimension
# mat = fitz.Matrix(600 / 72, 600 / 72)  # sets zoom factor for 300 dpi
for i, page in enumerate(doc):
    pix = page.get_pixmap(matrix=mat)
    img_filename = os.path.join(dir_name, f"page_{i:03}.png")
    pix.pil_save(img_filename, format="PNG", dpi=(300,300))
    
    # 画像を読み込む。
    img = cv2.imread(img_filename)
    h, w = img.shape[:2]
    height = round(h * (width / w))
    # 指定した倍率でリサイズする。
    dst = cv2.resize(img, dsize=(width, height))
    cv2.imwrite(img_filename, dst)
    # for j, img in enumerate(page.getImageList()):
    #     x = doc.extractImage(img[0])
    #     name = os.path.join(dir_name, f"page_{j:02}.png")
    #     with open(name, "wb") as ofh:
    #         ofh.write(x['image'])
```

## markdownのリンク作成
```python
import glob

paths = glob.glob(os.path.join(dir_name, '*.png'))

for path in paths:
    print(f"![]({path}) \n")
```

## まとめ
PDFを1ページずつ画像データに変換しました．

## 参考サイト
[PyMUPDF - How to convert PDF to image, using the original document settings for the image size and set to 300dpi?](https://stackoverflow.com/questions/69415164/pymupdf-how-to-convert-pdf-to-image-using-the-original-document-settings-for)

[論文(PDF)から画像を抽出する](https://zenn.dev/kohhee/articles/af04806b032433)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


