#!/bin/env python
#encoding: utf-8
from pymongo import MongoClient

client = MongoClient('127.0.0.1', 27017)
db = client.guping

db.onObservation.remove({});
db.onObservationplus.remove({});
