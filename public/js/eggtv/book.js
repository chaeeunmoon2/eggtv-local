$(document).ready(function () {
    let step = $('#step').val();
    let book_no = $('#book_no').val();
    let viewContents = {};

    $('.step_contents').hide();



    $(window).resize(function(){
        startSlidSwiper();
    });
            //카드슬라이드

    let startSlidSwiper = function() {
        let screenRate = window.innerWidth / window.innerHeight;
        let perView = 1;
        if (screenRate > 1) {
            perView = 5.2;
        } else {
            perView = 3.5;
        }
        var cardSwiper = new Swiper(".card_slide", {
            slidesPerView: perView,
            spaceBetween: 10,
            freeMode: true,
        });


        if (screenRate > 1) {
            perView = 3.1;
        } else {
            perView = 2.1;
        }
        //영상 슬라이드
        var videoSwiper = new Swiper(".video_slide", {
            slidesPerView: perView,
            spaceBetween: 10,
            freeMode: true,
        });
        //음원 슬라이드
        if (screenRate > 1) {
            perView = 5.2;
        } else {
            perView = 3.8;
        }
        var soundSwiper = new Swiper(".sound_slide", {
            slidesPerView: perView,
            spaceBetween: 15,
            freeMode: true,
        });
    }
    $.ajax({
        'url': `/eggtv/books/relations/${step}/${book_no}`,
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

            if(data.length > 0) {
                $('.step_contents').show();
            }
            $(`.list-relation`).empty();
            for (var key in data) {
                $('.title-relation').text('연계컨텐츠');
                addRelation(data[key]);
                imgUrl = data[key].imgUrl.replace('content.englishegg.co.kr' , 'de2tho0n83703.cloudfront.net');
                preloadImage(imgUrl, 'img-book-' + data[key].goods_type + data[key].book_no);
            };
            console.log(data);
        },
    });

    function setContentsData()
    {
        $.ajax({
            'url': `/eggtv/${step}/books/${book_no}/view`,
            'method': 'get',
            'data': {},
            'dataType': 'json',
            'async':false,
            'headers' : {
                'Authorization' : "Bearer " + $("#token").val()
            },
            error: function (request, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (data) {
                viewContents = data;
                console.log(viewContents);
            },
        });
    }

    function addRowData(name, value) {
            let $bookmark = getBookmarkTag(value);
            let progress = value.watchingTime * 100 / value.mediaTotalTime;
            if(value.type == 'vod') {
                $category = `style="float: left"`;
                defaultImg = defaultVideoImg;
            } else {
                $category = ''
                defaultImg = defaultAudioImg;
            }
            $img = `<li class="swiper-slide item">
                <a href="#" onclick="return false;" class="item-contents" data-vod_code="${value.vod_code}" data-type="${value.type}">
                    <div class="thumnail">
                        <img src='${defaultImg}' alt="${value.content_title}" ismember="${value.ismember}" alt="" loading="lazy" id="img-${value.vod_code}"/>
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
                    <p class="category" ${$category}>${value.category}</p>
                    ${$bookmark}
                </div>
            </li>`;
        $(`.list-${name}`).append($img);

    }

    // 가운데 정렬 해결하기위해 임시 마지막줄
    function addLastRow(name) {

        for(i = 0; i<6; i++) {
            $img = `<li class="item item-video">
                </li>`;
            $(`.list-${name}`).append($img);
        }
    }
    function emptyRow() {
        $('.list').empty();
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

    function addRelation(row)
    {
        if (row.purchase == 1) {
            $img = `<li class="swiper-slide item">
                    <a class="link" href="/eggtv/app/book?step=${row.goods_type}&book_no=${row.book_no}">
                        <img class="image image-book" src='${defaultBookImg}' alt="교재 이미지" purchase="${row.purchase}" id="img-book-${row.goods_type + row.book_no}">
                    </a>
                    <div class="info">
                        <p class="category">${row.goods_title}</p>
                    </div>
                </li>`;
        } else {
            $img = `<li class="swiper-slide item inactive">
                            <a href="#" onclick="return false;">
                                <img src='${defaultBookImg}' alt="${row.title}" purchase="${row.purchase}" id="img-book-${row.goods_type + row.book_no}">
                            </a>
                        </li>`;
        }
        $(`.list-relation`).append($img);

    }
    // Flutter Native로 데이터를 보냄
    $(document).on('click', '.item-contents', function () {
        let vodCode = $(this).data('vod_code');
        let type = $(this).data('type');
        setContentsData();
        viewContents.contentsType = viewContents.contentsType + '_' + type;

        viewContents.contents = viewContents.contents.filter(content => content.type == type);
        viewContents.startPlayIndex = viewContents.contents.findIndex(content => content.vod_code == vodCode);
        // if ($('#new_play').val() == '1') {
        //     viewContents.contents = viewContents.contents.filter(function (item) {
        //         if (item.category == 'Sitcom' || item.category == 'Animation' || item.category == 'Song&Dance') return item;
        //     });
        // }
        console.log(type);
        console.log(vodCode);
        console.log(viewContents);
        NewMediaInfoList.postMessage(JSON.stringify(viewContents));
    });

    startSlidSwiper();
});
