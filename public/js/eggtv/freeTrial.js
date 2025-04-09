$(function () {

    let mainUrl = '/eggtv/app/main';
    let loginForm = function(data) {
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

    // 신청 버튼
    $(document).on('click', '#apply_freeTrial', function (){
        var auth_state = $('#auth_state').val();
        if(auth_state == 'false'){
            ShowNativeAlert.postMessage('인증을 완료해주세요.');
            return false;
        }
        if($("#parents_name").val() == ''){
            ShowNativeAlert.postMessage("부모님 이름을 입력해주세요.");
            return false;
        }
        if($("#kid_name").val() == ''){
            ShowNativeAlert.postMessage("아이 이름을 입력해주세요.");
            return false;
        }
        if($('#select_center').val() == ''){
            ShowNativeAlert.postMessage("센터를 선택해주세요.");
            return false;
        }
        if($('#phone_number').val() == ''){
            ShowNativeAlert.postMessage("휴대폰 번호를 선택해주세요.");
            return false;
        }
        if($("#agree").is(":checked") == false){
            ShowNativeAlert.postMessage("이용약관에 동의해주세요.");
            return false;
        }
        $.ajax({
            'url': '/api/auth/free/login',
            'method': 'post',
            'data': {
                'name' : $("#kid_name").val(),
                'device': $("#device").val(),
                'device_os': $("#device_os").val(),
                'model_number': $("#model_number").val()
            },
            'dataType': 'json',
            headers: {
                'X-CSRF-Token': $("#csrf").val(),
            },
            error: function (request, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (data) {
                console.log(data);
                loginForm(data);
            },
        });
    });
    // 센터 불러오기
    $(document).on('change', '#select_area', function (){
        var selected = $("#select_area").val();

        if(selected == ''){
            $branch = '<option value="">센터를 선택해주세요.</option>>';
            $("#select_center").html($branch);
        }else{
            $.ajax({
                'url': '/eggtv/branches',
                'method': 'get',
                'data': {},
                'dataType': 'json',
                'headers' : {
                    'Authorization' : "Bearer " + $("#token").val()
                },
                error: function (request, error) {
                    console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                },
                success: function (data) {
                    console.log('지사코드 불러오기');
                    console.log(data);
                    $divece = '<option value="">센터를 선택해주세요.</option>>';
                    data.forEach(function (value) {
                        if(selected == value.sido){
                            $divece += `<option value="${value.brch_id}">${value.brch_name}</option>>`;
                        }
                    });
                    $('#select_center').html($divece);
                },
            });
        }
    });
//
    // 인증번호 요청
    $(document).on('click', '#auth_req', function (){
        var parent = $("#parents_name").val();
        var phone = $("#phone_number").val();
        var eb_no = $('#select_center').val();
        var name = $('#kid_name').val();
        if ( /^010-[0-9]{4}-[0-9]{4}$/.test( phone ) ) {
            console.log('true');
        } else {
            console.log('else');
            // $('.auth-phone-msg').text('휴대폰 번호를 정확히 입력해주세요.');
            // return false;
        }
        if(phone == '' || phone.length < 10){
            $('.auth-phone-msg').text('휴대폰 번호를 입력해주세요.');
            return false;
        }else{
            $.ajax({
                'url': '/api/auth/free/code',
                'method': 'post',
                'data': {
                    'phone':phone,
                    'eb_no': eb_no,
                    'parent':parent,
                    'countryCode':82,
                    'name' : name
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
                    $('#auth_number').val(data.code);
                    $('.auth-phone-msg').text('인증번호가 발송되었습니다.');
                    console.log('인증번호 :::' + $('#auth_number').val());
                },
            });
        }
    });
//  인증번호확인
    $(document).on('click', '#auth_chk', function (){
        var input_number = $('#input_auth_number').val();
        var auth_number = $('#auth_number').val();
        if(input_number == ''){
            $('.auth-number-msg').text('인증번호를 입력해주세요.');
            return false;
        }
        if(auth_number != input_number){
            $('.auth-number-msg').text('인증번호를 확인해주세요.');
            return false;
        }else{
            $('.auth-number-msg').text('인증이 완료되었습니다.');
            $('#auth_state').val('true');
        }
    });

    $(document).keyup('#input_auth_number', function () {
        var $btnSubmit = $('#auth_chk');

        if($('#input_auth_number').val().length >= 4) {
            $btnSubmit.addClass('btn-active');
            $btnSubmit.removeClass('btn-default');
        } else {
            $btnSubmit.addClass('btn-default');
            $btnSubmit.removeClass('btn-active');
        }

    });
    $(document).on('click', '.cancel_btn', function (){
        location.href ='/eggtv/app/login';
    });
    //phone_number

});

