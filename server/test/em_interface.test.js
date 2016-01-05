// file: test/em_interface.test.js
var should = require('should');
var http = require('http');
var request = require('request');

var code_url = 'http://nuff.eastmoney.com/EM_Finance2015TradeInterface/JS.ashx?id=0006812';
var sh300_url = 'http://nufm2.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&cmd=0003001&&sty=AMIC&st=z&sr=1&p=1&ps=1000&cb=&js=callbacksh300&token=beb0a0047196124721f56b0f0ff5a27c';

describe("test/em_interface.test.js", function () {

  it("Code API statusCode should equal 200", function (done) {
    this.timeout(5000);
    http.get(code_url, function (res) {
      res.statusCode.should.equal(200);
      done();
    });

  });

  it("SH300 API statusCode should equal 200", function (done) {
    this.timeout(5000);
    request(sh300_url, function (err, response, data) {
      should.not.exist(err);
      response.statusCode.should.equal(200);
      done();
    });
  });

});
