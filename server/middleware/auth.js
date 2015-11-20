exports.needLogin = function (req, res, next) {

  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

exports.needNoLogin = function (req, res, next) {

  if (req.session.user) {
    return res.redirect('/admin');
  }
  next();
}
