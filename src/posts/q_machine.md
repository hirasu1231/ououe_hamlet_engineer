---
display: home
title: '量子コンピュータ(組合せ最適化問題)をPythonで実行する'
description: 量子コンピュータ(組合せ最適化問題)をPythonで実行します．
date: 2022-5-2
image: https://www.hamlet-engineer.com/image/q_machine_top.png
categories: 
  - Python
tags:
  - Python
  - Quantum_Computer
  - D-Wave
---
量子コンピュータ(組合せ最適化問題)をPythonで実行します．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## 組合せ最適化問題

### イジングモデル
イジングモデル方式の量子コンピュータは組合せ最適化問題に特化した専用機ということで、入力が特定の形に限定されています。その入力形式がイジングモデルと呼ばれる統計力学で用いられるモデルです。

量子コンピュータ（イジングモデル方式）にイジングモデルの形で入力すると、そのモデルのエネルギーが最小となるような変数の組合せを探索してくれるといった感じです。

具体的なエネルギーの式は以下のように表現されます。

$$
H=\sum_{i≠j}j_{ij} σ_i σ_j + \sum_{i}h_i σ_i(σ=±1)
$$

いきなり複雑な数式が出てきて、は？って感じですよね。筆者も理論的な解説には自信がないのでここでは割愛します。
ただ一つ、HH は σσ の最大2次の多項式で表現されるということだけ認識しておいてください。

解く際には、σσ の係数を行列形式で入力すると、HH が最小となるような σσ の組合せを探索してくれます。
とりあえず量子コンピュータで解くには、σσ の最大2次の多項式で表現することが最初の目標となります。

### QUBO
QUBOはイジングモデルと似た別のモデルで、エネルギーは以下の式で表されます。

$$
H=\sum_{i≠j}j_{ij} x_i x_j + \sum_{i}h_i x_i
$$

イジングモデルとの違いは、変数が「±1をとるσ」から「{0,1}をとるx」に置き換わっただけです。

本コードでは最適化ではQUBOを使用します。

## 最短経路探索

### 経路の表現
移動経路を都市ごとに下記の画像のような図を示している．

横軸は都市名，縦軸は巡回する順序，●は利用するかor利用しないかを0,1のバイナリで入力している．

下図では，都市A → 都市B → 都市C → 都市Dの順で利用する経路を示している．

![](/image/q_machine01.png)

### QUBO(H)の最適化
上図の行列は，QUBOで示したエネルギーHHが最小となる組合せとして返してくれます。

Hが最小となる組合せは，4×4=16のバイナリの組合せは、2の16乗で65536通りにもなります．

ただし，65536通りの中に4つの都市を同時に利用する状況も入っています．

上記のようなありえない状況は，Hが最小となる組合せを算出する際に，実態の移動を示す制約条件(利用できるのは1つだけ等)として考慮します．

つまり、理想的なコースのときに H が最小となるような式を x(2次以下)を用いて表現できれば量子コンピュータで最適化することができます。

## QUBO(H)の計算項
一般的に、Hを考える際には Hを構成する項として目的項と制約項を考えます。

| 項 | 役割 |
| - | - |
| 目的項 | 最大化 or 最小化したい目的となる項。良い結果ほど値が小さくなるように設定する。 |
| 制約項(罰則項) | 制約を満たす場合に最小となる項。制約に違反する場合はペナルティとして値が大きくなるように設定する。 |


## 最短経路探索の定式化

### 目的項
「都市Aからスタートして全都市を巡回して、Aに戻る」ということを目的としいました．

移動前都市をj、移動後都市を i  (1≤j≤m,1≤i≤n)とすると、総移動距離 L は以下のように示し，下図に示す．
$$
L=\sum_{j=0}^{m} \sum_{i=0}^{n}l_jx_i,_j
$$


![](/image/q_machine02.png)


そして、移動経路の算出は下記の通りとする。

![](/image/q_machine03.png)

最短経路で巡回するので、良い結果ほど値が小さくなるよう目的項 Haimとして設定します。

$$
Haim=\sum_{t=1}^{4}  \sum_{j=1}^{4} \sum_{k=1}^{4}l_j,_k x_t,_j x_{t+1},_k
$$

### 制約条件なし
制約条件なしの目的項で最適化すると，下記のようになります．

![](/image/q_machine04.png)

よって、ここから求めている最適化の形にするために、制約条件を逐次設定します。

### 制約条件1(出発都市以外は1度だけ訪れる)
制約条件1としては、出発都市以外は各都市1度だけは訪れるものとします。

制約条件1について、下図、下式で示します．

$$
\sum_{j=2}^{4}(1 - \sum_{i=1}^{5}x_i,_j)^2
$$

![](/image/q_machine05.png)

### 制約条件2(出発都市と到着都市の指定)
上記の目的項と制約項1だと下記のような解も想定できます。

![](/image/q_machine06.png)

巡回させるために、コースの最初と最後は都市Aを利用するという制約を設定します．

式に示すと，下記のようになります．都市Aに帰ることで，最小値0をとります．

$$
H_2 = 2 - x_1,_1 - x_n,_1
$$

![](/image/q_machine07.png)

### 制約条件3(同時に複数都市を訪れない)
上記の目的項と制約項1・制約項2だと「同時に複数都市を来訪する解」も想定できます。

制約条件3としては、同時に複数都市を訪れないものとします。

制約条件3について、下図、下式で示します．
$$
\sum_{i=1}^{5}(1 - \sum_{j=1}^{4}x_i,_j)^2=1
$$

![](/image/q_machine08.png)

### 定式化まとめ

**入力データ**

**目的**
- 移動距離の最短化

**制約**
- 制約条件1(出発都市以外は1度だけ訪れる)
- 制約条件2(出発都市と到着都市の指定)
- 制約条件3(同時に複数都市を訪れない)

**最終的なエネルギー関数 HH**

$$
HH=Haim + H_1 + H_2 + H_3\\
Haim=\sum_{t=1}^{4}  \sum_{j=1}^{4} \sum_{k=1}^{4}l_j,_k x_t,_j x_{t+1},_k\\
H_1=\sum_{j=2}^{4}(1 - \sum_{i=1}^{5}x_i,_j)^2\\
H_2 = 2 - x_1,_1 - x_n,_1\\
H_3 =\sum_{i=1}^{5}(1 - \sum_{j=1}^{4}x_i,_j)^2=1
$$

## Pythonでの量子コン(D-Wave)の定式化

## ライブラリのインストール
下記のコードでライブラリをインストールします．
```python
# 実行後、ランタイムを再起動してください
!pip install dwave-ocean-sdk
```

### 都市ネットワークの作成

```python
import numpy as np

# 都市数
N = 4

# 都市間の移動距離
L = np.array([[   0,   10,   20,   50],
              [  10,    0,   20,   30],
              [  20,   20,    0,   25],
              [  50,   30,   25,    0]])
```

### quboの定式

**quboの定式**
```python
from pyqubo import Array, Constraint, Placeholder
x = Array.create('x', shape=(N+1, N), vartype='BINARY')

# 目的関数
cost = 0
for t in range(N):
    for j in range(N):
        for k in range(N):
            cost = cost + L[j][k]*x[t][j]*x[t+1][k]

# 制約条件1(出発都市以外は1度だけ訪れる)
constr_1 = 0
for j in range(1, N):
    constr_1 += (np.sum(x.T[j])-1)**2

# 制約条件2(出発都市と到着都市の指定)
constr_2 = 2-x[0][0]-x[4][0]

# 制約条件3(同時に複数都市を訪れない)¶
constr_3 = 0
for i in range(N+1):
    constr_3 += (np.sum(x[i])-1)**2
    
# 制約条件4(出発都市の来訪回数)
# constr_4 = (np.sum(x.T[0])-2)**2

# コスト関数
cost_func = cost + Placeholder('lam1')*Constraint(constr_1, label='constr_1') \
                 + Placeholder('lam2')*Constraint(constr_2, label='constr_2') \
                 + Placeholder('lam3')*Constraint(constr_3, label='constr_3') # \
                 # + Placeholder('lam4')*Constraint(constr_3, label='constr_4')
model = cost_func.compile()
```

**quboのパラメータ**

```python
# パラメータの設定
feed_dict = {'lam1': 200.0, 
             'lam2': 300.0, 
             'lam3': 100.0}
             # 'lam4': 300.0} # penalty係数

# dict形式のQUBO
qubo, offset = model.to_qubo(feed_dict=feed_dict)
```

## D-Waveマシンでの実行

### D-Waveのトークンの入力
```python
# D-Waveのトークンの入力
token = "＊＊＊＊＊＊＊＊＊＊＊"
endpoint = 'https://cloud.dwavesys.com/sapi/'
```

### quboの入力

```python
from dwave.system import DWaveSampler, EmbeddingComposite
# DWの設定
dw_sampler = DWaveSampler(solver='DW_2000Q_6', token=token, endpoint=endpoint)
# 呼び出し
sampler = EmbeddingComposite(dw_sampler)
# quboの入力
sampleset = sampler.sample_qubo(qubo, num_reads=10)
# 結果出力
print(sampleset.record)
# 00 h 00 m 00.013 s
```

### 制約条件の確認
出力結果が制約条件を満たしているかを確認する。

```python
# 制約条件を守っているかどうかの情報を得ることができる
decoded_samples = model.decode_sampleset(sampleset=sampleset, feed_dict=feed_dict)

# 後半の5つの出力結果が制約条件破ってる
for sample in decoded_samples:
    print(sample.constraints(only_broken=True))
# {}
# {'constr_3': (False, 1.0)}
# {'constr_3': (False, 1.0)}
```

### 出力結果の確認

```python
# 出力結果の確認
# 順路：A→D→C→B→A
sampleset.record[0][0].reshape(N+1, N)

# array([[1, 0, 0, 0],
#        [0, 0, 0, 1],
#        [0, 0, 1, 0],
#        [0, 1, 0, 0],
#        [1, 0, 0, 0]], dtype=int8)
```

## まとめ
量子コンピュータ(組合せ最適化問題)をPythonで実行しました。

## 参考サイト
[夢の国の最適経路を(量子)アニーリングで求めてみた](https://qiita.com/y_mukasa/items/a045d7370b79ee72d834)

[D-Wave社の量子コンピュータをクラウド利用する方法【無料】](https://ebi-works.com/dwave-free/)

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


