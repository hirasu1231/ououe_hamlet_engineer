---
display: home
title: '映画「CUBE」を楽しむプログラミングを構築してみた'
description: 映画「CUBE」で出てくる謎解きを楽しむプログラミングを構築してみました．
date: 2021-10-21
image: https://www.hamlet-engineer.com/image/cube.jpeg
categories: 
  - Python
tags:
  - Python
  - jupyter
  - Google_Colaboratory
---
<!-- https://www.hamlet-engineer.com -->
映画「CUBE」で出てくる謎解きを楽しむプログラミングを構築してみました．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

[[toc]]

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

## 素数トラップ仮説
冒頭で脱獄のプロが死亡したことで出てきた，3つの部屋番号のいずれかに素数が含まれているCUBEにトラップがあるという仮説から，下記に素数によるトラップ判定を記述しました．

```python
import math
from functools import reduce #左から右に累積的に関数を適用

# 素数じゃない判定
def not_prime(n):
    if n == 1: 
      return True

    for k in range(2, int(math.sqrt(n)) + 1):
        if n % k == 0:
            return True

    return False

# CUBEのトラップ素数判定
def cube_trap(room_num_str):
    # 数値に変換
    room_num_int = [int(n) for n in room_num_str.split(' ')]

    # 素数じゃない判定
    room_prime = [not_prime(n) for n in room_num_int]

    # トラップ判定
    trap_flag = reduce(lambda x, y: x*y, room_prime)

    if not trap_flag:
        print("トラップありの部屋です")
    else:
        print("トラップなしの部屋です")

while 1:
    room_num_str = input("部屋番号は？？(中断する時はEnter)")
    if not len(room_num_str):
        print("中断")
        break
    cube_trap(room_num_str)

# 部屋番号は？？(中断する時はEnter)149 419 568 <- 脱獄のプロが殺された部屋
# トラップありの部屋です
# 部屋番号は？？(中断する時はEnter)582 434 665
# トラップなしの部屋です
# 部屋番号は？？(中断する時はEnter)645 372 649
# トラップなしの部屋です
# 部屋番号は？？(中断する時はEnter)656 778 462
# トラップなしの部屋です
```

## デカルト座標仮説
部屋番号が3つの数字からなる理由について、それが三次元の座標を示しているという仮説．

CUBEの下請けだったワースの情報から、数学専攻の大学生であるレブンが，CUBEは最大一辺26部屋からなることを概算している。

そこで以下のようにして各数字の各位の数字を足し合わせることでマッピングが可能であると考えた。

たとえば、（899、552、175）という部屋番号であれば、（8+9+9、5+5+2、1+7+5）となり、（26、12、13）という端の部屋であることがわかる。

しかし、レブンは27の座標を持つ部屋を、CUBE中央部にて見つける。

```python
import math
from functools import reduce #左から右に累積的に関数を適用

# 各桁の総和
def digit_sum(n):
    sum_d = 0
    for d in range(2, -1, -1):
        sum_d = sum_d + (n // (10**d))
        n = n % (10**d)

    return sum_d

# CUBEの座標
def cube_coordinate(room_num_str):
    # 数値に変換
    room_num_int = [int(n) for n in room_num_str.split(' ')]

    # 座標変換
    room_coord = [digit_sum(n) for n in room_num_int]

    print("この部屋の座標は{}".format(room_coord))

while 1:
    room_num_str = input("部屋番号は？？(中断する時はEnter)")
    if not len(room_num_str):
        print("中断")
        break
    cube_coordinate(room_num_str)

# 部屋番号は？？(中断する時はEnter)566 472 737
# この部屋の座標は[17, 13, 17]
# 部屋番号は？？(中断する時はEnter)582 434 665
# この部屋の座標は[15, 11, 17]
# 部屋番号は？？(中断する時はEnter)149 419 568
# この部屋の座標は[14, 14, 19]
# 部屋番号は？？(中断する時はEnter)645 372 649
# この部屋の座標は[15, 12, 19]
# 部屋番号は？？(中断する時はEnter)656 778 462
# この部屋の座標は[17, 22, 12]
```

## 因数の数仮説
各数字の因数の個数がトラップの有無を決定付けているというもの。

本説では素数だけでなく、素数のべき乗もトラップナンバーであるとする。

すなわち、因数を1つしか持たない数（例えば841=29^2）はトラップナンバーとなる。

レブンは，26の三乗の計算は一瞬でできるのに，3桁の因数分解は天文学的らしい。

少し時間はかかるけど，できるだろ！！

```python
import collections

# 素因数分解
def prime_factorize(n):
    primes = []
    # 2で素因数分解
    while not n % 2:
        n //=  2
        primes.append(2)
    # 3以上で素因数分解
    f = 3
    while f**2 <= n:
        if not (n % f) :
            n //=  f
            primes.append(f)
        else:
            f += 2
    # 余った数を追加
    if n != 1:
        primes.append(n)
    
    return primes

# 素因数の数
def prime_counter(n):
    primes = prime_factorize(n)
    c = collections.Counter(primes)
    return len(c.keys())


# CUBEのトラップ素数判定
def cube_trap_new(room_num_str):
    # 数値に変換
    room_num_int = [int(n) for n in room_num_str.split(' ')]

    #  因数の数
    room_prime = [prime_counter(n)-1 for n in room_num_int]

    # トラップ判定
    trap_flag = reduce(lambda x, y: x*y, room_prime)

    if not trap_flag:
        print("トラップありの部屋です")
    else:
        print("トラップなしの部屋です")

while 1:
    room_num_str = input("部屋番号は？？(中断する時はEnter)")
    if not len(room_num_str):
        print("中断")
        break
    cube_trap_new(room_num_str)

# 部屋番号は？？(中断する時はEnter)656 778 462
# トラップなしの部屋です
# 部屋番号は？？(中断する時はEnter)841 778 462 <- 本編にない部屋
# トラップありの部屋です
```

## 順列組合せ移動説
デカルト座標仮説はあくまでも初期値を示すものであり，実際は各部屋が数字に従って移動しているとする説．

ワースがレンの死体を再発見した端部屋において，レン死亡時に隣接していたはずの部屋がなくなっていることから展開された．

レブンの解釈では，部屋の移動は部屋番号の各桁の数字を順列に従って引き算すれば良いとのこと．確かに，順列に従って引き算をすれば3回で一巡して元の位置に戻る．

本説により、27番目の部屋がCUBE外部へと続く架橋通路となっていることがわかった．

1st : (a1+b1+c1,a2+b2+c2,a3+b3+c3)+(a1-b1,a2-b2,a3-b3)=(2a1+c1,2a2+c2,2a3+c3)

2nd : (2a1+c1,2a2+c2,2a3+c3) + (b1-c1,b2-c2,b3-c3)=(2a1+b1, 2a2+b2, 2a3+b3)

3rd : (2a1+b1, 2a2+b2, 2a3+b3) + (c1-a1,c2-a2,c3-a3) = (a1+b1+c1, a2+b2+c2,a3+b3+c3)

```python
import math
import numpy as np
from functools import reduce #左から右に累積的に関数を適用

# 各桁の総和
def digit_sum(n):
    sum_d = 0
    for d in range(2, -1, -1):
        sum_d = sum_d + (n // (10**d))
        n = n % (10**d)

    return sum_d

# CUBEの座標
def cube_coordinate_new(room_num_str, idx):
    # 数値に変換
    room_num_int = [int(n) for n in room_num_str.split(' ')]

    # 1桁の数値
    al = [rn//100 for rn in room_num_int]
    # 2桁の数値
    bl = [rn%100 for rn in room_num_int]
    bl = [rn//10 for rn in bl]
    # 3桁の数値
    cl = [rn%10 for rn in room_num_int]
    
    # 初期座標
    coord_1st = np.array(al) + np.array(bl) + np.array(cl)
    # 第2座標 (2a1+c1,2a2+c2,2a3+c3)
    coord_2nd = 2 * np.array(al) + np.array(cl)
    # 第3座標 (2a1+b1, 2a2+b2, 2a3+b3)
    coord_3rd = 2 * np.array(al) + np.array(bl)

    print("この部屋の初期座標は{}".format(coord_1st))
    print("この部屋の第2座標は{}".format(coord_2nd))
    print("この部屋の第3座標は{}".format(coord_3rd))

    # 可視化用
    size = 2
    coord_1st = coord_1st.tolist() + [idx, size]
    coord_2nd = coord_2nd.tolist() + [idx, size]
    coord_3rd = coord_3rd.tolist() + [idx, size]

    return [coord_1st, coord_2nd, coord_3rd]

# 582 434 865 レンの死体
# 149 419 568 レンの死亡

# 666 897 466
# 567 898 545
# 656 778 462

# 作中では下記の部屋が隣り合う
room_list = ["582 434 865", 
            "666 897 466",
            "567 898 545",
            "656 778 462"]

cube_coordinates = []
for idx, room_num_str in enumerate(room_list):
    # room_num_str = input("部屋番号は？？(中断する時はEnter)")
    cube_coordinate = cube_coordinate_new(room_num_str, 'room_{}'.format(idx+1))
    cube_coordinates.extend(cube_coordinate)
    print("=" * 40)

# この部屋の初期座標は[15 11 19]
# この部屋の第2座標は[12 12 21]
# この部屋の第3座標は[18 11 22]
# ========================================
# この部屋の初期座標は[18 24 16]
# この部屋の第2座標は[18 23 14]
# この部屋の第3座標は[18 25 14]
# ========================================
# この部屋の初期座標は[18 25 14]
# この部屋の第2座標は[17 24 15]
# この部屋の第3座標は[16 25 14]
# ========================================
# この部屋の初期座標は[17 22 12]
# この部屋の第2座標は[18 22 10]
# この部屋の第3座標は[17 21 14]
# ========================================
```

座標を見ても隣り合っているようには見えない．

## 順列組合せ移動説を描画
上記の座標移動を描画する．
```python
import pandas as pd
import plotly.express as px

_list = []
for i in range(0,26, 25):
    for j in range(0,26, 25):
        for k in range(0,26, 25):
            _list.append([i, j, k, 'room_0', 1])

df = pd.DataFrame(_list, columns=['x', 'y', 'z', 'room_id', 'size'] )

df1 = pd.DataFrame(cube_coordinates, columns=['x', 'y', 'z', 'room_id', 'size'] )
df = pd.concat([df, df1], axis=0)

fig = px.scatter_3d(df, x = 'x', 
                    y = 'y', 
                    z = 'z',
                    color = 'room_id', size = 'size', size_max=10)
  
fig.show()
```

青点がCUBEの端で，それ以外の色が隣り合うようになるはずだが，明らかに赤点が離れた位置にある．

![](/image/cube_plot.png)


## 順列組合せ移動説の検証
劇中では，レンの死体がある部屋「582 434 865」の移動軌跡を下記のように示している．
- x軸移動： 0, 1, -1
- y軸移動： 2, 5, -7
- z軸移動： 1, -1, 0

そこで，3つの連立方程式で解いてみる．
```python
import sympy as sp

# ax+by+cz=j
# dx+ey+fz=k
# gx+hy+iz=l
a, b, c = 5, 8, 2
d, e, f = 4, 3, 4
g, h, i = 8, 6, 5

sp.var('x, y, z')
str_list = ['仮説での初期値', '仮説での1st移動', '仮説での2nd移動', '仮説での3rd移動']
cood_list = [[15, 11, 19], [-3, 1, 2], [6, -1, 1], [-3, 0, -3]]

for _str, [j, k, l] in zip(str_list, cood_list):
    eq1=sp.Eq(a*x+b*y+c*z, j)
    eq2=sp.Eq(d*x+e*y+f*z, k)
    eq3=sp.Eq(g*x+h*y+i*z, l)
    print(_str)
    print(sp.solve ([eq1, eq2, eq3], [x, y, z]))
    print('='*20)

# 仮説での初期値
# {x: 1, y: 1, z: 1} 
# ====================
# 仮説での1st移動
# {x: 1, y: -1, z: 0}
# ====================
# 仮説での2nd移動
# {x: 0, y: 1, z: -1}
# ====================
# 仮説での3rd移動
# {x: -1, y: 0, z: 1}
# ====================
```

そして，劇中での移動は下記の通りです．

```python
import sympy as sp

# ax+by+cz=j
# dx+ey+fz=k
# gx+hy+iz=l
a, b, c = 5, 8, 2
d, e, f = 4, 3, 4
g, h, i = 8, 6, 5

sp.var('x, y, z')
str_list = ['劇中での初期値', '劇中での1st移動', '劇中での2nd移動', '劇中での3rd移動']
cood_list = [[17, 25, 14], [0, 2, 1], [1, 5, -1], [-1, -7, 0]]

for _str, [j, k, l] in zip(str_list, cood_list):
    eq1=sp.Eq(a*x+b*y+c*z, j)
    eq2=sp.Eq(d*x+e*y+f*z, k)
    eq3=sp.Eq(g*x+h*y+i*z, l)
    print(_str)
    print(sp.solve ([eq1, eq2, eq3], [x, y, z]))
    print('='*20)

# 劇中での初期値
# {x: -163/17, y: 87/17, z: 12}
# ====================
# 劇中での1st移動
# {x: -10/17, y: 2/17, z: 1}
# ====================
# 劇中での2nd移動
# {x: -175/51, y: 23/17, z: 11/3}
# ====================
# 劇中での3rd移動
# {x: 205/51, y: -25/17, z: -14/3}
# ====================
```

順列組合せ移動説だと，各移動でx, y, zの解のどれかが0になるはずです．

他のサイトでも指摘されていましたが，おそらく制作のミスと思います．

## まとめ
結局できませんでしたが，映画「CUBE」で出てくる謎解きを楽しむプログラミングを構築してみました．

## 参考サイト
[google ColaboratoryでSeleniumを使う](https://enjoy-a-lot.com/google-colaboratory-selenium/)

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>