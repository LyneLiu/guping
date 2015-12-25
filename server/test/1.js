var request = require('request');

request('http://localhost:3000/getData', function (err, response, data) {
  // response.statusCode.should.equal(200);
  console.log(data);
  console.log(typeof data);
});

