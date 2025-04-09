$(function () {
    let viewContents;
    let step = $('#step').val();
    let autoPlay = 0;
    $.ajax({
        'url': `/eggtv/books/${step}/images/vod`,
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

            data.data.forEach(function (value) {
                addRowData('vod', value);
            });
            addLastRow();
            console.log(data);
        },
    });
    $.ajax({
        'url': `/eggtv/books/${step}/images/audio`,
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

            data.data.forEach(function (value) {
                addRowData('audio', value);
            });
            addLastRow();
            console.log(data);
        },
    });


    function addBookData(name, row) {
        $img = `<li class="item-book">
                    <a class="link" href="/eggtv/app/book?step=${step}&book_no=${row.volume}">
                        <img class="image image-book" src='${defaultBookImg}' alt="교재 이미지" id="book-${row.volume}">
                    </a>
                </li>`;
        $(`.list-${name}`).append($img);

    }

    function addRowData(name, row) {
        imgUrl = row.img.replace('content.englishegg.co.kr' , 'de2tho0n83703.cloudfront.net');
        $img = `<li class="item item-book" style="box-shadow: 0rem 0rem 0rem rgba(42, 42, 42, 0.2) !important;">
                    <a class="link item-contents" href="#" onclick="return false;" data-step="${step}" data-book_no="${row.volume}" data-play_type="${name}">
                        <img class="image image-book" src='${imgUrl}' alt="교재 이미지" onerror="this.src='/img/thumnail/pop_${name}_default.png'"  style="  -webkit-filter: drop-shadow(1px 1px 0 #f4f4f4)
                  drop-shadow(-1px -1px 0 #f4f4f4);
  filter: drop-shadow(1px 1px 0 #f4f4f4)
          drop-shadow(-1px -1px 0 #f4f4f4);">
                    </a>
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


    function setContentsData(type)
    {
        $.ajax({
            'url': `/eggtv/pling/${type}/${step}/`,
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


    // Flutter Native로 데이터를 보냄
    $(document).on('click', '.item-contents', function () {
        let bookNo = $(this).data('book_no');
        let play_type = $(this).data('play_type');
        let type = '';
        step = $('#step').val();
        if (play_type == 'audio') {
            type = 'song';
        } else {
            type = 'vod';
        }

        setContentsData(type);
        viewContents.clickedBookNo = bookNo;
        viewContents.startPlayIndex = viewContents.contents.find(function(item) {
            return item.book_no == bookNo
        }).index;
        console.log(bookNo);
        console.log(viewContents);
        NewMediaInfoList.postMessage(JSON.stringify(viewContents));
    });

    window.playNextStep = function(next, type) {
        let bookNo = 1;
        let playType = '';
        step = next;
        if (type == 'audio') {
            playType = 'song';
        } else {
            playType = 'vod';
        }
        setContentsData(playType);
        viewContents.clickedBookNo = 1;
        viewContents.startPlayIndex = 0;
        console.log(bookNo);
        console.log(viewContents);
        NewMediaInfoList.postMessage(JSON.stringify(viewContents));
    }
});
