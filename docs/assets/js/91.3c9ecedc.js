(window.webpackJsonp=window.webpackJsonp||[]).push([[91],{398:function(t,a,e){"use strict";e.r(a);var s=e(2),r=Object(s.a)({},(function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("p",[t._v("Mac + Dockerで「ゼロからのOS自作入門」の環境構築を実装します．")]),t._v(" "),e("ClientOnly",[e("CallInArticleAdsense")],1),t._v(" "),e("p"),e("div",{staticClass:"table-of-contents"},[e("ul",[e("li",[e("a",{attrs:{href:"#mac-dockerでの環境構築"}},[t._v("Mac + Dockerでの環境構築")])]),e("li",[e("a",{attrs:{href:"#xquartz"}},[t._v("XQuartz")])]),e("li",[e("a",{attrs:{href:"#vs-code-devcontaine"}},[t._v("VS Code devcontaine")])]),e("li",[e("a",{attrs:{href:"#環境構築の確認-hello-world"}},[t._v("環境構築の確認(Hello World)")]),e("ul",[e("li",[e("a",{attrs:{href:"#edk2の環境設定"}},[t._v("edk2の環境設定")])]),e("li",[e("a",{attrs:{href:"#hello-world"}},[t._v("Hello World")])])])]),e("li",[e("a",{attrs:{href:"#まとめ"}},[t._v("まとめ")])]),e("li",[e("a",{attrs:{href:"#参考サイト"}},[t._v("参考サイト")])]),e("li",[e("a",{attrs:{href:"#おまけ-用語の確認"}},[t._v("おまけ(用語の確認)")])])])]),e("p"),t._v(" "),e("p",[e("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5",rel:"nofollow"}},[e("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"}})]),e("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5",alt:""}})]),t._v(" "),e("p",[e("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",rel:"nofollow"}},[e("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"}})]),e("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",alt:""}})]),t._v(" "),e("p",[e("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",rel:"nofollow"}},[t._v("全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】")]),e("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",alt:""}})]),t._v(" "),e("h2",{attrs:{id:"mac-dockerでの環境構築"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#mac-dockerでの環境構築"}},[t._v("#")]),t._v(" Mac + Dockerでの環境構築")]),t._v(" "),e("p",[e("a",{attrs:{href:"https://zenn.dev/sarisia/articles/6b57ea835344b6",target:"_blank",rel:"noopener noreferrer"}},[t._v('Docker ではじめる "ゼロからのOS自作入門"'),e("OutboundLink")],1),t._v("に従い，VS Code Remote Container(devcontainer)を使用します．")]),t._v(" "),e("p",[t._v("VS Code Remote ContainerはVS code上でDockerのコンテナを使用する機能です．")]),t._v(" "),e("p",[t._v("仕組みとしては，環境と実行はDockerで，動作確認はローカルのXQuartzに表示させて実行します．")]),t._v(" "),e("h2",{attrs:{id:"xquartz"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#xquartz"}},[t._v("#")]),t._v(" XQuartz")]),t._v(" "),e("p",[t._v("ここでは，DockerとVS Codeのインストールは省略します．")]),t._v(" "),e("p",[t._v("以下のコマンドでXQuartzのインストールを実行します．")]),t._v(" "),e("p",[t._v("XQuartzは「/アプリケーション/ユーティリティ」ディレクトリにあるXQuartzをダブルクリックして起動します．")]),t._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# XQuartzのインストール")]),t._v("\nbrew "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" xquartz\n")])])]),e("p",[t._v("XQuartzが起動すると下記のようなターミナルが表示されます．表示されない場合は，上部メニューの「アプリケーション -> ターミナル」で表示できます．")]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/xquartz.png",loading:"lazy"}})]),t._v(" "),e("p",[t._v("XQuartzのターミナル上で，下記のコードを実行したら準備OKです．")]),t._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[t._v("xhost + "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("127.0")]),t._v(".0.1\n")])])]),e("h2",{attrs:{id:"vs-code-devcontaine"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#vs-code-devcontaine"}},[t._v("#")]),t._v(" VS Code devcontaine")]),t._v(" "),e("p",[t._v("ローカルのターミナルで以下コマンドを実行し，VS Codeが立ち上げます．")]),t._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 環境構築用のgit")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" clone https://github.com/karaage0703/mikanos-devcontainer\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# ディレクトリ移動")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("cd")]),t._v(" mikanos-devcontainer\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# VSCodeで実行")]),t._v("\ncode "),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(".")]),t._v("\n")])])]),e("p",[t._v("そして，VS Codeの左下の緑マークを押し，コマンドパレットで"),e("code",[t._v("Open Folder in Container...")]),t._v("を選択します.")]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/VS_Code1.png",loading:"lazy"}})]),t._v(" "),e("p",[t._v("しばらく待つと，以下のようなダイアログが表示されるのでmikanos-devcontainerが選ばれていることを確認してOpenをクリックしますと，環境構築が一気に済みます．")]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/VS_Code2.png",loading:"lazy"}})]),t._v(" "),e("h2",{attrs:{id:"環境構築の確認-hello-world"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#環境構築の確認-hello-world"}},[t._v("#")]),t._v(" 環境構築の確認(Hello World)")]),t._v(" "),e("p",[t._v("ここからは，VS Code上でのターミナルで実行します．")]),t._v(" "),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/VS_Code3.png",loading:"lazy"}})]),t._v(" "),e("h3",{attrs:{id:"edk2の環境設定"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#edk2の環境設定"}},[t._v("#")]),t._v(" edk2の環境設定")]),t._v(" "),e("p",[t._v("「ゼロからのOS自作入門」の筆者のgitから，コードをもろもろクローンします．")]),t._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# mikanosのgitをclone")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("cd")]),t._v(" /workspaces/mikanos-devcontainer/\n"),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" clone https://github.com/uchan-nos/mikanos.git\n"),e("span",{pre:!0,attrs:{class:"token assign-left variable"}},[t._v("OS_DIR")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("/workspaces/mikanos-devcontainer/mikanos\n")])])]),e("p",[t._v("そして，以下のコードでedk2の環境設定を実施します．")]),t._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# edk2のディレクトリに移動")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("cd")]),t._v(" ~/edk2\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# mikanosのパッケージを追加")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("ln")]),t._v(" -s "),e("span",{pre:!0,attrs:{class:"token environment constant"}},[t._v("$HOME")]),t._v("/workspace/mikanos/MikanLoaderPkg ./\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 環境変数設定用のスクリプト")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("source")]),t._v(" edksetup.sh\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 設定内容情報を作業ディレクトリにコピー")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("cp")]),t._v(" Conf/target.txt /workspaces/mikanos-devcontainer/target.txt \n")])])]),e("h3",{attrs:{id:"hello-world"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#hello-world"}},[t._v("#")]),t._v(" Hello World")]),t._v(" "),e("p",[t._v("環境構築確認のために，Hello Worldのコードを本の解説を見ながら自作するのは重たい作業なので，あらかじめクローンされている"),e("a",{attrs:{href:"https://github.com/uchan-nos/mikanos-build",target:"_blank",rel:"noopener noreferrer"}},[t._v("uchan-nos/mikanos-build"),e("OutboundLink")],1),t._v("を使用します．ディレクトリの場所は~/osbookです．")]),t._v(" "),e("p",[t._v("ここからのコードの実行は，意味を調べずに機械的に実行します．(あくまでの環境構築の確認が目的なので)")]),t._v(" "),e("p",[t._v("最初は，イメージを作ってFATでフォーマットします．")]),t._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("cd")]),t._v(" ~/osbook/day01/bin\nqemu-img create -f raw disk.img 200M\nmkfs.fat -n "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'MIKAN OS'")]),t._v(" -s "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),t._v(" -f "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),t._v(" -R "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("32")]),t._v(" -F "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("32")]),t._v(" disk.img\n")])])]),e("p",[t._v("イメージをマウントして，バイナリファイル（hello.efi）を書き込んで，アンマウントします．")]),t._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token function"}},[t._v("mkdir")]),t._v(" -p mnt\n"),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("mount")]),t._v(" -o loop disk.img mnt\n"),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("mkdir")]),t._v(" -p mnt/EFI/BOOT\n"),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("cp")]),t._v(" hello.efi mnt/EFI/BOOT/BOOTX64.EFI\n"),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("umount")]),t._v(" mnt\n")])])]),e("p",[t._v("バイナリファイルを書き込んだイメージをQEMUで読み込み起動します．(XQuartzに表示される)")]),t._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[t._v("qemu-system-x86_64 -drive "),e("span",{pre:!0,attrs:{class:"token assign-left variable"}},[t._v("if")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("pflash,format"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("raw,file"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),e("span",{pre:!0,attrs:{class:"token environment constant"}},[t._v("$HOME")]),t._v("/osbook/devenv/OVMF_CODE.fd -drive "),e("span",{pre:!0,attrs:{class:"token assign-left variable"}},[t._v("if")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("pflash,format"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("raw,file"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),e("span",{pre:!0,attrs:{class:"token environment constant"}},[t._v("$HOME")]),t._v("/osbook/devenv/OVMF_VARS.fd -drive "),e("span",{pre:!0,attrs:{class:"token assign-left variable"}},[t._v("file")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("disk.img,format"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("raw,index"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),t._v(",media"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("disk\n")])])]),e("p",[e("img",{staticClass:"lazy",attrs:{alt:"","data-src":"/image/xquartz_hello.png",loading:"lazy"}})]),t._v(" "),e("h2",{attrs:{id:"まとめ"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#まとめ"}},[t._v("#")]),t._v(" まとめ")]),t._v(" "),e("p",[t._v("Mac + Dockerで「ゼロからのOS自作入門」の環境構築を実装しました．")]),t._v(" "),e("p",[t._v("「ゼロからのOS自作入門」を進めていく上で，弊害が出た場合は逐次修正します．")]),t._v(" "),e("h2",{attrs:{id:"参考サイト"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#参考サイト"}},[t._v("#")]),t._v(" 参考サイト")]),t._v(" "),e("p",[e("a",{attrs:{href:"https://zenn.dev/sarisia/articles/6b57ea835344b6",target:"_blank",rel:"noopener noreferrer"}},[t._v('Docker ではじめる "ゼロからのOS自作入門"'),e("OutboundLink")],1)]),t._v(" "),e("p",[e("a",{attrs:{href:"https://zenn.dev/karaage0703/articles/1bdb8930182c6c",target:"_blank",rel:"noopener noreferrer"}},[t._v("「ゼロからのOS自作入門」の副読本的記事"),e("OutboundLink")],1)]),t._v(" "),e("p",[e("a",{attrs:{href:"https://github.com/uchan-nos/mikanos",target:"_blank",rel:"noopener noreferrer"}},[t._v("uchan-nos/mikanos"),e("OutboundLink")],1)]),t._v(" "),e("p",[e("a",{attrs:{href:"https://github.com/uchan-nos/mikanos-build",target:"_blank",rel:"noopener noreferrer"}},[t._v("uchan-nos/mikanos-build"),e("OutboundLink")],1)]),t._v(" "),e("p",[e("a",{attrs:{href:"https://github.com/sarisia/mikanos-devcontainer",target:"_blank",rel:"noopener noreferrer"}},[t._v("sarisia/mikanos-devcontainer"),e("OutboundLink")],1)]),t._v(" "),e("p",[e("a",{attrs:{href:"https://github.com/sarisia/mikanos-docker",target:"_blank",rel:"noopener noreferrer"}},[t._v("sarisia/mikanos-docker"),e("OutboundLink")],1)]),t._v(" "),e("p",[e("a",{attrs:{href:"https://github.com/bun913/go_devcontainer",target:"_blank",rel:"noopener noreferrer"}},[t._v("bun913/go_devcontainer"),e("OutboundLink")],1)]),t._v(" "),e("p",[e("a",{attrs:{href:"https://zero.osdev.jp/",target:"_blank",rel:"noopener noreferrer"}},[t._v("「ゼロからのOS自作入門」のサポートサイト"),e("OutboundLink")],1)]),t._v(" "),e("p",[e("a",{attrs:{href:"https://itcweb.cc.affrc.go.jp/affrit/documents/guide/x-window/x-win-mac",target:"_blank",rel:"noopener noreferrer"}},[t._v("4 macOSでのX Window利用"),e("OutboundLink")],1)]),t._v(" "),e("p",[e("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HBXCY+4DRW36+50+2HM5Z5",rel:"nofollow"}},[e("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www27.a8.net/svt/bgt?aid=210508450265&wid=001&eno=01&mid=s00000000018015052000&mc=1"}})]),e("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www10.a8.net/0.gif?a8mat=3HBXCY+4DRW36+50+2HM5Z5",alt:""}})]),t._v(" "),e("p",[e("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",rel:"nofollow"}},[e("img",{attrs:{border:"0",width:"1000",height:"124",alt:"",src:"https://www23.a8.net/svt/bgt?aid=210821855239&wid=001&eno=01&mid=s00000001642001062000&mc=1"}})]),e("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www17.a8.net/0.gif?a8mat=3HIN6N+3YAMCY+CO4+6BMG1",alt:""}})]),t._v(" "),e("p",[e("a",{attrs:{href:"https://px.a8.net/svt/ejp?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",rel:"nofollow"}},[t._v("全国630店舗以上！もみほぐし・足つぼ・ハンドリフレ・クイックヘッドのリラクゼーション店【りらくる】")]),e("img",{attrs:{border:"0",width:"1",height:"1",src:"https://www15.a8.net/0.gif?a8mat=3HIN6N+7FBNEA+4AQ0+5YJRM",alt:""}})]),t._v(" "),e("ClientOnly",[e("CallInArticleAdsense")],1),t._v(" "),e("h2",{attrs:{id:"おまけ-用語の確認"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#おまけ-用語の確認"}},[t._v("#")]),t._v(" おまけ(用語の確認)")]),t._v(" "),e("p",[t._v("EDKⅡ")]),t._v(" "),e("blockquote",[e("p",[t._v("EDKⅡはUEFI BIOS自体の開発にも，UEFI BIOS上で動くアプリケーションの開発にも使うことができる開発キット"),e("br"),t._v("\n引用元:[「ゼロからのOS自作入門」p48]")])]),t._v(" "),e("p",[t._v("UEFI(Unified Extensible Firmware Interface) or UEFI BIOS")]),t._v(" "),e("blockquote",[e("p",[t._v("UEFIとは、一言で言うと「最近のPCやサーバーに入っている、新しくて高機能なファームウェア(及びそのインターフェースの仕様)」です。"),e("br"),t._v("\n体感では、2世代目Core iシリーズのCPU以降が入っているマシンには、このUEFIが従来のBIOS(以降、BIOSと表記)の代わりに、または選択可能な状態で入っているように感じています。"),e("br"),t._v("\n引用元:"),e("a",{attrs:{href:"https://qiita.com/tnishinaga/items/40755f414557faf45dcb",target:"_blank",rel:"noopener noreferrer"}},[t._v("gnu-efiでUEFI遊びをはじめよう"),e("OutboundLink")],1)])]),t._v(" "),e("p",[t._v("BIOS(Basic Input / Output System)")]),t._v(" "),e("blockquote",[e("p",[t._v("BIOSは「Basic Input/Output System」の略で、CPUやメモリ、キーボード、マウスなどPCの大半の機能を制御しています。PCを起動したとき最初に作動するのがBIOSで、OSやソフトウェアとの橋渡しをする役割を担っています。"),e("br"),t._v("\n引用元:"),e("a",{attrs:{href:"https://pc-farm.co.jp/pc_column/pc/4351/",target:"_blank",rel:"noopener noreferrer"}},[t._v("BIOSとUEFIの違いについて詳しく解説！次世代のレガシーBIOSとは？"),e("OutboundLink")],1)])]),t._v(" "),e("p",[t._v("UEFI BIOSと従来のBIOSの違いについて")]),t._v(" "),e("blockquote",[e("ol",[e("li",[t._v("2 TB以上のドライブを処理できます。それに対して、古いレガシーBIOSは大容量のストレージドライブを処理できませんでした。")]),t._v(" "),e("li",[t._v("GUIDパーティションテーブルで4つ以上のプライマリパーティションが作成可能です。")]),t._v(" "),e("li",[t._v("BIOSより起動プロセスが高速です。UEFIの最適化により、システムの起動がより速くなる可能性があります。安全な起動をサポートしています。つまり、オペレーティングシステムの有効性の検証によって、起動プロセスを改ざんするマルウェアがないことを確認できます。")]),t._v(" "),e("li",[t._v("UEFIファームウェア自体のネットワーク機能をサポートして、リモートトラブルシューティングとUEFI構成に役立ちます。")]),t._v(" "),e("li",[t._v("グラフィカルユーザーインターフェイスはシンプルで、レガシーBIOSよりも豊富なセットアップメニューがあります。"),e("br"),t._v(" "),e("br"),t._v("\n引用元:"),e("a",{attrs:{href:"https://www.partitionwizard.jp/partitionmagic/uefi-vs-bios.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("UEFIとBIOS、どっちがいい？"),e("OutboundLink")],1),e("br"),t._v("\nより詳細に:"),e("a",{attrs:{href:"https://knowledge.sakura.ad.jp/22963/",target:"_blank",rel:"noopener noreferrer"}},[t._v("現代における自作OSの難しさ 〜自作OSのいまと昔 [第2回]"),e("OutboundLink")],1)])])])],1)}),[],!1,null,null,null);a.default=r.exports}}]);