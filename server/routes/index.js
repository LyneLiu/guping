var express = require('express');
var router = express.Router();

index = require('../controllers/index.js');
router.get('/getData', index.getData);
router.post('/add', index.add);
router.get('/update', index.update);
router.post('/sell', index.sell);
router.get('/rank', index.ranklist);

test = require('../controllers/test.js');
router.get('/test', test.hello);

module.exports = router;
