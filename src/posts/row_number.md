---
display: home
title: '時間が早い順に連続値を追加する'
description: 時間が早い順に連続値を追加する方法をPandasとBQで記述します．
date: 2023-4-4
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - memo
  - Python
  - Pandas
---
時間が早い順に連続値を追加する方法をPandasとBQで記述します．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## Pandasで作成

```python
# 連続値を追加
df = df.sort_values('dep_time', ascending=False)
df["order_number"] = df(["id"]).cumcount()
```

## BigQueryで作成

```sql
select 
  * ,
  ROW_NUMBER() OVER(PARTITION BY id ORDER BY dep_time) AS order_number
from 
  t1
```

## まとめ
時間が早い順に連続値を追加する方法をPandasとBQで記述しました．

## 参考サイト

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">