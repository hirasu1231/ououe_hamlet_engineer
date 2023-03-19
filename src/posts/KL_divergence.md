---
display: home
title: 'カルバック・ライブラー情報量についての解説もどき(2021/1/14時点)'
description: カルバック・ライブラー情報量についての解説もどき(2021/1/14時点での勉強結果)を記述します．
date: 2023-3-25
image: https://www.hamlet-engineer.com/image/KL.png
categories: 
  - 勉強
tags:
  - 勉強
---

<!-- https://www.hamlet-engineer.com -->
カルバック・ライブラー情報量についての解説もどき(2021/1/14時点での勉強結果)を記述します．

<!-- more -->


[[toc]]

## おすすめの参考書
いままでの統計本で一番わかりやすかった．

<!-- START MoshimoAffiliateEasyLink -->
<script type="text/javascript">
(function(b,c,f,g,a,d,e){b.MoshimoAffiliateObject=a;
b[a]=b[a]||function(){arguments.currentScript=c.currentScript
||c.scripts[c.scripts.length-2];(b[a].q=b[a].q||[]).push(arguments)};
c.getElementById(a)||(d=c.createElement(f),d.src=g,
d.id=a,e=c.getElementsByTagName("body")[0],e.appendChild(d))})
(window,document,"script","//dn.msmstatic.com/site/cardlink/bundle.js?20210203","msmaflink");
msmaflink({"n":"データ分析に必須の知識・考え方　統計学入門　仮説検定から統計モデリングまで重要トピックを完全網羅","b":"","t":"","d":"https:\/\/m.media-amazon.com","c_p":"","p":["\/images\/I\/51DhtjHTnIL._SL500_.jpg"],"u":{"u":"https:\/\/www.amazon.co.jp\/dp\/B09M81WRHT","t":"amazon","r_v":""},"v":"2.1","b_l":[{"id":1,"u_tx":"Amazonで見る","u_bc":"#f79256","u_url":"https:\/\/www.amazon.co.jp\/dp\/B09M81WRHT","a_id":2622833,"p_id":170,"pl_id":27060,"pc_id":185,"s_n":"amazon","u_so":1},{"id":2,"u_tx":"楽天市場で見る","u_bc":"#f76956","u_url":"https:\/\/search.rakuten.co.jp\/search\/mall\/%E3%83%87%E3%83%BC%E3%82%BF%E5%88%86%E6%9E%90%E3%81%AB%E5%BF%85%E9%A0%88%E3%81%AE%E7%9F%A5%E8%AD%98%E3%83%BB%E8%80%83%E3%81%88%E6%96%B9%E3%80%80%E7%B5%B1%E8%A8%88%E5%AD%A6%E5%85%A5%E9%96%80%E3%80%80%E4%BB%AE%E8%AA%AC%E6%A4%9C%E5%AE%9A%E3%81%8B%E3%82%89%E7%B5%B1%E8%A8%88%E3%83%A2%E3%83%87%E3%83%AA%E3%83%B3%E3%82%B0%E3%81%BE%E3%81%A7%E9%87%8D%E8%A6%81%E3%83%88%E3%83%94%E3%83%83%E3%82%AF%E3%82%92%E5%AE%8C%E5%85%A8%E7%B6%B2%E7%BE%85\/","a_id":2603993,"p_id":54,"pl_id":27059,"pc_id":54,"s_n":"rakuten","u_so":2}],"eid":"o8uVu","s":"s"});
</script>
<div id="msmaflink-o8uVu">リンク</div>
<!-- MoshimoAffiliateEasyLink END -->


## カルバック・ライブラー情報量
>確率論と情報理論における2つの確率分布の差異を計る尺度である。情報ダイバージェンス（英: information divergence）、情報利得（英: information gain）、相対エントロピー（英: relative entropy）とも呼ばれる。 2つの確率分布の差異を表す事から、カルバック・ライブラー距離 と呼ばれる事もあるが、距離の公理を満たさないので、数学的な意味での距離ではない。<br>応用上は、「真の」確率分布 P とそれ以外の任意の確率分布 Q に対するカルバック・ライブラー情報量が計算される事が多い。 例えばP はデータ、観測値、正確に計算で求められた確率分布などを表し、Q は理論値、モデル値、P の予測値などを表す。<br>引用先：[カルバック・ライブラー情報量 Wiki](https://ja.wikipedia.org/wiki/%E3%82%AB%E3%83%AB%E3%83%90%E3%83%83%E3%82%AF%E3%83%BB%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%BC%E6%83%85%E5%A0%B1%E9%87%8F)

**数式**

$$ {\displaystyle D_{\mathrm {KL} }(P\|Q)=\sum _{i}P(i)\log {\frac {P(i)}{Q(i)}}} $$

上記の解説を調べる中で，下記の疑問点が沸きました．
1. 確率変数の期待値と確率分布の平均は一緒
2. なんでlogを付けるのか・p * logPの意味は？
3. 確率分布の差異がなぜ見れるのか？
4. 物質の差を見るときと共通点はないのか？
5. なぜ，下記の数式ではダメなのか？
$$ \sum _{i}Q(i)(-\log Q(x)) - \sum _{i}P(i)(-\log P(x)) $$

6. なぜ，下記の数式ではダメなのか？
$$ {\sum _{i}Q(i)\log {\frac {P(i)}{Q(i)}}} $$

## 確率変数の期待値と確率分布の平均は一緒
下記のサイトを参照ください．
[「確率変数の期待値 = 確率分布の平均」について]()

## なんでlogを付けるのか・p * logPの意味は？
期待値(加重平均)を求める際に，身長グループで言う身長のように数字尺度・価値を示す指標が確率変数であれば問題ありません．

しかし，「SSSランクのキャラが-%の確率で出る」という情報そのものの場合は，確率変数がストレートに数値で示せないので，工夫がいります．

そこで，下記の式を「情報量」と定義して，情報の価値を数値化します．-logで括れば確率P(i)が低いほど価値が増すことが表現できます．

$$ -\log {P(i)} $$

$$ SSSランクのガチャの情報量　= -\log {\frac {1}{1000000}} = 6$$

$$ Bランクのガチャの情報量　= -\log {\frac {1}{10}} = 1$$

情報の価値を数値化した「情報量」を定義したので，後は確率で重み付けして期待値(加重平均)が算出します．(p * logPの意味)

$$ \sum _{i}P(i)(\log P(x)) $$

## 確率分布の差異がなぜ見れるのか？
2つの確率分布(ここでは,P(x),Q(x))でも，カルバック・ライブラー情報量で差異がみれるのか，数式から見る．

$$ 
\begin{aligned} 
D_{\mathrm {KL} }(P\|Q) &= \sum _{i}P(i)\log {\frac {P(i)}{Q(i)}}\\
                        &= \sum _{i}P(i)(-\log Q(x)) - \sum _{i}P(i)(-\log P(x))
\end{aligned} 
$$

確率P(x)で重みつけしたP(x)情報量の平均とQ(x)情報量の平均の差を見ていることがわかります．

t検定でも分散が一致する前提のもとに平均の差を見ています．

それと，同様のことをしていると解釈しています．

## 物質の差を見るときと共通点はないのか？
学校のクラスごとのテスト成績を比べる時は，クラスごとの平均点で比べるとわかりやすい．

ただし，クラスの人数が極端に違うと，比較対象になりえないので注意が必要である．

極端な話だが，40人のクラスと10人のクラスでは10人のクラスの方が平均が高くなりがちです．


## なぜ，下記の数式ではダメなのか？_1
$$ \sum _{i}Q(i)(-\log Q(x)) - \sum _{i}P(i)(-\log P(x)) $$

上式の方で「違う分布なのに0となる」という支障パターンを考えました．

下図に示すように，分布の形が違うのに平均は一致してしまいます．

![](/image/gauss_diff.png)

t検定でも分散が違う場合は，上図のように分布は違うのに「一致している」という結果が返ってきます．

なので，t検定では事前にF検定で分散(分布の形)が一緒という確認をしています．

この事態を防ぐために，重みはP(x)で統一していると考えています．


## なぜ，下記の数式ではダメなのか？_2
$$ {\sum _{i}Q(i)\log {\frac {P(i)}{Q(i)}}} = \sum _{i}Q(i)(\log P(x)) - \sum _{i}Q(i)(\log Q(x)) $$

上式の方で支障パターンを考えました．

支障パターンとしては，「差が最小化になる分布を求めづらい」ことがあります．

真の確率(観測データ)：P(x)と観測できた確率(推定データ)：Q(x|θ)のカルバック・ライブラー情報量の場合は，差が埋まるようにθを調節します．上記のカルバック・ライブラー情報量を下式に示します．
文字は，xはデータ，θはパラメータとします．

$$ 
\begin{aligned} 
D_{\mathrm {KL} }(P(x)\|Q(x|\theta)) &= \sum _{i}P(x_i)\log {\frac {P(x_i)}{Q(x_i|\theta)}}
\end{aligned} 
$$

上式を最小化する場合は，真の確率(観測データ)：P(x)は固定値ですので，下のようになれは最小化します

$$ 
\begin{aligned} 
 \max _{\theta }\sum _{i=1}^{n}\log Q(x_i|\theta )
\end{aligned} 
$$

しかし，

$$ 
\begin{aligned} 
D_{\mathrm {KL} }(P(x)\|Q(x|\theta)) &= \sum _{i}Q(x_i|\theta)\log {\frac {P(x_i)}{Q(x_i|\theta)}}\\
                                     &= \sum _{i}Q(x_i|\theta)(-\log Q(x_i|\theta)) - \sum _{i}Q(x_i|\theta)(-\log P(x_i))
\end{aligned}
$$

だと，最小化する数式が複雑になります．どうするかは面倒なのでやりません．

よって，最小化が容易な下式となります．

$$ 
\begin{aligned} 
D_{\mathrm {KL} }(P(x)\|Q(x|\theta)) &= \sum _{i}P(x_i)\log {\frac {P(x_i)}{Q(x_i|\theta)}}
\end{aligned} 
$$

## おまけ：尤度
カルバック・ライブラー情報量の一部である，下式の真の確率(観測データ)：P(x)で重みつけしたQ(x|θ)の情報量を尤度と言います．

$$ 
\begin{aligned} 
D_{\mathrm {KL} }(P\|Q) &= \sum _{i}P(x_i)\log {\frac {P(i)}{Q(x_i|\theta)}}\\
                        &= \sum _{i}P(x_i)(-\log Q(x_i|\theta)) - \sum _{i}P(x_i)(-\log P(x_i))\\

尤度&：\sum _{i}P(i)(-\log Q(x_i|\theta))

\end{aligned} 
$$

## まとめ
ここまでで，カルバック・ライブラー情報量についての解説もどき(2021/1/14時点での勉強結果)を記述しました．

逐次更新します．

## 参考サイト
[カルバック・ライブラー情報量 Wiki](https://ja.wikipedia.org/wiki/%E3%82%AB%E3%83%AB%E3%83%90%E3%83%83%E3%82%AF%E3%83%BB%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%BC%E6%83%85%E5%A0%B1%E9%87%8F)

[期待値 Wiki](https://ja.wikipedia.org/wiki/%E6%9C%9F%E5%BE%85%E5%80%A4)

[KL情報量とモデル推定](http://www.aoni.waseda.jp/y.fujimoto/index_files/r_mle.html)
