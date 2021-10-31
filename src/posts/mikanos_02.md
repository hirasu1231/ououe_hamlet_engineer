---
display: home
title: '「ゼロからのOS自作入門」2章 メモリ情報を出力しながらでHello worldを実行する(後編)'
description: ゼロからのOS自作入門」2章 EDKⅡでHello worldを実行します．(後編)
date: 2021-10-22
image: https://www.hamlet-engineer.com/image/mikanos_top.png
categories: 
  - OS
tags:
  - OS
  - Docker
  - C++
---

<!-- https://www.hamlet-engineer.com -->
ゼロからのOS自作入門」2章 メモリ情報を出力しながらでHello worldを実行します．(後編)

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

## Main.cの改良
/workspaces/mikanos-devcontainer/mikanos/MikanLoaderPkg/Main.c,Loader.infを下記の内容のファイルを改良します．

(MikanLoaderPkg.dec・MikanLoaderPkg.dsc・Loader.inf・Main.c)

```C
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
  // ここを追加
  gEfiLoadedImageProtocolGuid
  gEfiLoadFileProtocolGuid
  gEfiSimpleFileSystemProtocolGuid
```

```C++
// Main.c
#include  <Uefi.h>
#include  <Library/UefiLib.h>
#include  <Library/UefiBootServicesTableLib.h>
#include  <Library/PrintLib.h>
#include  <Protocol/LoadedImage.h>
#include  <Protocol/SimpleFileSystem.h>
#include  <Protocol/DiskIo2.h>
#include  <Protocol/BlockIo.h>

struct MemoryMap{
  UINTN buffer_size;
  VOID* buffer;
  UINTN map_size;
  UINTN map_key;
  UINTN descriptor_size;
  UINT32 descriptor_version;
};

EFI_STATUS GetMemoryMap(struct MemoryMap* map) {
  if (map->buffer == NULL) {
    return EFI_BUFFER_TOO_SMALL;
  }

  map->map_size = map->buffer_size;
  return gBS->GetMemoryMap(
      &map->map_size,
      (EFI_MEMORY_DESCRIPTOR*)map->buffer,
      &map->map_key,
      &map->descriptor_size,
      &map->descriptor_version);
}


// #@@range_begin(get_memory_type)
const CHAR16* GetMemoryTypeUnicode(EFI_MEMORY_TYPE type) {
  switch (type) {
    case EfiReservedMemoryType: return L"EfiReservedMemoryType";
    case EfiLoaderCode: return L"EfiLoaderCode";
    case EfiLoaderData: return L"EfiLoaderData";
    case EfiBootServicesCode: return L"EfiBootServicesCode";
    case EfiBootServicesData: return L"EfiBootServicesData";
    case EfiRuntimeServicesCode: return L"EfiRuntimeServicesCode";
    case EfiRuntimeServicesData: return L"EfiRuntimeServicesData";
    case EfiConventionalMemory: return L"EfiConventionalMemory";
    case EfiUnusableMemory: return L"EfiUnusableMemory";
    case EfiACPIReclaimMemory: return L"EfiACPIReclaimMemory";
    case EfiACPIMemoryNVS: return L"EfiACPIMemoryNVS";
    case EfiMemoryMappedIO: return L"EfiMemoryMappedIO";
    case EfiMemoryMappedIOPortSpace: return L"EfiMemoryMappedIOPortSpace";
    case EfiPalCode: return L"EfiPalCode";
    case EfiPersistentMemory: return L"EfiPersistentMemory";
    case EfiMaxMemoryType: return L"EfiMaxMemoryType";
    default: return L"InvalidMemoryType";
  }
}

EFI_STATUS SaveMemoryMap(struct MemoryMap* map, EFI_FILE_PROTOCOL* file){
  CHAR8 buf[256];
  UINTN len;
  
  CHAR8* header = "Index Type, Type(name), PhysicalStart, NumberOfPages, Attribute\n";
  len = AsciiStrLen(header);
  file->Write(file, &len, header);

  Print(L"map->buffer = %08lx, map->map_size = %08lx\n", 
      map->buffer, map->map_size);

  EFI_PHYSICAL_ADDRESS iter;
  int i;
  for (iter = (EFI_PHYSICAL_ADDRESS)map->buffer, i = 0;
  iter < (EFI_PHYSICAL_ADDRESS)map->buffer + map->map_size;
  iter += map->descriptor_size, i++){
    EFI_MEMORY_DESCRIPTOR* desc = (EFI_MEMORY_DESCRIPTOR*)iter;
    len = AsciiSPrint(
      buf, sizeof(buf),
      "%u, %x, %-ls, %08lx, %lx, %lx\n",
      i, desc->Type, GetMemoryTypeUnicode(desc->Type),
      desc->PhysicalStart, desc->NumberOfPages,
      desc->Attribute & 0xffffflu);
    file->Write(file, &len, buf);
  }
  return EFI_SUCCESS;
}

EFI_STATUS OpenRootDir(EFI_HANDLE image_handle, EFI_FILE_PROTOCOL** root){
  EFI_LOADED_IMAGE_PROTOCOL* loaded_image;
  EFI_SIMPLE_FILE_SYSTEM_PROTOCOL* fs;

  gBS->OpenProtocol(
    image_handle,
    &gEfiLoadedImageProtocolGuid,
    (VOID**)&loaded_image,
    image_handle,
    NULL,
    EFI_OPEN_PROTOCOL_BY_HANDLE_PROTOCOL);

  gBS->OpenProtocol(
    loaded_image->DeviceHandle,
    &gEfiSimpleFileSystemProtocolGuid,
    (VOID**)&fs,
    image_handle,
    NULL,
    EFI_OPEN_PROTOCOL_BY_HANDLE_PROTOCOL);

  fs->OpenVolume(fs, root);

  return EFI_SUCCESS;
}

EFI_STATUS EFIAPI UefiMain(
    // ウィンドウ等を操作したいときに対象を識別するために割り当てられる一意の番号
    EFI_HANDLE image_handle,
    // データを入れる表
    EFI_SYSTEM_TABLE* system_table) {

  Print(L"Hello, Mikan World!\n");

  CHAR8 memmap_buf[4096 * 4];
  struct MemoryMap memmap = {sizeof(memmap_buf), memmap_buf, 0, 0, 0, 0};
  GetMemoryMap(&memmap);

  Print(L"GetMemoryMap done\n");

  EFI_FILE_PROTOCOL* root_dir;
  OpenRootDir(image_handle, &root_dir);

  Print(L"OpenRootDir done\n");

  EFI_FILE_PROTOCOL* memmap_file;
  root_dir->Open(
    root_dir, &memmap_file, L"\\memmap",
    EFI_FILE_MODE_READ | EFI_FILE_MODE_WRITE | EFI_FILE_MODE_CREATE, 0);

  Print(L"EFI_FILE_PROTOCOL done\n");

  SaveMemoryMap(&memmap, memmap_file);
  memmap_file->Close(memmap_file);

  Print(L"All done\n");

  while (1);
  return EFI_SUCCESS;
}
```


## メインマップの確認
下記のコードでメインマップを確認しつつ，Hello Worldを実行します．

## ビルド
下記のコードで変更したMain.c等を反映します．
```sh
# cd ~/workspaces/mikanos-devcontainer/mikanos/kernel
cd $HOME/edk2/
source edksetup.sh
build
```

## Hello world
下記のコードでイメージファイルを上書きし，Hello Worldを実行します．

```sh
cd /home/vscode/edk2/Build/MikanLoaderX64/DEBUG_CLANG38/X64

qemu-system-x86_64 -drive if=pflash,format=raw,file=$HOME/osbook/devenv/OVMF_CODE.fd -drive if=pflash,format=raw,file=$HOME/osbook/devenv/OVMF_VARS.fd -drive file=disk.img,format=raw,index=0,media=disk
```

![](/image/mikanos/hello_2seq.png)


そして，イメージファイルをマウントします．すると，「ls mnt」でmemmapが作成されていることを確認します．
```sh
mkdir -p mnt
sudo mount -o loop disk.img mnt
sudo mkdir -p mnt/EFI/BOOT
sudo cp Loarder.efi mnt/EFI/BOOT/BOOTX64.EFI
```

memmapの確認後は，マウントを解除します．
```sh
sudo umount mnt
```



## まとめ
以上で，2章の内容を一通り実装しました．

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

