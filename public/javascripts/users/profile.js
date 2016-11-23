$(function (){
  $('#userDelete').click(function(){
    if(confirm('계정을 삭제 하시겠습니까?')) {
      var url = '/users?_method=DELETE';
      window.location.href=url;
    }
    else {
      return false;
    }
  });
});
