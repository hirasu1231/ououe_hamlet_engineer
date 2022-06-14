---
display: home
title: 'Pytorchで学習済みモデルによる背景削除を実装する'
description: Pytorchで学習済みモデルによる背景削除を実装します．
date: 2022-01-8
image: https://www.hamlet-engineer.com/image/remove_bg.png
categories: 
  - Python
tags:
  - Python
  - Semantic_Segmentation
  - Background_Removal
---
Pytorchで学習済みモデルによる背景削除を実装します．

<!-- https://www.hamlet-engineer.com -->

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


## 背景削除
Semantic SegmentationによるDeep Image Matting(物体の切り抜き)を実装します。

Semantic Segmentationのカラーマップは、物体には255、背景には0、物体か背景か不明な場所には127と記述します。

![](image/remove_bg.png)


## ライブライのインポート
下記のコマンドでライブラリをインポートします。

```python
import numpy as np
import cv2
import matplotlib.pyplot as plt

import torch
import torchvision
from torchvision import transforms
```

## 画像の読み込み
画像を読み込み、DeepLabv3の入力サイズに合わせてリサイズします。

![](image/man.png)

```python
# 画像の読み込み
image_path = 'man.png'
img = cv2.imread(image_path)
# BGR->RGBへ変換
img = img[...,::-1]
h,w,_ = img.shape
# 画像のリサイズ
img = cv2.resize(img,(320,320))
```

## 学習済みモデルの読み込み
pythorchで学習済みモデル(21クラスのセマンティックセグメンテーション)を読み込みます。

```python
# GPU or CPU
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

# 学習済みモデルの読み込み
model = torchvision.models.segmentation.deeplabv3_resnet101(pretrained=True)
model = model.to(device)
model.eval();
```

## 前処理
前処理として、画像のnumpy配列をtensor型にし、正規化します．また，バッチの次元を追加します．

正規化を実施する場合，本来は各チャネル(BGR)でtensor型の平均・標準偏差を算出して入力する．

しかし，今回は学習済みモデルを読み込んでいるため，事前に算出されている平均・標準偏差を公式ページより引用します．

[torchvision.models — PyTorch master documentation](https://pytorch.org/docs/master/torchvision/models.html)

**前処理**
- 前処理：transforms.Compose()
- tensor型へ変換(0~1にスケーリング)：transforms.ToTensor()
- 正規化：transforms.Normalize()

**バッチ化**

元のテンソルを書き換えずに次元を増やして，バッチ化を記述する．
- unsqueeze(dim)：元のテンソルを書き換えずに、次元を増やしたテンソルを返す
- unsqueeze_(dim)：元のテンソルを書き換えて、テンソルの次元を増やす

```python
# 前処理：tensor型へ変換 + 正規化
preprocess = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# 入力画像の情報
print("img-info")
print('channel：', img[0][0])
print('shape：', img.shape)
print("="*40)

# 画像の前処理
input_tensor = preprocess(img)
print("preprocess-info")
print('channel：', input_tensor[0][0][0], input_tensor[1][0][0], input_tensor[2][0][0])
print('shape：', input_tensor.shape)
print("="*40)

# バッチ化(ここではバッチサイズ=1)
input_batch = input_tensor.unsqueeze(0).to(device)
print("batch-info")
print('channel：', input_batch[0][0][0][0], input_batch[0][1][0][0], input_batch[0][2][0][0])
print('shape：', input_batch.shape)
```

## セグメンテーションの実行
下記の手法でセグメンテーションを実行します．

torch.no_gradはテンソルの勾配の計算を不可にし，メモリの消費を減らします．

そして，21クラス中で最大となるクラスを出力させて，背景とそれ以外を区別してマスキングします．

最大となるクラスの出力は，argmax(0)で出力します．

3次元のnumpy型でのargmax(0)では、2次元目・3次元目での各要素で最大値となる1次元の順序を出力します．

```python
import numpy as np

# 3次元
array3 = np.array([[[8, 4, 1 ], 
                    [7, 2, 12], 
                    [3, 2, 9]],
                   [[6, 11,  3], 
                    [5,  9, 10], 
                    [11, 7, 4]]])

print(array3)
print(array3.shape)
print(array3.argmax(0))

# [[[ 8  4  1]
#   [ 7  2 12]
#   [ 3  2  9]]

#  [[ 6 11  3]
#   [ 5  9 10]
#   [11  7  4]]]
# (2, 3, 3)
# [[0 1 1]
#  [0 1 0]
#  [1 1 0]]
```

下記のコードで背景削除を実行します．
```python
# 勾配計算を不可にし，メモリを節約
with torch.no_grad():
    output = model(input_batch)['out']
    print("output-info")
    print('shape', model(input_batch)['out'].shape)
    output = output[0]
    print('shape', output.shape) # 21クラスでの各要素のスコア
    
# 画像を出力
# 21クラス中で最大スコアのクラスを出力
output = output.argmax(0)
# マスキング画像の生成
mask = output.byte().cpu().numpy()
mask = cv2.resize(mask,(w,h))
mask[mask!=0] = 255
img = cv2.resize(img,(w,h))

# 画像を描画
plt.gray()
plt.figure(figsize=(20,20))
plt.subplot(1,2,1)
plt.imshow(img)
plt.subplot(1,2,2)
plt.imshow(mask);
cv2.imwrite('./mask.png', mask)
```

![](image/figure01.png)

## trimapの作成
OpenCVで膨張収縮処理をしてtrimapを生成し、適当な場所に保存します。下の右のようなtrimapが得られます。

```python
# trimapを作成
def gen_trimap(mask,k_size=(5,5),ite=1):
    # 膨張収縮処理
    kernel = np.ones(k_size,np.uint8)
    eroded = cv2.erode(mask,kernel,iterations = ite)
    dilated = cv2.dilate(mask,kernel,iterations = ite)
    # 膨張収縮の差はグレーに着色
    trimap = np.full(mask.shape,128)
    trimap[eroded == 255] = 255
    trimap[dilated == 0] = 0
    return trimap

trimap = gen_trimap(mask,k_size=(10,10),ite=5)
print(trimap[500][300:400])
cv2.imwrite('./trimaps.png', trimap)
plt.figure(figsize=(20,20))
plt.subplot(1,2,1)
plt.imshow(img)
plt.subplot(1,2,2)
plt.imshow(trimap)
```

![](image/figure02.png)

## 背景削除の実行
下記の手法で背景削除を実行します．

```python
import numpy as np
import cv2
import matplotlib.pyplot as plt

# 読み込み
img = cv2.imread('./man.png')
img = img[...,::-1]
matte = cv2.imread('./mask.png')
h,w,_ = img.shape
wback = np.full_like(img,255) #white background

# 小数点型に変換
img = img.astype(float)
wback = wback.astype(float)

# 背景削除
matte = matte.astype(float)/255
img = cv2.multiply(img, matte) # 画像の乗算
wback = cv2.multiply(wback, 1.0 - matte) # 画像の乗算
# 白背景とカラー画像を重ねる
outImage = cv2.add(img, wback)
# 画像描画
plt.imshow(outImage/255)

# 画像出力
outImage = outImage[...,::-1]
cv2.imwrite('./remove_bg.png', outImage)
```

![](image/remove_bg.png)

## まとめ
Pytorchで学習済みモデルによる背景削除を実装しました．

次は，論文のコードを実装します．

## 参考サイト
[Deep Learningで背景削除をしてみる](https://tech.fusic.co.jp/posts/2020-01-20-remove-background/)

[poppinace/indexnet_matting](https://github.com/poppinace/indexnet_matting)

[Indices Matter: Learning to Index for Deep Image Matting](https://arxiv.org/pdf/1908.00672.pdf)

[Deep Image Matting : 物体の切り抜きを高精度化する機械学習モデル](https://medium.com/axinc/deep-image-matting-%E7%89%A9%E4%BD%93%E3%81%AE%E5%88%87%E3%82%8A%E6%8A%9C%E3%81%8D%E3%82%92%E9%AB%98%E7%B2%BE%E5%BA%A6%E5%8C%96%E3%81%99%E3%82%8B%E6%A9%9F%E6%A2%B0%E5%AD%A6%E7%BF%92%E3%83%A2%E3%83%87%E3%83%AB-45580882966f)

[unsqueeze(dim)とunsqueeze_(dim)の違い【PyTorch】](https://lilaboc.work/archives/23948835.html)

[【Ptyorch】ToTenserした画像をNormalizationすることに意味はあるのでしょうか](https://teratail.com/questions/234027)

[torchvision.models — PyTorch master documentation](https://pytorch.org/docs/master/torchvision/models.html)

[PyTorchのtorch.no_grad()とは何か（超個人的メモ）](https://qiita.com/kaba/items/da5ff6d93e5147412613)

[pytorch_vision_deeplabv3_resnet101](https://pytorch.org/hub/pytorch_vision_deeplabv3_resnet101/)



<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

