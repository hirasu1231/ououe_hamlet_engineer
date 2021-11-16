---
display: home
title: '「ゼロからのOS自作入門」3章 3.1〜3.3を実行する(前編)'
description: 「ゼロからのOS自作入門」3章 Hello worldを実行します．
date: 2021-11-16
image: https://www.hamlet-engineer.com/image/mikanos_top.png
categories: 
  - OS
tags:
  - OS
  - Docker
  - C++
---

<!-- https://www.hamlet-engineer.com -->
'「ゼロからのOS自作入門」3章 3.1〜3.3を実行します(前編)'

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

## QEMUモニタ
下記のコードでQEMUモニタを起動します．
```sh
qemu-system-x86_64 -drive if=pflash,format=raw,file=$HOME/osbook/devenv/OVMF_CODE.fd -drive if=pflash,format=raw,file=$HOME/osbook/devenv/OVMF_VARS.fd -drive file=disk.img,format=raw,index=0,media=disk -monitor stdio
```

![](/image/mikanos/qemu_monitor01.png)


下記のコードでレジスタの情報を表示します．
```sh
(qemu) info registers
# RAX=0000000000000000 RBX=0000000000000001 RCX=0000000007b7b1c0 RDX=0000000000000002
# RSI=0000000000000400 RDI=0000000007ea9270 RBP=000000000000002c RSP=0000000007ea88a0
# R8 =00000000000000af R9 =0000000000000288 R10=0000000000000050 R11=0000000000000000
# R12=000000000669258c R13=0000000007ea8930 R14=0000000007230ca0 R15=0000000007ea88e8
# RIP=000000000669143a RFL=00000202 [-------] CPL=0 II=0 A20=1 SMM=0 HLT=0
# ES =0030 0000000000000000 ffffffff 00cf9300 DPL=0 DS   [-WA]
# CS =0038 0000000000000000 ffffffff 00af9a00 DPL=0 CS64 [-R-]
```

下記のコードで任意のメモリ領域の値を表示できます．

表示の設定は「x /format 先頭文字」です．/formatは［表示数］［フォーマット］［サイズ］となります．
- 表示数：そのまま．何個表示するか．
- ファーマット：16進数表示のx,10進数表示のd，逆アセンブリ表示のi
- サイズ：1バイトはb，2バイトはh，4バイトはw，8バイトはg

「/4xb」では「4個表示，16進数，単位は1バイト」となります．

```sh
(qemu) x /4xb 0x067ae4c4
# 00000000067ae4c4: 0xeb 0xfe 0x66 0x90

# (qemu) x /2i 0x067ae4c4
# 0x067ae4c4:  00 00                    addb     %al, (%rax)
# 0x067ae4c6:  00 00                    addb     %al, (%rax)
```

## レジスタ
> レジスタとは、レジスタとは、CPU（中央演算装置）そのものに内蔵されている記憶装置である。計算中のデータや計算結果データを一時的に保持する領域などとして用いられる。典型的にはCPUの部品であるが、CPU以外でも複雑な処理を行う集積回路（たとえばGPU）がレジスタを内蔵する場合はある。<br>
<br>
コンピュータの演算処理の手順は、きわめて大雑把にいえば、（1）演算装置が記憶装置らデータを読み取り、（2）その内容に従って演算処理を行い、（3）演算の結果を再び記憶装置に書き込む、といった流れの繰り返しで成り立っている。この一連の流れにおいて、演算装置と記憶装置の間で行われるデータ転送が相対的に遅くなり（ボトルネックとなり）やすい。レジスタはきわめて高速に動作する記憶装置であり、かつ、CPUの内部（つまり演算装置に直結した場所）に設置され、高速なバスで結合されている。両素子が同じ配線上の最短距離に位置することにより、データ転送速度の最高速化が実現されている。<br>
引用元[レジスタ（register）とは - IT用語辞典 e-Words](https://www.weblio.jp/content/%E3%83%AC%E3%82%B8%E3%82%B9%E3%82%BF)

## カーネルのコード改良点
カーネルとは，osの本体となるファイルです．下記のコードでkernelディレクトリを作成します．
```sh
cd /home/vscode/workspaces/mikanos-devcontainer/mikanos
mkdir kernel
touch kernel/main.cpp
```

kernel/main.cppの中身は以下の通りである．

```C++
extern "C" void KernelMain(){
    while(1) __asm__("hlt");
}
```

```sh
cd /home/vscode/workspaces/mikanos-devcontainer/mikanos/kernel

clang++ -O2 -Wall -g --target=x86_64-elf -ffreestanding -mno-red-zone -fno-exceptions -fno-rtti -std=c++17 -c main.cpp
# main.cpp  main.o

ld.lld --entry KernelMain -z norelro --image-base 0x100000 --static -o kernel.elf main.o
# kernel.elf  main.cpp  main.o
```

clang++の設定を下記に示す．
| 設定                | 説明                                                          | 
| ------------------- | ------------------------------------------------------------- | 
| -02                 | レベル2の最適化を行う                                         | 
| -Wall               | 警告をたくさん出す                                            | 
| -g                  | デバック情報付きでコンパイルする                              | 
| --target=x86_64-elf | x86_64向けの機械語を生成する．出力ファイルの形式をELFとする． | 
| -ffreestanding      | フリースタンディング環境向けにコンパイルする                  | 
| -mno-red-zone       | Red Zone機能を無効にする                                      | 
| -fno-exception      | C++の例外機能は使わない                                       | 
| -fno-rtti           | C++の動的型情報を使わない                                     | 
| -std=c++17          | C++のバージョンをC++17とする                                  | 
| -c                  | コンパイルのみする．リンクしない．                            | 

ld.lldの設定を下記に示す．

| 設定                  | 説明                                                  | 
| --------------------- | ----------------------------------------------------- | 
| --entry KernelMain    | KernelMain()をエントリポイントとする                  | 
| -z norelro            | リロケーション情報を読み込み専用にする機能を使わない  | 
| --image-base 0x100000 | 出力されたバイナリのベースアドレスを0x10000番地とする | 
| --static              | 静的リンクを行う                                      | 
| -o kernel.elf         | 出力ファイル名をkernel.elfとする                      | 

下記のコードをMain.cのメイン関数に追記する．

```C++
// カーネルファイルの読み込み
// #@@range_begin(read_kernel)
EFI_FILE_PROTOCOL* kernel_file;
root_dir->Open(
  root_dir, &kernel_file, L"\\kernel.elf",
  EFI_FILE_MODE_READ, 0);

UINTN file_info_size = sizeof(EFI_FILE_INFO) + sizeof(CHAR16) * 12;
UINT8 file_info_buffer[file_info_size];
kernel_file->GetInfo(
  kernel_file, &gEfiFileInfoGuid,
  &file_info_size, file_info_buffer);

EFI_FILE_INFO* file_info = (EFI_FILE_INFO*)file_info_buffer;
UINTN kernel_file_size = file_info->FileSize;

EFI_PHYSICAL_ADDRESS kernel_base_addr = 0x100000;
gBS->AllocatePages(
  AllocateAddress, EfiLoaderData,
  (kernel_file_size + 0xfff) / 0x1000, &kernel_base_addr);
kernel_file->Read(kernel_file, &kernel_file_size, (VOID*)kernel_base_addr);
Print(L"Kernel: 0x%0lx (%lu bytes)\n", kernel_base_addr, kernel_file_size);
// #@@range_end(read_kernel)
```

```C++
typedef struct{
  UINT64 Size, FileSize, PhysicalSize;
  EFI_TIME CreateTime, LastAccessTime, ModificationTime;
  UINT64 Attribute;
  CHAR16 FileName[];
} EFI_FILE_INFO;
```

```C++
// カーネル起動時にブートサービスを停止させる
// #@@range_begin(exit_bs)
EFI_STATUS status;
status = gBS->ExitBootServices(image_handle, memmap.map_key);
if (EFI_ERROR(status)){
  status = GetMemoryMap(&memmap);
  if (EFI_ERROR(status)){
    Print(L"failed to get memory map: %r\n", status);
    while(1);
  }
  status = gBS->ExitBootServices(image_handle, memmap.map_key);
  if (EFI_ERROR(status)){
    Print(L"Could not exit boot service: %r\n", status);
    while(1);
  }
}
// #@@range_end(exit_bs)
```

```C++
// メイン関数をカーネル起動する
// #@@range_begin(call_kernel)
UINT64 entry_addr = *(UINT64*)(kernel_base_addr + 24);

typedef void EntryPointType(void);
EntryPointType* entry_point = (EntryPointType*)entry_addr;
entry_point();
// #@@range_end(call_kernel)
```

カーネルの内部構造は下記のコードで閲覧できる．

```sh
cd /home/vscode/workspaces/mikanos-devcontainer/mikanos/kernel
readelf -h kernel.elf
# ELF Header:
#   Magic:   7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00 
#   Class:                             ELF64
#   Data:                              2's complement, little endian
#   Version:                           1 (current)
```

## コードの全容
Main.cの内容を下記に示す．
```C++
#include  <Uefi.h>
#include  <Library/UefiLib.h>
#include  <Library/UefiBootServicesTableLib.h>
#include  <Library/PrintLib.h>
#include  <Protocol/LoadedImage.h>
#include  <Protocol/SimpleFileSystem.h>
#include  <Protocol/DiskIo2.h>
#include  <Protocol/BlockIo.h>

// #@@range_begin(include)
#include  <Guid/FileInfo.h>
// #@@range_end(include)

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

  // #@@range_begin(read_kernel)
  EFI_FILE_PROTOCOL* kernel_file;
  root_dir->Open(
    root_dir, &kernel_file, L"\\kernel.elf",
    EFI_FILE_MODE_READ, 0);

  UINTN file_info_size = sizeof(EFI_FILE_INFO) + sizeof(CHAR16) * 12;
  UINT8 file_info_buffer[file_info_size];
  kernel_file->GetInfo(
    kernel_file, &gEfiFileInfoGuid,
    &file_info_size, file_info_buffer);

  EFI_FILE_INFO* file_info = (EFI_FILE_INFO*)file_info_buffer;
  UINTN kernel_file_size = file_info->FileSize;

  EFI_PHYSICAL_ADDRESS kernel_base_addr = 0x100000;
  gBS->AllocatePages(
    AllocateAddress, EfiLoaderData,
    (kernel_file_size + 0xfff) / 0x1000, &kernel_base_addr);
  kernel_file->Read(kernel_file, &kernel_file_size, (VOID*)kernel_base_addr);
  Print(L"Kernel: 0x%0lx (%lu bytes)\n", kernel_base_addr, kernel_file_size);
  // #@@range_end(read_kernel)

  // #@@range_begin(exit_bs)
  EFI_STATUS status;
  status = gBS->ExitBootServices(image_handle, memmap.map_key);
  if (EFI_ERROR(status)){
    status = GetMemoryMap(&memmap);
    if (EFI_ERROR(status)){
      Print(L"failed to get memory map: %r\n", status);
      while(1);
    }
    status = gBS->ExitBootServices(image_handle, memmap.map_key);
    if (EFI_ERROR(status)){
      Print(L"Could not exit boot service: %r\n", status);
      while(1);
    }
  }
  // #@@range_end(exit_bs)

  // #@@range_begin(call_kernel)
  UINT64 entry_addr = *(UINT64*)(kernel_base_addr + 24);

  typedef void EntryPointType(void);
  EntryPointType* entry_point = (EntryPointType*)entry_addr;
  entry_point();
  // #@@range_end(call_kernel)

  Print(L"All done\n");

  while (1);
  return EFI_SUCCESS;
}
```

Loader.infの内容を下記に示す．
```C++
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
  gEfiFileInfoGuid # 追加

[Protocols]
  gEfiLoadedImageProtocolGuid
  gEfiLoadFileProtocolGuid
  gEfiSimpleFileSystemProtocolGuid
```

## Build
下記のコードでビルドします．
```sh
cd $HOME/edk2
build

# qemuモニタ起動
$HOME/osbook/devenv/run_qemu.sh Build/MikanLoaderX64/DEBUG_CLANG38/X64/Loader.efi $HOME/workspaces/mikanos-devcontainer/mikanos/kernel/kernel.elf
```

run_qemu.shを直打ちする場合は，以下のコマンドを実行している．

```sh
cd /home/vscode/edk2/Build/MikanLoaderX64/DEBUG_CLANG38/X64

# imgファイルの新規作成
rm -f ./disk.img
qemu-img create -f raw ./disk.img 200M
mkfs.fat -n 'MIKAN OS' -s 2 -f 2 -R 32 -F 32 ./disk.img

# imgファイルのマウント
mkdir -p ./mnt
sudo mount -o loop ./disk.img ./mnt

# mntディレクトリにファイルを移動
sudo mkdir -p ./mnt/EFI/BOOT
sudo cp Loader.efi ./mnt/EFI/BOOT/BOOTX64.EFI
sudo cp $HOME/workspaces/mikanos-devcontainer/mikanos/kernel/kernel.elf ./mnt/
sudo umount ./mnt

# qemu起動(-vnc :0は削除)
qemu-system-x86_64 -m 1G -drive if=pflash,format=raw,readonly,file=/home/vscode/osbook/devenv/OVMF_CODE.fd -drive if=pflash,format=raw,file=/home/vscode/osbook/devenv/OVMF_VARS.fd -drive if=ide,index=0,media=disk,format=raw,file=./disk.img -device nec-usb-xhci,id=xhci -device usb-mouse -device usb-kbd -monitor stdio
```

上記のコードが実行されていれば，モニタには「All done」は表示されずに，「RAX=000000000010000」と「hlt」が表示されます．
```sh
(qemu) info registers
# RAX=0000000000100000 RBX=000000003effef18 RCX=0000000000000000 RDX=0000000000000000
```

```sh
(qemu) x /2i 0x101010
# 0x00101010:  f4                       hlt      
# 0x00101011:  eb fd                    jmp      0x101010
```

## まとめ
「ゼロからのOS自作入門」3章 3.1〜3.3を実行しました(前編)．

## 参考サイト
[clangの最適化で動作が変わった](https://qiita.com/yoyomion/items/6e3e2648830c457ffe52)


<!-- お名前.com -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5" alt="">

<!-- エックスサーバー株式会社 -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" rel="nofollow"><img border="0" width="1000" height="124" alt="" src="https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"></a><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1" alt="">

<!-- りらくる -->
<a href="https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" rel="nofollow">全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】</a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM" alt="">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

