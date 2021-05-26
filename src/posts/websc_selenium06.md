---
display: home
title: 'Python＋Selenium＋Chromeのウェブスクレイピングで，ボタンクリックを実装する'
description: Python＋Selenium＋Chromeのウェブスクレイピングで，ボタンクリックの操作を容易にするために，コードを実装します
date: 2021-04-19
image: https://www.hamlet-engineer.com/image/selenium.jpg
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - ウェブスクレイピング
---
Python＋Selenium＋Chromeのウェブスクレイピングで，ボタンクリックの操作を容易にするために，コードを実装します．<br>

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>


[[toc]]

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

## ボタンクリック
class名で取得しても，複数のボタンで同じクラス名が使用されているサイトもあるので，ボタンの文字列を指定してクリックするようなコードを実装しました．

```python
def button_click(button_text):
  buttons = driver.find_elements_by_tag_name("button")

  for button in buttons:
      if button.text == button_text:
          button.click()
          break
```


## まとめ
Python＋Selenium＋Chromeのウェブスクレイピングで，ボタンクリックの操作を容易にするために，コードを実装しました．

<br>

## 参考サイト
[Seleniumでボタンをクリックするときは、ボタンの文字列を取得するのがいい](https://nonenull.hatenablog.com/entry/2018/07/25/015453)<br>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>