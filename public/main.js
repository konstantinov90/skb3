$(function () {
  // $("#text").keypress(function(event) {
  //   if(event.which == '13') {
  //     return false;
  //   }
  // });

  $('#postForm').submit(function () {
    $(this).attr('action', $('#action-select').val());
    $(this).attr('method', $('#method-select').val());
    // var textInit = $('#text').val();
    // $('#text').val(textInit.replace(/\n/g, ''));
    // console.log($('#text').val())
    return true;
  });

});
