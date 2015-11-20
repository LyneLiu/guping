var express = require('express');
var router = express.Router();

index = require('../controllers/index.js');
auth = require('../middleware/auth.js');
admin = require('../controllers/admin.js');

// 获取数据
router.get('/getData', index.getData);
router.post('/add', auth.needLogin, index.add);
router.get('/update', index.update);
router.post('/sell', index.sell);
router.get('/rank', index.ranklist);

// 登陆
router.post('/login', auth.needLogin, admin.loginCheck);
// router.get('/logout', admin.logout);

test = require('../controllers/test.js');
router.get('/test', test.hello);

module.exports = router;