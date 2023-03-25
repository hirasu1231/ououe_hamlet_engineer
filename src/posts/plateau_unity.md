---
display: home
title: 'PLATEAU SDKをMacBookProで操作できるようにするまで'
description: PLATEAU SDKをMacBookProで操作できるようにするまでのことを記述します
date: 2023-3-25
image: https://www.hamlet-engineer.com/image/sample_53391540.png
categories: 
  - GIS
tags:
  - GIS
  - PLATEAU
---
PLATEAU SDKをMacBookProで操作できるようにするまでのことを記述します(1回目)

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## 第一の失敗(サンプルを実行)
[PLATEAU SDK for Unity Samples](https://github.com/Project-PLATEAU/PLATEAU-SDK-for-Unity-Samples)でサンプルを実装しようとしたら，Windowsのディレクトリでエラーが発生した．
Windows用に作られているのか，Mac版なのにWindows用のディレクトリを参照しているようです．
```
A meta data file (.meta) exists but its asset 'Packages/com.synesthesias.plateau-unity-sdk/Plugins/Windows/x86_64/plateau.pdb' can't be found. When moving or deleting files outside of Unity, please ensure that the corresponding .meta file is moved or deleted along with it.
```

見直そうと思います．

## 公式ドキュメント

### プロジェクトの作成
- Unityバージョン 2021.3 
- テンプレートは3D

### PLATEAU SDK for Unityのインストール
- gitのURL指定で導入します
- Window → Package Manager の＋ボタンから Add pacakge from git URL...を選択
  - [ PLATEAU SDK for Unity のリリースページ](https://github.com/Synesthesias/PLATEAU-SDK-for-Unity/releases)
  - https://github.com/Synesthesias/PLATEAU-SDK-for-Unity.git#v1.1.0
  - 公式コメント：デフォルトブランチは内容が予告なく変更されるので推奨しません。タグ名を記載することを推奨します。
- ウィンドウのパッケージ一覧に Plateau Unity SDK が表示されたら完了

![](/image/SDKinstall.png)
 
### 都市モデルのインポート
- Unityのメニューバーから PLATEAU → PLATEAU SDK を選択

![](/image/SDK_menu.png)

- 3D都市モデルは G空間情報センターのPLATEAUポータルサイト からダウンロードできます。
  - CityGML形式のものをダウンロードしてください。
- 都市データのフォルダの中には、udx,codelistsという名前のフォルダがあるはずです。
  - udxから階層が1つ上のフォルダを選択します。

### 基準座標系の選択
- 3Dモデルなので平面直角座標系を使用する
- 地方に合わせた平面直角座標を選択する

### 範囲の選択
- マウスホイールを上下に回してズームアウト、ズームインします。
- マウスホイールを押し込んだままドラッグしてカメラ移動します。
- 青色の線は利用可能な地域を示します。

![](/image/areaSelectWindow.png)

### 描画の設定
- Mesh Collider
  - Mesh：網
  - Collider：当たり判定処理を行ってくれる処理
- LOD
  - gmlファイルの中には、都市モデルの形状の細かさを指定したいという需要に対応するため、複数の形状データが格納されている場合があります。
  - LOD0がもっとも大雑把な形状で、LOD1, LOD2 と数字が上がるほど細かい形状になります。
  - 建築物の場合、LOD0 は平面、LOD1は平面に一定の高さを付けたもの、LOD2はより細かい形状です。

- 現実の景観と異なる地物について
  - 地物の種類で「土地利用」と「災害リスク」については、情報の範囲を示す目印として白い板の3Dモデルが表示されます。
  - この白い板はリアルな景観のみを求める際には不要になるので、土地利用と災害リスクに関するデータが不要な場合はインポートしないか、インポート後オフにすることを推奨します

今回は下記の設定
- Mesh Collider:オフ
- LOD：オン
- 「土地利用」と「災害リスク」:オン(後からオフ)

ここでも，Windows関連のエラーになった
```
A meta data file (.meta) exists but its asset 'Packages/com.synesthesias.plateau-unity-sdk/Plugins/Windows/x86_64/plateau.pdb' can't be found. When moving or deleting files outside of Unity, please ensure that the corresponding .meta file is moved or deleted along with it.
```

- *.pdb ファイルは，Windows 向けプレイヤービルドバイナリらしい
  - *.pdb ファイル ― デバッグ用のシンボルファイルです。 Build Settings ウィンドウで Copy PDB files を有効にすると、これらのファイルが Unity によってビルド ディレクトリ内にコピーされます。
  - あんまり，このエラーは関係にないのかな

- Demの読み込みでメモリ消費量230GBが出てきたw
- 今日はここまでにするか

### 次：53391540
付属しているサンプルの描画ができたしなぁ

![](/image/sample_53391540.png)

53391540で一から作ってみるか



## まとめ
PLATEAU SDKをMacBookProで操作できるようにするまでのことを記述しました(1回目)

## 参考サイト
[plateauのドキュメント](https://www.mlit.go.jp/plateaudocument/)



<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


