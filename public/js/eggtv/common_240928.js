$(document).ready(function () {
  //블루투스 토
    // $(".bluetooth").on("click", function () {
//    $(this).toggleClass("on");
//  });

  //고정헤더(step)
  $(window).scroll(function(){
    let scrollCheck = $(window).scrollTop();
    // console.log(scrollCheck)

    //stepHeader
    if (scrollCheck > 0) {
      $(".move_header").addClass("scroll");
    } else {
      $(".move_header").removeClass("scroll");
    }
  })

});

$(function () {
    //stepHeader
    if ($(window).scrollTop() > 0) {
        $(".move_header").addClass("scroll");
    } else {
        $(".move_header").removeClass("scroll");
    }
    $('.prev_arrow, .btn-close').on('click', function () {
        let index = $(this).data('index');
        if (index == '' || !index) {
            history.back();
        } else {
            location.href = '/eggtv/app/main?index=' + index;
        }
    });
    $('.btn-back').on('click', function () {
        Navigation.postMessage("close");
    });
    $('.btn-home').on('click', function () {
        if($('.btn-home').hasClass('guide-home') == true){
            Navigation.postMessage("home");
        }else{
            location.href = '/eggtv/app/main';
        }
    });
    $('.btn-eggtalk').on('click', function () {
        Navigation.postMessage("guide");
        // location.href = '/eggtv/app/guide';
    });
    $('.btn-search').on('click', function () {
        location.href = '/eggtv/app/search';
    });
    $(document).on('click', '.btn-mypage', function() {
        Navigation.postMessage('user_page');
        $('.normal_pop').css('display', 'none');
    });
    $('.btn-bluetooth').on('click', function () {
        Navigation.postMessage('bluetooth');
    });
    $('.logo').on('click', function () {
        NativeDeviceInfo.postMessage('device');
    });

    //블루투스 토글
    $(document).on("click", '.blutooth', function () {
        $(this).toggleClass("on");
    });

    $(document).on('click', '.like', function () {
        let bookmark = $(this).hasClass("on");
        if(bookmark){
            bookmark = 0;
        } else {
            bookmark = 1;
        }
        $(this).toggleClass("on");
        // console.log('change bookmark');
        let vodCode = $(this).data('vod_code');
        $.ajax({
            'url': '/eggtv/bookmark/',
            'method': 'post',
            'data': {
                "goods_type": $(this).data('goods_type'),
                "vod_code": $(this).data('vod_code')
            },
            'dataType': 'json',
            'async': false,
            'headers' : {
                'Authorization' : "Bearer " + $("#token").val()
            },
            error: function (request, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (data) {
                // console.log('change bookmark : ' + vodCode);
                let jsonData = JSON.stringify({
                    'vod_code':vodCode,
                    'bookmark':bookmark,
                });
                BookmarkUpdated.postMessage(jsonData);
                window.getBookmark();
            },
        });
    });


    //
    $(document).on('click', '.btn-get-title', function () {
        changePage('str from flutter');
        // console.log(count);
    });
    $(document).on('click', '.item', function () {
        window.changePage('click item');
    });
    $(document).on('click', '#toggle_slide01', function () {
        // console.log($(this).prop('checked'));
        let isPush = 'Y';
        if ($(this).prop('checked')) {
            isPush = 'Y';
        } else {
            isPush = 'N';
        }
        $.ajax({
            'url': '/eggtv/push/',
            'method': 'post',
            'data': {
                "ispush": isPush,
            },
            'dataType': 'json',
            'async': false,
            'headers' : {
                'Authorization' : "Bearer " + $("#token").val()
            },
            error: function (request, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (data) {
                window.getBookmark();
            },
        });
    });
});

let defaultBookImg = '/img/thumnail/book01.png';
let defaultBannerImg = '/img/common/banner_default.png';
let defaultVideoImg = '/img/guide/letter_default.png';
let defaultAudioImg = '/img/thumnail/pop_audio_default.png';
let defaultPopVideoImg = '/img/thumnail/pop_video_default.png';
preloadImage(defaultBookImg);
preloadImage(defaultBannerImg);
preloadImage(defaultVideoImg);
preloadImage(defaultBannerImg);
preloadImage(defaultAudioImg);
preloadImage(defaultPopVideoImg);


function preloadImage(src, id) {
    let img = new Image();
    img.src = src;
    if(src !== defaultBookImg) {
        img.onload = function() {
            $('#' + id).attr('src', src);
        }
    }
}

function loadImage(src, id) {
    let img = new Image();
    img.src = src;
    $('#' + id).attr('src', src);
}

let count = 0;
window.changePage = function (str) {
    count++;
    $('.main-logo').text(count + " : test0" + str);
}
let changePage = function (str) {
    count++;
    $('.main-logo').text(count + " : test1" + str);
}

let vod_code = '';
let goods_type = '';
let watchingTime = 0;
let mediaTotalTime = 0;
let recordTime = 0;

window.onBluetoothStateUpdate = function(data){
    if(data == 'true' || data == true) {
        $('.btn-bluetooth').addClass('on');
    } else {
        $('.btn-bluetooth').removeClass('on');
    }
};


window.updateBookmarkValue = function($json) {
    let requestData = JSON.parse($json);
    let vodCode = requestData.vod_code;
    $('.like').each(function() {

        if($(this).data('vod_code') === vodCode) {
            $(this).toggleClass('on');
        }
    });
    $(this).toggleClass("on");
    $.ajax({
        'url': '/eggtv/bookmark/',
        'method': 'post',
        'data': requestData,
        'dataType': 'json',
        'async': false,
        'headers' : {
            'Authorization' : "Bearer " + $("#token").val()
        },
        error: function (request, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        },
        success: function (data) {
            //window.getBookmark();
            // console.log('change bookmark : ' + vodCode);
            location.reload();
        },
    });
}

window.startRecordWatchTime = function ($json) {
    let requestData = JSON.parse($json);
    $.ajax({
        'url': '/eggtv/watch/',
        'method': 'post',
        'data': requestData,
        'dataType': 'json',
        'async': false,
        'headers' : {
            'Authorization' : "Bearer " + $("#token").val()
        },
        error: function (request, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        },
        success: function (data) {
        },
    });

}

window.updateWatchTime = function ($json) {
    // alert($json);
    // console.log($json);
    let requestData = JSON.parse($json);
    $.ajax({
        'url': '/eggtv/watching/',
        'method': 'post',
        'data': requestData,
        'dataType': 'json',
        'async': false,
        'headers' : {
            'Authorization' : "Bearer " + $("#token").val()
        },
        error: function (request, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        },
        success: function (data) {
        },
    });
}

window.onNewOidRead = function (loop, oid) {
    // console.log(`loop : ${loop}, oid : ${oid}`);
    if(loop == 'false') {
        loop = false;
    }
    $.ajax({
        'url': '/eggtv/bluetooth/',
        'method': 'get',
        'data': {
            'oid':oid,
            'loop':loop,
        },
        'dataType': 'json',
        'async': false,
        'headers' : {
            'Authorization' : "Bearer " + $("#token").val()
        },
        error: function (request, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        },
        success: function (data) {
            // console.log(data);
            NewMediaInfoList.postMessage(JSON.stringify(data));
        },
    });
}

window.getBookmark = function () {
    $.ajax({
        'url': '/eggtv/bookmark/vod',
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
                $('.bookmark-vod-title').hide();
            }
            $('.list-bookmarkVod').empty();
            data.contents.forEach(function (value) {
                $img = getContentTag(value, 'bookmarkVod');
                $('.list-bookmarkVod').append($img);
                imgUrl = value.img_url.replace('content.englishegg.co.kr' , 'de2tho0n83703.cloudfront.net');
                preloadImage(imgUrl, 'bookmarkVod-' + value.vod_code);
            });
            // console.log(data);
            $('.list-bookmarkVod > .default').remove();
        },
    });
    $.ajax({
        'url': '/eggtv/bookmark/song',
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
                $('.bookmark-audio-title').hide();
            }
            $('.list-bookmarkAudio').empty();
            data.contents.forEach(function (value) {
                $img = getContentTag(value, 'bookmarkAudio');
                $('.list-bookmarkAudio').append($img);
                imgUrl = value.img_url.replace('content.englishegg.co.kr' , 'de2tho0n83703.cloudfront.net');
                preloadImage(imgUrl, 'bookmarkAudio-' + value.vod_code);
            });
            // console.log(data);
            $('.list-bookmarkAudio > .default').remove();
        },
    });
}

window.setWarningActionLog = function($json) {
    let data = JSON.parse($json);
    $.ajax({
        'url': '/eggtv/warning',
        'method': 'post',
        'data': data,
        'dataType': 'json',
        'headers' : {
            'Authorization' : "Bearer " + $("#token").val()
        },
        error: function (request, error) {
//                location.reload();
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        },
        success: function (data) {

        },
    });
}
// window.BookmarkUpdated = function($json) {
//     let requestData = JSON.parse($json);
//     let vodCode = requestData.vod_code;
//     let bookmark = requestData.bookmark;
//     console.log('change BookmarkUpdated vodCode : ' + vodCode + ", bookmark : " + bookmark);
//     $('.like').each(function() {
//         if($(this).data('vod_code') === vodCode) {
//             if(bookmark == 1) {
//                 $(this).addClass('on');
//             } else {
//                 $(this).removeClass('on');
//             }
//         }
//     });
// }

window.setInAppPaymentLog = function($json) {
    // 추후 인앱 관련 행동 기록
}


function getContentTag(value, category)
{
    let $bookmark = getBookmarkTag(value);
    let progress = value.watchingTime * 100 / value.mediaTotalTime;
    let defaultThumb = '';
    if(value.channelName == 'vod') {
        defaultThumb = defaultVideoImg;
    }
    if(value.channelName == 'audio') {
        defaultThumb = defaultAudioImg;
    }
    return `<li class="swiper-slide item">
            <a href="#" onclick="return false;" class="item-contents" data-vod_code="${value.vod_code}" data-category="${category}">
                <div class="thumnail">
                    <img src='${defaultThumb}' alt="${value.content_title}" ismember="${value.ismember}" alt="" id="${category}-${value.vod_code}" />
                    <div class="video_progress">
                      <span class="bar" style="width: ${progress}%"></span>
                    </div>
                </div>
            </a>
            <div class="info">
                <p class="title">
                    <span class="logo">
                        <img class="image-logo" src='${value.goodsTypeImg}' alt="스탭로고">
                    </span>
                    ${value.content_title}
                </p>
                <p class="category">${value.category}</p>
                ${$bookmark}
            </div>
        </li>`;
}

function getBookmarkTag(value)
{
    let $result;
    if(value.bookmark === 1) {
        $result = `<button class="like on" aria-label="즐겨찾기" data-bookmark="${value.bookmark}" data-vod_code="${value.vod_code}" data-goods_type="${value.goods_type}"></button>`;
    } else {
        $result = `<button class="like" aria-label="즐겨찾기" data-bookmark="${value.bookmark}" data-vod_code="${value.vod_code}" data-goods_type="${value.goods_type}"></button>`;
    }
    return $result;
}

window.isLoginPage = function () {
    let isLogin = true;
    if (!$("#token").val() || $("#token").val() == '') {
        isLogin = false;
    }
    SendIsLoginPage.postMessage(isLogin);
}

// 쿠키 설정 함수
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // 하루 동안 유지
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/;`;
}

// 쿠키 가져오기 함수
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const [cookieName, cookieValue] = cookies[i].split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}
