---
display: home
title: 'Pandasで接頭文字の検索をする'
description: Pandasで接頭文字の検索をします
date: 2023-4-9
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - memo
  - Python
  - Pandas
---
Pandasで接頭文字の検索をします

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## 接頭文字で検索
下記のコードで接頭文字の検索をします。
```python
A = ["abc", "abcd", "abcde", "abdedf"]
# Aに含まれる文字列の共通接頭辞は"ab"です。

prefix = []
for x in zip(*A):  # リストAをUnpackingしてzip()に渡します。
    if len(set(x)) == 1:
        prefix.append(x[0])
    else:
        break
print("".join(prefix))
# ab
```

## まとめ
Pandasで接頭文字の検索をしました。

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">
