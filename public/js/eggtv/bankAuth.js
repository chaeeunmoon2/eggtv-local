/*
    * Oauth - Client ID ,조회
    * 토큰생성
*/
$(function () {
    $(document).on('change','#auth_type', function (){
       var auth_type = $('#auth_type').val();
       if(auth_type == 'sms'){
           $('#pass_wrap').hide();
           $('#sms_wrap').show();
       }else{
           $('#pass_wrap').show();
           $('#sms_wrap').hide();
       }
    });
});

