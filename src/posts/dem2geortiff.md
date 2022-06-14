---
display: home
title: 'PythonでDEMのXMLファイルをgeotiffファイルに変換する'
description: PythonでDEMのXMLファイルをgeotiffファイルに変換します．
date: 2022-6-17
image: https://www.hamlet-engineer.com/image/hyogo_dsm_3d.png
categories: 
  - GIS
tags:
  - Python
  - GIS
  - DEM
  - geotiff
---
PythonでDEMのXMLファイルをgeotiffファイルに変換します．

<!-- https://www.hamlet-engineer.com -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## ライブラリのインストール
下記のコードでライブラリをインストールします．
```python
!sudo apt-get install python-gdal python3-gdal
!sudo apt-get update
!sudo apt-get install -y build-essential
!sudo apt-get install -y gdal-bin
!sudo apt-get install -y libgdal-dev
```

```python
!gdal-config --version
!pip install setuptools==57.4.0
!pip install GDAL==$(gdal-config --version) --global-option=build_ext --global-option="-I/usr/include/gdal"
```

## geotiffファイルの変換
下記のコードでgeotiffファイルへ変換します.

```python
%%writefile zdem2tif.py
import os
import sys
import zipfile
import numpy as np
import xml.etree.ElementTree as et
import osgeo.gdal
import osgeo.osr


class XMLContents(object):
    def __init__(self):
        self.ns = {
                   'ns': 'http://fgd.gsi.go.jp/spec/2008/FGD_GMLSchema',
                   'gml': 'http://www.opengis.net/gml/3.2',
                   'xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                   'xlink': 'http://www.w3.org/1999/xlink'
                   }

    def read_xml(self, zf, filename, dem_mode):
        if dem_mode == 'DEM10':
            self.posix = 0
            self.posiy = 0
        elif dem_mode == 'DEM5':
            _split = os.path.basename(filename).split('-')
            self.posix = int(_split[4][1])
            self.posiy = int(_split[4][0])

        with zf.open(filename, 'r') as file:
            self.text = file.read().decode('utf_8')
            self.root = et.fromstring(self.text)
            self.dem = self.root.find('ns:DEM', self.ns)
            self.coverage = self.dem.find('ns:coverage', self.ns)
            self.envelope = self.coverage.find(
                'gml:boundedBy//gml:Envelope', self.ns)
            self.lower = self.envelope.find('gml:lowerCorner', self.ns).text
            self.upper = self.envelope.find('gml:upperCorner', self.ns).text
            self.grid = self.coverage.find(
                'gml:gridDomain//gml:Grid//gml:limits//gml:GridEnvelope', self.ns)
            self.low = self.grid.find('gml:low', self.ns).text
            self.high = self.grid.find('gml:high', self.ns).text
            self.tuplelist = self.coverage.find(
                'gml:rangeSet//gml:DataBlock//gml:tupleList', self.ns).text
            self.gridfunc = self.coverage.find(
                'gml:coverageFunction//gml:GridFunction', self.ns)
            self.rule = self.gridfunc.find('gml:sequenceRule', self.ns)
            self.start = self.gridfunc.find('gml:startPoint', self.ns).text

            if self.rule.attrib['order'] != '+x-y':
                print('warning sequence order not +x-y')
            if self.rule.text != 'Linear':
                print('warning sequence rule not Linear')

            file.close()


class DEMInArray(object):
    def __init__(self, contents):
        self._noValue = -1.
        self.llat, self.llon = np.array(
            contents.lower.split(' '), dtype=np.float64)
        self.ulat, self.ulon = np.array(
            contents.upper.split(' '), dtype=np.float64)
        self.lowx, self.lowy = np.array(
            contents.low.split(' '), dtype=np.int)
        self.highx, self.highy = np.array(
            contents.high.split(' '), dtype=np.int)
        self.sizex, self.sizey = self.get_size()
        self.x_init, self.y_init = np.array(
            contents.start.split(' '), dtype=np.int)
        self.datapoints = contents.tuplelist.splitlines()
        self.raster = self.get_raster()

    def get_size(self):
        sizex = self.highx - self.lowx + 1
        sizey = self.highy - self.lowy + 1
        return sizex, sizey

    def get_raster(self):
        _x, _y = self.x_init, self.y_init
        raster = np.zeros([self.sizey, self.sizex])
        raster.fill(self._noValue)
        for dp in self.datapoints:
            if _y > self.highy:
                print('DEM datapoints are unexpectedly too long')
                break
            s = dp.split(',')
            if len(s) == 1:
                continue
            desc, value = s[0], np.float64(s[1])
            # if desc == '地表面':
            raster[_y, _x] = value if value > -9998 else self._noValue
            _x += 1
            if _x > self.highx:
                _x = 0
                _y += 1
        return raster


class DEMOutArray(object):
    def __init__(self):
        self._fillValue = -9999.

    def initialize_raster(self):
        raster = np.zeros([self.sizey, self.sizex])
        raster.fill(self._fillValue)
        return raster

    def get_trans(self):
        # +x-y
        return [self.llon, self.resx, 0, self.ulat, 0, -self.resy]

    def update_raster(self, tile, posiy, posix):
        xmin = posix * tile.shape[1]
        ymin = posiy * tile.shape[0]
        xmax = xmin + tile.shape[1]
        ymax = ymin + tile.shape[0]
        self.raster[ymin:ymax, xmin:xmax] = tile[::-1]

    def get_size(self):
        sizex = (self.highx - self.lowx + 1) * self.tilex
        sizey = (self.highy - self.lowy + 1) * self.tiley
        return sizex, sizey

    def mesh_info_from_zipname(self, zipname):
        '''
        Ref: Table 4 of https://www.stat.go.jp/data/mesh/pdf/gaiyo1.pdf
        '''
        _split = os.path.basename(zipname).split('-')
        _lat1 = int(_split[2][:2])
        _lon1 = int(_split[2][2:])
        _lat2 = int(_split[3][0])
        _lon2 = int(_split[3][1])
        self.llat = _lat1 * 0.66666666666 + _lat2 * 0.08333333333
        self.llon = _lon1 + 100. + _lon2 * 0.125
        self.ulat = self.llat + 0.08333333333
        self.ulon = self.llon + 0.125

        if _split[4][:5] == 'DEM10':
            self.mode = 'DEM10'
            self.tilex, self.tiley = 1, 1
            self.lowx, self.lowy = 0, 0
            self.highx, self.highy = 1124, 749
            self.sizex, self.sizey = self.get_size()
            self.resx, self.resy = 1.1111111111e-04, 1.1111111111e-04
        elif _split[4][:4] == 'DEM5':
            self.mode = 'DEM5'
            self.tilex, self.tiley = 10, 10
            self.lowx, self.lowy = 0, 0
            self.highx, self.highy = 224, 149
            self.sizex, self.sizey = self.get_size()
            self.resx, self.resy = 5.5555555555e-05, 5.5555555555e-05
        else:
            raise ValueError('Unexpected definition of DEM:', _split[4])

        self.raster = self.initialize_raster()

    def save_raster(self, out_filename):
        trans = self.get_trans()
        srs = osgeo.osr.SpatialReference()
        srs.ImportFromEPSG(4612)
        driver = osgeo.gdal.GetDriverByName('GTiff')
        output = driver.Create(out_filename, self.sizex, self.sizey,
                               1, osgeo.gdal.GDT_Float32)
#         output.GetRasterBand(1).WriteArray(self.raster) <- 修正@2020.06.10
        output.GetRasterBand(1).WriteArray(self.raster[::-1])
        output.GetRasterBand(1).SetNoDataValue(self._fillValue)
        output.SetGeoTransform(trans)
        output.SetProjection(srs.ExportToWkt())
        output.FlushCache()


def convert(in_filename, out_filename):
    output_array = DEMOutArray()
    output_array.mesh_info_from_zipname(in_filename)
    dem_mode = output_array.mode

    with zipfile.ZipFile(in_filename, 'r') as zf:
        filelist = zf.namelist()
        for filename in filelist:
            print('loading', filename)
            contents = XMLContents()
            contents.read_xml(zf, filename, dem_mode)
            posix, posiy = contents.posix, contents.posiy
            dem_tile = DEMInArray(contents)
            output_array.update_raster(dem_tile.raster, posiy, posix)
        zf.close()
    print('save', out_filename)
    output_array.save_raster(out_filename)


def main(argv):
    for i in range(1, len(argv)):
        convert(argv[i], argv[i].replace('.zip', '.tif'))


if __name__ == '__main__':
    main(sys.argv)
```

## geotiffファイルの変換実行
下記のコードでgeotiffファイルへ変換を実行します.

```python
!python zdem2tif.py ../kure_city_data/geograph/dem/5Mmesh_zip/FG-GML-5132-03-DEM5A.zip \

                    ../kure_city_data/geograph/dem/5Mmesh_zip/FG-GML-5132-36-DEM5B.zip
```

## まとめ
PythonでDEMのXMLファイルをgeotiffファイルに変換しました．

## 参考サイト
[Pythonを用いた基盤地図情報 数値標高データのgeotiff変換](https://qiita.com/HidKamiya/items/66b1d98503301446460c)

[急にpip installで一部のライブラリのインストールが失敗するようになった件](https://qiita.com/nkmr_RL/items/85edc2ee68c01ec5582e)




<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


