#!/bin/env python
#encoding: utf-8
from pymongo import MongoClient

client = MongoClient('127.0.0.1', 27017)
db = client.guping

db.onObservation.insert({
        "code": "000681",
        "name": "视觉中国",
        "author": "林雷",
        "startDate": "2015-01-06",
        "endDate": "2015-03-10",
        "codePriceStart": "30.22",
        "codePriceEnd": "31.95",
        "sh300Start": "3806.67",
        "sh300End": "3822.25",
        "ifsell": 1,
});

db.onObservation.insert({
        "code": "300144",
        "name": "宋城演艺",
        "author": "王林",
        "startDate": "2015-03-07",
        "endDate": "2015-05-07",
        "codePriceStart": "40.22",
        "codePriceEnd": "51.95",
        "sh300Start": "3806.67",
        "sh300End": "3922.25",
        "ifsell": 1,
});

db.onObservation.insert({
        "code": "600118",
        "name": "中国卫星",
        "author": "萧炎",
        "startDate": "2015-07-11",
        "endDate": "",
        "codePriceStart": "48.35",
        "codePriceEnd": "48.35",
        "sh300Start": "3743.97",
        "sh300End": "3743.97",
        "ifsell": 0,
});
