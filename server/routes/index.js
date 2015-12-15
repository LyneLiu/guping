var express = require('express');
var router = express.Router();

index = require('../controllers/index.js');
auth = require('../middleware/auth.js');
admin = require('../controllers/admin.js');

// 获取数据
router.get('/getData', index.getData);
//router.post('/add', auth.needLogin, index.add);
router.post('/add', index.add);
router.get('/update', index.update);
router.post('/sell', index.sell);
router.get('/rank', index.ranklist);


router.get('/user/:user', index.getData);

// 登陆
router.get('/auth_status', admin.auth_status);
router.post('/login', admin.loginCheck);
router.get('/logout', admin.logout);

test = require('../controllers/test.js');
router.get('/test', test.hello);

module.exports = router;
