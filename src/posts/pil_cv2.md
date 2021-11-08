---
display: home
title: 'Pillow ↔ OpenCVの変換を実装する'
description: Pillow ↔ OpenCVの変換を実行します．
date: 2021-11-08
image: https://www.hamlet-engineer.com/image/opencv.jpeg
categories: 
  - Python
tags:
  - Python
  - Opencv
  - Pillow
---

<!-- https://www.hamlet-engineer.com -->
Pillow ↔ OpenCVの変換を実行します．

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

## Pillow → OpenCV

```python
import numpy as np
import cv2

# PIL型で読み込み
pil_image = Image.open('opencv.jpeg')

try:
    # 保存
    cv2.imwrite('save_cv2.png', pil_image)
except:
    print('Error')
    

# PIL型 -> OpenCV型
cv2_image = np.array(pil_image, dtype=np.uint8)
cv2_image = cv2.cvtColor(cv2_image, cv2.COLOR_RGB2BGR)

# 保存
cv2.imwrite('save_cv2.png', cv2_image)
print('OK')
# Error
# OK
```

## OpenCV → Pillow

```python
from PIL import Image
import cv2

# OpenCV型で読み込み
cv2_image = cv2.imread('opencv.jpeg')
cv2_image = cv2.cvtColor(cv2_image, cv2.COLOR_BGR2RGB)

try:
    # 保存
    cv2_image.save('save_pil.png')
except:
    print('Error')

# OpenCV型 -> PIL型
pil_image = Image.fromarray(cv2_image)

# 保存
pil_image.save('save_pil.png')
print('OK')
# Error
# OK
```

## まとめ
Pillow ↔ OpenCVの変換を実行しました．

## 参考サイト
[【Python】Pillow ↔ OpenCV 変換](https://qiita.com/derodero24/items/f22c22b22451609908ee)



<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

