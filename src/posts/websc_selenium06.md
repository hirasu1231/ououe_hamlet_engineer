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