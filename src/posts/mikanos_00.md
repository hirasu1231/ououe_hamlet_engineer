---
display: home
title: 'Mac + Dockerで「ゼロからのOS自作入門」の環境構築を実装する'
description: Mac + Dockerで「ゼロからのOS自作入門」の環境構築を実装します．
date: 2021-08-03
image: https://www.hamlet-engineer.com/image/mikanos_top.png
categories: 
  - OS
tags:
  - OS
  - Docker
  - C++
---

<!-- https://www.hamlet-engineer.com -->
Mac + Dockerで「ゼロからのOS自作入門」の環境構築を実装します．

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

## Mac + Dockerでの環境構築
[Docker ではじめる "ゼロからのOS自作入門"](https://zenn.dev/sarisia/articles/6b57ea835344b6)に従い，VS Code Remote Container(devcontainer)を使用します．

VS Code Remote ContainerはVS code上でDockerのコンテナを使用する機能です．

仕組みとしては，環境と実行はDockerで，動作確認はローカルのXQuartzに表示させて実行します．

## XQuartz
ここでは，DockerとVS Codeのインストールは省略します．

以下のコマンドでXQuartzのインストールを実行します．

XQuartzは「/アプリケーション/ユーティリティ」ディレクトリにあるXQuartzをダブルクリックして起動します．

```bash
# XQuartzのインストール
brew install xquartz
```

XQuartzが起動すると下記のようなターミナルが表示されます．表示されない場合は，上部メニューの「アプリケーション -> ターミナル」で表示できます．

![](/image/xquartz.png)

XQuartzのターミナル上で，下記のコードを実行したら準備OKです．
```bash
xhost + 127.0.0.1
```

## VS Code devcontaine
ローカルのターミナルで以下コマンドを実行し，VS Codeが立ち上げます．

```bash
# 環境構築用のgit
git clone https://github.com/karaage0703/mikanos-devcontainer
# ディレクトリ移動
cd mikanos-devcontainer
# VSCodeで実行
code .
```


そして，VS Codeの左下の緑マークを押し，コマンドパレットで`Open Folder in Container...`を選択します.

![](/image/VS_Code1.png)

しばらく待つと，以下のようなダイアログが表示されるのでmikanos-devcontainerが選ばれていることを確認してOpenをクリックしますと，環境構築が一気に済みます．

![](/image/VS_Code2.png)


## 環境構築の確認(Hello World)
ここからは，VS Code上でのターミナルで実行します．

![](/image/VS_Code3.png)

### edk2の環境設定
「ゼロからのOS自作入門」の筆者のgitから，コードをもろもろクローンします．

```bash
# mikanosのgitをclone
cd /workspaces/mikanos-devcontainer/
git clone https://github.com/uchan-nos/mikanos.git
OS_DIR=/workspaces/mikanos-devcontainer/mikanos
```

そして，以下のコードでedk2の環境設定を実施します．
```bash
# edk2のディレクトリに移動
cd ~/edk2
# mikanosのパッケージを追加
ln -s $HOME/workspace/mikanos/MikanLoaderPkg ./
# 環境変数設定用のスクリプト
source edksetup.sh
# 設定内容情報を作業ディレクトリにコピー
cp Conf/target.txt /workspaces/mikanos-devcontainer/target.txt 
```

### Hello World
環境構築確認のために，Hello Worldのコードを本の解説を見ながら自作するのは重たい作業なので，あらかじめクローンされている[uchan-nos/mikanos-build](https://github.com/uchan-nos/mikanos-build)を使用します．ディレクトリの場所は~/osbookです．

ここからのコードの実行は，意味を調べずに機械的に実行します．(あくまでの環境構築の確認が目的なので)

最初は，イメージを作ってFATでフォーマットします．

```bash
cd ~/osbook/day01/bin
qemu-img create -f raw disk.img 200M
mkfs.fat -n 'MIKAN OS' -s 2 -f 2 -R 32 -F 32 disk.img
```

イメージをマウントして，バイナリファイル（hello.efi）を書き込んで，アンマウントします．
```bash
mkdir -p mnt
sudo mount -o loop disk.img mnt
sudo mkdir -p mnt/EFI/BOOT
sudo cp hello.efi mnt/EFI/BOOT/BOOTX64.EFI
sudo umount mnt
```

バイナリファイルを書き込んだイメージをQEMUで読み込み起動します．(XQuartzに表示される)
```bash
qemu-system-x86_64 -drive if=pflash,format=raw,file=$HOME/osbook/devenv/OVMF_CODE.fd -drive if=pflash,format=raw,file=$HOME/osbook/devenv/OVMF_VARS.fd -hda disk.img
```

![](/image/xquartz_hello.png)

## まとめ
Mac + Dockerで「ゼロからのOS自作入門」の環境構築を実装しました．

「ゼロからのOS自作入門」を進めていく上で，弊害が出た場合は逐次修正します．

## 参考サイト
[Docker ではじめる "ゼロからのOS自作入門"](https://zenn.dev/sarisia/articles/6b57ea835344b6)

[「ゼロからのOS自作入門」の副読本的記事](https://zenn.dev/karaage0703/articles/1bdb8930182c6c)

[uchan-nos/mikanos](https://github.com/uchan-nos/mikanos)

[uchan-nos/mikanos-build](https://github.com/uchan-nos/mikanos-build)

[sarisia/mikanos-devcontainer](https://github.com/sarisia/mikanos-devcontainer)

[sarisia/mikanos-docker](https://github.com/sarisia/mikanos-docker)

[bun913/go_devcontainer](https://github.com/bun913/go_devcontainer)

[「ゼロからのOS自作入門」のサポートサイト](https://zero.osdev.jp/)

[4 macOSでのX Window利用](https://itcweb.cc.affrc.go.jp/affrit/documents/guide/x-window/x-win-mac)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>


## おまけ(用語の確認)
EDKⅡ
> EDKⅡはUEFI BIOS自体の開発にも，UEFI BIOS上で動くアプリケーションの開発にも使うことができる開発キット<br>
引用元:[「ゼロからのOS自作入門」p48]

UEFI(Unified Extensible Firmware Interface) or UEFI BIOS
> UEFIとは、一言で言うと「最近のPCやサーバーに入っている、新しくて高機能なファームウェア(及びそのインターフェースの仕様)」です。<br>
体感では、2世代目Core iシリーズのCPU以降が入っているマシンには、このUEFIが従来のBIOS(以降、BIOSと表記)の代わりに、または選択可能な状態で入っているように感じています。<br>
引用元:[gnu-efiでUEFI遊びをはじめよう](https://qiita.com/tnishinaga/items/40755f414557faf45dcb)

BIOS(Basic Input / Output System)
>BIOSは「Basic Input/Output System」の略で、CPUやメモリ、キーボード、マウスなどPCの大半の機能を制御しています。PCを起動したとき最初に作動するのがBIOSで、OSやソフトウェアとの橋渡しをする役割を担っています。<br>
引用元:[BIOSとUEFIの違いについて詳しく解説！次世代のレガシーBIOSとは？](https://pc-farm.co.jp/pc_column/pc/4351/)

UEFI BIOSと従来のBIOSの違いについて
> 1. 2 TB以上のドライブを処理できます。それに対して、古いレガシーBIOSは大容量のストレージドライブを処理できませんでした。
> 2. GUIDパーティションテーブルで4つ以上のプライマリパーティションが作成可能です。
> 3. BIOSより起動プロセスが高速です。UEFIの最適化により、システムの起動がより速くなる可能性があります。安全な起動をサポートしています。つまり、オペレーティングシステムの有効性の検証によって、起動プロセスを改ざんするマルウェアがないことを確認できます。
> 4. UEFIファームウェア自体のネットワーク機能をサポートして、リモートトラブルシューティングとUEFI構成に役立ちます。
> 5. グラフィカルユーザーインターフェイスはシンプルで、レガシーBIOSよりも豊富なセットアップメニューがあります。<br>
<br>
> 引用元:[UEFIとBIOS、どっちがいい？](https://www.partitionwizard.jp/partitionmagic/uefi-vs-bios.html)<br>
> より詳細に:[現代における自作OSの難しさ 〜自作OSのいまと昔 [第2回]](https://knowledge.sakura.ad.jp/22963/)
