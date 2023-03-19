---
display: home
title: '異常検知入門'
description: 異常検知入門を実装しました
date: 2023-4-5
image: https://www.hamlet-engineer.com/image/abnormal_acc.png
categories: 
  - Python
tags:
  - Python
  - sklearn
---


<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ライブラリのインポート

```python
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.cm as cm
from sklearn import datasets
from sklearn.metrics import classification_report, roc_auc_score, roc_curve, confusion_matrix
from sklearn.svm import OneClassSVM
```

## データセットの用意
sklearnで用意されているデータセットを使用します．

```python
X, Y = datasets.make_blobs(n_samples=200, centers=2, n_features=2,random_state=0)
print(X.shape)
print(Y.shape)
# (200, 2)
# (200,)
```

下記のコードで正常値・異常値のラベルを付与します．


```python
normal = 1
abnormal = 0

x_normal = X[np.where(Y==normal,True,False)]
y_normal = Y[np.where(Y==normal,True,False)]
x_abnormal = X[np.where(Y==abnormal,True,False)]
y_abnormal = Y[np.where(Y==abnormal,True,False)]

plt.scatter(x_normal[:, 0], x_normal[:, 1]) # 青：正常
plt.scatter(x_abnormal[:, 0], x_abnormal[:, 1]) # 橙：異常
```

![](/image/abnormal_scatter.png)

## 異常検知用のモデルの作成と学習
異常検知用のモデルに学習させます.

sklearnのOneClassSVMを使い，1クラスで過学習させて異常検知させます．

ズボンを過学習させて，T-シャツを異常と判定させるイメージです．

```python
svm = OneClassSVM(kernel='rbf', nu=0.2, gamma=1e-04)
svm.fit(x_normal)
```
## 評価
先程のデータ群に対して、どのように正常か異常値かをモデルが判断したかをplotしてみます。

```python
x1_min, x1_max = X[:, 0].min() - 2, X[:, 0].max() + 2
x2_min, x2_max = X[:, 1].min() - 2, X[:, 1].max() + 2

x1_ = np.linspace(x1_min, x1_max, 500)
x2_ = np.linspace(x2_min, x2_max, 500)

xx1, xx2 = np.meshgrid(x1_, x2_)

z = svm.decision_function(np.c_[xx1.ravel(), xx2.ravel()])
z = z.reshape(xx1.shape)

plt.contourf(xx1, xx2, z, cmap=plt.cm.PuBu)
a = plt.contour(xx1, xx2, z, levels=[0], linewidths=2, colors='darkred')
b = plt.scatter(X[Y == normal, 0], X[Y == normal, 1], c='white', edgecolors='k')
c = plt.scatter(X[Y == abnormal, 0], X[Y == abnormal, 1], c='gold', edgecolors='k')
plt.legend([a.collections[0], b, c], ['learned frontier', 'normal', 'abnormal'], bbox_to_anchor=(1.05, 1))
plt.xlabel('x1')
plt.ylabel('x2')
plt.axis('tight')
plt.show()
```

![](/image/abnormal_acc.png)

ROCとAUCも確認する．

ROCは，陽性陰性判定の閾値を変更したときに，偽陽性率 (FPR : False Positive Rate) と真陽性率 (TPR : True Positive Rate)の値をプロットしたものです．

真陽性率 (TPR : True Positive Rate) とは全ての Positive のうち、実際に Postitive だったものを正しく Positive と判定できた割合です。

偽陽性率 (FPR : False Positive Rate)  は全ての Negative のうち、実際には Negative だったが間違えて Positive と判定した割合です。

![](/image/roc1.png)

![](/image/roc2.png)

![](/image/roc3.png)

```python
y_score = svm.decision_function(X)
auc = roc_auc_score(Y,y_score)
print('auc:',auc)

fpr, tpr, thresholds = roc_curve(Y, y_score)

plt.plot(fpr, tpr, label='baseline(AUC = %.3f)'%auc)
plt.plot([0,1],[0,1],'k--')
plt.legend()
plt.title('ROC curve')
plt.xlabel('False Positive Rate') # 偽陽性率 (FPR : False Positive Rate) 
plt.ylabel('True Positive Rate') # 真陽性率 (TPR : True Positive Rate)
plt.grid(True)
```

![](/image/roc4.png)

## まとめ
異常検知入門を実施しました．

## 参考サイト
[【異常検知入門】超簡単な異常検知プログラムを作ってみる](https://www.tcom242242.net/entry/ai-2/ai-ge/%E7%95%B0%E5%B8%B8%E6%A4%9C%E7%9F%A5/simple_abnomaly_detection/)

[【評価指標】ROC 曲線と AUC についてわかりやすく解説してみた](https://blog.kikagaku.co.jp/roc-auc)

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">