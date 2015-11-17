/* 获取排名 */
$(document).ready(function () {

  $.getJSON('http://127.0.0.1:3000/rank', function (json, status) {
    console.log(json);
    $('#rank').append(
      '<tr>' +
      '<th>名次</th>' +
      '<th>作者</th>' +
      '<th>平均相对涨幅</th>' +
      '</tr>'
    );
    $.each(json, function (i, item) {
      $('#rank').append(
        '<tr>' +
        '<td>' + (i+1) + '</td>' +
        '<td>' + item.author + '</td>' +
        '<td>' + item.avg + '</td>' +
        '</tr>'
      );
    });
  });
});

