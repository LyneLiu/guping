exports.needLogin = function (req, res, next) {

  if (!req.session.user) {
    // return res.jsonp({'status': 'false'});
    return res.redirect('login.html');
  }
  next();
}

exports.needNoLogin = function (req, res, next) {

  if (req.session.user) {
    return res.redirect('/');
  }
  next();
}

