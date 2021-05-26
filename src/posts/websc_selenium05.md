---
display: home
title: 'Python＋Selenium＋Chromeのウェブスクレイピングで，スペースが入った要素を取得する'
description: Python＋Selenium＋Chromeのウェブスクレイピングでは，by_class_nameでスペースが入った要素を取得することができませんので，取得できる手法を紹介します．
date: 2021-04-16
image: https://www.hamlet-engineer.com/image/selenium.jpg
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - ウェブスクレイピング
---
Python＋Selenium＋Chromeのウェブスクレイピングでは，by_class_nameでスペースが入った要素を取得することができませんので，取得できる手法を紹介します．<br>


<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>


[[toc]]

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

## by_css_selectorを使用
メソッドを<span style="background-color: #ffff99;">by_class_name</span>ではなく<span style="background-color: #ffff99;">by_css_selector</span>にして，取得します．

また，by_css_selectorでは，要素の頭と間にあるスペースに「.」を入れる必要があります．

修正前
```python
elem_sample = driver.find_elements_by_class_name("a-link-sample a-text-normal")
```

修正後
```python
elem_sample = driver.find_elements_by_css_selector(".a-link-sample.a-text-normal")
```

ただし，僕の場合，上記の手法で複数要素を取得しようとすると，<span style="color: #ff0000;">100個の要素の内10個しか取得されない</span>ような，漏れが発生しました．

そこで，僕は次の手法を主に使っています．
<br>

## by_xpathを使用
<span style="background-color: #ffff99;">by_css_selector</span>で複数要素を取得しようとすると，漏れが発生しましたので，<span style="background-color: #ffff99;">by_xpath</span>を利用した手法も紹介します．

修正前
```python
elem_sample = driver.find_elements_by_class_name("a-link-sample a-text-normal")
```

修正後
```python
elem_sample = driver.find_elements_by_xpath('//div[@class="a-link-sample a-text-normal"]')
```
<br>

## まとめ
by_class_nameでスペースが入った要素を取得するために，<span style="background-color: #ffff99;">by_css_selectorとby_xpath</span>を利用した2つの手法を紹介しました．

これでPython＋Selenium＋Chromeのウェブスクレイピングもまた，使いやすくなると思います．

<br>

## 参考サイト
[seleniumでby_class_nameでスペースが入った要素が取得できずエラーになる時の対処法](https://qiita.com/hanonaibaobabu/items/e547410865d857aa25ec)<br>
[<Python, selenium> 空白のあるクラス名を選択するには、、](https://nekoyukimmm.hatenablog.com/entry/2017/05/09/090117)<br>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>