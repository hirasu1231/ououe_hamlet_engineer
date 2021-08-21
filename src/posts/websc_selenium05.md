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

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

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

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>