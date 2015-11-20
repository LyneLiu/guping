var crypto = require('crypto');
var MongoClient = require('mongodb').MongoClient

dbpath = 'mongodb://localhost:27017/guping';

exports.loginCheck = function (req, res) {

  username = req.body.username;
  password = req.body.password;

  md5 = crypto.createHash('md5')
  key = md5.update(password).digest('hex')

  MongoClient.connect(dbpath, function (err, db) {
    var collection = db.collection('onObservationuser');
    collection.findOne({"username": username}, function (err, docs) {
      // console.log(docs.password);
      if (docs.password === key) {
        req.session.user = username;
        req.session.nicename = docs.nickname;
        return res.jsonp({'status': true});
      }
      else {
        req.session.user = null;
        req.session.nicename = null;
        return res.jsonp({'status': false});
      }
    })
  })
}
