/* 获取排名 */
$(document).on('click', '#submit', function () {

  username = $('input[name=username]').val();
  password = $('input[name=password]').val();

  alert(username);
  alert(password);

  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:3000/login',
    data: {
      username: username,
      password: password
    },
    success: function (result) {
      if(result.status) {
        window.location = '/';
      }
      else {
        alert('请重新登陆');
        window.location = '/login.html';
      }
    }
  });
});


