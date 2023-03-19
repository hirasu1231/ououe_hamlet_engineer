---
display: home
title: 'Pandasにおける条件付きで要素を上書きする'
description: Pandasにおける条件付きで要素を上書きします．
date: 2023-3-30
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - memo
  - Python
  - Pandas
  - kowaza0708
---
Pandasにおける条件付きで要素を上書きします．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## データフレームの作成
データフレームの作成します．

```python
import pandas as pd
import numpy as np

df = pd.DataFrame([['A','a',110], ['C','c',130], ['C','c',130], ['D', 'a',140],['A','a',110]],
                  columns=['col01', 'col02', 'col03'])
df.head()
```

| col01 | col02 | col03 |
| - | - | - |
| A | a | 110 |
| C | c | 130 |
| C | c | 130 |
| D | a | 140 |
| A | a | 110 |
| A | a1 | 110 |

## Pandasの上書き

```python
# 「col01がA」の時は,「col03を10」にする
df2 = df.copy()
df2.loc[df2['col01']=='A', 'col03'] = 10
display(df2)
```

| col01 | col02 | col03 |
| - | - | - |
| A | a | 10 |
| C | c | 130 |
| C | c | 130 |
| D | a | 140 |
| A | a | 10 |
| A | a1 | 10 |


```python
# 「col01がA」以外は,「col03を10」にする
df2 = df.copy()
df2.loc[~(df2['col01']=='A'), 'col03'] = 10
display(df2)
```

| col01 | col02 | col03 |
| - | - | - |
| A | a | 110 |
| C | c | 10 |
| C | c | 10 |
| D | a | 10 |
| A | a | 110 |
| A | a1 | 110 |


```python
# 「col01がA」かつ「col02がa」の時は,「col03を10」にする
df2 = df.copy()
df2.loc[(df2['col01']=='A') & (df2['col02']=='a'), 'col03'] = 10
display(df2)
```

| col01 | col02 | col03 |
| - | - | - |
| A | a | 10 |
| C | c | 130 |
| C | c | 130 |
| D | a | 140 |
| A | a | 10 |
| A | a1 | 110 |



## まとめ
Pandasにおける条件付きで要素を上書きしました．

## 参考サイト
[pandasで条件に応じて値を代入（where, mask）](https://note.nkmk.me/python-pandas-where-mask/)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


