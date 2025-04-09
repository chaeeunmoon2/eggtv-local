var EGGTVAPP = {};
EGGTVAPP.login = new function () {

    let mainUrl = '/eggtv/app/main';
    /**
     * 정회원로그인
     * @param id
     * @param pw
     */
    this.memberLogin = function () {
        $('.wrap').css('padding-bottom','0');
        if($("#member_id").val() == '' || $("#member_pw").val() == ''){
            ShowNativeAlert.postMessage('아이디 또는 패스워드를 입력해주세요.');
            return false;
        }
        var param = {
            'email': $("#member_id").val(),
            'password': $("#member_pw").val(),
            'device': $("#device").val(),
            'device_os': $("#device_os").val(),
            'model_number': $("#model_number").val(),
        };
        $.ajax({
            'url': '/api/auth/login',
            'method': 'POST',
            'data': param,
            'dataType': 'json',
            'async': false,
            headers: {
                'X-CSRF-Token': $("#csrf").val(),
            },
            error: function (request, error) {
                var json_request = JSON.stringify(request);
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + + "\n" + "request:" + json_request +"\n" + "error:" + error);
                // alert(request.responseJSON.message); // 맨처음
                ShowNativeAlert.postMessage(request.responseJSON.message);
            },
            success: function (data) {
                console.log("success");
                console.log(data);
                EGGTVAPP.login.loginForm(data);
                // location.href = '/eggtv/app/main';
            },
        });
    };
    this.eventLogin = function () {
        $('.wrap').css('padding-bottom','0');
        console.log("test");
        var param = {
            'phone': $("#exp_phone").val(),
            'code': $("#exp_code").val(),
            'device': $("#device").val(),
            'device_os': $("#device_os").val(),
            'model_number': $("#model_number").val(),
        };
        $.ajax({
            'url': '/api/auth/exp/login',
            'method': 'POST',
            'data': param,
            'dataType': 'json',
            'async': false,
            headers: {
                'X-CSRF-Token': $("#csrf").val(),
            },
            error: function (request, error) {
                var json_request = JSON.stringify(request);
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + + "\n" + "request:" + json_request +"\n" + "error:" + error);
                ShowNativeAlert.postMessage(request.responseJSON.message);
            },
            success: function (data) {
                console.log(data);
                EGGTVAPP.login.loginForm(data);
            },
        });
    };
    this.freetrialLogin = function () {
        $('.wrap').css('padding-bottom','0');
        console.log("freetrialLogin");
        var param = {
            'email': $("#member_id").val(),
            'password': $("#member_pw").val(),
            'device': $("#device").val(),
            'device_os': $("#device_os").val(),
            'model_number': $("#model_number").val(),
        };
        $.ajax({
            'url': '/api/auth/free/login',
            'method': 'POST',
            'data': param,
            'dataType': 'json',
            'async': false,
            headers: {
                'X-CSRF-Token': $("#csrf").val(),
            },
            error: function (request, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + + "\n" + "request:" + request +"\n" + "error:" + error);
                ShowNativeAlert.postMessage(request.responseJSON.message);
            },
            success: function (data) {

                console.log(data);
            },
        });
    };

    this.loginForm = function(data) {
        $('.wrap').css('padding-bottom','0');
        SendIsLoginPage.postMessage("false");
        let frm = $("#frm-login");
        let $row;
        frm.empty();
        $row = `<input type="hidden" name="_token" value="${$("#csrf").val()}">`;
        frm.append($row);
        for (let key in data) {
            $row = `<input type="hidden" name="${key}" value="${data[key]}">`;
            frm.append($row);
        }
        console.log('post data');
        frm.attr('action', mainUrl);
        frm.attr('method', 'post');
        frm.submit();
    }
    $(document).on('click', '#member_id, #member_pw, #exp_phone, #exp_code', function (){
        console.log('click');
        $('.wrap').css('padding-bottom','30%');
    });
    $(document).on('mouseup', '#member_id, #member_pw, #exp_phone, #exp_code', function (){
        console.log('mouseup');
        $('.wrap').css('padding-bottom','0');
    });
    $(document).on('click', '#find_member_id', function (){
        console.log('find_id');
        NewChromeWindow.postMessage('https://www.englishegg.co.kr/customMem/findIdprocess.php');
    });
    $(document).on('click', '#find_member_pw', function (){
        console.log('find_pw');
        NewChromeWindow.postMessage('https://www.englishegg.co.kr/customMem/orderpw.php');
    });
    $(document).on('click', '#move_store_btn', function (){
        console.log('move_store_btn');
        alert('move_store_btn');
        GoAppStore.postMessage('');
    });


};
let getDevice = function() {
    console.log('getDevice');
    NativeDeviceInfo.postMessage('device');
}
getDevice();
window.getNativeDeviceInfo = function($json) {
    let deviceData = JSON.parse($json);
    $('#device').val(deviceData.deviceId);
    $('#device_os').val(deviceData.os);
    $('#model_number').val(deviceData.modelName);
}


window.isLoginPage = function () {
    let isLoginPage = 'false';
    if (!$("#csrf").val() || $("#csrf").val() == '') {
        isLoginPage = 'true';
    }
    SendIsLoginPage.postMessage(isLoginPage);
}
function open_birth_popup(){
    $('.layer_popup').show();
}
function close_birth_popup(status){

    $('.layer_popup').hide();
}
open_birth_popup();
