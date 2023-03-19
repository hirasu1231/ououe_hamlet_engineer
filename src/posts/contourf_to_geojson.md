---
display: home
title: 'PythonのヒートマップをGeoJsonで出力する'
description: PythonのヒートマップをGeoJsonで出力します。
date: 2023-3-19
image: https://www.hamlet-engineer.com/image/kde_2d_geojson.png
categories: 
  - Python
tags:
  - Python
  - visualization
  - Pandas
  - matplotlib
  - GIS
  - geojson
---
Pythonのヒートマップ(2次元カーネル密度)で描画したのをGeoJsonで出力します。

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ライブラリのインポート
```
!pip install -U matplotlib
```

```python
import warnings
warnings.simplefilter('ignore')

import numpy as np
import pandas as pd
from shapely import wkt
from shapely.geometry import Point

from scipy import stats
from scipy.stats import gaussian_kde
from skimage.transform import resize, rotate

import seaborn as sns
import matplotlib
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
from mpl_toolkits.mplot3d import Axes3D
import matplotlib.image as mpimg 

try:
  import geojsoncontour
except:
  !pip install geojsoncontour
  import geojsoncontour
```

## データの読み込み
下記のコードでデータを読み込みます。
```python
## データの読み込み
# 下記のコードでデータを読み込みます。

# データの生成
cood = []
for i in range(100):
    t = random.randint(0, 24)
    x = random.uniform(139.74, 139.75)
    y = random.uniform(35.65, 35.66)
    cood.append([t, x, y])

for i in range(400):
    t = random.randint(0, 24)
    x = random.uniform(139.72, 139.77)
    y = random.uniform(35.63, 35.68)
    cood.append([t, x, y])

# データフレーム化
df_plot = pd.DataFrame(cood, columns=["time", "lon", "lat"])
df_plot.head(2)
```

## 背景画像の準備
matplotlibで背景に使う画像を示します．

[右上]:139.786, 35.695

[左下]：139.747, 35.668 

![](/image/osm.png)


## 2次元カーネルをgeojsonで保存
2次元カーネルをgeojsonで保存します。

GISソフトに読み込ませるために，geojsonで出力します．

```python
# plt.figure(figsize=(32, 18))
figure = plt.figure(figsize=(16, 9))
# ax = figure.add_subplot(111)

# カーネル密度
kde = gaussian_kde(array_plot.T)

# 等高線を引く領域のx座標とy座標のリストを用意する
x = np.linspace(array_plot[:, 0].max(), array_plot[:, 0].min(), 200)
y = np.linspace(array_plot[:, 1].max(), array_plot[:, 1].min(), 200)
# メッシュに変換
xx, yy = np.meshgrid(x, y)
# kdeが受け取れる形に整形
meshdata = np.vstack([xx.ravel(), yy.ravel()])
# 高さのデータ計算
z = kde.evaluate(meshdata)

# 可視化
fig = plt.figure(figsize=(16, 9))
ax = fig.add_subplot(111)
# ax.scatter(data[:, 0], data[:, 1], c="b")
contourf = ax.contourf(xx, yy, z.reshape(len(y), len(x)), cmap=plt.cm.jet, alpha=0.4,  levels=10)
contourf.collections[0].set_alpha(0)

# ↑ここまでが普通のmatplotlib

# Convert matplotlib contour to geojson
geojson = geojsoncontour.contourf_to_geojson(
    contourf=contourf,
    geojson_filepath='./Dkde_plot.geojson',
    min_angle_deg=3.0,
    ndigits=3,
    fill_opacity=0.5
)
```

![](/image/kde_2d_geojson.png)

## まとめ
Pythonのヒートマップ(2次元カーネル密度)で描画したのをGeoJsonで出力しました。

## 参考サイト
[Python contourf_to_geojson Examples](https://python.hotexamples.com/examples/geojsoncontour/-/contourf_to_geojson/python-contourf_to_geojson-function-examples.html)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">