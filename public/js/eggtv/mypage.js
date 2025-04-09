$(function () {
    getDeviceList();
    DeviceSearch();
    // 이용권 구매내역
    // $.ajax({
    //     'url': '/eggtv/service-pass',
    //     'method': 'get',
    //     'data': {},
    //     'dataType': 'json',
    //     'headers' : {
    //         'Authorization' : "Bearer " + $("#token").val()
    //     },
    //     error: function (request, error) {
    //         console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
    //     },
    //     success: function (data) {
    //         console.log('이용권 구매 내역');
    //         console.log(data);
    //         var cnt=1;
    //         data.forEach(function (value) {
    //
    //             $ticket = `<table class="tableA">
    //                 <colgroup>
    //                     <col style="width: 30%"/>
    //                     <col style="width: 70%"/>
    //                 </colgroup>
    //                 <tbody>
    //                 <tr>
    //                     <th>구매상품</th>
    //                     <td>${value.name}</td>
    //                 </tr>
    //                 <tr>
    //                     <th>결제일</th>
    //                     <td>${value.pay_date}</td>
    //                 </tr>
    //                 <tr>
    //                     <th>이용기간</th>
    //                     <td>${value.start_date} ~ ${value.end_date}</td>
    //                 </tr>
    //                 </tbody>
    //             </table>`;
    //             $('#ticket_info').append($ticket);
    //         });
    //         $(function(){
    //             $(".tableA").slice(0, 2).show(); // select the first ten
    //             if($(".tableA:hidden").length == 0){ // check if any hidden divs still exist
    //                 $('.gray_btn').hide(); // alert if there are none left
    //             }
    //             $(".gray_btn").click(function(e){ // click event for load more
    //                 e.preventDefault();
    //                 $(".tableA:hidden").slice(0, 2).show(); // select next 10 hidden divs and show them
    //                 if($(".tableA:hidden").length == 0){ // check if any hidden divs still exist
    //                     $('.gray_btn').hide(); // alert if there are none left
    //                 }
    //             });
    //         });
    //     },
    // });
    // END 이용권 내역
    // 로그아웃

    $(document).on('click', '#suc_input_birth', function (){
        check_member_birth();
    });
    // $(document).on('click', '.logout', function (){
    //     // if (confirm("정말 로그아웃 하시겠습니까?")) {
    //     // ShowNativeAlert.postMessage('알림 내용입니다. 앱이 곧 종료됩니다.');
    //
    //     LogOut.postMessage("");
    //     // }
    // });

    $(document).on('click','#go_editPage', function (){
        // Navigation.postMessage("https://www.englishegg.co.kr/customMem/before_control.php;");
        // NewChromeWindow.postMessage('https://www.englishegg.co.kr/egglounge/clubegg/?isapp=Y');
        NewChromeWindow.postMessage('https://www.englishegg.co.kr/customMem/before_control.php;');
    });

    $(document).on('click','#page_popup_stop', function (){
       close_birth_popup(1);
    });
    $(document).on('click', '#go_store_btn', function (){
        GoAppStore.postMessage('');
    });
    // 디바이스 등록
    $(document).on('click', '#add_btn', function (){
        var device_count = $('#device_cnt').val();
        var status = $('#device_status').val();
        var total_change = $('#change_cnt').val();
        var allowDevicesCount = $('#allowDevicesCount').val();
        var em_no = $('#em_no').val();
        // if(em_no == '85528' || em_no == '84246'){
        //     open_birth_popup();
        // }
        // 이미 등록된 기기라면
        if(status == 1){
            ShowNativeAlert.postMessage('이미 등록된 디바이스입니다.');
            return false;
        }
        // 등록 가능한 디바이스갯수 초과
        if(allowDevicesCount <= device_count){
            ShowNativeAlert.postMessage('디바이스 삭제 후 다시시도해주세요.');
            return false;
        }
        // 총 디바이스 등록 횟수
        // if(total_change > 100){
        //         ShowNativeAlert.postMessage('고객센터에 문의해주세요.');
        //         return false;
        // }
        // 디바이스 등록 총 갯수가 이빠이일때

        if(total_change > 2){
            // ShowNativeAlert.postMessage('본인인증을 진행해주세요.');
            if(total_change % 2 == 1){
                HideTabMenu.postMessage("");
                KcbCheck();
            }else{
                open_birth_popup();
            }

        }else{
            add_device();
        }
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
                getDeviceList();
                ShowNativeAlert.postMessage('디바이스 등록이 완료되었습니다.');
            },
        });
    }
    // 디바이스 삭제
    $(document).on('click', '.del', function (){
        var no = $(this).data('id');
        rm_device(no)
    });
    function rm_device(no){
        $.ajax({
            'url': '/eggtv/device',
            'method': 'delete',
            'data': {
                'device' : no
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
                ShowNativeAlert.postMessage('삭제가 완료되었습니다.');
                getDeviceList();
                DeviceSearch();
            },
        });
    }
    // END 디바이스 삭제
    // 디바이스 리스트 가져오기
    function getDeviceList(){
        $.ajax({
            'url': '/eggtv/device',
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
                console.log('디바이스 리스트 가져오기');
                console.log(data);
                $('#allowDevicesCount').val(data.allowDevicesCount);
                var devices = data.devices;
                $('.btm').html('');
                devices.forEach(function (value) {
                    if($('#device').val() == value.device_id){
                        $divece = `<p>${value.model_number}</p>`;
                    }else{
                        $divece = `<p>${value.model_number}
                            <button data-id="${value.device_id}" class="del none_blueScale">삭제</button>
                        </p>`;
                    }

                    $('.btm').append($divece);
                });
                $('.device_cnt').html(devices.length);
                $('#device_cnt').val(devices.length);
            },
        });
    }
    // END 디바이스 리스트 가져오기
    // 휴대폰 본인인증서비스
    function KcbCheck(){
        HideTabMenu.postMessage("");
        $("#go_kcb").submit();
    }
    // 유스비 1원계좌인증
    function UsebCertify(){
        showLoadingUI();
        // 토큰 생성
        $.ajax({
            'url': '/eggtv/app/mypage/signInToken',
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
                if(data.api_response == "N100"){
                    $('#useb_token').val(data.useb_token);
                    var token = data.useb_token;
                    const KYC_TARGET_ORIGIN = "https://kyc.useb.co.kr";
                    const KYC_URL = "https://kyc.useb.co.kr/auth";

                    const params = {
                        "access_token": token,
                        "name": $('#parent').val(),
                        "birthday": $('#hide_parent_birth').val(),
                        "phone_number": $('#member_hp').val(),
                        "email": $('#member_email').val()};  // access_token
                    const kycIframe = document.getElementById("kyc_iframe");
                    kycIframe.onload = function () {
                        let encodedParams = btoa(encodeURIComponent(JSON.stringify(params)));     // how to make a token by using base64 and url encoding
                        console.log('encodedParams : '+encodedParams);
                        kycIframe.contentWindow.postMessage(encodedParams, KYC_TARGET_ORIGIN);
                        hideLoadingUI();
                        startKYC();
                        kycIframe.onload = null;
                    };
                    kycIframe.src = KYC_URL;
                }else{
                    ShowNativeAlert.postMessage('잠시 후 다시시도해 주세요.');
                }

            },
        });
    }
    // 유스비 결과값[Data처리, UI처리]
    window.addEventListener("message", (e) => {
        console.log("alcherakyc response", e.data); // base64 encoded된 JSON 메시지이므로 decoded해야 함(needs to be decoded becaused it`s encoded by base64)
        console.log("origin :", e.origin);
        try {
            const decodedData = decodeURIComponent(atob(e.data));
            console.log("decoded", decodedData);
            const json = JSON.parse(decodedData);
            console.log("json", json);
            var parent_name = $('#parent').val();
            var phone = $('#member_hp').val();
            // 데이터처리 부분
            if (json.result === "success") {
                // TODO: KYC 인증을 성공한 경우 데이터 처리
                // console.log(json.result + "결과 서버 저장");
                console.log('success');
                var account_name = json.review_result.name;
                var account_hp = json.review_result.phone_number;
                console.log("인증한 이름 :::" + account_name);
                console.log("인증한 연락처 :::" + account_hp);
                if(json.review_result.result_type == 1){
                    if((account_name == parent_name) && (account_hp == phone)){
                        add_device();
                    }else{
                        ShowNativeAlert.postMessage('기기등록에 실패하였습니다. 회원가입한 회원명과 연락처로 인증을 진행해주세요.');
                    }
                }else{
                    ShowNativeAlert.postMessage('인증을 다시시도해 주세요.');
                }


            } else if (json.result === "failed") {
                console.log('failed');
                ShowNativeAlert.postMessage('본인인증에 실패하였습니다. CS에 문의해주세요.');
                // TODO: KYC 인증을 실패한 경우 데이터 처리 [인증번호 3번 틀렸을 때]
                // console.log(json.result + "결과 서버 저장");
            }
            // UI 처리
            else if (json.result === "complete") {

                console.log('complete');
                // TODO: KYC 인증을 성공(자동승인 or 심사필요 케이스 모두 포함) 후 UI 처리
                endKYC();
                // iframe이 포함된 UI를 종료
                // 고객사 서비스 UI를 다시 띄우고 상황에 맞는 UI 표시
                // 예시 : 자동승인 -> KYC인증이 완료되었습니다. 계좌개설이 완료되었습니다.
                // 예시 : 심사필요 -> KYC인증이 완료되었습니다. 심사가 완료된 이후 이메일로 안내 드리겠습니다.
            } else if (json.result === "close") {
                console.log('close');
                endKYC();
                // TODO: KYC 인증을 실패(자동거부 or 중도이탈) 후 UI 처리
                // iframe이 포함된 UI를 종료
                // 고객사 서비스 UI를 다시 띄우고 상황에 맞는 UI 표시
                // 예시 : 자동거부 -> KYC인증이 실패하였습니다. 다시 인증을 시도후 서비스 이용이 가능합니다.
            } else {
                console.log('invalid');
                // invalid result
                endKYC();
            }
        } catch (error) {
            console.log("wrong data", error);
        }
    });
    // 현재 디바이스 등록 여부
    function DeviceSearch(){
        $.ajax({
            'url': '/eggtv/device',
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
                console.log('디바이스 리스트 가져오기');
                console.log(data);
                var devices = data.devices;
                var chk_number = $('#model_number').val();
                var chk_id = $('#device').val();
                var result = 0;
                devices.forEach(function (value) {
                    if(chk_number == value.model_number && chk_id == value.device_id){
                        result = 1;
                    }
                });
                $('#device_status').val(result);
            },
        });
    }
    // END 현재 디바이스 등록 여부
    function showLoadingUI() {
        document.getElementById("loading_ui").style.display = "flex";
    }

    function hideLoadingUI() {
        document.getElementById("loading_ui").style.display = "none";
    }

    function startKYC() {
        HideTabMenu.postMessage("");
        document.getElementById("kyc").style.display = "block";
    }
    function endKYC() {
        ShowTabMenu.postMessage("");
        document.getElementById('kyc').style.display = 'none';
    }
    function check_member_birth(){
        var year = month = day = '';
        year = $('#birth_year').val();
        month = $('#birth_month').val();
        day = $('#birth_day').val();

        if(year == '' || month == '' || day == ''){
            ShowNativeAlert.postMessage('생년월일을 입력해주세요.');
            return false;
        }else{
            var birth = year+'-'+month+'-'+day;
            $('#hide_parent_birth').val(birth);
            close_birth_popup(0);
            UsebCertify();
        }

    }
    function open_birth_popup(){
        HideTabMenu.postMessage("");
        $('.layer_popup').show();
    }
    function close_birth_popup(status){

        $('.layer_popup').hide();
        if(status == '1'){
            ShowTabMenu.postMessage("");
        }else{

        }
    }
//     정회원 무료체험회원 구분
    function check_member_type(){
        var exp = 9990001; // 체험회원
        var expNew = 9990004; // 체험회원 The EGG 계정번호
        var free = 9990002; // 무료회원
        var freeNew = 9990003; // 무료체험 The EGG 계정번호
    }
    let getDevice = function() { //do 네이티브요청
        NativeDeviceInfo.postMessage('device'); // 디바이스 정보
    }
    getDevice();
    window.getNativeDeviceInfo = function($json) {  // return 리턴 데이터
        let deviceData = JSON.parse($json);
        var latest_version = '6.0.27';
        if($('#device_os').val() == 'Android'){
            latest_version = '6.0.27';
        }else{
            latest_version = '6.0.27';
        }
        // array로 변환
        var app_ver_ary = deviceData.appVersion.split(".");
        var lat_ver_ary = latest_version.split(".");

        $(".app_info_text").html(device_txt_1+' v'+ deviceData.appVersion +' <em class="pointR">'+device_txt_2+' v'+latest_version+'</em>');
        var app_version = deviceData.appVersion.replace('.', '');
        latest_version = latest_version.replace('.', '');
        if(lat_ver_ary[2] <= app_ver_ary[2]){
                $('#go_store_btn').css('background-color', '#dedbd4');
                $("#go_store_btn").prop("disabled", true);
        }
        // if(latest_version <= app_version){
        //     $('#go_store_btn').css('background-color', '#dedbd4');
        //     $("#go_store_btn").prop("disabled", true);
        // }
    }
    $(document).ready(function (){
        OnUiLoadingEnd.postMessage('');
    });

});

