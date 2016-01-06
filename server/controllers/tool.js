exports.isWorkTime = function () {
  var bit2 = function (t) {
    if (t < 10) {
      return '0' + String(t);
    }
    return t;
  };
  var nowDate = new Date();
  var nowDay = nowDate.getDay();
  var nowHours = nowDate.getHours();
  var nowMinutes = nowDate.getMinutes();

  nowHours = bit2(nowHours);
  nowMinutes = bit2(nowMinutes);
  var now = nowHours + ':' + nowMinutes;

  var morning_start = "09:30:00";
  var morning_end = "11:30:00";
  var afternoon_start = "13:00:00";
  var afternoon_end = "15:00:00";

  if (nowDay === 0 || nowDay === 6) {
    console.log('Toady is Saturday or Sunday, Do not update');
    return false;
  }

  if ((now > morning_start && now < morning_end) || (now > afternoon_start && now < afternoon_end)) {
    return true;
  }
  return false;
};
