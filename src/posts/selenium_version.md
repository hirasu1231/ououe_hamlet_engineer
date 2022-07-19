---
display: home
title: 'Seleniumのversion変更について'
description: Seleniumのversion変更により，過去のコードが使えなくなったので，それについて記述します．
date: 2022-7-19
image: https://www.hamlet-engineer.com/image/selenium.jpg
categories: 
  - Python
tags:
  - Python
  - Selenium
---

Seleniumのversion変更により，過去のコードが使えなくなったので，それについて記述します．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## Seleniumのversion
2022年7月4日において,Seleniumのversionが4.3.0となっています．

それにより，過去の記事で使った下記のようなコードが使えなくなっています．

本記事では，その対策を記述します．

```python
from selenium import webdriver

# Macの場合 (Chromedriveがこのプログラムを実行している同じ場所にある前提)
driver = webdriver.Chrome(executable_path="./chromedriver")

### 1.Webサイトにアクセスする
driver.get("https://aiacademy.jp/")

# 要素を取得する
driver.find_element_by_class_name("classname") # classでの指定
driver.find_element_by_xpath("xpath") # xpathでの指定
```

## 今まで通りに使いたい
過去のコードを今まで通りに使いたい場合は，下記のコードを走らせて古いversionに上書きします．

```python
!pip install -U selenium==4.1.5
```


```python
from selenium import webdriver

# Macの場合 (Chromedriveがこのプログラムを実行している同じ場所にある前提)
driver = webdriver.Chrome(executable_path="./chromedriver")

### 1.Webサイトにアクセスする
driver.get("https://aiacademy.jp/")

# 要素を取得する
driver.find_element_by_class_name("classname") # classでの指定
driver.find_element_by_xpath("xpath") # xpathでの指定
```

## 新versionに対応
新version(4.3.0)では，下記のように書きます．

```python
from selenium import webdriver

# Macの場合 (Chromedriveがこのプログラムを実行している同じ場所にある前提)
driver = webdriver.Chrome(executable_path="./chromedriver")

### 1.Webサイトにアクセスする
driver.get("https://aiacademy.jp/")

# 要素を取得する(旧)
# driver.find_element_by_class_name("classname") # classでの指定
# driver.find_element_by_xpath("xpath") # xpathでの指定

# 要素を取得する(新)
driver.find_element(By.CLASS, "classname") # classでの指定
driver.find_element(By.XPATH, "xpath") # xpathでの指定

```

## まとめ
Seleniumのversion変更により，過去のコードが使えなくなったので，それについて記述しました．

## 参考サイト


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">
