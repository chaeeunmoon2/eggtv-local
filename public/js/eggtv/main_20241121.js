$(document).ready(function () {
    // test
    checkPayStatus();
    let contents = {};
    let screenWidth = document.body.scrollWidth;
    let viewContents = {
        'watch' : '/eggtv/watching/view',
        'recommends' : '/eggtv/recommends/view',
        'bookmarkVod' : '/eggtv/bookmark/vod/view',
        'bookmarkAudio': '/eggtv/bookmark/song/view',
    };

    function checkPayStatus() {
        $.ajax({
            'url': '/eggtv/pay',
            'method': 'get',
            'data': {
                'json_token':$("#json_token").val()
            },
            'dataType': 'json',
            'headers' : {
                'Authorization' : "Bearer " + $("#token").val()
            },
            error: function (request, error) {
//                location.reload();
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (data) {
                // console.log(data);
                if (data.paytype != 'service') {
                    if(data.url == '') {
                        data.url = '/eggtv/app/login';
                    }
                    $('.txt-pop').text(data.msg);
                    $('.btn-pop').text(data.buttons[0]);
                    //$('.btn-pop').attr('href', data.url);

                    if(data.url == '/eggtv/app/login') {
                        $('.btn-pop').attr('href', data.url);
                    }else{
                        $('.btn-pop').attr('href', data.url);
                        $('.btn-pop').addClass('new_open_btn');
                    }

                    $('.normal_pop').css('display', 'block');
                }
                getAllContents();
            },
        });
        return true;
    }
    function checkDeviceStatus() {
        $.ajax({
            'url': '/eggtv/device',
            'method': 'post',
            'data': {
                'fcmToken':$('#fcmToken').val()
            },
            'dataType': 'json',
            'headers' : {
                'Authorization' : "Bearer " + $("#token").val()
            },
            statusCode: {
                201:function(data) {
                    console.log('기기등록 완료*');
                },
                204:function(data) {
                    $('.txt-pop').text('디바이스 2개만 등록 가능합니다.');
                    $('.btn-pop').text('기기등록');
                    $('.btn-pop').addClass('btn-mypage');
                    $('.static_pop').css('display', 'block');
                },
            },
            error: function (request, error) {
//                location.reload();
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (data) {
            },
        });
        return true;
    }
    function checkEnv() {
        $.ajax({
            'url': '/eggtv/env',
            'method': 'post',
            'data': {
            },
            'dataType': 'json',
            'headers' : {
                'Authorization' : "Bearer " + $("#token").val()
            },
            error: function (request, error) {
//                location.reload();
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (data) {
                // console.log(data);
            },
        });
        return true;
    }


    window.refreshWatching = function() {

        $.ajax({
            'url': '/eggtv/watching',
            'method': 'get',
            'data': {
                'num' : 10
            },
            'dataType': 'json',
            'headers' : {
                'Authorization' : "Bearer " + $("#token").val()
            },
            error: function (request, error) {
//                location.reload();
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (data) {
                setContentsData('/eggtv/watching/view', 'watch');
                $('.list-watching').empty();
                data.contents.forEach(function (value) {
                    $img = getContentTag(value, 'list-watching');
                    $('.list-watching').append($img);
                    imgUrl = value.img_url.replace('content.englishegg.co.kr' , 'de2tho0n83703.cloudfront.net');
                    loadImage(imgUrl, 'list-watching-' + value.vod_code);
                });
                // console.log(data);
                $('.list-watching > .default').remove();
            },
        });
    }
    window.getNativeDeviceInfo = function($json) {
        let deviceData = JSON.parse($json);
        $('#fcmToken').val(deviceData.fcmToken);
        checkDeviceStatus();
    }

    let init = async function() {
        checkPayStatus();
        NativeDeviceInfo.postMessage('device');
        Navigation.postMessage("main_page");
    }
    let getAllContents = function() {
        $.ajax({
            'url': '/eggtv/recommends',
            'method': 'get',
            'data': {
                'num' : 10
            },
            'dataType': 'json',
            'headers' : {
                'Authorization' : "Bearer " + $("#token").val()
            },
            error: function (request, error) {
//                location.reload();
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (data) {
                $('.list-recommend').empty();
                data.contents.forEach(function (value) {
                    $img = getContentTag(value, 'recommends');
                    imgUrl = value.img_url.replace('content.englishegg.co.kr' , 'de2tho0n83703.cloudfront.net');
                    preloadImage(imgUrl, 'recommends-' + value.vod_code);
                    $('.list-recommend').append($img);
                });
                // console.log(data);
                $('.list-recommend > .default').remove();
            },
        });
        window.getBookmark();


        $.ajax({
            'url': '/eggtv/recommends-audio',
            'method': 'get',
            'data': {
                'num' : 10
            },
            'dataType': 'json',
            'headers' : {
                'Authorization' : "Bearer " + $("#token").val()
            },
            error: function (request, error) {
//                location.reload();
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (data) {
                if(data.contents.length == 0) {
                    $('.recommend-audio-title').hide();
                }
                $('.list-recommendAudio').empty();
                data.contents.forEach(function (value) {
                    $img = getContentTag(value, 'recommendAudio');
                    $('.list-recommendAudio').append($img);
                    imgUrl = value.img_url.replace('content.englishegg.co.kr' , 'de2tho0n83703.cloudfront.net');
                    preloadImage(imgUrl, 'recommendAudio-' + value.vod_code);
                });
                // console.log(data);
                $('.list-recommendAudio > .default').remove();
            },
        });
    }

    let getViewContents = function() {

        setContentsData('/eggtv/watching/view', 'watch');
        setContentsData('/eggtv/recommends/view', 'recommends');
        setContentsData('/eggtv/bookmark/vod/view', 'bookmarkVod');
        setContentsData('/eggtv/bookmark/song/view', 'bookmarkAudio');
    }


    // 데이터를 페이지 전역변수 값에 넣는다.
    function setContentsData(url)
    {
        $.ajax({
            'url': url,
            'method': 'get',
            'data': {},
            'dataType': 'json',
            'async':false,
            'headers' : {
                'Authorization' : "Bearer " + $("#token").val()
            },
            error: function (request, error) {
//                location.reload();
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (data) {
                contents = data;
                // console.log(data);
            },
        });

    }

    function logContents()
    {
        // console.log(contents);
    }

    $(document).on('click','.new_open_btn', function (){
        NewChromeWindow.postMessage('https://www.englishegg.com/customMem/eggtv/buy.php');
    });

    // Flutter Native로 데이터를 보냄
    $(document).on('click', '.btn-banner', function () {
        $("#book-step").val($(this).data('step'));
        $("#book-index").val($(this).data('index'));
        $("#index").val($(this).data('index'));
        $("#book-title").val($(this).data('title'));
        $("#book-sub-title").val($(this).data('subtitle'));
        $("#frm-book").submit();
    });


    // Flutter Native로 데이터를 보냄
    $(document).on('click', '.item-contents', function () {
        logContents();
    });

    // Flutter Native로 데이터를 보냄
    $(document).on('click', '.item-contents', function () {
        let vodCode = $(this).data('vod_code');
        let category = $(this).data('category');
        setContentsData(viewContents[category]);
        contents.startPlayIndex = contents.contents.findIndex(value => value.vod_code == vodCode);
        // console.log(vodCode);
        // console.log(contents);
        NewMediaInfoList.postMessage(JSON.stringify(contents));
    });

    $(document).on('click', '.item-contents_test', function () {
        NewChromeWindow.postMessage('https://www.englishegg.com/contents/EggShow/');
//         let vodCode = $(this).data('vod_code');
//         let category = $(this).data('category');
//
//         $.ajax({
//             'url': viewContents[category],
//             'method': 'get',
//             'data': {
//                 'type': 'free'
//             },
//             'dataType': 'json',
//             'async':false,
//             'headers' : {
//                 'Authorization' : "Bearer " + $("#token").val()
//             },
//             error: function (request, error) {
// //                location.reload();
//                 console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
//             },
//             success: function (data) {
//                 contents = data;
//                 // console.log(data);
//             },
//         });
//         contents.startPlayIndex = contents.contents.findIndex(value => value.vod_code == vodCode);
//         // console.log(vodCode);
//         // console.log(contents);
//         NewMediaInfoList.postMessage(JSON.stringify(contents));
    });

    init();
    // Native
    window.onDisposeUserPage = function (){
        // console.log('뾰로롱');
        $.ajax({
            'url': '/eggtv/device',
            'method': 'post',
            'data': {
                'fcmToken':$('#fcmToken').val()
            },
            'dataType': 'json',
            'headers' : {
                'Authorization' : "Bearer " + $("#token").val()
            },
            statusCode: {
                201:function(data) {
                    console.log('기기등록 완료*');
                },
                204:function(data) {
                    $('.txt-pop').text('디바이스 2개만 등록 가능합니다.');
                    $('.btn-pop').text('기기등록');
                    $('.btn-pop').addClass('btn-mypage');
                    $('.static_pop').css('display', 'block');
                },
            },
            error: function (request, error) {
//                location.reload();
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (data) {
            },
        });
    }

});
