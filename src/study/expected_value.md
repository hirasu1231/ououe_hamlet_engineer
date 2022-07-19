---
display: home
title: '「確率変数の期待値 = 確率分布の平均」についての解説もどき(2021/1/14時点)'
description: 統計の勉強でよく「確率分布の平均=確率変数の期待値」という言葉がよく出てきたので，それについて調べてみました．
date: 2022-07-25
image: https://www.hamlet-engineer.com/image/hist_mean.png
categories: 
  - Study
tags:
  - Study
  - expected_value
  - Mean
  - probability
  - Stat
---

<!-- https://www.hamlet-engineer.com -->

統計の勉強でよく「確率分布の平均=確率変数の期待値」という言葉がよく出てきたので，それについて調べてみました．

2021/1/14時点での勉強結果です．
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


### 確率変数の期待値
確率変数とは，サイコロの出目の確率分布で言うと，サイコロでいう出目の数字を示します．

では，下記にサイコロの期待値を示します．

$$ 6 * {\frac {1}{6}} + 5 * {\frac {1}{6}} + 4 * {\frac {1}{6}} + 3 * {\frac {1}{6}} + 2 * {\frac {1}{6}} + 1 * {\frac {1}{6}} = 3.5 $$

上記の期待値の算出は，サイコロの確率に対する「加重平均」とも置き換えられます．


### 確率分布の平均
#### 度数分布
確率分布を見る前に，度数分布に着目します．

下記にあるグループの身長の度数分布とその平均を示します．

![](/image/hist_mean.png)

上画像の度数分布の平均は単純平均で求まりますが，ここでは度数(y軸)を重みとした事象(--cmの人がいる){1,0}の「加重平均」として見ていきます．下に式を示します．

$$
\begin{aligned} 
mean &= {\frac {1}{N_{sum}}}(140 * N_{140-145}+145 * N_{145-150}\\
                         &\qquad\qquad + 150 * N_{150-155} + 155 * N_{155-160}\\
                         &\qquad\qquad + 160 * N_{160-165} + 165 * N_{165-170}\\ 
                         &\qquad\qquad + 170 * N_{170-175} + 175 * N_{175-180}\\
                         &\qquad\qquad + 180 * N_{180-185})\\
      &= {\frac {1}{41}}(140 * 1 + 145 * 3 \\
                    &\qquad\quad + 150 * 5 + 155 * 7 \\
                    &\qquad\quad + 160 * 9 + 165 * 7 \\ 
                    &\qquad\quad + 170 * 5 + 175 * 3 \\ 
                    &\qquad\quad + 180 * 1) \\
      &= 160
\end{aligned}
$$

#### 確率分布

次に，確率分布に移ります．ここでの確率は，あるグループから**1つ選ぶ時**を想定しています．

前述の身長グループで言うと，グループからランダムに**1人だけ選ぶ時に**140~145cmの人が選ばれる確率は，下記のように示すことができます．

すると，ここでの確率分布は度数分布のy軸を全体数で割れば作成できます．


そして，上画像での平均は確率(y軸)を重みとした事象{1,0}の「加重平均」です．これは，度数分布の平均の式から導出できます．

$$
\begin{aligned}
mean &= {\frac {1}{N_{sum}}}(140 * N_{140-145}+145 * N_{145-150}\\
                         &\qquad\qquad + 150 * N_{150-155} + 155 * N_{155-160}\\
                         &\qquad\qquad + 160 * N_{160-165} + 165 * N_{165-170}\\ 
                         &\qquad\qquad + 170 * N_{170-175} + 175 * N_{175-180}\\
                         &\qquad\qquad + 180 * N_{180-185})\\
     &= (140 * {\frac {N_{140-145}}{N_{sum}}}+145 * {\frac {N_{145-150}}{N_{sum}}} \\\\
          &\quad + 150 * {\frac {N_{150-155}}{N_{sum}}}+155 * {\frac {N_{155-160}}{N_{sum}}} \\
          &\quad + 160 * {\frac {N_{160-165}}{N_{sum}}}+165 * {\frac {N_{165-170}}{N_{sum}}} \\
          &\quad + 170 * {\frac {N_{170-175}}{N_{sum}}}+175 * {\frac {N_{175-180}}{N_{sum}}} \\
          &\quad + 180 * {\frac {N_{180-185}}{N_{sum}}}) \\
     &= 140 * {\frac {1}{41}} + 145 * {\frac {3}{41}} \\
        &\quad + 150 * {\frac {5}{41}} + 155 * {\frac {7}{41}} \\
        &\quad + 160 * {\frac {9}{41}} + 165 * {\frac {7}{41}} \\ 
        &\quad + 170 * {\frac {5}{41}} + 175 * {\frac {3}{41}} \\ 
        &\quad + 180 * {\frac {1}{41}} \\
      &= 160
\end{aligned}
$$


上式より，ここでの確率分布の平均は確率(y軸)に対する「加重平均」ですので，確率変数の期待値と一致します．

![](/image/gauss_mean.png)

よって，「確率変数の期待値 = 確率分布の平均」となります．


### 数式での理解
左辺は期待値，右辺は確率分布の加重平均となる．
$$ 
{\sum _{i}x_i * {P(x_i)}} = x_i * {\sum _{i}{\frac {N_i}{N_p}}} = {\frac {1}{N_p}}{\sum _{i}{x_i * N_i}}
$$

## まとめ
ここまでで，「確率変数の期待値 = 確率分布の平均」についての解説もどき(2021/1/14時点での勉強結果)を記述しました．

## 参考サイト
[期待値 Wiki](https://ja.wikipedia.org/wiki/%E6%9C%9F%E5%BE%85%E5%80%A4)
