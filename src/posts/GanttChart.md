---
display: home
title: 'Pythonでガントチャートの作成する'
description: Pandasでガントチャートの作成します。
date: 2023-1-20
image: https://www.hamlet-engineer.com/image/gant4.png
categories: 
  - Python
tags:
  - memo
  - Python
  - Pandas
  - Plotly
---
Pandasでガントチャートの作成します。

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/gantt_charts.png.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ライブラリのインストール
下記のコマンドを実行して再起動する

```python
!pip install plotly
!pip install plotly_express
!jupyter labextension install @jupyterlab/plotly-extension
```

## ガントチャートの作成

### 単純プロット

```python
import pandas as pd
import plotly.express as px
import plotly.io as pio
# pxでガントチャートを作成
# そのまま作成すると縦軸が上下逆さまに
# ガントチャートを作成するデータフレーム
df = pd.DataFrame([
    dict(
        Task='Job A',  # ジョブの名称
        Start='2022-01-01',  # 開始日
        Finish='2022-02-28',  # 終了日
    ),
    dict(
        Task='Job B',
        Start='2022-03-05',  # 開始日
        Finish='2022-04-15',  # 終了日
    ),
    dict(
        Task='Job C',
        Start='2022-02-20',  # 開始日
        Finish='2022-05-30',  # 終了日
    )
])
print(df)
#     Task       Start      Finish
# 0  Job A  2022-01-01  2022-02-28
# 1  Job B  2022-03-05  2022-04-15
# 2  Job C  2022-02-20  2022-05-30

fig = px.timeline(
    df,  # 使用するデータフレーム
    x_start='Start', x_end='Finish',  # 横軸の開始・終了の列名
    y='Task',  # 縦軸の列名
)
# グラフ全体とホバーのフォントサイズ変更
fig.update_layout(font_size=20, hoverlabel_font_size=20)
fig.show()

# # グラフ保存
# prefix = 'plotly-gantt-charts'  # 保存ファイル名の接頭辞
# save_name = f"{prefix}_simple"
# pio.orca.config.executable = '/Applications/orca.app/Contents/MacOS/orca'
# pio.write_html(fig, f"{save_name}.html")
# pio.write_image(fig, f"{save_name}.png")
```

![](/image/gant1.png)

### 判例によって色分けプロット

```python
import pandas as pd
import plotly.express as px
import plotly.io as pio
# colorで色分けする（人名、リソース）
# ガントチャートを作成するデータフレーム
df = pd.DataFrame([
    dict(
        Task='Job A',  # ジョブの名称
        Start='2022-01-01', Finish='2022-02-28',  # 開始年と終了年
        Resource='Alex',  # リソース名
        Time=60, # 作業時間
        People=3, # 人工
    ),
    dict(
        Task='Job B',
        Start='2022-03-05', Finish='2022-04-15',
        Resource='Alex',  # リソース名
        Time=60, # 作業時間
        People=3, # 人工
    ),
    dict(
        Task='Job C',
        Start='2022-02-20', Finish='2022-05-30',
        Resource='Max',  # リソース名
        Time=60, # 作業時間
        People=3, # 人工
    )
])
print(df)
#     Task       Start      Finish Resource  Time  People
# 0  Job A  2022-01-01  2022-02-28     Alex    60       3
# 1  Job B  2022-03-05  2022-04-15     Alex    60       3
# 2  Job C  2022-02-20  2022-05-30      Max    60       3
fig = px.timeline(
    df,  # 使用するデータフレーム
    x_start='Start', x_end='Finish',  # 横軸の開始・終了の列名
    y='Task',  # 縦軸の列名
    color='Resource',  # 色分けをリソースにする
)
# グラフ全体とホバーのフォントサイズ変更
fig.update_layout(font_size=20, hoverlabel_font_size=20)
# 縦軸の向きを逆にする
fig.update_yaxes(autorange='reversed')
fig.show()
# # グラフ保存
# prefix = 'plotly-gantt-charts'  # 保存ファイル名の接頭辞
# save_name = f"{prefix}_color_Resource"
# pio.orca.config.executable = '/Applications/orca.app/Contents/MacOS/orca'
# pio.write_html(fig, f"{save_name}.html")
# pio.write_image(fig, f"{save_name}.png")
```

![](/image/gant2.png)

### 判例によって任意の色分けプロット

```python
import pandas as pd
import plotly.express as px
import plotly.io as pio
# color_discrete_sequenceで色を変更
# ガントチャートを作成するデータフレーム
df = pd.DataFrame([
    dict(
        Task='Job A',  # ジョブの名称
        Start='2022-01-01', Finish='2022-02-28',  # 開始年と終了年
        Resource='Alex',  # リソース名
        Time=60, # 作業時間
        People=3, # 人工
    ),
    dict(
        Task='Job B',
        Start='2022-03-05', Finish='2022-04-15',
        Resource='Alex',  # リソース名
        Time=60, # 作業時間
        People=3, # 人工
    ),
    dict(
        Task='Job C',
        Start='2022-02-20', Finish='2022-05-30',
        Resource='Max',  # リソース名
        Time=60, # 作業時間
        People=3, # 人工
    )
])
print(df)
#     Task       Start      Finish Resource  Time  People
# 0  Job A  2022-01-01  2022-02-28     Alex    60       3
# 1  Job B  2022-03-05  2022-04-15     Alex    60       3
# 2  Job C  2022-02-20  2022-05-30      Max    60       3
fig = px.timeline(
    df,  # 使用するデータフレーム
    x_start='Start', x_end='Finish',  # 横軸の開始・終了の列名
    y='Task',  # 縦軸の列名
    color='Resource',  # 色分けをリソースにする
    # 色の変更。余った色は反映されない
    color_discrete_sequence=('violet', 'orange', 'green')
)
# グラフ全体とホバーのフォントサイズ変更
fig.update_layout(font_size=20, hoverlabel_font_size=20)
# 縦軸の向きを逆にする
fig.update_yaxes(autorange='reversed')
fig.show()
# # グラフ保存
# prefix = 'plotly-gantt-charts'  # 保存ファイル名の接頭辞
# save_name = f"{prefix}_color_discrete_sequence"
# pio.orca.config.executable = '/Applications/orca.app/Contents/MacOS/orca'
# pio.write_html(fig, f"{save_name}.html")
# pio.write_image(fig, f"{save_name}.png")
```

![](/image/gant3.png)

### 任意の情報も付属させる

```python
import pandas as pd
import plotly.express as px
import plotly.io as pio
# color_discrete_sequenceで色を変更
# ガントチャートを作成するデータフレーム
df = pd.DataFrame([
    dict(
        Task='Job A',  # ジョブの名称
        Start='2022-01-01', Finish='2022-02-28',  # 開始年と終了年
        Resource='Alex',  # リソース名
        Time=60, # 作業時間
        People=3, # 人工
    ),
    dict(
        Task='Job B',
        Start='2022-03-05', Finish='2022-04-15',
        Resource='Alex',  # リソース名
        Time=60, # 作業時間
        People=3, # 人工
    ),
    dict(
        Task='Job C',
        Start='2022-02-20', Finish='2022-05-30',
        Resource='Max',  # リソース名
        Time=60, # 作業時間
        People=3, # 人工
    )
])
print(df)
#     Task       Start      Finish Resource  Time  People
# 0  Job A  2022-01-01  2022-02-28     Alex    60       3
# 1  Job B  2022-03-05  2022-04-15     Alex    60       3
# 2  Job C  2022-02-20  2022-05-30      Max    60       3
fig = px.timeline(
    df,  # 使用するデータフレーム
    x_start='Start', x_end='Finish',  # 横軸の開始・終了の列名
    y='Task',  # 縦軸の列名
    color='Resource',  # 色分けをリソースにする
    # 色の変更。余った色は反映されない
    color_discrete_sequence=('violet', 'orange', 'green'),
    hover_data=df[["Time", "People"]] # グラフに情報を付与
)
# グラフ全体とホバーのフォントサイズ変更
fig.update_layout(font_size=20, hoverlabel_font_size=20)
# 縦軸の向きを逆にする
fig.update_yaxes(autorange='reversed')
fig.show()
# # グラフ保存
# prefix = 'plotly-gantt-charts'  # 保存ファイル名の接頭辞
# save_name = f"{prefix}_color_discrete_sequence"
# pio.orca.config.executable = '/Applications/orca.app/Contents/MacOS/orca'
# pio.write_html(fig, f"{save_name}.html")
# pio.write_image(fig, f"{save_name}.png")
```

![](/image/gant4.png)

## まとめ
Pandasでガントチャートの作成しました．

## 参考サイト
[Python ガントチャートの作成](https://megatenpa.com/python/plotly/px/gantt-charts/)

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


