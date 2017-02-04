$(function() {
  let socket = io();

  socket.on('new message', function (data) {
    console.log(data.quote);
    $('.text-body').append('$ ' + data.quote + '<br />');
  });

});
