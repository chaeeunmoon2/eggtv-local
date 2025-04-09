
// 디바이스 삭제
let isDownloading = false;
$(document).on('click', '#btn-pen-download', function (){
    let isChecked = false;
    $('.subscription_path').each(function () {
        if($(this).prop('checked') == true) {
            isChecked = true;
        }
    });
    if (isChecked && !isDownloading) {
        isDownloading = true;
        downloadStatus('start');
        $.ajax({
            'url': '/eggtv/app/mypage/pen/download',
            'method': 'post',
            'data': $('#frm-pen-download').serialize(),
            'dataType': 'json',
            'headers' : {
                'Authorization' : "Bearer " + $("#token").val()
            },
            error: function (request, error) {
                isDownloading = false;
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                //downloadStatus('end');
                ToastMessage.postMessage('다운로드 요청중 에러가 발생했습니다.');
            },
            success: function (data) {
                console.log(data);
                isDownloading = false;
                // downloadStatus('end');
                window.flutter_inappwebview.callHandler('handlerPenDown', data.url);
                // PenDownChannel.postMessage(data.url);
            },
        });
    } else {
        ToastMessage.postMessage('다운받을 음원을 선택해주세요.');
    }
});
$(document).on('click', '#subscription_path_all', function (){
    if ($(this).prop('checked') == false) {
        $('.subscription_path').prop('checked', false);
        $('#btn-pen-download').addClass('grey_btn', true);
        $('#btn-pen-download').removeClass('red_btn', true);
    }

    if ($(this).prop('checked') == true) {
        $('.subscription_path:not([disabled])').prop('checked', true);
        $('#btn-pen-download').addClass('red_btn', true);
        $('#btn-pen-download').removeClass('grey_btn', true);
    }
});
$(document).on('click', '.subscription_path', function (){

    let isChecked = false;
    $('#btn-pen-download').addClass('grey_btn', true);
    $('.subscription_path').each(function () {
        if($(this).prop('checked') == true) {
            isChecked = true;
        }
    });
    if (isChecked) {
        $('#btn-pen-download').addClass('red_btn', true);
        $('#btn-pen-download').removeClass('grey_btn', true);
    } else {
        $('#btn-pen-download').addClass('grey_btn', true);
        $('#btn-pen-download').removeClass('red_btn', true);
    }
    if ($(this).prop('checked') == false) {
        $('#subscription_path_all').prop('checked', false);
    }
});

// file download progress js
function setPercentage(percent) {
    const circle = $('circle.bar');
    const base = parseInt(circle.css('stroke-dasharray'), 10);
    const val = parseInt(percent, 10);
    const final = Math.abs(val * base / 100 - base);
    circle.css('stroke-dashoffset', final);
    $('.progress .percent').text(`${percent}%`);
}

function downloadStatus(status) {
    if (status === 'start') {
        $('#btn-pen-download .inner_text').text('다운받는 중');
        $('#btn-pen-download').removeClass('red_btn');
        $('#btn-pen-download').addClass('green_btn');
        setPercentage(0);
        // download progress 활성화
        $('#btn-pen-download').addClass('active');
    } else {
        $('#btn-pen-download .inner_text').text('다운받는 중');
        $('#btn-pen-download').removeClass('green_btn');
        $('#btn-pen-download').addClass('red_btn');
    }

    if (status === 'end') {
        $('#btn-pen-download .inner_text').text('다운로드 완료');
        $('#btn-pen-download').removeClass('green_btn');
        $('#btn-pen-download').addClass('red_btn');
        setPercentage(100);
        // download progress 비활성화
        $('#btn-pen-download').removeClass('active');
    }
}
window.addEventListener("flutterInAppWebViewPlatformReady", function(event) {
    // 앱 데이터 웹으로 받기
    window.flutter_inappwebview.callHandler('app2web')
        .then(function(result) {
            if(result!=null) {
                $.ajax({
                    'url': '/eggtv/app/mypage/pen/download/log',
                    'method': 'post',
                    'data': {
                        'list': result.toString()
                    },
                    'headers' : {
                        'Authorization' : "Bearer " + $("#token").val()
                    },
                });
            }
        });
});
//저장 폴더보기
$(document).on('click', '#save_folder_btn', function (){
    window.flutter_inappwebview.callHandler('PdsFind', 'find');
    return false;
});
