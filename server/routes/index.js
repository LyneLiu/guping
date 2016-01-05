var express = require('express');
var router = express.Router();

var index = require('../controllers/index.js');
var auth = require('../middleware/auth.js');
var admin = require('../controllers/admin.js');

// 获取数据
router.get('/getData', index.getData);
router.get('/getData/:user', index.getData);
router.post('/add', index.add);
router.get('/update', index.update);
router.post('/sell', index.sell);
router.get('/rank', index.ranklist);


router.get('/user/:user', index.getData);

// 登陆
router.get('/auth_status', admin.auth_status);
router.post('/login', admin.loginCheck);
router.get('/logout', admin.logout);

var test = require('../controllers/test.js');
router.get('/test', test.hello);

module.exports = router;
