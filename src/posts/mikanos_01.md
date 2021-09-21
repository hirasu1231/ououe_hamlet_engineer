---
display: home
title: '「ゼロからのOS自作入門」2章 EDKⅡでHello worldを実行する(前編)'
description: ゼロからのOS自作入門」2章 EDKⅡでHello worldを実行します．
date: 2021-09-21
image: https://www.hamlet-engineer.com/image/mikanos_top.png
categories: 
  - OS
tags:
  - OS
  - Docker
  - C++
---

<!-- https://www.hamlet-engineer.com -->
ゼロからのOS自作入門」2章 EDKⅡでHello worldを実行します．

EDKⅡのダウンロードはDockerでビルドした時に実行済みです．

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

## MikanLoaderPkg
/workspaces/mikanos-devcontainer/mikanos/MikanLoaderPkgを作成し，下記の内容のファイルを作成します．

(MikanLoaderPkg.dec・MikanLoaderPkg.dsc・Loader.inf・Main.c)

```C
// MikanLoaderPkg.dec
[Defines]
  DEC_SPECIFICATION              = 0x00010005
  PACKAGE_NAME                   = MikanLoaderPkg
  PACKAGE_GUID                   = 452eae8e-71e9-11e8-a243-df3f1ffdebe1
  PACKAGE_VERSION                = 0.1
```

```C
// MikanLoaderPkg.dsc
[Defines]
  PLATFORM_NAME                  = MikanLoaderPkg
  PLATFORM_GUID                  = d3f11f4e-71e9-11e8-a7e1-33fd4f7d5a3e
  PLATFORM_VERSION               = 0.1
  DSC_SPECIFICATION              = 0x00010005
  OUTPUT_DIRECTORY               = Build/MikanLoader$(ARCH)
  SUPPORTED_ARCHITECTURES        = X64
  BUILD_TARGETS                  = DEBUG|RELEASE|NOOPT

[LibraryClasses]
  UefiApplicationEntryPoint|MdePkg/Library/UefiApplicationEntryPoint/UefiApplicationEntryPoint.inf
  UefiLib|MdePkg/Library/UefiLib/UefiLib.inf

  // 下記は教材にない設定です．ただ，入れないとエラーが吐いた
  BaseLib|MdePkg/Library/BaseLib/BaseLib.inf
  BaseMemoryLib|MdePkg/Library/BaseMemoryLib/BaseMemoryLib.inf
  DebugLib|MdePkg/Library/BaseDebugLibNull/BaseDebugLibNull.inf
  DevicePathLib|MdePkg/Library/UefiDevicePathLib/UefiDevicePathLib.inf
  MemoryAllocationLib|MdePkg/Library/UefiMemoryAllocationLib/UefiMemoryAllocationLib.inf
  PcdLib|MdePkg/Library/BasePcdLibNull/BasePcdLibNull.inf
  PrintLib|MdePkg/Library/BasePrintLib/BasePrintLib.inf
  DebugLib|MdePkg/Library/BaseDebugLibNull/BaseDebugLibNull.inf
  UefiBootServicesTableLib|MdePkg/Library/UefiBootServicesTableLib/UefiBootServicesTableLib.inf
  UefiRuntimeServicesTableLib|MdePkg/Library/UefiRuntimeServicesTableLib/UefiRuntimeServicesTableLib.inf

[Components]
  MikanLoaderPkg/Loader.inf
```

```C
// Loader.inf
[Defines]
  INF_VERSION                    = 0x00010006
  BASE_NAME                      = Loader
  FILE_GUID                      = c9d0d202-71e9-11e8-9e52-cfbfd0063fbf
  MODULE_TYPE                    = UEFI_APPLICATION
  VERSION_STRING                 = 0.1
  ENTRY_POINT                    = UefiMain

#  VALID_ARCHITECTURES           = X64

[Sources]
  Main.c

[Packages]
  MdePkg/MdePkg.dec

[LibraryClasses]
  UefiLib
  UefiApplicationEntryPoint

  // 下記は教材にない設定です．ただ，入れないとエラーが吐いた
  BaseLib
  BaseMemoryLib
  DebugLib
  DevicePathLib
  MemoryAllocationLib
  PcdLib
  PrintLib
  DebugLib
  UefiBootServicesTableLib
  UefiRuntimeServicesTableLib

[Guids]

[Protocols]
```

```C
// Main.c
#include  <Uefi.h>
#include  <Library/UefiLib.h>

EFI_STATUS EFIAPI UefiMain(
    // handle:ウィンドウ等を操作したいときに対象を識別するために割り当てられる一意の番号
    // table:データを入れる表
    EFI_HANDLE image_handle,
    EFI_SYSTEM_TABLE* system_table) {

  Print(L"Hello, Mikan World!\n");
  while (1);
  return EFI_SUCCESS;
}
```


## edkⅡの設定
edkⅡディレクトリの中に/workspaces/mikanos-devcontainer/mikanos/MikanLoaderPkgのシンボリックリンクを作成します．

できうる限り書籍に沿うために，$HOME(/home/vscode)内にworkspacesのシンボリックリンクも作成します．
```sh
cd $HOME
ln -s /workspaces ./

cd ~/edk2/
ln -s $HOME/workspaces/mikanos-devcontainer/MikanLoaderPkg ./
```

シンボリックリンクの作成後，edksetup.shを実行し，作成されたConf/target.txtで下記の項目を書き換えます．

| 設定項目        | 設定値                            | 
| --------------- | --------------------------------- | 
| ACTIVE_PLATFORM | MikanLoaderPkg/MikanLoaderPkg.dsc | 
| TARGET          | DEBUG                             | 
| TARGET_ARCH     | X64                               | 
| TOOL_CHAIN_TAG  | CLANG38                           | 


書き換える時は，vimを使用しました．
```sh
sudo apt upgrade
sudo apt list upgrade
sudo apt install -y vim

vim Conf/target.txt
```

## build
下記のコマンドでビルドし，実行ファイル(~/edk2/Build/MikanLoaderX64/DEBUG_CLANG38/X64/Loader.efi)が作成されていることを確認します．

実際の実行は，また後日実施します．

```sh
cd ~/edk2
build

ls Build/MikanLoaderX64/DEBUG_CLANG38/X64/
# Loader.debug  Loader.efi  MdePkg  MikanLoaderPkg  TOOLS_DEF.X64
```



## まとめ
USBに突っ込んだ上での実行はしていませんが，一通り実装しました．

## 参考サイト
[「ゼロからのOS自作入門」のサポートサイト](https://zero.osdev.jp/)

[EDK II で UEFI アプリケーションを作る](https://osdev-jp.readthedocs.io/ja/latest/2017/create-uefi-app-with-edk2.html)

[ハンドル（handle）とは - IT用語辞典](https://e-words.jp/w/%E3%83%8F%E3%83%B3%E3%83%89%E3%83%AB.html)



<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

