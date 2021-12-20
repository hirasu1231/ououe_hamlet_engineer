---
display: home
title: '論文レビュー(駄文)「除雪区間の最適化」'
description: 最適除雪道路選択モデルに関する研究をレビューします．
date: 2021-12-21
image: https://www.hamlet-engineer.com/image/josetsu.jpeg
categories: 
  - 論文レビュー
tags:
  - 論文レビュー
  - 交通計画
---

2021/12/21 論文レビュー(駄文)を記述します．
- 最適除雪道路選択モデルに関する研究

<!-- https://www.hamlet-engineer.com -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


## 最適除雪道路選択モデルに関する研究
有村幹治,上西和弘,杉本博之,田村 亨:最適除雪道路選択モデルに関する研究, 土木計画学研究・論文集No.16, 1999年9月 

### 背景
- 雪の除排作業には巨額の予算を費やしているという問題があり，年々増加する傾向にある．
- 1996年，札幌市では記録的な降雪により、160億円の除雪費用を計上された．
- ただし，冬季間の路面悪化では，夏期の平均と比べて交通量は77%、 旅行速度は50%にまで落ち込むこともある．
- 限られた予算で最適な除雪作業体制を構築する必要がある．
- 本研究は、大規模道路網(札幌都市圏道路網)を対象とし，走行費用便益によって評価される最適な除雪実施路線網を求める
- また，配分計算を含む大規模ネットワーク最適化における問題点と課題を整理する

###  既存研究と本研究の位置付け
- ネットワークの考慮(除 雪道路の選択)と予算制約の考慮の2点に着目する
- 除雪に関する研究当初は、対象ネットワークは全て除雪することを想定していて，予算制約を考慮していなかった

### 手法
- 道路ネットワークは，41ノード・133リンク・96工事区間を想定
- 等分割配分法による交通量配分
- 準組み合わせ最適化手法の1つ「遺伝的アルゴリズム(GA」を使用
- 道路リンク特性(冬季Q-V式)とリンク別除雪コストを取りこんだGA最適化モデル
- 予算制約として，連続性的に除雪できること・走行時間の変動による費用便益を考慮する
- また，組み合わせ解空間の縮小を考慮して，推定除雪区間を集約させる工夫をする

### 結論
- ネットワーク特性と予算制約を考慮した最適な除雪位置を求めるためのGA最適化モデルを示した
- 実道路網の札幌市都市圏道路網を対象にGA最適化モデルを適用し，予算制約内で走行費用便益が高い除雪道路を導き出した

### 課題点
- 少ない人口サイズにより計算を行っている
- 膨大な計算時間が必要となる
- 対象ネットワークの1回の配分計算に約30分，本研究での計算例でも294.5時間の計算時間を要している

## 論文集
有村幹治,上西和弘,杉本博之,田村 亨:最適除雪道路選択モデルに関する研究, 土木計画学研究・論文集No.16, 1999年9月



<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

