---
display: home
title: 'JupyterLabに17言語を対応させる'
description: 17言語が扱えるJupyterLabをDockerにインストールしました．
date: 2021-02-21
image: https://www.hamlet-engineer.com/image/jupyter_langs.png
categories: 
  - Jupyter
tags:
  - Jupyter
  - Docker
  - Go
  - Julia
  - Rust
---
17言語が扱えるJupyterLabをDockerにインストールします．
<!-- more -->

## サポートしている言語
以下の言語が対応してます．
 | Languages| Version| jupyter kernel
 | ---- | ---- | ---- |
 | Python | 3.8.6| IPython |
 | C#(.Net5) | 9.0 | .NET Interactive |
 | Elixir | 1.11.2 | ierl | 
 | Erlang | OTP 23.2.1 | ierl | 
 | F#(.Net5) | 5.0 | .NET Interactive | 
 | Go | 1.15.6 | Gophernotes | 
 | Java | 1.8.0_152 | SciJava Jupyter Kernel | 
 | JavaScript(Node.js) | 14.15.3 | tslab | 
 | Julia | 1.5.3 | IJulia | 
 | Kotlin | 1.4.30 | jupyter-kotlin | 
 | Powershell(.Net5) | 7.0.3 | .NET Interactive | 
 | R | 4.0.3 | IRKernel | 
 | Ruby | 3.0.0 | IRuby | 
 | Rust | 1.49.0 | EvCxR Jupyter Kernel | 
 | Scala | 2.13.3 | almond | 
 | Sparql  |  | SPARQL kernel | 
 | Typescript | 4.1.3 | tslab | 

## インストール
[HeRoMo/jupyter-langs](https://github.com/HeRoMo/jupyter-langs)を落として，docker-composeでイメージをPullします．<br>
僕はdocker-compose.ymlを以下のように書き換えました．
```
version: "3"
services:
  jupyter:
    image: ghcr.io/heromo/jupyter-langs:latest
    volumes:
      - ./notebooks:/jupyter/notebooks
    ports:
      - 8050:8050 # for Dash
      - 85:8888 # for Jupyterlab
```

サイズが10GB弱もありますのでPullまでに時間がかかります．<br>
コンテナが立ち上がったら http://localhost:85/ にアクセスすると Jupyter Lab が開きます．<br>
```
$ git clone https://github.com/HeRoMo/jupyter-langs.git
$ cd jupyter-langs
$ docker-compose up
```

## まとめ
17言語が扱えるJupyterLabをDockerにインストールしました．<br>s
追加でNimも入れてみたいです．

## 参考サイト
[17言語をぶち込んだJupyter LabのDockerイメージを作ってみた](https://qiita.com/HeRo/items/61e7f45a5dbb5fd0e4a7)<br>
[HeRoMo/jupyter-langs](https://github.com/HeRoMo/jupyter-langs)
