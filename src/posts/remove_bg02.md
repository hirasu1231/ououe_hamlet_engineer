---
display: home
title: 'Image Mattingで学習済みモデルによる背景削除を実装する'
description: Image Mattingで学習済みモデルによる背景削除を実装します．
date: 2022-01-08
image: https://www.hamlet-engineer.com/image/remove_bg.png
categories: 
  - Python
tags:
  - Python
  - Semantic_Segmentation
  - Background_Removal
  - Image_Matting
---
Image Mattingで学習済みモデルによる背景削除を実装します．

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
Deep Image Matting(物体の切り抜き)によるSemantic Segmentationを実装します。

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
### gitのダウンロード
[poppinace/indexnet_matting](https://github.com/poppinace/indexnet_matting)をダウンロードします．

```python
!git clone https://github.com/poppinace/indexnet_matting.git
```

### 画像の整理
背景削除したい画像を"./examples/images/"に、先ほど作成したtrimapを"./examples/trimaps/"に移動させます．


```python
%cd indexnet_matting   
!pwd

# ＊＊＊/indexnet_matting
```

```python
# 背景削除したい画像
!cp ../man.png ./examples/images/
# trimap
!cp ../mask.png ./examples/trimaps/
```

### スクリプトの書き換え
./scripts/demo.pyのimage_pathに"./examples/images/men.png" ,trimap_pathに"./examples/trimaps/men.png" を追記します．

```python
%%writefile ./scripts/demo.py

import numpy as np
import os
import cv2 as cv
from time import time
from PIL import Image
from collections import OrderedDict

import torch
import torch.nn as nn
from hlmobilenetv2 import hlmobilenetv2

# ignore warnings
import warnings
warnings.filterwarnings("ignore")

IMG_SCALE = 1./255
IMG_MEAN = np.array([0.485, 0.456, 0.406, 0]).reshape((1, 1, 4))
IMG_STD = np.array([0.229, 0.224, 0.225, 1]).reshape((1, 1, 4))

STRIDE = 32
RESTORE_FROM = './pretrained/indexnet_matting.pth.tar'
RESULT_DIR = './examples/mattes'

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

if not os.path.exists(RESULT_DIR):
    os.makedirs(RESULT_DIR)

# load pretrained model
net = hlmobilenetv2(
        pretrained=False,
        freeze_bn=True, 
        output_stride=STRIDE,
        apply_aspp=True,
        conv_operator='std_conv',
        decoder='indexnet',
        decoder_kernel_size=5,
        indexnet='depthwise',
        index_mode='m2o',
        use_nonlinear=True,
        use_context=True
    )

try:
    checkpoint = torch.load(RESTORE_FROM, map_location=device)
    pretrained_dict = OrderedDict()
    for key, value in checkpoint['state_dict'].items():
        if 'module' in key:
            key = key[7:]
        pretrained_dict[key] = value
except:
    raise Exception('Please download the pretrained model!')
net.load_state_dict(pretrained_dict)
net.to(device)
if torch.cuda.is_available():
    net = nn.DataParallel(net)

# switch to eval mode
net.eval()

def read_image(x):
    img_arr = np.array(Image.open(x))
    return img_arr

def image_alignment(x, output_stride, odd=False):
    imsize = np.asarray(x.shape[:2], dtype=np.float)
    if odd:
        new_imsize = np.ceil(imsize / output_stride) * output_stride + 1
    else:
        new_imsize = np.ceil(imsize / output_stride) * output_stride
    h, w = int(new_imsize[0]), int(new_imsize[1])

    x1 = x[:, :, 0:3]
    x2 = x[:, :, 3]
    new_x1 = cv.resize(x1, dsize=(w,h), interpolation=cv.INTER_CUBIC)
    new_x2 = cv.resize(x2, dsize=(w,h), interpolation=cv.INTER_NEAREST)

    new_x2 = np.expand_dims(new_x2, axis=2)
    new_x = np.concatenate((new_x1, new_x2), axis=2)

    return new_x

def inference(image_path, trimap_path):
    with torch.no_grad():
        image, trimap = read_image(image_path), read_image(trimap_path)
        trimap = np.expand_dims(trimap, axis=2)
        image = np.concatenate((image, trimap), axis=2)
        
        h, w = image.shape[:2]

        image = image.astype('float32')
        image = (IMG_SCALE * image - IMG_MEAN) / IMG_STD
        image = image.astype('float32')

        image = image_alignment(image, STRIDE)
        inputs = torch.from_numpy(np.expand_dims(image.transpose(2, 0, 1), axis=0))
        inputs = inputs.to(device)
        
        # inference
        start = time()
        outputs = net(inputs)
        end = time()

        outputs = outputs.squeeze().cpu().numpy()
        alpha = cv.resize(outputs, dsize=(w,h), interpolation=cv.INTER_CUBIC)
        alpha = np.clip(alpha, 0, 1) * 255.
        trimap = trimap.squeeze()
        mask = np.equal(trimap, 128).astype(np.float32)
        alpha = (1 - mask) * trimap + mask * alpha

        _, image_name = os.path.split(image_path)
        Image.fromarray(alpha.astype(np.uint8)).save(os.path.join(RESULT_DIR, image_name))
        # Image.fromarray(alpha.astype(np.uint8)).show()

        running_frame_rate = 1 * float(1 / (end - start)) # batch_size = 1
        print('framerate: {0:.2f}Hz'.format(running_frame_rate))


if __name__ == "__main__":
    # 書換箇所_START
    image_path = [
        './examples/images/man.png',
        './examples/images/beach-747750_1280_2.png',
        './examples/images/boy-1518482_1920_9.png',
        './examples/images/light-bulb-1104515_1280_3.png',
        './examples/images/spring-289527_1920_15.png',
        './examples/images/wedding-dresses-1486260_1280_3.png'
    ]
    trimap_path = [
        './examples/trimaps/mask.png',
        './examples/trimaps/beach-747750_1280_2.png',
        './examples/trimaps/boy-1518482_1920_9.png',
        './examples/trimaps/light-bulb-1104515_1280_3.png',
        './examples/trimaps/spring-289527_1920_15.png',
        './examples/trimaps/wedding-dresses-1486260_1280_3.png'
    ]
    # 書換箇所_END
    for image, trimap in zip(image_path, trimap_path):
        inference(image, trimap)
```

### 背景削除の実行
scripts/demo.pyを実行、"./example/mattes/"に出力が格納される。

```python
!python3 ./scripts/demo.py
```

![](image/matte.png)


## まとめ
[Indices Matter: Learning to Index for Deep Image Matting](https://arxiv.org/pdf/1908.00672.pdf)
のコードから背景削除を実装しました．

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

