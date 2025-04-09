/*
    * SMS일때
    * 기기등록 -> 인증요청 -> 인증번호입력 -> 인증확인 -> 기기등록
    * PASS일때
    * 기기등록 -> 인증요청 -> 인증확인 -> 기기등록
    * 공통
    * 회원명 과 휴대폰은 회원정보에서 가져오기
    *
    * */
$(function () {
    // 탭 메뉴 기능
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
    // 패스 본인정보확인
    $(document).on('click', '#check_pass_btn', function (){

        var tel_code = $('#TEL_COM_CD').val();
        if(tel_code == ''){
            ShowNativeAlert.postMessage('통신사를 선택해주세요.');
            return false;
        }
        for(var i=1; i<5; i++){
            if($('#PassAGREE'+i).is(":checked") == false){
                ShowNativeAlert.postMessage('개인정보이용 동의여부를 동의해주세요.');

                return false;
            }
        }
        var _token = $("#token").val();
        var phone = $("#PASS_TEL_NO").val();
        var cp_code = $("#PASS_CP_CD").val();
        $('input[name=PASS_CP_CD]').val(cp_code);
        $('input[name=PASS_TEL_NO]').val(phone);
        $.ajax({
            'url': '/eggtv/app/kcbCertify/passCheck',
            'method': 'post',
            'data': {
                "_token": _token,
                'CP_CD' : $("#PASS_CP_CD").val(),
                'NAME' :  $("#PASS_NAME").val(),
                'TEL_COM_CD' : $("#PASS_TEL_COM_CD").val(),
                'TEL_NO' : $("#PASS_TEL_NO").val(),
                'RQST_CAUS_CD' : $("#PASS_RQST_CAUS_CD").val(),
                'AGREE1': $("#PassAGREE1").val(),
                'AGREE2': $("#PassAGREE2").val(),
                'AGREE3': $("#PassAGREE3").val(),
                'AGREE4': $("#PassAGREE4").val()
            },
            'dataType': 'json',
            'headers' : {
                'Authorization' : "Bearer " + $("#token").val()
            },
            error: function (request, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (data) {
                console.log(data);
                if(data.code == 'B000'){
                    console.log(data.returnData);
                    var form3 = document.form3;
                    $('input[name=output]').val(data.returnData);
                    console.log(form3);
                    form3.submit();
                }else{
                    ShowNativeAlert.postMessage(data.msg);
                    return false;
                }
            },
        });
    });
});

