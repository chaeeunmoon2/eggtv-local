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
    let timer;
    let isRunning = false;
// 인증번호 발송하고 타이머 함수 실행
    function sendAuthNum(){
        // 남은 시간
        let leftSec = 180,
            display = document.querySelector('.count');
        // 이미 타이머가 작동중이면 중지
        if (isRunning){
            clearInterval(timer);
        } else {
            isRunning = true;
        }
        startTimer(leftSec, display);
    }

    function startTimer(count, display) {
        let minutes, seconds;
        timer = setInterval(function () {
            minutes = parseInt(count / 60, 10);
            seconds = parseInt(count % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            // 타이머 끝
            if (--count < 0) {
                clearInterval(timer);
                display.textContent = "";
                isRunning = false;
            }
        }, 1000);
    }
    // 탭 메뉴 기능
    $(document).on('change','#auth_type', function (){
        let auth_type = $('#auth_type').val();
        if(auth_type == 'sms'){
            $('#pass_wrap').hide();
            $('#sms_wrap').show();
        }else{
            $('#pass_wrap').show();
            $('#sms_wrap').hide();
        }
    });
    $(document).on('click', '#check_pass_btn', function (){

        let tel_code = $('#TEL_COM_CD').data('num');
        console.log(tel_code);
        if(tel_code == '' || tel_code===undefined){
            ShowNativeAlert.postMessage('통신사를 선택해주세요.');
            return false;
        }
        if($('#authCode').val() != $("#number").val() && ($('#authCode').val() != '' || $('#authCode').val() !==undefined))
        if($('.count').text() == '' || $('.count').text()===undefined){
            ShowNativeAlert.postMessage('휴대폰 인증요청을 다시 해주세요.');
            return false;
        }
        for(let i=1; i<5; i++){
            if(!$('#agree0'+i).is(":checked")){
                ShowNativeAlert.postMessage('개인정보이용 동의여부를 동의해주세요.');
                return false;
            }
        }
        let _token = $('input[name=_token]').val();
        let phone = $("#PASS_TEL_NO").val();
        let cp_code = $("#PASS_CP_CD").val();
        $('input[name=PASS_CP_CD]').val(cp_code);
        $('input[name=PASS_TEL_NO]').val(phone);
        $.ajax({
            'url': '/eggtv/app/kcbCertify/passInfoCheck',
            'method': 'post',
            'data': {
                "_token": _token,
                'CP_CD' : $("#PASS_CP_CD").val(),
                'NAME' :  $("#PASS_NAME").val(),
                'TEL_COM_CD' : $("#TEL_COM_CD").data('num'),
                'TEL_NO' : $("#PASS_TEL_NO").val(),
                'RQST_CAUS_CD' : $("#PASS_RQST_CAUS_CD").val(),
                'AGREE1': $("#agree01").val(),
                'AGREE2': $("#agree02").val(),
                'AGREE3': $("#agree03").val(),
                'AGREE4': $("#agree04").val()
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
                    let form3 = document.form3;
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
    // 일반 SMS 정보확인
    $('#OTP_NO').keyup(function() {
        if ($(this).val().length >= 6) {
            $('#check_sms_btn').addClass('red');
        } else {
            $('#check_sms_btn').removeClass('red');
        }
    })
    $(document).on('click', '.check_phone_btn', function (){

        let tel_code = $('#TEL_COM_CD').data('num');
        let sex_code = $('#SMS_SEX_CD').data('num');
        console.log(tel_code);
        if(tel_code === '' || tel_code===undefined){
            ShowNativeAlert.postMessage('통신사를 선택해주세요.');
            return false;
        }
        if(sex_code === '' || sex_code===undefined){
            ShowNativeAlert.postMessage('성별을 선택해주세요.');
            return false;
        }
        for(let i=1; i<5; i++){
            if(!$('#agree0'+i).is(":checked")){
                ShowNativeAlert.postMessage('개인정보이용 동의여부를 동의해주세요.');
                return false;
            }
        }

        $(this).parents(".phone_certification").addClass("send");
        $(this).addClass("hide");
        $(".send_certification.resend").addClass("show");

        let _token = $('input[name=_token]').val();
        let reqData = {
            "_token": _token,
            'CP_CD' : $("#SMS_CP_CD").val(),
            'NAME' :  $("#SMS_NAME").val(),
            'BIRTHDAY' : $("#SMS_BIRTHDAY").val(),
            'SEX_CD' : $('#SMS_SEX_CD').data('num'),
            'NTV_FRNR_CD' : $('input[name=SMS_NTV_FRNR_CD]').val(),
            'TEL_COM_CD' : $("#TEL_COM_CD").data('num'),
            'TEL_NO' : $("#SMS_TEL_NO").val(),
            'SMS_RESEND_YN' : $("#SMS_RESEND_YN").val(),
            'RQST_CAUS_CD' : $("#SMS_RQST_CAUS_CD").val(),
            'APP_HASH_STR' : "",
            'TX_SEQ_NO' : $("#TX_SEQ_NO").val(),
            'AGREE1': $("#agree01").val(),
            'AGREE2': $("#agree02").val(),
            'AGREE3': $("#agree03").val(),
            'AGREE4': $("#agree04").val()
        };
        console.log(reqData);
        $.ajax({
            'url': '/eggtv/app/kcbCertify/normal2',
            'method': 'post',
            'data': reqData,
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
                    sendAuthNum();
                    $('.alert-msg').text('3분 이내에 인증번호를 입력하여 본인인증을 완료해주세요.');
                    $("#TX_SEQ_NO").val(data.returnData.TX_SEQ_NO);
                    $("#SMS_RESEND_YN").val('Y');
                    console.log(data.returnData);
                }else{
                    ShowNativeAlert.postMessage(data.msg);
                    return false;
                }
            },
        });
    });
    // 일반 SMS 정보확인
    $(document).on('click', '#check_sms_btn', function (){
        let tel_code = $('#TEL_COM_CD').data('num');
        let sex_code = $('#SMS_SEX_CD').data('num');
        let otp_code = $('#TX_SEQ_NO').val();
        console.log(tel_code);
        if(tel_code === '' || tel_code===undefined){
            ShowNativeAlert.postMessage('통신사를 선택해주세요.');
            return false;
        }
        if(sex_code === '' || sex_code===undefined){
            ShowNativeAlert.postMessage('성별을 선택해주세요.');
            return false;
        }
        if(otp_code === '' || otp_code===undefined || !$(this).hasClass('red')){
            ShowNativeAlert.postMessage('인증번호를 입력해주세요');
            return false;
        }
        for(let i=1; i<5; i++){
            if(!$('#agree0'+i).is(":checked")){
                ShowNativeAlert.postMessage('개인정보이용 동의여부를 동의해주세요.');
                return false;
            }
        }
        let _token = $('input[name=_token]').val();
        let reqData = {
            "_token": _token,
            'TX_SEQ_NO' : $("#TX_SEQ_NO").val(),
            'TEL_NO' : $("#SMS_TEL_NO").val(),
            'OTP_NO' : $("#OTP_NO").val()
        };
        console.log(reqData);
        $.ajax({
            'url': '/eggtv/app/kcbCertify/normal3',
            'method': 'post',
            'data': reqData,
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
                    ShowNativeAlert.postMessage('본인인증이 완료되었습니다.');
                    add_device();
                }else{
                    ShowNativeAlert.postMessage(data.msg);
                    if(data.code == 'B128'){
                        add_device();
                    }
                    return false;
                }
            },
        });
    });
});
// 디바이스 등록
function add_device(){
    $.ajax({
        'url': '/eggtv/device',
        'method': 'post',
        'data': {
            '_token':$('input[name=_token]').val()
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
            ShowTabMenu.postMessage("");
            location.href = "/eggtv/app/mypage/myInfo";
        },
    });
}
$(document).on('click', '.auth-btn-close', function (){
    location.href = "/eggtv/app/mypage/myInfo";
    ShowTabMenu.postMessage("");

});
