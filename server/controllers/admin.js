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
      if (docs.password === key) {
        req.session.user = username;
        req.session.nickname = docs.nickname;
        return res.jsonp({'status': true});
      }
      else {
        req.session.destroy();
        return res.jsonp({'status': false});
      }
    })
  })
}

exports.auth_status = function (req, res) {
  if (req.session.user) {
    return res.jsonp({'status': true});
  } else {
    return res.jsonp({'status': false});
  }
}


exports.logout = function (req, res) {

  req.session.destroy();

  console.log('logout ok');

  return res.jsonp({'status': 'success', 'message': 'logout'});
}
