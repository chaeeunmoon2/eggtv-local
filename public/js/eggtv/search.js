$(function () {
    let step = $('#step').val();
    if ($('#txt-search').val() == '') {
        $.ajax({
            'url': `/eggtv/search/recent`,
            'method': 'get',
            'data': {},
            'dataType': 'json',
            'async': false,
            'headers' : {
                'Authorization' : "Bearer " + $("#token").val()
            },
            error: function (request, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (data) {
                console.log(data);

                for (var key in data) {
                    addRecentItem('recent', data[key]);
                };
                console.log(data);
            },
        });
        $.ajax({
            'url': `/eggtv/search/top`,
            'method': 'get',
            'data': {},
            'dataType': 'json',
            'async': false,
            'headers' : {
                'Authorization' : "Bearer " + $("#token").val()
            },
            error: function (request, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (data) {
                console.log(data);

                for (var key in data) {
                    addBestData('best', data[key]);
                };
            },
        });
    } else {
        searchbook($('#keyword').val());
    }

    $('.btn-get-search').on('click', function () {
        console.log($('#txt-search').val());
        $('.search_form').submit();
    });

    function searchbook(keyword) {
        let searchText = $('#search-message').data('message');

        $.ajax({
            'url': `/eggtv/search`,
            'method': 'get',
            'data': {
                'keyword' : keyword
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
                console.log(data);
                emptyRow();

                //{{ __('main.search_txt3') }}
                if (data.length === 0) {
                    $img = `<div class="item item-book" style="font-size: 3.2rem; color: #605a4f; padding: 0 11rem 0 11rem">
                        ${searchText}
                    </div>`;
                    $(`.list-book`).append($img);
                }
                for (var key in data) {
                    addRowData('book', data[key]);
                    preloadImage(data[key].img, 'img-book-' + data[key].goods_type + data[key].book_no);
                };
            },
        });
    }

    function removeKeyword(keyword) {

        $.ajax({
            'url': `/eggtv/search/remove`,
            'method': 'POST',
            'data': {
                'keyword' : keyword
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
                console.log(data);
            },
        });
    }

    $('.search-keyword').on('click', function () {
       $('#txt-search').val($(this).text());
       $('.btn-get-search').trigger('click');
    });
    $('.del').on('click', function () {
        let keyword = $(this).siblings('.search-keyword').text();
        console.log('del keyword : ' + keyword);
        removeKeyword(keyword);
        $(this).parent('.item-keyword').remove();
    });


    function addRowData(name, row) {
        if (row.ismember == 1) {
            $img = `<li class="item item-book">
                    <a class="link" href="/eggtv/app/book?step=${row.goods_type}&book_no=${row.book_no}">
                        <img class="image image-book" src='${defaultBookImg}' alt="교재 이미지" id="img-book-${row.goods_type + row.book_no}">
                    </a>
                </li>`;
        } else {
            $img = `<li class="item item-book inactive">
                    <a class="link" href="#" onclick="return false;">
                        <img src='${defaultBookImg}' alt="교재 이미지" id="img-book-${row.goods_type + row.book_no}">
                    </a>
                </li>`;
        }
        $(`.list-${name}`).append($img);

    }
    function addRecentItem(name, row) {
        $img = `<li class="item-keyword">
                    <a href="#" onclick="return false;" class="search-keyword">${row.keyword}</a>
                    <em class="del">삭제</em>
                </li>`;
        $(`.${name}-keyword`).append($img);

    }
    function addBestData(name, row) {
        $img = `<li class="item-keyword" data-num="${row.rank}">
                    <a href="#" onclick="return false;" class="search-keyword">
                        ${row.keyword}
                    </a>
                </li>`;
        $(`.${name}-keyword`).append($img);

    }
    function emptyRow() {
        $('.current_search').empty();
        $('.favorite_search').empty();
        $('.list-book').empty();
    }
});
