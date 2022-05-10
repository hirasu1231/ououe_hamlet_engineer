---
display: home
title: 'Pythonを使って気象庁でウェブスクレイピングを実施する(都心部+地方部編)'
description: Pythonを使って気象庁でウェブスクレイピングを実施します．
date: 2022-3-10
image: https://www.hamlet-engineer.com/image/jma_logo.png
categories: 
  - Python
tags:
  - Python
  - ウェブスクレイピング
---
Pythonを使って気象庁でウェブスクレイピングを実施します(都心部+地方部編)．

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ウェブスクレイピングの実行
気象庁のデータは，17項目の表と8項目の表の2つがあるので，URLからそれらを判断してスクレイピングします．

### ウェブスクレイピング
```python
# -*- coding: utf-8 -*-
import os
import datetime
import csv
import urllib.request
from bs4 import BeautifulSoup

def str2float(weather_data):
    try:
        return float(weather_data)
    except:
        return 0

# tds[9]：風速, tds[15]：雲量
def str_fillna(weather_data):
    try:
        if len(weather_data)==0:
            return '-'
        return str(weather_data)
    except:
        return '-'

def scraping_tds17(url, date):
    # 気象データのページを取得
    html = urllib.request.urlopen(url).read()
    soup = BeautifulSoup(html)
    trs = soup.find("table", { "class" : "data2_s" })

    data_list = []
    data_list_per_hour = []

    # table の中身を取得
    for tr in trs.findAll('tr')[2:]:
        tds = tr.findAll('td')

        if tds[1].string == None:
            break;
        
        # 時刻
        hour = tds[0].string
        # 1/1 24:00 -> 1/2 0:00
        if hour == "24":
            date = date + datetime.timedelta(1)
            hour = "0"

        data_list.append(date)
        data_list.append(hour)
        data_list.append(str2float(tds[1].string))
        data_list.append(str2float(tds[2].string))
        data_list.append(str2float(tds[3].string))
        data_list.append(str2float(tds[4].string))
        data_list.append(str2float(tds[5].string))
        data_list.append(str2float(tds[6].string))
        data_list.append(str2float(tds[7].string))
        data_list.append(str2float(tds[8].string))
        data_list.append(str_fillna(tds[9].string))
        data_list.append(str2float(tds[10].string))
        data_list.append(str2float(tds[11].string))
        data_list.append(str2float(tds[12].string))
        data_list.append(str2float(tds[13].string))
        
        # data_list.append(str2float(tds[14].string))
        data_list.append(str_fillna(tds[15].string))
        data_list.append(str2float(tds[16].string))

        data_list_per_hour.append(data_list)

        data_list = []

    return data_list_per_hour

def scraping_tds8(url, date):
    # 気象データのページを取得
    html = urllib.request.urlopen(url).read()
    soup = BeautifulSoup(html)
    trs = soup.find("table", { "class" : "data2_s" })

    data_list = []
    data_list_per_hour = []

    # table の中身を取得
    for tr in trs.findAll('tr')[2:]:
        tds = tr.findAll('td')
        
        if tds[1].string == None:
            break;
        
        # 時刻
        hour = tds[0].string
        # 1/1 24:00 -> 1/2 0:00
        if hour == "24":
            date = date + datetime.timedelta(1)
            hour = "0"
            
        data_list.append(date)
        data_list.append(hour)
        data_list.append(str2float(tds[1].string))
        data_list.append(str2float(tds[2].string))
        data_list.append(str2float(tds[3].string))
        data_list.append(str_fillna(tds[4].string))
        data_list.append(str2float(tds[5].string))
        data_list.append(str2float(tds[6].string))
        data_list.append(str2float(tds[7].string))

        data_list_per_hour.append(data_list)

        data_list = []

    return data_list_per_hour
```

### ウェブスクレイピングの実行
```python
def create_csv():
    # CSV 出力先ディレクトリ
    output_dir = "./"

    # 出力ファイル名
    output_file = "tokyo_jma.csv"

    # データ取得開始・終了日
    # 満空データ ：　2020/11/26/12:00 ~ 2021-10-25/03:00
    # 気象庁で補完：2019/7/01/00:00 〜 2020/11/26/12:00
    start_date = datetime.date(2021, 3, 19)
    end_date   = datetime.date(2021, 3, 20)
    
    # CSV の列
    # fields17 = ["年月日", "時間", "気圧（現地）", "気圧（海面）",
    #             "降水量", "気温", "露点湿度", "蒸気圧", "湿度",
    #             "風速", "風向", "日照時間", "全天日射量", "降雪", "積雪", 雲量、視程] # 天気、は今回は対象外とする
    fields17 = ["date", "hour", "pressure_land", "pressure_sea",
              "precipitation", "temperature", "dew_temperature", "vapor_pressure", 
              "humidity", "wind_speed", "wind_direction", "daylight_hours", 
              "solar_radiation", "snowfall", "snow_cover", 
              "cloudage", "visibility"] # 天気は今回は対象外とする
    
    # fields08 = ["年月日", "時間", "降水量", "気温", 
    #           "風速", "風向", "日照時間", "降雪", "積雪"]
    fields08 = ["date", "hour", "precipitation", "temperature",
                "wind_speed", "wind_direction", "daylight_hours", 
                "snowfall", "snow_cover"] # 天気は今回は対象外とする

    with open(os.path.join(output_dir, output_file), 'w') as f:
        date = start_date
        flag = 0
        while date != end_date + datetime.timedelta(1):

            # 対象url（今回は東京）
            #url = "http://www.data.jma.go.jp/obd/stats/etrn/view/hourly_s1.php?" \
            #      "prec_no=44&block_no=47662&year=%d&month=%d&day=%d&view="%(date.year, date.month, date.day)
            url = "https://www.data.jma.go.jp/obd/stats/etrn/view/hourly_a1.php?" \
                  "prec_no=44&block_no=0371&year=%d&month=%d&day=%d&view="%(date.year, date.month, date.day)
            
            # 17項目
            if 'hourly_s1' in url:
                if not flag:
                    writer = csv.writer(f, lineterminator='\n')
                    writer.writerow(fields17)
                # スクレイピング実行
                data_per_day = scraping_tds17(url, date)
            # 8項目
            elif 'hourly_a1' in url:
                if not flag:
                    writer = csv.writer(f, lineterminator='\n')
                    writer.writerow(fields08)
                # スクレイピング実行
                data_per_day = scraping_tds8(url, date)
                
            # csvへ格納
            for dpd in data_per_day:
                writer.writerow(dpd)

            date += datetime.timedelta(1)
            flag = 1

if __name__ == '__main__':
    create_csv()
```


## まとめ
Pythonを使っている気象庁でウェブスクレイピングを実施しました(都心部+地方部編)．

## 参考サイト
[気象データを Python でスクレイピングする方法](https://www.gis-py.com/entry/scraping-weather-data)

[東京　2021年3月19日 過去の気象データ](https://www.data.jma.go.jp/obd/stats/etrn/view/hourly_s1.php?prec_no=44&block_no=47662&year=2021&month=3&day=19&view=)

[羽田　2021年3月19日 過去の気象データ](https://www.data.jma.go.jp/obd/stats/etrn/view/hourly_a1.php?prec_no=44&block_no=0371&year=2021&month=03&day=19&view=)


<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


