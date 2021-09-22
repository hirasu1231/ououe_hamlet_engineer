---
display: home
title: 'データ可視化ライブラリ Altairを使ってみる(クロス集計編)'
description: クロス集計でのデータ可視化ライブラリ Altair を使ってみる．
date: 2021-09-20
image: https://www.hamlet-engineer.com/image/Altair_logo.jpeg
categories: 
  - Python
tags:
  - Python
  - jupyter
  -  Altair
---
<!-- https://www.hamlet-engineer.com -->
クロス集計でのデータ可視化ライブラリ Altair を使ってみる．

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[toc]

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

## モジュールのインストール


```python
!pip3 install altair
!pip3 install altair_saver
```

## データの作成
可視化するためにでもデータを作成します．


```python
import numpy as np
import pandas as pd

np.random.seed(1)# 乱数の固定

n = 300 # 学生の人数
s = np.random.normal(55,10,n) # 学生の学力（score）
c = np.random.randint(0,3,n) # クラス
s = s * (1 + c * 0.015) # クラスの学力差をつける
g = np.random.randint(0,2,n) # 性別

# 得点データの生成
s1 = np.random.uniform(0.75,1.1,n) * s * (1 + g * 0.02)
s2 = np.random.uniform(0.9,1.1,n) * s * (1 - g * 0.05)
s3 = np.random.uniform(0.9,1.05,n) * s * (1 + g * 0.03)
s4 = np.random.uniform(0.9,1.2,n) * s * (1 - g * 0.02)
s5 = np.random.uniform(0.8,1.1,n) * s * (1 + g * 0.01)

sex = ['男','女'] # 性別
cl = ['普通','理数','特進'] # クラス
sub = ['国語','数学','理科','社会','英語'] # 教科

df = pd.DataFrame()
df['学生番号'] = list(map(lambda x: 'ID'+str(x).zfill(3), range(1,1+n)))
df['国語'] = list(map(lambda x: round(x), s1))
df['数学'] = list(map(lambda x: round(x), s2))
df['理科'] = list(map(lambda x: round(x), s3))
df['社会'] = list(map(lambda x: round(x), s4))
df['英語'] = list(map(lambda x: round(x), s5))
df['合計'] = df['国語'] + df['数学'] + df['社会'] + df['理科'] + df['英語']
df['クラス'] = list(map(lambda x: cl[x], c))
df['性別'] = list(map(lambda x: sex[x], g))
display(df.head(5))
```


<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>学生番号</th>
      <th>国語</th>
      <th>数学</th>
      <th>理科</th>
      <th>社会</th>
      <th>英語</th>
      <th>合計</th>
      <th>クラス</th>
      <th>性別</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>ID001</td>
      <td>65</td>
      <td>68</td>
      <td>68</td>
      <td>72</td>
      <td>76</td>
      <td>349</td>
      <td>普通</td>
      <td>男</td>
    </tr>
    <tr>
      <th>1</th>
      <td>ID002</td>
      <td>48</td>
      <td>52</td>
      <td>49</td>
      <td>56</td>
      <td>47</td>
      <td>252</td>
      <td>普通</td>
      <td>男</td>
    </tr>
    <tr>
      <th>2</th>
      <td>ID003</td>
      <td>52</td>
      <td>45</td>
      <td>50</td>
      <td>49</td>
      <td>45</td>
      <td>241</td>
      <td>普通</td>
      <td>女</td>
    </tr>
    <tr>
      <th>3</th>
      <td>ID004</td>
      <td>48</td>
      <td>39</td>
      <td>46</td>
      <td>45</td>
      <td>39</td>
      <td>217</td>
      <td>普通</td>
      <td>女</td>
    </tr>
    <tr>
      <th>4</th>
      <td>ID005</td>
      <td>52</td>
      <td>62</td>
      <td>71</td>
      <td>68</td>
      <td>63</td>
      <td>316</td>
      <td>特進</td>
      <td>女</td>
    </tr>
  </tbody>
</table>
</div>



```python
# 整然データへの変換
mdf = pd.melt(df.drop('合計',axis=1),id_vars=['学生番号','性別','クラス'],var_name="科目",value_name="得点" )
display(mdf) # melted dataframe
display(mdf[mdf['学生番号']=='ID001']) # melted dataframe
```


<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>学生番号</th>
      <th>性別</th>
      <th>クラス</th>
      <th>科目</th>
      <th>得点</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>ID001</td>
      <td>男</td>
      <td>普通</td>
      <td>国語</td>
      <td>65</td>
    </tr>
    <tr>
      <th>1</th>
      <td>ID002</td>
      <td>男</td>
      <td>普通</td>
      <td>国語</td>
      <td>48</td>
    </tr>
    <tr>
      <th>2</th>
      <td>ID003</td>
      <td>女</td>
      <td>普通</td>
      <td>国語</td>
      <td>52</td>
    </tr>
    <tr>
      <th>3</th>
      <td>ID004</td>
      <td>女</td>
      <td>普通</td>
      <td>国語</td>
      <td>48</td>
    </tr>
    <tr>
      <th>4</th>
      <td>ID005</td>
      <td>女</td>
      <td>特進</td>
      <td>国語</td>
      <td>52</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>1495</th>
      <td>ID296</td>
      <td>男</td>
      <td>特進</td>
      <td>英語</td>
      <td>50</td>
    </tr>
    <tr>
      <th>1496</th>
      <td>ID297</td>
      <td>男</td>
      <td>理数</td>
      <td>英語</td>
      <td>65</td>
    </tr>
    <tr>
      <th>1497</th>
      <td>ID298</td>
      <td>女</td>
      <td>普通</td>
      <td>英語</td>
      <td>69</td>
    </tr>
    <tr>
      <th>1498</th>
      <td>ID299</td>
      <td>男</td>
      <td>特進</td>
      <td>英語</td>
      <td>44</td>
    </tr>
    <tr>
      <th>1499</th>
      <td>ID300</td>
      <td>男</td>
      <td>特進</td>
      <td>英語</td>
      <td>52</td>
    </tr>
  </tbody>
</table>
<p>1500 rows × 5 columns</p>
</div>



<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>学生番号</th>
      <th>性別</th>
      <th>クラス</th>
      <th>科目</th>
      <th>得点</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>ID001</td>
      <td>男</td>
      <td>普通</td>
      <td>国語</td>
      <td>65</td>
    </tr>
    <tr>
      <th>300</th>
      <td>ID001</td>
      <td>男</td>
      <td>普通</td>
      <td>数学</td>
      <td>68</td>
    </tr>
    <tr>
      <th>600</th>
      <td>ID001</td>
      <td>男</td>
      <td>普通</td>
      <td>理科</td>
      <td>68</td>
    </tr>
    <tr>
      <th>900</th>
      <td>ID001</td>
      <td>男</td>
      <td>普通</td>
      <td>社会</td>
      <td>72</td>
    </tr>
    <tr>
      <th>1200</th>
      <td>ID001</td>
      <td>男</td>
      <td>普通</td>
      <td>英語</td>
      <td>76</td>
    </tr>
  </tbody>
</table>
</div>


## デモデータの可視化

### 散布図


```python
import altair as alt
from altair_saver import save

scatter = alt.Chart(df).mark_circle(
        size=30
        ).encode(
        x=alt.X('国語',
            scale=alt.Scale(
                domain=[0,100]
                ),
            axis=alt.Axis(
                labelFontSize=15, 
                ticks=True, 
                titleFontSize=18, 
                title='国語の得点')
            ),
        y=alt.Y('数学',
            scale=alt.Scale(
                domain=[0, 100]
                ),
            axis=alt.Axis(labelFontSize=15, 
                ticks=True, 
                titleFontSize=18, 
                title='数学の得点')
            ),
        column=alt.Column('クラス',
            header=alt.Header(
                labelFontSize=15, 
                titleFontSize=18), 
            sort = alt.Sort(
                cl
                ), 
            title='クラス'
            ),
        color=alt.Color('性別', 
            scale=alt.Scale(
                domain=sex,
                range=['blue', 'red']
                ),
            ),
        tooltip=['国語', '数学'],
    ).properties(
        width=300,
        height=300,
        title="国語と数学の得点分布"
    ).interactive()

# 描画
display(scatter)
# 保存
# save(scatter,'qiita1.html',embed_options={'actions':True})
```

![](/image/Altair_scatter01.png)


## 散布図（統計量の表示）
平均や標準偏差といった統計量を表示することができます．

ちなみに散布図は mark_circle()でも、mark_point() でも作成できます．

aggregation 関数を用いることで主要な統計量は計算可能である。代表的な統計量は mean()、median()、sum()、min()、max()、stderr()（標準誤差）、stdev()（標準偏差）など。


```python
import altair as alt
from altair_saver import save

scatter = alt.Chart(df).mark_point(
        filled=True, 
        size=200,
        opacity=0.7
    ).encode(
        x=alt.X(
            'mean(合計):Q',
            scale=alt.Scale(
                domain=[0,500]
                ),
            axis=alt.Axis(
                title='合計得点の平均'
                )
            ),
        y=alt.Y(
            'stdev(合計):Q',
            scale=alt.Scale(
                domain=[0,100]
                ),
            axis=alt.Axis(
                title='合計得点の標準偏差'
                )
            ),
        color=alt.Color('性別', 
            scale=alt.Scale(
                domain=sex,
                range=['blue', 'red']
                )
            )
    )
# 描画
display(scatter)
# 保存
# save(scatter,'qiita2.html',embed_options={'actions':True})
```

![](/image/Altair_scatter02.png)

## ヒストグラム
得点の分布を調べる際に有効です

```python
import altair as alt
from altair_saver import save

histgram = alt.Chart(df).mark_bar(opacity=0.5).encode(
    x=alt.X("合計", 
        bin=alt.Bin(
            step=10,
            extent=[0,500]
            ),
        axis=alt.Axis(
            labelFontSize=15, 
            ticks=True, 
            titleFontSize=18, 
            title='得点の分布'
            )
        ),
    y=alt.Y('count(合計)',
        axis=alt.Axis(
            labelFontSize=15, 
            ticks=True, 
            titleFontSize=18,
            title='人数'
            ),
        stack=None
        ),
    color=alt.Color('性別', 
            scale=alt.Scale(
                domain=sex,
                range=['blue','red']
                ),
            ),
    ).properties(
    width=600,
    height=500
    ).interactive()

# 描画
display(histgram)
# 保存
# save(histgram,'qiita3.html',embed_options={'actions':True})
```

![](/image/Altair_histgram.png)

## まとめ
今回は，クロス集計データでの代表的なもの3つで実装しました．

次は，時系列データでの実装もし，後に別データで可視化してみます．

## 参考サイト
[【Python】データ可視化ライブラリ Altair を使いこなす](https://qiita.com/keisuke-ota/items/aa93f45b3a9fc520541d)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>