var request = require('request');
var async = require('async');
var MongoClient = require('mongodb').MongoClient;

// The mongodb path
var dbpath='mongodb://localhost:27017/guping';

/*
* getData: Select all or one user
* method: GET
* if --URL1: http://127.0.0.1:3000/getData
*    | - select all
*    |-URL2: http://127.0.0.1:3000/getData/dongdong
*    | - select user 'dongdong'
*/
exports.getData = function (req, res) {

  var finder = {};
  var author = req.params.user || undefined;
  if (author) {
    finder = {"author": req.params.user};
  } else {
    finder = {};
  }

  // Mongo client
  MongoClient.connect(dbpath, function(err, db) {
    if (err) {throw err;}

    var collection = db.collection('onObservation');
    collection.find(finder).toArray(function (err, docs) {
      if (err) {throw err;}

      var i = 0;
      var item = {};
      var data = [];
      for (i=0; i<docs.length; i++) {

        item = {
          "key": i+1,
          "code": docs[i].code,
          "name": docs[i].name,
          "author": docs[i].author,
          "startDate": docs[i].startDate,
          "endDate": docs[i].endDate,
          "codePriceStart": parseFloat(docs[i].codePriceStart),
          "codePriceEnd": parseFloat(docs[i].codePriceEnd),
          "code_up": docs[i].code_up,
          "code_up_string": docs[i].code_up_string,
          "sh300Start": parseFloat(docs[i].sh300Start),
          "sh300End": parseFloat(docs[i].sh300End),
          "sh300_up": docs[i].sh300_up,
          "sh300_up_string": docs[i].sh300_up_string,
          "relative_up": parseFloat(docs[i].relative_up),
          "relative_up_string": docs[i].relative_up_string,
          "hold_days": docs[i].hold_days,
          "ifsell": docs[i].ifsell
        };

        data.push(item);
      }
      console.log('Get data success');
      return res.jsonp({status: 0, result: data, message: "get data success"});
    });
  });
};


/* 添加数据 */
exports.add = function (req, res) {

  console.log(req.body.code);
  console.log(req.body.author);

  var code = req.body.code;
  var author = req.body.author;

  async.parallel([

    // 添加个股信息
    function (callback) {

      var flag = code[0] === '6' ? '1' : '2';
      var url = 'http://nuff.eastmoney.com/EM_Finance2015TradeInterface/JS.ashx?id=' + code + flag;

      request(url, function (err, response, data) {
        if (!err && response.statusCode === 200) {
          var jsonpData = data;
          var startPos = jsonpData.indexOf('({');
          var endPos = jsonpData.indexOf('})');
          var jsonString = jsonpData.substring(startPos+1, endPos+1);
          var json = JSON.parse(jsonString);

          // 获得接口数据
          var codePriceStart = parseFloat(json.Value[25]);
          var codePriceEnd = codePriceStart;

          var res_json = {
            code: code,
            name: json.Value[2],
            codePriceStart: codePriceStart,
            codePriceEnd: codePriceEnd
          };

          callback(null, res_json);

        } else {
          console.log(err);
        }
      });
    },
    // 添加沪深300信息
    function (callback) {
      var sh300_url = 'http://nufm2.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&cmd=0003001&&sty=AMIC&st=z&sr=1&p=1&ps=1000&cb=&js=callbacksh300&token=beb0a0047196124721f56b0f0ff5a27c';

      request(sh300_url, function (err, response, data) {
        if (!err && response.statusCode === 200) {
          var startPos = data.indexOf('([');
          var endPos = data.indexOf('])');
          var string = data.substring(startPos+3, endPos-1);
          var list = string.split(',');
          console.log(list[2]);

          var sh300Start = parseFloat(list[2]);
          var sh300End = sh300Start;

          var res_json = {
            sh300Start: sh300Start,
            sh300End: sh300End
          };
          callback(null, res_json);
        } else {
          console.log(err);
        }
      });
    }
  ], function (err, result) {
    if (err) { throw err; }

    // 获取当前日期
    var date = new Date();
    var Ymd = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    // result为code接口与sh300接口返回的数据, 在这里重新拼接
    var json = {
      code: result[0].code,
      name: result[0].name,
      author: author,
      startDate: Ymd,
      endDate: Ymd,
      codePriceStart: result[0].codePriceStart,
      codePriceEnd: result[0].codePriceEnd,
      sh300Start: result[1].sh300Start,
      sh300End: result[1].sh300End,
      ifsell: 0,
      code_up: 0.00,
      code_up_string: "0.00%",
      sh300_up: 0.00,
      sh300_up_string: "0.00",
      relative_up: 0.00,
      relative_up_string: "0.00",
      hold_days: 0
    };

    // 存入数据库
    MongoClient.connect(dbpath, function (err, db) {
      if (err) { throw err; }
      var collection = db.collection('onObservation');
      collection.insert(json, function (e, docs) {
        if (e) { throw e; }
        if (docs.result.ok === 1) {
          console.log('add code to database success');
          db.close();
          return res.jsonp({status:0, result:"", message:"add code success"});
        }
        console.log('add code to database failed');
        db.close();
        return res.jsonp({status:-1, result:"", message:"add code to database failed"});
      });
    });
  });
};


/* 更新数据 */
exports.update = function (req, res) {

  // 获取待更新的股票列表
  MongoClient.connect(dbpath, function (err, db) {
    var collection = db.collection('onObservation');

    collection.find({"ifsell": {"$eq": 0}}, {"code": 1, "_id": 0}).toArray(function (err, docs) {

      // 构造股票代码列表
      var code_list = [];
      for (i in docs) {
        code_list.push(docs[i]['code']);
      }
      console.log("need update: " + code_list);

      // 更新个股及沪深300数据
      async.parallel([
        // 负责个股更新
        function (callback) {
          async.each(code_list, function (code, callback) {
            flag = code[0] === '6' ? '1' : '2';

            // 拼接接口地址
            var url = 'http://nuff.eastmoney.com/EM_Finance2015TradeInterface/JS.ashx?id=' + code + flag;

            // 请求个股数据
            request(url, function (err, response, data) {
              if (!err && response.statusCode == 200) {
                var jsonpData = data;
                var startPos = jsonpData.indexOf('({');
                var endPos = jsonpData.indexOf('})');
                var jsonString = jsonpData.substring(startPos+1, endPos+1);
                var json = JSON.parse(jsonString);

                var codePriceEnd = parseFloat(json['Value'][25]); // 当前价
              }
              else {
                console.log(err);
              }

              // 更新数据
              collection.update({"code": code}, {$set: {"codePriceEnd": codePriceEnd}}, {multi: true}, function (err, docs) {
                if (err) throw err;
                if (docs.result.ok === 1) {
                  console.log('update ' + code + ' data success: ' + codePriceEnd);
                } else {
                  console.log('update ' + code + ' data failed');
                }
                callback();
              });
            });

          }, function (err) {
            console.log('> code done');
            callback(null, 'codes update success');
          });
        },
        // 负责沪深300指数更新
        function (callback) {

          var sh300_url = 'http://nufm2.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&cmd=0003001&&sty=AMIC&st=z&sr=1&p=1&ps=1000&cb=&js=callbacksh300&token=beb0a0047196124721f56b0f0ff5a27c'

          request(sh300_url, function (err, response, data) {
            if (!err && response.statusCode == 200) {
              var startPos = data.indexOf('([');
              var endPos = data.indexOf('])');
              var string = data.substring(startPos+3, endPos-1);
              var list = string.split(',');
              var sh300End = parseFloat(list[2]);
            }
            else {
              console.log(err);
            }

            // 更新数据
            collection.update({"ifsell": {"$eq": 0}}, {$set: {"sh300End": sh300End}}, {multi: true}, function (err, docs) {
              if (err) throw err;
              if (docs.result.ok >= 1) {
                console.log('update sh300 data success: ' + sh300End);
              } else {
                console.log('update sh300 data failed');
              }
              console.log('> sh300 done');

              callback(null, 'sh300 update');
            });
          });
        },
      ], function (err, result) {
        console.log(result);
        console.log('Wait for the next update...');
        db.close();
      });
    });
  });
}


/* 卖出 */
exports.sell = function (req, res) {

  code = req.body.code;
  author = req.body.author;
  startDate = req.body.startDate;

  console.log(code);
  console.log(author);
  console.log(startDate);

  /* 获取当前得日期 如2015-11-11*/
  date = new Date();
  Ymd = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

  /* 求得持股天数 */
  sDate= startDate;
  eDate= Ymd;
  sArr = sDate.split("-");
  eArr = eDate.split("-");
  sRDate = new Date(sArr[0], sArr[1], sArr[2]);
  eRDate = new Date(eArr[0], eArr[1], eArr[2]);
  hold_days = (eRDate-sRDate)/(24*60*60*1000);

  /* 待更新的数据 */
  json = {
    "endDate": Ymd,
    "hold_days": hold_days,
    "ifsell": 1
  }

  /* 写入数据库 */
  MongoClient.connect(dbpath, function (err, db) {
    var collection = db.collection('onObservation');
    collection.update({"code": code, "author": author}, {$set: json}, function (e, docs) {
      console.log('sell: ' + code);
    });
    db.close();
    return res.jsonp({status:0, result:"", message:"sell success"});
  });
};


/* 排名 */
exports.ranklist = function (req, res) {

  /* 利用mongodb的aggregate聚合得出结果 */
  MongoClient.connect(dbpath, function (err, db) {
    var collection = db.collection('onObservationplus');

    collection.aggregate([
      {$group: {_id: "$author", avg: {$avg: "$relative_up"}}},
      {$sort: {avg: -1}}
    ], function (err, result) {

      // 重新组合返回数据
      resu = []
      for (var i in result) {
        one = {
          "author": result[i]._id,
          "avg": (result[i].avg).toFixed(2).toString() + '%'
        }
        resu.push(one);
      }
      console.log(resu)

      db.close();

      // return res.jsonp(resu);
      return res.jsonp({status:0, result:resu, message:"get rank data success"});
    });
  });
};












