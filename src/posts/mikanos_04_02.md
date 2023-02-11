---
display: home
title: '「ゼロからのOS自作入門」4章 4.3〜を実行する'
description: 「ゼロからのOS自作入門」4章 4.3〜を実行します．
date: 2023-02-12
image: https://www.hamlet-engineer.com/image/mikanos_top.png
categories: 
  - OS
tags:
  - OS
  - Docker
  - C++
---

<!-- https://www.hamlet-engineer.com -->
'「ゼロからのOS自作入門」4章 4.3〜を実行します(前編)'

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

![](image/WritePixel_4_2.png)

## PixelWriterクラス(osbook_day04c)

### PixelWriterクラスの実装
mikanos/kernel/main.cppに下記の内容を追記します．
```c++
class PixelWriter{
  public:
    PixelWriter(const FrameBufferConfig& config) : config_{config} {
    }
    virtual ~PixelWriter() = default;
    virtual void Write(int x, int y, const PixelColor& c) = 0;

  protected:
    uint8_t* PixelAt(int x, int y) {
      return config_.frame_buffer + 4 * (config_.pixels_per_scan_line * y + x);
    }
  
  private:
    const FrameBufferConfig& config_;
};
```

### PixelWriterクラスの継承
mikanos/kernel/main.cppに，PixelWriterクラスで画面に描画する内容を追記します．
```c++
class RGBResv8BitPerColorPixelWriter : public PixelWriter {
  public:
    using PixelWriter::PixelWriter;

    virtual void Write(int x, int y, const PixelColor& c) override {
      auto p = PixelAt(x, y);
      p[0] = c.r;
      p[1] = c.g;
      p[2] = c.b;
    }
};

class BGRResv8BitPerColorPixelWriter : public PixelWriter {
  public:
    using PixelWriter::PixelWriter;

    virtual void Write(int x, int y, const PixelColor& c) override {
      auto p = PixelAt(x, y);
      p[0] = c.b;
      p[1] = c.g;
      p[2] = c.r;
    }
};
```

### PixelWriterクラスの使い方
mikanos/kernel/main.cppに，PixelWriterクラスを使う内容を追記します．
```c++
// PixelWriterポインタの定義
char pixel_writer_buf[sizeof(RGBResv8BitPerColorPixelWriter)];
PixelWriter* pixel_writer;

// PixelWriterクラスの使い方
extern "C" void KernelMain(const FrameBufferConfig& frame_buffer_config) {
  switch (frame_buffer_config.pixel_format) {
    case kPixelRGBResv8BitPerColor:
      pixel_writer = new(pixel_writer_buf)
        RGBResv8BitPerColorPixelWriter(frame_buffer_config);
      break;
    case kPixelBGRResv8BitPerColor:
      pixel_writer = new(pixel_writer_buf)
        BGRResv8BitPerColorPixelWriter(frame_buffer_config);
      break;
  }

  for (int x = 0; x < frame_buffer_config.horizontal_resolution; ++x){
    for (int y = 0; y < frame_buffer_config.vertical_resolution; ++y){
      pixel_writer->Write(x, y, {255, 255, 255});
    }
  }
  for (int x = 0; x < 200; ++x){
    for (int y = 0; y < 100; ++y){
      pixel_writer->Write(x, y, {0, 255, 0});
    }
  }
  while (1) __asm__("hlt");
}
```

### 配置newの演算子の定義
mikanos/kernel/main.cppに，配置newの演算子の定義を追記します．

下記の配置newは，メモリ領域の確保を実施しない．
```c++
void* operator new(size_t size, void* buf) {
  return buf;
}

void operator delete(void* obj) noexcept {
}
```

### ビルド
下記のコードで変更したmain.cpp等を反映します．
```sh
source $HOME/osbook/devenv/buildenv.sh

cd ~/workspaces/mikanos-devcontainer/mikanos/kernel
make

cd $HOME/edk2/
source edksetup.sh
build
```

### Hello world
下記のコードでイメージファイルを上書きし，Hello Worldを実行します．

```sh
cd $HOME/edk2

$HOME/osbook/devenv/run_qemu.sh Build/MikanLoaderX64/DEBUG_CLANG38/X64/Loader.efi $HOME/workspaces/mikanos-devcontainer/mikanos/kernel/kernel.elf
```

![](image/mikanos/WritePixel_4_3.png)


## ローダの改良(osbook_day04d)
今までの描画プログラムには，下記のバグが存在します．

カーネルの読み込むためのメモリ確保において，メモリの大きさを計算する処理が間違っている．

```c++
cd ~/workspaces/mikanos-devcontainer/mikanos/kernel
readelf -l kernel.elf

// Elf file type is EXEC (Executable file)
// Entry point 0x101020
// There are 5 program headers, starting at offset 64

// Program Headers:
//   Type           Offset             VirtAddr           PhysAddr
//                  FileSiz            MemSiz              Flags  Align
//   PHDR           0x0000000000000040 0x0000000000100040 0x0000000000100040
//                  0x0000000000000118 0x0000000000000118  R      0x8
//   LOAD           0x0000000000000000 0x0000000000100000 0x0000000000100000
//                  0x00000000000001a8 0x00000000000001a8  R      0x1000
//   LOAD           0x0000000000001000 0x0000000000101000 0x0000000000101000
//                  0x00000000000001b9 0x00000000000001b9  R E    0x1000
//   LOAD           0x0000000000002000 0x0000000000102000 0x0000000000102000
//                  0x0000000000000000 0x0000000000000018  RW     0x1000
//   GNU_STACK      0x0000000000000000 0x0000000000000000 0x0000000000000000
//                  0x0000000000000000 0x0000000000000000  RW     0x0

//  Section to Segment mapping:
//   Segment Sections...
//    00     
//    01     .rodata 
//    02     .text 
//    03     .bss 
//    04   
```

### 64ビット ELF　のファイルヘッダの作成
mikanos/kernel/elf.hppに64ビット_ELFのファイルヘッダを追記します．
```c++
#define EI_NINDENT 16

typedef struct {
  unsigned char e_indent[EI_NINDENT]:
  Elf64_Half e_type;
  Elf64_Half e_machine;
  Elf64_Word e_version;
  Elf64_Addr e_entry;
  Elf64_Off  e_phoff;
  Elf64_Off  e_shoff;
  Elf64_Word e_flags;
  Elf64_Half e_ehsize;
  Elf64_Half e_phentsize;
  Elf64_Half e_phnum;
  Elf64_Half e_shentsize;
  Elf64_Half e_shnum;
  Elf64_Half shstrndx;
} Elf64_Endr;
```

### カーネルファイルの読み込み(Main.c)p113
```

```


## まとめ
「ゼロからのOS自作入門」4章 4.3〜を実行しました(前編)．

## 参考サイト
[『ゼロからのOS自作入門』をMacで動かしてみた記録（第4章 4.2 osbook_day04b）](https://noanoa07.livedoor.blog/archives/2342461.html)



<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

