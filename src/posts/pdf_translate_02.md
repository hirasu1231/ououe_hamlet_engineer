---
display: home
title: 'Pythonで英文をTransformer(BERT)で翻訳してみる'
description: Pythonで英文をTransformer(BERT)での翻訳を実施します．
date: 2021-09-25
image: https://www.hamlet-engineer.com/image/pdf_tansrate01.png
categories: 
  - Python
tags:
  - Python
  - jupyter
  - machine_translate
---
<!-- https://www.hamlet-engineer.com -->
Pythonで英文をTransformer(BERT)での翻訳を実施します．<br>

<!-- more -->

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

[[toc]]

<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">


## モジュールのインストール
下記のコマンドでモジュールをインストールします．

```python
!pip install -U easynmt
```

## 翻訳実行
日本語の翻訳ができるモデルが`mbart50_m2m`しか実行できなかったので，下記のコードで実行します．

### モデルの読み込み
下記のコードでモデルの読み込みを実施します．

```python
from easynmt import EasyNMT
model = EasyNMT('mbart50_m2m')
```

### 翻訳可能な言語の確認
下記のコマンドで翻訳可能な言語の確認します．

```python
# 英文から翻訳可能な言語の確認
print("All languages with source_lang=en. I.e., we can translate English (en) to these languages.")
print(model.get_languages(source_lang='en'))
```

### 翻訳実行
下記のコマンドで翻訳を実行します．

```python
# いくつかの言語を日本語に訳します
sentences = ['Dies ist ein Satz in Deutsch.',   # ドイツ語
             '这是一个中文句子',    #中国語
             'これは日本語の文です．',     #日本語
             'This is a english sentence',    #英語
             'Esta es una oración en español.']     #スペイン語
print(model.translate(sentences, target_lang='ja'))

# 出力
# ['これがドイツ語の句です。', 'それは中国語の句です', 'これは日本語の文です．', 'これは英語の文です', 'これが、スペイン語の言葉です。']
```

## まとめ
Pythonで英文をTransformer(BERT)での翻訳を実施しました．

次はPDFの翻訳と組み合わしたいと考えています．


## 参考サイト
[UKPLab/EasyNMT](https://github.com/UKPLab/EasyNMT)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>
