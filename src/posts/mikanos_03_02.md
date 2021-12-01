---
display: home
title: '「ゼロからのOS自作入門」3章 3.1〜3.3を実行する(前編)'
description: 「ゼロからのOS自作入門」3章 Hello worldを実行します．
date: 2021-12-01
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

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

## ブートローダからピクセルを描く
UEFIにあるGOP(Graphics Output Protocol)という機能によりピクセル単位で描画するのに必要な情報を得ることができます．
- フレームバッファのアドレス．フレームバッファ(Frame Buffer)とはピクセルを敷き詰めたメモリ領域のことです．フレームバッファの各点に値を書き込むと，それがディスプレイのピクセルに反映される仕組みとなっています．
- フレームバッファの表示領域の幅と高さ．解像度とも言います．
- フレームバッファの非表示領域を含めた幅．フレームバッファには，表示領域の右側に表示されない余分な横幅が存在することがあります．
- 1ピクセルのデータ形式．フレームバッファの中で1ピクセルが何バイトで表示されているか，RGBの3色が何バイトずつどんな順番で並んでいるかという情報です．1ピクセルが8ビットであれば256(2<sup>8</sup>)色，各色8ビットであれば役1677万色(2<sup>24</sup>)の表示が可能です．

GOPを取得して画面描画するところをMain.cに記述する．

```C++
EFI_STATUS OpenGOP(EFI_HANDLE image_handle,
                   EFI_GRAPHICS_OUTPUT_PROTOCOL** gop) {
  UINTN num_gop_handles = 0;
  EFI_HANDLE* gop_handles = NULL;
  gBS->LocateHandleBuffer(
      ByProtocol,
      &gEfiGraphicsOutputProtocolGuid,
      NULL,
      &num_gop_handles,
      &gop_handles);

  gBS->OpenProtocol(
      gop_handles[0],
      &gEfiGraphicsOutputProtocolGuid,
      (VOID**)gop,
      image_handle,
      NULL,
      EFI_OPEN_PROTOCOL_BY_HANDLE_PROTOCOL);

  FreePool(gop_handles);

  return EFI_SUCCESS;
}

const CHAR16* GetPixelFormatUnicode(EFI_GRAPHICS_PIXEL_FORMAT fmt) {
  switch (fmt) {
    case PixelRedGreenBlueReserved8BitPerColor:
      return L"PixelRedGreenBlueReserved8BitPerColor";
    case PixelBlueGreenRedReserved8BitPerColor:
      return L"PixelBlueGreenRedReserved8BitPerColor";
    case PixelBitMask:
      return L"PixelBitMask";
    case PixelBltOnly:
      return L"PixelBltOnly";
    case PixelFormatMax:
      return L"PixelFormatMax";
    default:
      return L"InvalidPixelFormat";
  }
}
```

```C++
// UefiMain()の中に記述
// #@@range_begin(gop)
EFI_GRAPHICS_OUTPUT_PROTOCOL* gop;
OpenGOP(image_handle, &gop);
Print(L"Resolution: %ux%u, Pixel Format: %s, %u pixels/line\n",
      gop->Mode->Info->HorizontalResolution,
      gop->Mode->Info->VerticalResolution,
      GetPixelFormatUnicode(gop->Mode->Info->PixelFormat),
      gop->Mode->Info->PixelsPerScanLine);
Print(L"Frame Buffer: 0x%0lx - 0x%0lx, Size: %lu bytes\n",
      gop->Mode->FrameBufferBase,
      gop->Mode->FrameBufferBase + gop->Mode->FrameBufferSize,
      gop->Mode->FrameBufferSize);

UINT8* frame_buffer = (UINT8*)gop->Mode->FrameBufferBase;
for (UINTN i = 0; i < gop->Mode->FrameBufferSize; ++i){
  frame_buffer[i] = 255;
}
// #@@range_end(gop)
```

Qemuを起動すると，下記のコードのようになる．

```sh
cd $HOME/edk2

$HOME/osbook/devenv/run_qemu.sh Build/MikanLoaderX64/DEBUG_CLANG38/X64/Loader.efi $HOME/workspaces/mikanos-devcontainer/mikanos/kernel/kernel.elf
```

![](/image/mikanos_0304.png)

## カーネルからピクセルを描く
カーネルからピクセルを描く際は，main.cppに下記を記述する．
```C++
#include <cstdint>

extern "C" void KernelMain(uint64_t frame_buffer_base,
                           uint64_t frame_buffer_size){
  uint8_t* frame_buffer = reinterpret_cast<uint8_t*>(frame_buffer_base);
  for (uint64_t i = 0; i < frame_buffer_size; ++i>){
    frame_buffer[i] = i % 256;
  }
  while(1) __asm__("hlt");
}
```
下記のコードでC++が「#include ＜cstdint＞」を使えるようにします．

```sh
source $HOME/osbook/devenv/buildenv.sh

echo $CPPFLAGS
```

「#include ＜cstdint＞」を使えるようにしたので，clang++でコンパイルします．

```sh
cd /home/vscode/workspaces/mikanos-devcontainer/mikanos/kernel

clang++ $CPPFLAGS -O2 --target=x86_64-elf -ffreestanding -fno-exceptions -c main.cpp

ld.lld $LDFLAGS --entry KernelMain -z norelro --image-base 0x100000 --static -o kernel.elf main.o
```

そして，Main.cに「フレームバッファの情報をカーネルに渡す」コードを記述します．

「entry_point」に「gop->Mode->FrameBufferBase」と「gop->Mode->FrameBufferSize」を渡して，main.cppの「KernelMain(uint64_t frame_buffer_base, uint64_t frame_buffer_size)」を実行させます．

```C++
// #@@range_begin(call_kernel)
UINT64 entry_addr = *(UINT64*)(kernel_base_addr + 24);

typedef void EntryPointType(UINT64, UINT64);
EntryPointType* entry_point = (EntryPointType*)entry_addr;
entry_point(gop->Mode->FrameBufferBase, gop->Mode->FrameBufferSize);
// #@@range_end(call_kernel)
```

Qemuを起動すると，下記のコードのようになる．

```sh
cd $HOME/edk2

$HOME/osbook/devenv/run_qemu.sh Build/MikanLoaderX64/DEBUG_CLANG38/X64/Loader.efi $HOME/workspaces/mikanos-devcontainer/mikanos/kernel/kernel.elf
```

![](/image/mikanos_0305.png)

## エラー処理
上記のコードでは無限ループを発生させているので，下記のコードをMain.cに追記・修正して，エラーと処理できるようにします．
```C++
// #@@range_begin(alloc_error)
EFI_PHYSICAL_ADDRESS kernel_base_addr = 0x100000;
status = gBS->AllocatePages(
    AllocateAddress, EfiLoaderData,
    (kernel_file_size + 0xfff) / 0x1000, &kernel_base_addr);
if (EFI_ERROR(status)) {
  Print(L"failed to allocate pages: %r", status);
  Halt();
}
// #@@range_end(alloc_error)
```

```C++
// #@@range_begin(halt)
void Halt(void) {
  while (1) __asm__("hlt");
}
// #@@range_end(halt)
```

さらに，各工程でエラー処理をするために，「EFI_STATUS status」に各処理内容を入れて，if文でエラー処理を実行させる．
```C++
// 例
EFI_STATUS SaveMemoryMap(省略){
  EFI_STATUS status;
  (省略)
  status = file->Write(file, &len, header);
  if (EFI_ERROR(status)) {
    return status;
  }
  (省略)
}
```

また，Main.cは下記のように記述される．
```C++
#include  <Uefi.h>
#include  <Library/UefiLib.h>
#include  <Library/UefiBootServicesTableLib.h>
#include  <Library/PrintLib.h>
#include  <Protocol/LoadedImage.h>
#include  <Protocol/SimpleFileSystem.h>
#include  <Protocol/DiskIo2.h>
#include  <Protocol/BlockIo.h>
#include  <Guid/FileInfo.h>

// #@@range_begin(include)
#include <Library/MemoryAllocationLib.h>
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
  EFI_STATUS status;
  CHAR8 buf[256];
  UINTN len;
  
  CHAR8* header = "Index Type, Type(name), PhysicalStart, NumberOfPages, Attribute\n";
  len = AsciiStrLen(header);
  status = file->Write(file, &len, header);
  if (EFI_ERROR(status)) {
    return status;
  }

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
    status = file->Write(file, &len, buf);
    if (EFI_ERROR(status)) {
      return status;
      }
  }
  return EFI_SUCCESS;
}

EFI_STATUS OpenRootDir(EFI_HANDLE image_handle, EFI_FILE_PROTOCOL** root){
  EFI_STATUS status;
  EFI_LOADED_IMAGE_PROTOCOL* loaded_image;
  EFI_SIMPLE_FILE_SYSTEM_PROTOCOL* fs;

  status = gBS->OpenProtocol(
    image_handle,
    &gEfiLoadedImageProtocolGuid,
    (VOID**)&loaded_image,
    image_handle,
    NULL,
    EFI_OPEN_PROTOCOL_BY_HANDLE_PROTOCOL);

  if (EFI_ERROR(status)) {
    return status;
  }

  status = gBS->OpenProtocol(
    loaded_image->DeviceHandle,
    &gEfiSimpleFileSystemProtocolGuid,
    (VOID**)&fs,
    image_handle,
    NULL,
    EFI_OPEN_PROTOCOL_BY_HANDLE_PROTOCOL);
  if (EFI_ERROR(status)) {
    return status;
  }
  return fs->OpenVolume(fs, root);
}

EFI_STATUS OpenGOP(EFI_HANDLE image_handle,
                   EFI_GRAPHICS_OUTPUT_PROTOCOL** gop) {
  EFI_STATUS status;
  UINTN num_gop_handles = 0;
  EFI_HANDLE* gop_handles = NULL;
  status = gBS->LocateHandleBuffer(
      ByProtocol,
      &gEfiGraphicsOutputProtocolGuid,
      NULL,
      &num_gop_handles,
      &gop_handles);
  if (EFI_ERROR(status)) {
    return status;
  }
  status = gBS->OpenProtocol(
      gop_handles[0],
      &gEfiGraphicsOutputProtocolGuid,
      (VOID**)gop,
      image_handle,
      NULL,
      EFI_OPEN_PROTOCOL_BY_HANDLE_PROTOCOL);
  if (EFI_ERROR(status)) {
    return status;
  }

  FreePool(gop_handles);

  return EFI_SUCCESS;
}

const CHAR16* GetPixelFormatUnicode(EFI_GRAPHICS_PIXEL_FORMAT fmt) {
  switch (fmt) {
    case PixelRedGreenBlueReserved8BitPerColor:
      return L"PixelRedGreenBlueReserved8BitPerColor";
    case PixelBlueGreenRedReserved8BitPerColor:
      return L"PixelBlueGreenRedReserved8BitPerColor";
    case PixelBitMask:
      return L"PixelBitMask";
    case PixelBltOnly:
      return L"PixelBltOnly";
    case PixelFormatMax:
      return L"PixelFormatMax";
    default:
      return L"InvalidPixelFormat";
  }
}

// #@@range_begin(halt)
void Halt(void) {
  while (1) __asm__("hlt");
}
// #@@range_end(halt)

EFI_STATUS EFIAPI UefiMain(
    // ウィンドウ等を操作したいときに対象を識別するために割り当てられる一意の番号
    EFI_HANDLE image_handle,
    // データを入れる表
    EFI_SYSTEM_TABLE* system_table) {

  EFI_STATUS status;

  Print(L"Hello, Mikan World!\n");

  CHAR8 memmap_buf[4096 * 4];
  struct MemoryMap memmap = {sizeof(memmap_buf), memmap_buf, 0, 0, 0, 0};
  status = GetMemoryMap(&memmap);
  if (EFI_ERROR(status)) {
    Print(L"failed to get memory map: %r\n", status);
    Halt();
  }
  Print(L"GetMemoryMap done\n");

  EFI_FILE_PROTOCOL* root_dir;
  status = OpenRootDir(image_handle, &root_dir);
  if (EFI_ERROR(status)) {
    Print(L"failed to open root directry: %r\n", status);
    Halt();
  }

  Print(L"OpenRootDir done\n");

  EFI_FILE_PROTOCOL* memmap_file;
  status = root_dir->Open(
    root_dir, &memmap_file, L"\\memmap",
    EFI_FILE_MODE_READ | EFI_FILE_MODE_WRITE | EFI_FILE_MODE_CREATE, 0);
  if (EFI_ERROR(status)) {
    Print(L"failed to open file '\\memmap': %r\n", status);
    Print(L"Ignored.\n");
  } else {
    status = SaveMemoryMap(&memmap, memmap_file);
    if (EFI_ERROR(status)) {
      Print(L"failed to save memory map: %r\n", status);
      Halt();
    }
    status = memmap_file->Close(memmap_file);
    if (EFI_ERROR(status)) {
      Print(L"failed to close memory map: %r\n", status);
      Halt();
    }
  }

  Print(L"EFI_FILE_PROTOCOL done\n");

  // #@@range_begin(gop)
  EFI_GRAPHICS_OUTPUT_PROTOCOL* gop;
  status = OpenGOP(image_handle, &gop);
  if (EFI_ERROR(status)) {
    Print(L"failed to open GOP: %r\n", status);
    Halt();
  }
  Print(L"Resolution: %ux%u, Pixel Format: %s, %u pixels/line\n",
        gop->Mode->Info->HorizontalResolution,
        gop->Mode->Info->VerticalResolution,
        GetPixelFormatUnicode(gop->Mode->Info->PixelFormat),
        gop->Mode->Info->PixelsPerScanLine);
  Print(L"Frame Buffer: 0x%0lx - 0x%0lx, Size: %lu bytes\n",
        gop->Mode->FrameBufferBase,
        gop->Mode->FrameBufferBase + gop->Mode->FrameBufferSize,
        gop->Mode->FrameBufferSize);

  UINT8* frame_buffer = (UINT8*)gop->Mode->FrameBufferBase;
  for (UINTN i = 0; i < gop->Mode->FrameBufferSize; ++i){
    frame_buffer[i] = 255;
  }
  // #@@range_end(gop)

  // #@@range_begin(read_kernel)
  EFI_FILE_PROTOCOL* kernel_file;
  status = root_dir->Open(
    root_dir, &kernel_file, L"\\kernel.elf",
    EFI_FILE_MODE_READ, 0);
  if (EFI_ERROR(status)) {
    Print(L"failed to open file '\\kernel.elf': %r\n", status);
    Halt();
  }

  UINTN file_info_size = sizeof(EFI_FILE_INFO) + sizeof(CHAR16) * 12;
  UINT8 file_info_buffer[file_info_size];
  status = kernel_file->GetInfo(
    kernel_file, &gEfiFileInfoGuid,
    &file_info_size, file_info_buffer);
  if (EFI_ERROR(status)) {
    Print(L"failed to get file information: %r\n", status);
    Halt();
  }

  EFI_FILE_INFO* file_info = (EFI_FILE_INFO*)file_info_buffer;
  UINTN kernel_file_size = file_info->FileSize;

  // #@@range_begin(alloc_error)
  EFI_PHYSICAL_ADDRESS kernel_base_addr = 0x100000;
  status = gBS->AllocatePages(
      AllocateAddress, EfiLoaderData,
      (kernel_file_size + 0xfff) / 0x1000, &kernel_base_addr);
  if (EFI_ERROR(status)) {
    Print(L"failed to allocate pages: %r", status);
    Halt();
  }
  // #@@range_end(alloc_error)
  // #@@range_end(read_kernel)

  status = kernel_file->Read(kernel_file, &kernel_file_size, (VOID*)kernel_base_addr);
  if (EFI_ERROR(status)) {	
    Print(L"error: %r", status);	
    Halt();	
  }
  Print(L"Kernel: 0x%0lx (%lu bytes)\n", kernel_base_addr, kernel_file_size);

  // #@@range_begin(exit_bs)
  status = gBS->ExitBootServices(image_handle, memmap.map_key);
  if (EFI_ERROR(status)){
    status = GetMemoryMap(&memmap);
    if (EFI_ERROR(status)){
      Print(L"failed to get memory map: %r\n", status);
      Halt();
    }
    status = gBS->ExitBootServices(image_handle, memmap.map_key);
    if (EFI_ERROR(status)){
      Print(L"Could not exit boot service: %r\n", status);
      Halt();
    }
  }
  // #@@range_end(exit_bs)

  // #@@range_begin(call_kernel)
  UINT64 entry_addr = *(UINT64*)(kernel_base_addr + 24);

  typedef void EntryPointType(UINT64, UINT64);
  EntryPointType* entry_point = (EntryPointType*)entry_addr;
  entry_point(gop->Mode->FrameBufferBase, gop->Mode->FrameBufferSize);
  // #@@range_end(call_kernel)

  Print(L"All done\n");

  while (1);
  return EFI_SUCCESS;
}
```

Qemuを起動すると，下記のコードのようになる．

```sh
cd $HOME/edk2

$HOME/osbook/devenv/run_qemu.sh Build/MikanLoaderX64/DEBUG_CLANG38/X64/Loader.efi $HOME/workspaces/mikanos-devcontainer/mikanos/kernel/kernel.elf
```

![](/image/mikanos_0305.png)

## まとめ
「ゼロからのOS自作入門」3章 3.1〜3.3を実行しました(前編)．

## 参考サイト
[clangの最適化で動作が変わった](https://qiita.com/yoyomion/items/6e3e2648830c457ffe52)



<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

