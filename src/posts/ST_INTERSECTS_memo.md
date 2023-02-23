---
display: home
title: 'BigQueryでST_INTERSECTSを使って苦労した話'
description: BigQueryでST_INTERSECTSを使って苦労したことを綴ります。
date: 2023-2-24
image: https://www.hamlet-engineer.com/image/gbq_pandas.png
categories: 
  - Python
tags:
  - memo
  - Python
  - Pandas
  - BigQuery
---
BigQueryでST_INTERSECTSを使って苦労したことを綴ります。

<!-- https://www.hamlet-engineer.com -->
<!-- ![](/image/ChordDiagram.png) -->

<!-- more -->

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

[[toc]]

## 失敗1:
逐次、SELECT文で結果を呼び出しているので、時間がかかる

```SQL
with
/* -----------------------------------------------------------------------------
-- 入力テーブル指定
------------------------------------------------------------------------------*/
--  facilitys as (select distinct facility_id from ${dataset_base}.process_facility)
 area_shp AS (SELECT * FROM `area_shp`),
 centroid AS (SELECT * FROM `centroid`)

/* -----------------------------------------------------------------------------
-- citycodeを変数
------------------------------------------------------------------------------*/

/* -----------------------------------------------------------------------------
-- citycodeを付与
------------------------------------------------------------------------------*/
SELECT 
  dailyid, daily_group_id, in_time, out_time
  , centroid_lat, centroid_lon,
  CASE
    -- 40131	 	東区
    WHEN 
      ST_Intersects(st_geogpoint(centroid_lon, centroid_lat)
                    ,ST_GEOGFROMTEXT((SELECT geometry FROM area_shp WHERE ward_name="東区"))
                    )
      THEN 40131
    -- 40132	 	博多区
    WHEN 
      ST_Intersects(st_geogpoint(centroid_lon, centroid_lat)
                    ,ST_GEOGFROMTEXT((SELECT geometry FROM area_shp WHERE ward_name="博多区"))
                    )
      THEN 40132
    -- 40133	 	中央区
    WHEN 
      ST_Intersects(st_geogpoint(centroid_lon, centroid_lat)
                    ,ST_GEOGFROMTEXT((SELECT geometry FROM area_shp WHERE ward_name="中央区"))
                    )
      THEN 40133
    -- 40134	 	南区
    WHEN 
      ST_Intersects(st_geogpoint(centroid_lon, centroid_lat)
                    ,ST_GEOGFROMTEXT((SELECT geometry FROM area_shp WHERE ward_name="南区"))
                    )
      THEN 40134
    -- 40135	 	西区
    WHEN 
      ST_Intersects(st_geogpoint(centroid_lon, centroid_lat)
                    ,ST_GEOGFROMTEXT((SELECT geometry FROM area_shp WHERE ward_name="西区"))
                    )
      THEN 40135
    -- 40136	 	城南区
    WHEN 
      ST_Intersects(st_geogpoint(centroid_lon, centroid_lat)
                    ,ST_GEOGFROMTEXT((SELECT geometry FROM area_shp WHERE ward_name="城南区"))
                    )
      THEN 40136
    -- 40137	 	早良区
    WHEN 
      ST_Intersects(st_geogpoint(centroid_lon, centroid_lat)
                    ,ST_GEOGFROMTEXT((SELECT geometry FROM area_shp WHERE ward_name="早良区"))
                    )
      THEN 40137
    -- その他
    ELSE 99999
  END AS city_code
FROM
  centroid
ORDER BY dailyid, in_time
```


## 失敗1:
SETで変数化しようとしたが、メモリーオーバーした

```SQL
/* -----------------------------------------------------------------------------
-- 地理情報を変数化
------------------------------------------------------------------------------*/
DECLARE wards ARRAY<GEOGRAPHY>;
-- 変数に値を設定
SET wards = (SELECT ARRAY_AGG(ST_GEOGFROMTEXT(geometry)) FROM `area_shp` WHERE ward_name!="福岡市");

with
/* -----------------------------------------------------------------------------
-- 入力テーブル指定
------------------------------------------------------------------------------*/
 --  area_shp AS (SELECT * FROM `area_shp`),
 centroid AS (SELECT * FROM `centroid`)

/* -----------------------------------------------------------------------------
-- citycodeを付与
------------------------------------------------------------------------------*/
SELECT 
  dailyid, daily_group_id, in_time, out_time
  , centroid_lat, centroid_lon,
  CASE
    -- 40133	 	中央区
    WHEN 
      ST_Intersects(st_geogpoint(centroid_lon, centroid_lat),wards[ORDINAL(0)])
      THEN 40133
    -- 40134	 	南区
    WHEN 
      ST_Intersects(st_geogpoint(centroid_lon, centroid_lat),wards[ORDINAL(1)])
      THEN 40134
    -- 40132	 	博多区
    WHEN 
      ST_Intersects(st_geogpoint(centroid_lon, centroid_lat),wards[ORDINAL(2)])
      THEN 40132
    -- 40136	 	城南区
    WHEN 
      ST_Intersects(st_geogpoint(centroid_lon, centroid_lat),wards[ORDINAL(3)])
      THEN 40136
    -- 40137	 	早良区
    WHEN 
      ST_Intersects(st_geogpoint(centroid_lon, centroid_lat),wards[ORDINAL(4)])
      THEN 40137
    -- 40131	 	東区
    WHEN 
      ST_Intersects(st_geogpoint(centroid_lon, centroid_lat),wards[ORDINAL(5)])
      THEN 40131
    -- 40135	 	西区
    WHEN 
      ST_Intersects(st_geogpoint(centroid_lon, centroid_lat),wards[ORDINAL(6)])
      THEN 40135
    -- その他
    ELSE 99999
  END AS city_code
FROM
  centroid
ORDER BY dailyid, in_time
```

## 成功
JOIN文で条件結合を実行する

```SQL
with
/* -----------------------------------------------------------------------------
-- 入力テーブル指定
------------------------------------------------------------------------------*/
  area_shp AS (SELECT * FROM `area_shp`),
  centroid AS (SELECT * FROM `centroid`)

/* -----------------------------------------------------------------------------
-- citycodeを付与
------------------------------------------------------------------------------*/
SELECT 
  t1.dailyid, t1.daily_group_id, t1.in_time, t1.out_time
  , t1.lat, t1.lon
  , st_geogpoint(t1.lon, t1.lat) AS point
  , t2.S_NAME AS s_name,
FROM
  centroid AS t1
JOIN
  area_shp AS t2
ON
  ST_INTERSECTS(
    st_geogpoint(t1.lon, t1.lat), ST_GEOGFROMTEXT(t2.geometry)
  )
ORDER BY dailyid, in_time
```

## まとめ
BigQueryでST_INTERSECTSを使って苦労したことを綴りました．

## 参考サイト
[Efficient spatial matching in BigQuery](https://medium.com/google-cloud/efficient-spatial-matching-in-bigquery-c4ddc6fb9f69)<br>
[BigQuey 地理関数](https://cloud.google.com/bigquery/docs/reference/standard-sql/geography_functions?hl=ja#st_boundary)<br>
[BigQuery GISを用いた位置情報データ分析の入門](https://qiita.com/shin_ishiguro/items/2429038b2c4c99c10837)<br>
[BigQuery 欠損値補完](https://hayaengineer.com/%E3%82%AF%E3%83%A9%E3%82%A6%E3%83%89%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9/gcp/bigquery/%E3%80%90bigquery%E3%80%91null%E3%81%A0%E3%81%A3%E3%81%9F%E3%82%89%E5%88%A5%E3%81%AE%E5%80%A4%E3%81%AB%E5%A4%89%E3%81%88%E3%82%8Bifnull%E6%96%87%E3%82%92%E8%A7%A3%E8%AA%AC%E3%80%82case%E6%96%87/)<br>
[BigQuery ハッシュ関数](https://cloud.google.com/bigquery/docs/reference/standard-sql/hash_functions?hl=ja)<br>
[BigQuery タイムスタンプ関数](https://cloud.google.com/bigquery/docs/reference/standard-sql/timestamp_functions?hl=ja)<br>
[BigQuery 文字列の結合](https://workmemo.techblog.jp/archives/45776957.html)<br>
[BigQuery 日時情報](https://gri.jp/media/entry/6544)<br>
[BigQuery 配列関数](https://cloud.google.com/bigquery/docs/reference/standard-sql/array_functions?hl=ja)<br>
[地理空間データを可視化](https://cloud.google.com/bigquery/docs/geospatial-visualize)<br>
[国土数値情報_行政区域データ](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html#prefecture40)<br>
[Pandas dataframe to Shapely LineString using GroupBy & SortBy](https://gis.stackexchange.com/questions/366058/pandas-dataframe-to-shapely-linestring-using-groupby-sortby)<br>
[geopandas でshapefileをgeojsonに変換する](https://zenn.dev/gomoku11/articles/4bce125e5f1834)<br>
[Geopandas: how to convert the column geometry to string?](https://stackoverflow.com/questions/61125808/geopandas-how-to-convert-the-column-geometry-to-string)<br>

<ClientOnly>
  <CallInArticleAdsense />
</ClientOnly>

<!-- TechAcademy -->
<a href="//af.moshimo.com/af/c/click?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/0866/000000029835.jpg" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2604050&p_id=1555&pc_id=2816&pl_id=29835" width="1" height="1" style="border:none;">

<!-- テックキャンプ -->
<a href="//af.moshimo.com/af/c/click?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847&guid=ON" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="//image.moshimo.com/af-img/1115/000000025847.png" width="728" height="90" style="border:none;"></a><img src="//i.moshimo.com/af/i/impression?a_id=2641145&p_id=1770&pc_id=3386&pl_id=25847" width="1" height="1" style="border:none;">


