---
display: home
title: 'Python, OpenCVで指定した色の抽出と別の色への置換を実装する'
description: Python, ESPNetでCityscapesデータセットから人のみを抽出して，仮のオリジナルデータを生成します．
date: 2021-03-21
image: https://www.hamlet-engineer.com/image/color_replace.png
categories: 
  - Python
tags:
  - Python
  - OpenCV
---

Python, OpenCVで指定した色の抽出と別の色への置換を実装します．<br>
本稿では，Cityscapesデータセットのカラーマスキング画像の内，人だけを抽出し，白色に置換します．

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

### 特定の色を抽出する
ここでは特定の色を抽出して，人のマスキングのみを残した画像を作成します．<br>
人のマスキングのRGBは，[cityscapesScripts/cityscapesscripts/helpers/labels.py](https://github.com/mcordts/cityscapesScripts/blob/master/cityscapesscripts/helpers/labels.py)よりRGB=(220, 20, 60)となります．<br>
以下のコードではBGRをベースに抽出しています．<br>

```python
import cv2
import numpy as np

image = cv2.imread('color_mask_image.png') # ファイル読み込み

# bgrでの色抽出
bgrLower = np.array([60, 20, 220])    # 抽出する色の下限(bgr)
bgrUpper = np.array([60, 20, 220])    # 抽出する色の上限(bgr)
img_mask = cv2.inRange(image, bgrLower, bgrUpper) # bgrからマスクを作成
extract = cv2.bitwise_and(image, image, mask=img_mask) # 元画像とマスクを合成
cv2.imwrite('extract.png',extract)
```

color_mask_image.png<br>
![](/image/color_mask_image.png)<br>

extract.png<br>
![](/image/extract.png)


### 特定の色を別の色に置換する
抽出した人のマスキングを特定の色，ここではBGR=(255, 255, 255)に置換します．<br>
以下のコードで実行します．<br>
```python
import cv2
import numpy as np

result = cv2.imread('result.png')
# 特定の色を別の色に置換する
before_color = [60, 20, 220]
after_color = [255, 255, 255]
result[np.where((result == before_color).all(axis=2))] = after_color
cv2.imwrite('replace.png',result)
```

extract.png<br>
![](/image/extract.png)<br>

replace.png<br>
![](/image/replace.png)


## 参考サイト
[【python/OpenCV】画像の特定の色を抽出する方法](https://rikoubou.hatenablog.com/entry/2019/02/21/190310)<br>
[PIL/Pillowで画像の色を高速に置換する](https://qiita.com/pashango2/items/d6dda5f07109ee5b6163)<br>
[【OpenCV】 forループを使わずに指定した色を別の色に変更する](http://ni4muraano.hatenablog.com/entry/2017/05/15/000000)

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>