$(document).ready(function () {
  $('#training-form').prop('action', function (i, val) {
    var correlation_id = new RegExp('correlation_id=([^&#]*)').exec(window.location.href);
    if (correlation_id === null) {
      correlation_id = "";
    } else {
      correlation_id = '?' + correlation_id[0];
    }
    return val + correlation_id;
  });
});
