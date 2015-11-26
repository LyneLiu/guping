/* 渲染首页 */
$(document).ready(function() {
   $.getJSON("http://127.0.0.1:3000/getData", function (json, status) {

     // console.log(json);
     $("#content").append(
       "<tr>" +
       "<th>序号</th>" +
       "<th>代码</th>" +
       "<th>名称</th>" +
       "<th>推荐人</th>" +
       "<th>买入日期</th>" +
       "<th>卖出日期</th>" +
       "<th>买入价格</th>" +
       "<th>卖出价格</th>" +
       "<th>股票涨幅</th>" +
       "<th>沪深300入价</th>" +
       "<th>沪深300卖价</th>" +
       "<th>沪深300涨幅</th>" +
       "<th>相对涨幅</th>" +
       "<th>持股天数</th>" +
       "<th>是否卖出</th>" +
       "</tr>"
     );
     $.each(json, function (i, item) {

       if (item.ifsell === 1) {
         endDate = item.endDate;
         sell_status = "已售出";
       }
       else {
         endDate = "未卖"
         sell_status = "<span>点击售出</span>";
       }

       $("#content").append(
         "<tr>" +
         "<td>" + (i+1) + "</td>" +
         "<td>" + item.code + "</td>" +
         "<td>" + item.name + "</td>" +
         "<td>" + item.author + "</td>" +
         "<td>" + item.startDate + "</td>" +
         "<td>" + endDate + "</td>" +
         "<td>" + item.codePriceStart + "</td>" +
         "<td>" + item.codePriceEnd + "</td>" +
         "<td>" + item.code_up + "</td>" +
         "<td>" + item.sh300Start + "</td>" +
         "<td>" + item.sh300End + "</td>" +
         "<td>" + item.sh300_up + "</td>" +
         "<td>" + item.relative_up + "</td>" +
         "<td>" + item.hold_days+ "</td>" +
         "<td>" + sell_status + "</td>" +
         "</tr>"
       );
     });
   });
});



/* 添加新的股票 */
$(document).on('click', '#add', function () {

  /* 接口地址 */
  code = $('input[name=code]').val();
  if(code[0]==='6') {
    flag = '1';
  }
  else {
    flag = '2';
  }
  code_url = "http://nuff.eastmoney.com/EM_Finance2015TradeInterface/JS.ashx?id=" + code + flag;
  sh300_url = "http://nufm2.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&cmd=0003001&&sty=AMIC&st=z&sr=1&p=1&ps=1000&cb=&js=callbacksh300&token=beb0a0047196124721f56b0f0ff5a27c"

  /* 获取当前得日期 如2015-11-11*/
  date = new Date();
  Ymd = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

  /* 请求单只股票的数据 */
  $.ajax({
    url: code_url,
    dataType: 'jsonp',
    jsonpCallback: "callback",
    success: function (data) {

      /* 获得所需数据 */
      name = data.Value[2];
      codePriceStart = data.Value[25];  // 昨日收盘价
      codePriceEnd = data.Value[25];     // 今日收盘价

      /* 请求沪深300的数据 */
      $.ajax({
        url: sh300_url,
        dataType: 'jsonp',
        jsonpCallback: "callbacksh300",
        success: function (sh300) {

          sh = sh300[0].split(',');
          sh300Start = sh[2];   // 昨日收盘价
          sh300End = sh[2];     // 今日开盘价


          /* 传入后端 */
          $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:3000/add',
            data: {
              code: $('input[name=code]').val(),
              name: name,
              author: $('input[name=author]').val(),
              startDate: Ymd,
              endDate: '',
              codePriceStart: codePriceStart,
              codePriceEnd: codePriceEnd,
              sh300Start: sh300Start,
              sh300End: sh300End,
              ifsell: 0
            },
          });

          location.reload()
        }
      });
    }
  });
});



/* 更新数据 */
$(document).on('click', '#update', function () {
  $.ajax({
    url: 'http://127.0.0.1:3000/update',
    success: function (result) {
      if (result.status) {
        location.reload();
      } else {
        alert('更新失败');
      }
    }
  });

 setTimeout("location.reload()", 3000);
});



/* 售出 */
$(document).on('click', 'table tr td span', function () {

  code = this.parentNode.parentNode.children[1].innerHTML;
  author = this.parentNode.parentNode.children[3].innerHTML;
  startDate = this.parentNode.parentNode.children[4].innerHTML;
  codePriceEnd = this.parentNode.parentNode.children[7].innerHTML;
  sh300End = this.parentNode.parentNode.children[10].innerHTML;

  console.log(code + author + codePriceEnd + sh300End + startDate);

  /* 通知后端更新数据 */
  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:3000/sell',
    data: {
      code: code,
      author: author,
      startDate: startDate,
      codePriceEnd: codePriceEnd,
      sh300End: sh300End,
    },
  });

  setTimeout("location.reload()", 3000);
});










