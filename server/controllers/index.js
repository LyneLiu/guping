var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/guping');
var request = require('request');
var async = require('async');

/* 用来获取jsop */
// #FIXME
// getJsonFromJsonP 与getJsonFromJsonP2 两个函数是否能合并为一个函数呢?
var getJsonFromJsonP = function (url, callback) {
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonpData = body;
      var json;
      //if you don't know for sure that you are getting jsonp, then i'd do something like this
      try
      {
         json = JSON.parse(jsonpData);
      }
      catch(e)
      {
          var startPos = jsonpData.indexOf('({');
          var endPos = jsonpData.indexOf('})');
          var jsonString = jsonpData.substring(startPos+1, endPos+1);
          json = JSON.parse(jsonString);
      }
      callback(null, json);
    } else {
      callback(error);
    }
  });
};

var getJsonFromJsonP2 = function (url, callback) {
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonpData = body;
      callback(null, jsonpData);
    } else {
      callback(error);
    }
  });
};

/* 获取数据 */
exports.getData = function (req, res) {
  var collection = db.get('onObservation');
  collection.find({}, {}, function (e, docs) {

    var newdata = [];
    for (var i=0; i<docs.length; i++) {

      /* 计算股票和沪深300涨幅 */
      code_up = (docs[i].codePriceEnd - docs[i].codePriceStart) / docs[i].codePriceStart;
      code_up_string = (code_up * 100).toFixed(2).toString() + "%";

      sh300_up = (docs[i].sh300End - docs[i].sh300Start) / docs[i].sh300Start;
      sh300_up_string = (sh300_up * 100).toFixed(2).toString() + "%";

      relative_up = ((code_up - sh300_up) * 100).toFixed(2)
      relative_up_string = relative_up.toString() + "%";

      /* 获取当前得日期 如2015-11-11*/
      date = new Date();
      Ymd = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      console.log(Ymd);

      /* 求得持股天数 */
      sDate= docs[i].startDate;
      eDate= docs[i].ifsell === 1 ? docs[i].endDate : Ymd;
      sArr = sDate.split("-");
      eArr = eDate.split("-");
      sRDate = new Date(sArr[0], sArr[1], sArr[2]);
      eRDate = new Date(eArr[0], eArr[1], eArr[2]);
      hold_days = (eRDate-sRDate)/(24*60*60*1000);

      /* 重组返回得数据 */
      one = {
        "code": docs[i].code,
        "name": docs[i].name,
        "author": docs[i].author,
        "startDate": docs[i].startDate,
        "endDate": eDate,
        "codePriceStart": docs[i].codePriceStart,
        "codePriceEnd": docs[i].codePriceEnd,
        "code_up": code_up_string,
        "sh300Start": docs[i].sh300Start,
        "sh300End": docs[i].sh300End,
        "sh300_up": sh300_up_string,
        "relative_up": relative_up_string,
        "hold_days": hold_days,
        "ifsell": docs[i].ifsell
      }

      newdata.push(one);
    }
    console.log(newdata);

    return res.jsonp(newdata);
  })
}



/* 添加数据 */
exports.add = function (req, res) {

  console.log(req.body.code);
  console.log(req.body.name);

  json = {
    code: req.body.code,
    name: req.body.name,
    author: req.body.author,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    codePriceStart: req.body.codePriceStart,
    codePriceEnd: req.body.codePriceEnd,
    sh300Start: req.body.sh300Start,
    sh300End: req.body.sh300End,
    ifsell: 0
  }

  var collection = db.get('onObservation');
  collection.insert(json, function (e, docs) {
  });

}



/* 更新数据 */
//TODO
// 我觉得本函数应该进行优化或者重构
// 但是现在没有时间优化，但是现在其依旧可以工作...
exports.update = function (req, res) {

  url = 'http://nuff.eastmoney.com/EM_Finance2015TradeInterface/JS.ashx?id=0006812';
  sh300_url = 'http://nufm2.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&cmd=0003001&&sty=AMIC&st=z&sr=1&p=1&ps=1000&cb=&js=callbacksh300&token=beb0a0047196124721f56b0f0ff5a27c'

  /* 获取待跟踪的股票 */
  var collection = db.get('onObservation');
  collection.find({"ifsell": {"$eq": 0}}, {"code": 1}, function (err, items) {

    // 用于存储待更新的股票
    code_list = []
    for (i in items) {
      code_list.push(items[i]['code']);
    }
    console.log("need update: " + code_list);


    /* 从股票接口获取最新的数据 */
    async.every(code_list, function (code, callback) {

      // 6开头股票代码与0，3开头的股票接口不一样
      if(code[0]==='6') {
        flag = '1';
      }
      else {
        flag = '2';
      }

      url = 'http://nuff.eastmoney.com/EM_Finance2015TradeInterface/JS.ashx?id=' + code + flag;
      // 请求数据
      getJsonFromJsonP(url, function (err, data) {

        // 更新股票数据， 最新数据为data.Value[25]
        var collection = db.get('onObservation');
        console.log(data.Value[25]);
        collection.update({"code": code}, {$set: {"codePriceEnd": data.Value[25]}}, function (e, docs) {
          console.log("update code: " + code);
        });
      });
    }, function (err) {
      console.log("err:" + err);
    });

    // 请求沪深300数据
    getJsonFromJsonP2(sh300_url, function (err, data) {
      // console.log(typeof(parseFloat(data.split('[')[1].split(']')[0].split(',')[2])));

      // 将string转成number
      sh300End = parseFloat(data.split('[')[1].split(']')[0].split(',')[2]);

      // 更新沪深300指数
      var collection = db.get('onObservation');
      collection.update({"ifsell": {"$eq": 0}}, {$set: {"sh300End": sh300End}},  { multi: true }, function (e, docs) {
        console.log('update sh300');
      });
    });

    return res.jsonp({"hello": "world"});
  });
}



/* 卖出 */
exports.sell = function (req, res) {

  code = req.body.code;
  author = req.body.author;
  codePriceEnd = req.body.codePriceEnd;
  sh300End = req.body.sh300End;
  startDate = req.body.startDate;

  console.log(code);
  console.log(author);
  console.log(codePriceEnd);
  console.log(sh300End);
  console.log(startDate);

  /* 获取当前得日期 如2015-11-11*/
  date = new Date();
  Ymd = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  console.log(Ymd);

  /* 求得持股天数 */
  sDate= startDate;
  eDate= Ymd;
  sArr = sDate.split("-");
  eArr = eDate.split("-");
  sRDate = new Date(sArr[0], sArr[1], sArr[2]);
  eRDate = new Date(eArr[0], eArr[1], eArr[2]);
  hold_days = (eRDate-sRDate)/(24*60*60*1000);

  /* 待更新的数库 */
  json = {
    "sh300End": sh300End,
    "codePriceEnd": codePriceEnd,
    "endDate": Ymd,
    "hold_days": hold_days,
    "ifsell": 1
  }

  var collection = db.get('onObservation');
  collection.update({"code": code, "author": author}, {$set: json}, function (e, docs) {
    console.log('sell: ' + code);
  });

  return res.jsonp({"hello": "world"});
};
















