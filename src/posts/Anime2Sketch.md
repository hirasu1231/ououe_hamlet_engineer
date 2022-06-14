---
display: home
title: 'Anime2Sketchでアニメ画像から線画への変換を実装する'
description: Anime2Sketchでアニメ画像から線画への変換を実装します．
date: 2021-10-27
image: https://www.hamlet-engineer.com/image/out_madoka.jpg
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - Anime
---
Anime2Sketchでアニメ画像から線画への変換を実装します．<br>

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


## Google Driveと連携
Google ColabとGoogle Driveを連携させて，gitから[Mukosame/Anime2Sketch](https://github.com/Mukosame/Anime2Sketch.git)をダウンロードします．

```python
# Google ColabとGoogle Driveを連携
from google.colab import drive
drive.mount('/content/drive')
```

```python
# ディレクトリの移動
%cd /content/drive/MyDrive/
# gitのダウンロード
!git clone https://github.com/Mukosame/Anime2Sketch.git
!ls
```

```python
# 作業ディレクトリへの移動
%cd /content/drive/MyDrive/Anime2Sketch
!ls
```

## モジュールのインストール
下記のコードでモジュールのインストールします．

```python
!pip install -r requirements.txt
```

## 学習済みモデルのダウンロード
下記のリンクから学習済みモデルの`netG.pth`をダウンロードして，weightsフォルダーに入れてください．

[GoogleDrive](https://github.com/Mukosame/Anime2Sketch#:~:text=the%20weights%20from-,GoogleDrive,-%2C%20and%20put%20it)

```python
%%bash
# 確認
cd weights
ls
# netG.pth, Put the weights here
```

## コードの書き換え
エラーが発生したため，下記のコードの変更します．
```python
try:
  from torchvision.transforms import InterpolationMode
  bic = InterpolationMode.BICUBIC
 except ImportError:
   bic = Image.BICUBIC
```

```python
# try:
#   from torchvision.transforms import InterpolationMode
#   bic = InterpolationMode.BICUBIC
#  except ImportError:
bic = Image.BICUBIC
```

```python
%%writefile data.py
import os 
from PIL import Image
import torchvision.transforms as transforms
# try:
#     from torchvision.transforms import InterpolationMode
#     bic = InterpolationMode.BICUBIC
# except ImportError:
bic = Image.BICUBIC

import numpy as np
import torch 

IMG_EXTENSIONS = ['.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG', '.ppm', '.PPM', '.bmp', '.BMP']

def is_image_file(filename):
    """if a given filename is a valid image
    Parameters:
        filename (str) -- image filename
    """
    return any(filename.endswith(extension) for extension in IMG_EXTENSIONS)

def get_image_list(path):
    """read the paths of valid images from the given directory path
    Parameters:
        path (str)    -- input directory path
    """
    assert os.path.isdir(path), '{:s} is not a valid directory'.format(path)
    images = []
    for dirpath, _, fnames in sorted(os.walk(path)):
        for fname in sorted(fnames):
            if is_image_file(fname):
                img_path = os.path.join(dirpath, fname)
                images.append(img_path)
    assert images, '{:s} has no valid image file'.format(path)
    return images

def get_transform(load_size=0, grayscale=False, method=bic, convert=True):
    transform_list = []
    if grayscale:
        transform_list.append(transforms.Grayscale(1))
    if load_size > 0:
        osize = [load_size, load_size]
        transform_list.append(transforms.Resize(osize, method))
    if convert:
        transform_list += [transforms.ToTensor()]
        if grayscale:
            transform_list += [transforms.Normalize((0.5,), (0.5,))]
        else:
            transform_list += [transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))]
    return transforms.Compose(transform_list)

def read_img_path(path, load_size):
    """read tensors from a given image path
    Parameters:
        path (str)     -- input image path
        load_size(int) -- the input size. If <= 0, don't resize
    """
    img = Image.open(path).convert('RGB')
    aus_resize = None
    if load_size > 0:
        aus_resize = img.size
    transform = get_transform(load_size=load_size)
    image = transform(img)
    return image.unsqueeze(0), aus_resize 

def tensor_to_img(input_image, imtype=np.uint8):
    """"Converts a Tensor array into a numpy image array.
    Parameters:
        input_image (tensor) --  the input image tensor array
        imtype (type)        --  the desired type of the converted numpy array
    """

    if not isinstance(input_image, np.ndarray):
        if isinstance(input_image, torch.Tensor):  # get the data from a variable
            image_tensor = input_image.data
        else:
            return input_image
        image_numpy = image_tensor[0].cpu().float().numpy()  # convert it into a numpy array
        if image_numpy.shape[0] == 1:  # grayscale to RGB
            image_numpy = np.tile(image_numpy, (3, 1, 1))
        image_numpy = (np.transpose(image_numpy, (1, 2, 0)) + 1) / 2.0 * 255.0  # post-processing: tranpose and scaling
    else:  # if it is a numpy array, do nothing
        image_numpy = input_image
    return image_numpy.astype(imtype)

def save_image(image_numpy, image_path, output_resize=None):
    """Save a numpy image to the disk
    Parameters:
        image_numpy (numpy array)    -- input numpy array
        image_path (str)             -- the path of the image
        output_resize(None or tuple) -- the output size. If None, don't resize
    """

    image_pil = Image.fromarray(image_numpy)
    if output_resize:
        print(output_resize)
        print(bic)
        image_pil = image_pil.resize(size=output_resize, resample=bic)
    image_pil.save(image_path)
```

## 画像での変換を実行
下記のコードで画像での変換を実行します．
```python
# テスト実行
!python3 test.py --dataroot test_samples/madoka.jpg --load_size 512 --output_dir results/
```

下記のコードでJupyter上で画像を確認します．
```python
from IPython.display import Image,display_jpeg
display_jpeg(Image('test_samples/madoka.jpg'))
```

![jpg](/image/madoka.jpg)

```python
from IPython.display import Image,display_jpeg
display_jpeg(Image('results/madoka.jpg'))
```

![jpg](/image/out_madoka.jpg)

## 動画での変換を実行
下記のコードで動画での変換するpythonスクリプトを作成します．
```python
%%writefile test_video.py

import os
import cv2
import numpy as np
import torch
import torchvision.transforms as transforms

from data import get_image_list, get_transform
from model import create_model
from data import read_img_path, tensor_to_img, save_image
import argparse

from PIL import Image
bic = Image.BICUBIC


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Anime-to-sketch test options.')
    parser.add_argument('--dataroot','-i', default='test_samples/', type=str)
    parser.add_argument('--load_size','-s', default=512, type=int)
    parser.add_argument('--output_video','-o', default='results/sample.mp4', type=str)
    parser.add_argument('--gpu_ids', '-g', default=[], help="gpu ids: e.g. 0 0,1,2 0,2.")
    opt = parser.parse_args()

    # create model
    gpu_list = ','.join(str(x) for x in opt.gpu_ids)
    os.environ['CUDA_VISIBLE_DEVICES'] = gpu_list
    device = torch.device('cuda' if len(opt.gpu_ids)>0 else 'cpu')
    model = create_model().to(device)      # create a model given opt.model and other options
    model.eval()
    
    # get input data
    if os.path.isfile(opt.dataroot):
        # load video
        cap = cv2.VideoCapture(opt.dataroot)
        # video info
        codec = cv2.VideoWriter_fourcc(*'XVID')
        cap_fps = int(cap.get(cv2.CAP_PROP_FPS))
        cap_width,cap_height= int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        # output video
        output_video = cv2.VideoWriter(opt.output_video, codec, cap_fps, (cap_width,cap_height))

    else:
        raise Exception("{} is not a valid directory or video file.".format(opt.dataroot))
        
    # save outputs
    # save_dir = opt.output_video
    # os.makedirs(save_dir, exist_ok=True)
    
    # for test_path in test_list:
    while True:
        ret, frame = cap.read()
        if frame is None:
            print('Completed')
            break
        
        # basename = os.path.basename(test_path)
        # aus_path = os.path.join(save_dir, basename)
        
        # video frame image
        # img,  aus_resize = read_img_path(test_path, opt.load_size)
        aus_resize = None
        frame = Image.fromarray(frame) # cv2 -> pillow
        if opt.load_size > 0:
            aus_resize = frame.size
        transform = get_transform(load_size=opt.load_size)
        image = transform(frame)
        img = image.unsqueeze(0)
        
        # model convert
        aus_tensor = model(img.to(device))
        aus_img = tensor_to_img(aus_tensor)
        
        # resize image
        # save_image(aus_img, aus_path, aus_resize)
        image_pil = Image.fromarray(aus_img)
        image_pil = image_pil.resize(size=aus_resize, resample=bic)
        
        # output video AND cv2 -> pillow
        image_cv2 = np.array(image_pil, dtype=np.uint8)
        output_video.write(cv2.cvtColor(image_cv2, cv2.COLOR_BGR2RGB))
        
    cap.release()
    output_video.release()
```

下記のコードを動画での変換を実施します．

```python
# 変換実行
!python3 test_video.py --dataroot ./video/vinland.mp4 --load_size 512 --output_video ./video/out_vinland.mp4
```

<video width="560" height="360" controls>
  <source src="/video/vinland.mp4" type="video/mp4">
</video> 

<br><br>

<video width="560" height="360" controls>
  <source src="/video/out_vinland.mp4" type="video/mp4">
</video> 

## まとめ
Anime2Sketchでアニメ画像から線画への変換を実装しました．<br>

<br>


## 参考サイト
[Mukosame/Anime2Sketch](https://github.com/Mukosame/Anime2Sketch.git)

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>