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
    // SMS 본인정보확인
    $(document).on('click', '#check_pass_auth_btn', function (){

        var _token = $('input[name=_token]').val();
        $.ajax({
            'url': '/eggtv/app/kcbCertify/passAuthCheck',
            'method': 'post',
            'data': {
                "_token": _token,
                'CP_CD' : $("#CP_CD").val(),
                'TX_SEQ_NO' :  $("#TX_SEQ_NO").val(),
                'CNFRM_RQST_SEQNO' : $("#CNFRM_RQST_SEQNO").val(),
            },
            'dataType': 'json',
            'headers' : {
                'Authorization' : "Bearer " + $("#token").val()
            },
            error: function (request, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (data) {
                if(data.code == 'B000'){
                    ShowNativeAlert.postMessage('인증이 완료되었습니다.');
                    add_device();
                    // 기기등록 처리
                }else if(data.code = 'B164'){
                    ShowNativeAlert.postMessage('PASS앱에서 인증 후 다시시도해주세요.');
                    var retry_cnt = $('#CNFRM_RQST_SEQNO').val();
                    retry_cnt = parseInt(retry_cnt) + 1;

                    retry_cnt = lpad(retry_cnt, 4, "0");
                    $("#CNFRM_RQST_SEQNO").val(retry_cnt);
                    return false;
                }else if(data.code = 'B129') {
                    ShowNativeAlert.postMessage('입력시간이 초과되었습니다.처음부터 다시 진행해주세요.');
                    return false;
                }else{
                    ShowNativeAlert.postMessage(data.msg);
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
                // 토큰없데요
                ShowNativeAlert.postMessage('디바이스 등록에 실패하였습니다. 다시시도해 주세요.');
                ShowTabMenu.postMessage("");
                location.href = "/eggtv/app/mypage/myInfo";
            },
            success: function (data) {
                console.log(data);
                ShowNativeAlert.postMessage('디바이스 등록이 완료되었습니다.');
                ShowTabMenu.postMessage("");
                location.href = "/eggtv/app/mypage/myInfo";
            },
        });
}
