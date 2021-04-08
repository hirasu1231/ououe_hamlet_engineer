---
display: home
title: 'Python + ESPNetをオリジナルデータで学習する(学習編)'
description: Python + ESPNetでCityscapesデータセットから人のみを抽出した仮のオリジナルデータで学習を実施します．
date: 2021-03-23
image: /image/org_seg1.png
categories: 
  - Python
tags:
  - Python
  - Jupyter
  - ESPNet
  - セマンティックセグメンテーション
---
セマンティックセグメンテーションの中で軽いモデルであるESPNetv2を実装します．<br>
本稿ではCityscapesデータセットから人のみを抽出した仮のオリジナルデータで学習を実施します．<br>
<!-- more -->

今回はGoogle ColabとGoogle Driveを連携させて，notebook形式で実行してます．<br>

> Google Colaboratory（以下Google Colab）は、Google社が無料で提供している機械学習の教育や研究用の開発環境です。開発環境はJupyter Notebookに似たインターフェースを持ち、Pythonの主要なライブラリがプリインストールされています。<br>
引用元：[Google Colabの使い方](https://interface.cqpub.co.jp/ail01/)

最終的に，人以外の背景を着色して，zoomのバーチャル背景機能のようなクロマキー合成を実装したいです．<br>
![](/image/zoom.jpg)

## 作業ディレクトリのファイル構成
プロジェクトディレクトリはsegmentationとしています．度々，省略しています．
```
segmentation
├── /EdgeNets
│   ├── /vision_datasets
│   │   ├── create_data.ipynb <- データ生成用ノートブック
│   │   ├── /cityscapes
│   │   └── /human_city  <- 仮オリジナルデータ
│   │       ├── train.txt
│   │       ├── val.txt
│   │       ├── /train
│   │       │   ├── /rgb
│   │       │   └── /label
│   │       └── /val
│   │           ├── /rgb
│   │           └── /label
│   │
│   ├── /results_segmentation <- モデルの出力ディレクトリ
│   │   └── /human_city
│   ├── /result_images <- 着色画像の出力ディレクトリ
│   │   └── /human_city
│   │
│   ├── /sample_images <- サンプル画像
│   ├── train_segmentation.py
│   ├── test_segmentation.py
│   ├── custom_test_segmentation.py <- 新規作成
│   ├── custom_train_segmentation.py <- 新規作成
│   └── (省略)
└── ESPNetv2.ipynb <- 実行用ノートブック
```

## オリジナルデータの学習
### オリジナルデータの学習コードの作成
デフォルトのtrain_segmentation.pyではオリジナルデータでの学習に対応していないため，オリジナルデータに対応した`custom_train_segmentation.py`を作成します．<br>
train_segmentation.pyではそれぞれのデータセットのクラス数に自動で指定されるため，コマンドの引数で指定されるように変更します．<br>
また，miou_val, val_lossをエポックの度にtxtファイルに記述するようにしています．<br>
```python
# custom_train_segmentation.py

# ============================================
__author__ = "Sachin Mehta"
__license__ = "MIT"
__maintainer__ = "Sachin Mehta"
# ============================================

import argparse
import os
import torch
import torch.nn as nn
import torch.optim as optim
from utilities.utils import save_checkpoint, model_parameters, compute_flops
from utilities.train_eval_seg import train_seg as train
from utilities.train_eval_seg import val_seg as val
from torch.utils.tensorboard import SummaryWriter
from loss_fns.segmentation_loss import SegmentationLoss
import random
import math
import time
import numpy as np
from utilities.print_utils import *


def main(args):
    crop_size = args.crop_size
    assert isinstance(crop_size, tuple)
    print_info_message('Running Model at image resolution {}x{} with batch size {}'.format(crop_size[0], crop_size[1], args.batch_size))
    if not os.path.isdir(args.savedir):
        os.makedirs(args.savedir)
        
    if args.dataset == 'custom':
        from data_loader.segmentation.custom_dataset_loader import CustomSegmentationDataset
        train_dataset = CustomSegmentationDataset(root=args.data_path, train=True, crop_size=crop_size, scale=args.scale)
        val_dataset = CustomSegmentationDataset(root=args.data_path, train=False, crop_size=crop_size, scale=args.scale)
                         
        seg_classes = args.num_classes
        class_wts = torch.ones(seg_classes)
        
    else:
        print_error_message('Dataset: {} not yet supported'.format(args.dataset))
        exit(-1)

    print_info_message('Training samples: {}'.format(len(train_dataset)))
    print_info_message('Validation samples: {}'.format(len(val_dataset)))

    if args.model == 'espnetv2':
        from model.segmentation.espnetv2 import espnetv2_seg
        args.classes = seg_classes
        model = espnetv2_seg(args)
    elif args.model == 'dicenet':
        from model.segmentation.dicenet import dicenet_seg
        model = dicenet_seg(args, classes=seg_classes)
    else:
        print_error_message('Arch: {} not yet supported'.format(args.model))
        exit(-1)

    if args.finetune:
        if os.path.isfile(args.finetune):
            print_info_message('Loading weights for finetuning from {}'.format(args.finetune))
            weight_dict = torch.load(args.finetune, map_location=torch.device(device='cpu'))
            model.load_state_dict(weight_dict)
            print_info_message('Done')
        else:
            print_warning_message('No file for finetuning. Please check.')

    if args.freeze_bn:
        print_info_message('Freezing batch normalization layers')
        for m in model.modules():
            if isinstance(m, nn.BatchNorm2d):
                m.eval()
                m.weight.requires_grad = False
                m.bias.requires_grad = False

    num_gpus = torch.cuda.device_count()
    device = 'cuda' if num_gpus > 0 else 'cpu'

    train_params = [{'params': model.get_basenet_params(), 'lr': args.lr},
                    {'params': model.get_segment_params(), 'lr': args.lr * args.lr_mult}]

    optimizer = optim.SGD(train_params, momentum=args.momentum, weight_decay=args.weight_decay)

    num_params = model_parameters(model)
    flops = compute_flops(model, input=torch.Tensor(1, 3, crop_size[0], crop_size[1]))
    print_info_message('FLOPs for an input of size {}x{}: {:.2f} million'.format(crop_size[0], crop_size[1], flops))
    print_info_message('Network Parameters: {:.2f} million'.format(num_params))

    writer = SummaryWriter(log_dir=args.savedir, comment='Training and Validation logs')
    try:
        writer.add_graph(model, input_to_model=torch.Tensor(1, 3, crop_size[0], crop_size[1]))
    except:
        print_log_message("Not able to generate the graph. Likely because your model is not supported by ONNX")

    start_epoch = 0
    best_miou = 0.0
    if args.resume:
        if os.path.isfile(args.resume):
            print_info_message("=> loading checkpoint '{}'".format(args.resume))
            checkpoint = torch.load(args.resume, map_location=torch.device('cpu'))
            start_epoch = checkpoint['epoch']
            best_miou = checkpoint['best_miou']
            model.load_state_dict(checkpoint['state_dict'])
            optimizer.load_state_dict(checkpoint['optimizer'])
            print_info_message("=> loaded checkpoint '{}' (epoch {})"
                               .format(args.resume, checkpoint['epoch']))
        else:
            print_warning_message("=> no checkpoint found at '{}'".format(args.resume))

    #criterion = nn.CrossEntropyLoss(weight=class_wts, reduction='none', ignore_index=args.ignore_idx)
    criterion = SegmentationLoss(n_classes=seg_classes, loss_type=args.loss_type,
                         device=device, ignore_idx=args.ignore_idx,
                         class_wts=class_wts.to(device))

    if num_gpus >= 1:
        if num_gpus == 1:
            # for a single GPU, we do not need DataParallel wrapper for Criteria.
            # So, falling back to its internal wrapper
            from torch.nn.parallel import DataParallel
            model = DataParallel(model)
            model = model.cuda()
            criterion = criterion.cuda()
        else:
            from utilities.parallel_wrapper import DataParallelModel, DataParallelCriteria
            model = DataParallelModel(model)
            model = model.cuda()
            criterion = DataParallelCriteria(criterion)
            criterion = criterion.cuda()

        if torch.backends.cudnn.is_available():
            import torch.backends.cudnn as cudnn
            cudnn.benchmark = True
            cudnn.deterministic = True

    train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True,
                           pin_memory=True, num_workers=args.workers)
    val_loader = torch.utils.data.DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False,
                         pin_memory=True, num_workers=args.workers)

    if args.scheduler == 'fixed':
        step_size = args.step_size
        step_sizes = [step_size * i for i in range(1, int(math.ceil(args.epochs / step_size)))]
        from utilities.lr_scheduler import FixedMultiStepLR
        lr_scheduler = FixedMultiStepLR(base_lr=args.lr, steps=step_sizes, gamma=args.lr_decay)
    elif args.scheduler == 'clr':
        step_size = args.step_size
        step_sizes = [step_size * i for i in range(1, int(math.ceil(args.epochs / step_size)))]
        from utilities.lr_scheduler import CyclicLR
        lr_scheduler = CyclicLR(min_lr=args.lr, cycle_len=5, steps=step_sizes, gamma=args.lr_decay)
    elif args.scheduler == 'poly':
        from utilities.lr_scheduler import PolyLR
        lr_scheduler = PolyLR(base_lr=args.lr, max_epochs=args.epochs, power=args.power)
    elif args.scheduler == 'hybrid':
        from utilities.lr_scheduler import HybirdLR
        lr_scheduler = HybirdLR(base_lr=args.lr, max_epochs=args.epochs, clr_max=args.clr_max,
                        cycle_len=args.cycle_len)
    elif args.scheduler == 'linear':
        from utilities.lr_scheduler import LinearLR
        lr_scheduler = LinearLR(base_lr=args.lr, max_epochs=args.epochs)
    else:
        print_error_message('{} scheduler Not supported'.format(args.scheduler))
        exit()

    print_info_message(lr_scheduler)

    with open(args.savedir + os.sep + 'arguments.json', 'w') as outfile:
        import json
        arg_dict = vars(args)
        arg_dict['model_params'] = '{} '.format(num_params)
        arg_dict['flops'] = '{} '.format(flops)
        json.dump(arg_dict, outfile)

    extra_info_ckpt = '{}_{}_{}'.format(args.model, args.s, crop_size[0])
    
    # val log txtfile
    txt_outpath = os.path.join(args.savedir, 'val_logs.txt')
    txt_outfile = open(txt_outpath, "w")
    txt_outfile.write('epoch, miou_val, val_loss\n')
    
    for epoch in range(start_epoch, args.epochs):
        lr_base = lr_scheduler.step(epoch)
        # set the optimizer with the learning rate
        # This can be done inside the MyLRScheduler
        lr_seg = lr_base * args.lr_mult
        optimizer.param_groups[0]['lr'] = lr_base
        optimizer.param_groups[1]['lr'] = lr_seg

        print_info_message(
            'Running epoch {} with learning rates: base_net {:.6f}, segment_net {:.6f}'.format(epoch, lr_base, lr_seg))
        miou_train, train_loss = train(model, train_loader, optimizer, criterion, seg_classes, epoch, device=device)
        miou_val, val_loss = val(model, val_loader, criterion, seg_classes, device=device)
        
        # write txtfile
        print('epoch, miou_val, val_loss')
        print('{},{:.2f}, {:.6f}'.format(epoch, miou_val, val_loss))
        txt_outfile.write('{},{:.2f}, {:.6f}\n'.format(epoch, miou_val, val_loss))

        # remember best miou and save checkpoint
        is_best = miou_val > best_miou
        best_miou = max(miou_val, best_miou)

        weights_dict = model.module.state_dict() if device == 'cuda' else model.state_dict()
        save_checkpoint({
            'epoch': epoch + 1,
            'arch': args.model,
            'state_dict': weights_dict,
            'best_miou': best_miou,
            'optimizer': optimizer.state_dict(),
        }, is_best, args.savedir, extra_info_ckpt)

        writer.add_scalar('Segmentation/LR/base', round(lr_base, 6), epoch)
        writer.add_scalar('Segmentation/LR/seg', round(lr_seg, 6), epoch)
        writer.add_scalar('Segmentation/Loss/train', train_loss, epoch)
        writer.add_scalar('Segmentation/Loss/val', val_loss, epoch)
        writer.add_scalar('Segmentation/mIOU/train', miou_train, epoch)
        writer.add_scalar('Segmentation/mIOU/val', miou_val, epoch)
        writer.add_scalar('Segmentation/Complexity/Flops', best_miou, math.ceil(flops))
        writer.add_scalar('Segmentation/Complexity/Params', best_miou, math.ceil(num_params))

    writer.close()
    txt_outfile.close()


if __name__ == "__main__":
    from commons.general_details import segmentation_models, segmentation_schedulers, segmentation_loss_fns, \
        segmentation_datasets

    parser = argparse.ArgumentParser()
    parser.add_argument('--resume', type=str, default=None, help='path to checkpoint to resume from')
    parser.add_argument('--workers', type=int, default=4, help='number of data loading workers')
    parser.add_argument('--ignore-idx', type=int, default=255, help='Index or label to be ignored during training')

    # model details
    parser.add_argument('--freeze-bn', action='store_true', default=False, help='Freeze BN params or not')

    # dataset and result directories
    parser.add_argument('--dataset', type=str, default='pascal', choices=['custom'], help='Datasets')
    parser.add_argument('--data-path', type=str, default='', help='dataset path')
    parser.add_argument('--coco-path', type=str, default='', help='MS COCO dataset path')
    parser.add_argument('--savedir', type=str, default='./results_segmentation', help='Location to save the results')
    ## only for cityscapes
    parser.add_argument('--coarse', action='store_true', default=False, help='Want to use coarse annotations or not')

    # scheduler details
    parser.add_argument('--scheduler', default='hybrid', choices=segmentation_schedulers,
                        help='Learning rate scheduler (fixed, clr, poly)')
    parser.add_argument('--epochs', type=int, default=100, help='num of training epochs')
    parser.add_argument('--step-size', default=51, type=int, help='steps at which lr should be decreased')
    parser.add_argument('--lr', default=9e-3, type=float, help='initial learning rate')
    parser.add_argument('--lr-mult', default=10.0, type=float, help='initial learning rate')
    parser.add_argument('--lr-decay', default=0.5, type=float, help='factor by which lr should be decreased')
    parser.add_argument('--momentum', default=0.9, type=float, help='momentum')
    parser.add_argument('--weight-decay', default=4e-5, type=float, help='weight decay (default: 4e-5)')
    # for Polynomial LR
    parser.add_argument('--power', default=0.9, type=float, help='power factor for Polynomial LR')

    # for hybrid LR
    parser.add_argument('--clr-max', default=61, type=int, help='Max number of epochs for cylic LR before '
                                  'changing last cycle to linear')
    parser.add_argument('--cycle-len', default=5, type=int, help='Duration of cycle')

    # input details
    parser.add_argument('--batch-size', type=int, default=40, help='list of batch sizes')
    parser.add_argument('--crop-size', type=int, nargs='+', default=[256, 256],
                        help='list of image crop sizes, with each item storing the crop size (should be a tuple).')
    parser.add_argument('--loss-type', default='ce', choices=segmentation_loss_fns, help='Loss function (ce or miou)')

    # model related params
    parser.add_argument('--s', type=float, default=2.0, help='Factor by which channels will be scaled')
    parser.add_argument('--model', default='espnet', choices=segmentation_models,
                        help='Which model? basic= basic CNN model, res=resnet style)')
    parser.add_argument('--channels', default=3, type=int, help='Input channels')
    parser.add_argument('--num-classes', default=1000, type=int,
                        help='ImageNet classes. Required for loading the base network')
    parser.add_argument('--finetune', default='', type=str, help='Finetune the segmentation model')
    parser.add_argument('--model-width', default=224, type=int, help='Model width')
    parser.add_argument('--model-height', default=224, type=int, help='Model height')

    args = parser.parse_args()

    random.seed(1882)
    torch.manual_seed(1882)
        
    if args.dataset == 'custom':
        if args.crop_size[0] == 512:
            args.scale = (0.25, 0.5)
        elif args.crop_size[0] == 1024:
            args.scale = (0.35, 1.0)
        elif args.crop_size[0] == 2048:
            args.scale = (1.0, 2.0)
        else:
            print_error_message('Select image size from 512x256, 1024x512, 2048x1024')
        print_log_message('Using scale = ({}, {})'.format(args.scale[0], args.scale[1]))
        
    else:
        print_error_message('{} dataset not yet supported'.format(args.dataset))

    if not args.finetune:
        from model.weight_locations.classification import model_weight_map

        weight_file_key = '{}_{}'.format(args.model, args.s)
        assert weight_file_key in model_weight_map.keys(), '{} does not exist'.format(weight_file_key)
        args.weights = model_weight_map[weight_file_key]
    else:
        args.weights = ''
        assert os.path.isfile(args.finetune), '{} weight file does not exist'.format(args.finetune)

    assert len(args.crop_size) == 2, 'crop-size argument must contain 2 values'
    assert args.data_path != '', 'Dataset path is an empty string. Please check.'

    args.crop_size = tuple(args.crop_size)
    timestr = time.strftime("%Y%m%d-%H%M%S")
    args.savedir = '{}/model_{}_{}/s_{}_sch_{}_loss_{}_res_{}_sc_{}_{}/{}'.format(args.savedir, args.model, args.dataset, args.s,
                               args.scheduler,
                               args.loss_type, args.crop_size[0], args.scale[0], args.scale[1], timestr)
    main(args)
```


### オリジナルデータの学習(第1段階)
最初の段階では、低解像度の画像を入力として使用して、より大きなバッチサイズに合わせることができます。<br>
モデルは，`./results_segmentation/human_city`に出力されます．<br>
`--num-classes`でクラス数を指定することを忘れずに．
```python
%cd /content/drive/My\ Drive/segmentation/EdgeNets

# original dataset
!CUDA_VISIBLE_DEVICES=0 python custom_train_segmentation.py \
                        --model espnetv2 --s 2.0 \
                        --dataset custom \
                        --savedir ./results_segmentation/human_city \
                        --data-path ./vision_datasets/human_city/ \
                        --batch-size 25 \
                        --crop-size 512 256 \
                        --num-classes 2 \
                        --lr 0.009 --scheduler hybrid --clr-max 61 --epochs 50
```

### オリジナルデータの学習(第2段階)
第2段階では、バッチ正規化レイヤーをフリーズしてから、わずかに高い画像解像度で微調整します。<br>
--finetuneでは，第1段階で出力した学習モデルを指定します．<br>
ここでも，`--num-classes`でクラス数を指定することを忘れずに．
```python
# original dataset
!CUDA_VISIBLE_DEVICES=0 python custom_train_segmentation.py \
                        --model espnetv2 --s 2.0 \
                        --dataset custom \
                        --savedir ./results_segmentation/human_city0318 \
                        --data-path ./vision_datasets/human_city/ \
                        --batch-size 6 \
                        --crop-size 1024 512 \
                        --lr 0.005 --scheduler hybrid --clr-max 61\
                        --epochs 25 \
                        --freeze-bn \
                        --num-classes 2 \
                        --finetune ./results_segmentation/human_city/model_espnetv2_custom/s_2.0_sch_hybrid_loss_ce_res_512_sc_0.25_0.5/＊＊＊＊/espnetv2_2.0_512_best.pth

```


## オリジナルデータモデルのテスト
### テストの実行
オリジナルデータで学習したモデルで/sample_dataの画像でsegmentationを実施しました．<br>
以下のコマンドで実行できます．
```python
%cd /content/drive/My\ Drive/segmentation/EdgeNets
!CUDA_VISIBLE_DEVICES=0 python custom_test_segmentation.py \
                        --model espnetv2 \
                        --s 2.0 \
                        --dataset custom \
                        --data-path ./sample_images/ \
                        --split custom \
                        --im-size 1024 512\
                        --num-classes 2 \
                        --weights-test ./results_segmentation/human_city0318/model_espnetv2_custom/s_2.0_sch_hybrid_loss_ce_res_1024_sc_0.35_1.0/＊＊＊＊/espnetv2_2.0_1024_best.pth \
                        --savedir-name sample_images_org
```

### テスト結果
Cityscapesデータセットの人は立っている状態ばかりなので，立っている人は着色されていますが，座っている人は着色されませんでした．<br>
学習データに入っていないので当然ですが，このようにはっきり形となって出ると，面白いです．<br>
<br>
立っている人の画像<br>
![](/image/org_seg1.png)<br>
<br>
座っている人の画像<br>
![](/image/org_seg2.png)

## まとめ
本稿ではCityscapesデータセットから人のみを抽出した仮のオリジナルデータで学習を実施しました．<br>
次回から，セグメンテーションしてクロマキー合成を実施したいです．


## 参考サイト
[sacmehta/EdgeNets](https://github.com/sacmehta/EdgeNets)<br>
[sacmehta/EdgeNets/README_Segmentation.md](https://github.com/sacmehta/EdgeNets/blob/master/README_Segmentation.md)
[ESPNetで自作データセットを学習してセグメンテーション](https://qiita.com/tokyokuma/items/37b1370ea7c84399fbb9)<br>
[【python/OpenCV】画像の特定の色を抽出する方法](https://rikoubou.hatenablog.com/entry/2019/02/21/190310)<br>
[PIL/Pillowで画像の色を高速に置換する](https://qiita.com/pashango2/items/d6dda5f07109ee5b6163)<br>
[【OpenCV】 forループを使わずに指定した色を別の色に変更する](http://ni4muraano.hatenablog.com/entry/2017/05/15/000000)