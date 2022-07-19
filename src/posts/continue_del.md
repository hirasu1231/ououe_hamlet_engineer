---
display: home
title: 'Pandasで連続データの重複を削除する'
description: Pandasで連続データの重複を削除します
date: 2022-7-21
image: https://www.hamlet-engineer.com/image/Python.png
categories: 
  - Python
tags:
  - memo
  - Python
  - Pandas
---

Pandasで連続データの重複を削除します

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## 単純な重複削除
単純に重複を削除する場合は，drop_duplicates()を使用します．


```python
import pandas as pd
import numpy as np

df = pd.Series(data=[1,1,1,2,2,2,3,3,3,2,2,3,1,1])
print('----初期データ----')
print(df)

# 一つ手前の要素と異なる要素だけを抜き出す
df = df.drop_duplicates()
print('-----削除後データ----')
print(df)
```

```
----初期データ----
0     1
1     1
2     1
3     2
4     2
5     2
6     3
7     3
8     3
9     2
10    2
11    3
12    1
13    1
dtype: int64
-----削除後データ----
0    1
3    2
6    3
dtype: int64
```

## 連続する場合の重複削除
単純に重複を削除する場合は，df.shift(1)で「1行ずらしたデータフレーム」を生成してします．

そして，上記のデータフレームと一致することを条件に抽出することで，連続する場合の重複削除されているデータフレームを擬似的に生成します．


```python
import pandas as pd
import numpy as np

df = pd.Series(data=[1,1,1,2,2,2,3,3,3,2,2,3,1,1])
print('----初期データ----')
print(df)

# 一つ手前の要素と異なる要素だけを抜き出す
df = df[df != df.shift(1)]
print('-----削除後データ----')
print(df)
```

```
----初期データ----
0     1
1     1
2     1
3     2
4     2
5     2
6     3
7     3
8     3
9     2
10    2
11    3
12    1
13    1
dtype: int64
-----削除後データ----
0     1
3     2
6     3
9     2
11    3
12    1
dtype: int64
```


## まとめ
Pandasで連続データの重複を削除しました．

## 参考サイト
[【Python】連続データの重複削除の覚書【Pandas】](https://kojimanotech.com/2020/01/14/205/)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">
