---
display: home
title: 'PythonでPDFの切り取りを実装する'
description: PythonでPDFの切り取りを実装します．
date: 2021-11-18
image: https://www.hamlet-engineer.com/image/pdf.png
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - PDF
---

<!-- https://www.hamlet-engineer.com -->
PythonでPDFの切り取りを実装します．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

## ライブラリのインストール
```python
!pip install fitz
!pip install PyMuPDF==1.16.14
```

<!-- ## PDFの範囲確認
下記のコードでPDFの切り取り範囲を確認します．

```python
import fitz
import csv
import json
from tqdm import tqdm

input_path = './Jisaku_x86.pdf'
doc = fitz.open(input_path)

for page in tqdm(doc):
    for f in range(3):
        crop_length = 120 * (f + 1)
        # rect = fitz.Rect(page.rect[0]+crop_length,page.rect[1]+crop_length,page.rect[2]-crop_length,page.rect[3]-crop_length)
        rect = fitz.Rect(page.rect[0],page.rect[1]-crop_length,page.rect[2],page.rect[3]+crop_length)
        # 図形挿入
        page.drawRect(rect,color=(0.25 * (f + 1), 0.25 * (f + 1), 0.25 * (f + 1)))

doc.save('./sample.pdf', garbage=1, clean=1, deflate=1)
``` -->

## PDFの切り取り
下記のコードでPDFの切り取りを実行します．

```python
import fitz
import csv
import json
from tqdm import tqdm

input_path = './Jisaku_x86.pdf'
doc = fitz.open(input_path)

for page in tqdm(doc):
    # 範囲指定
    crop_length = 40
    rect = fitz.Rect(page.rect[0]+crop_length,
                     page.rect[1]+crop_length,
                     page.rect[2]-crop_length,
                     page.rect[3]-crop_length)
    # トリミング
    page.setCropBox(rect)
    

doc.save(input_path.replace('.pdf', '_crop.pdf'), garbage=1, clean=1, deflate=1)
```

## まとめ
PythonでPDFの切り取りを実装しました．




<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

