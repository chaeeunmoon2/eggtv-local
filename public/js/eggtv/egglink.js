$(function () {
    $.ajax({
        'url': `/eggtv/egglink`,
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

            for (var key in data) {
                addRowData(data[key]);
            }
            console.log(data);
        },
    });

    function addRowData(row) {
        $img = `<li style="box-shadow: none; border-radius: 0;">
                    <a class="link" href="${row.webUrl}&isapp=N">
                        <div class="imgarea">
                            <img class="image image-eggletter" src='${row.thumbUrl}' alt="${row.webViewTitle}">
                        </div>
                    </a>
                </li>`;
        $(`.list-egglink`).append($img);

    }

    // 가운데 정렬 해결하기위해 임시 마지막줄
    function addLastRow() {

        for(i = 0; i<6; i++) {
            $img = `<li class="item item-egglink">
                </li>`;
            $(`.list-egglink`).append($img);
        }
    }
    function emptyRow() {
        $('.list').empty();
    }
    function getBookmarkTag(row)
    {
        let $result;
        if(row.bookmark === 1) {
            $result = `<div class="btn-bookmark bookmark-on" bookmark="${row.bookmark}" goods_type="${row.goods_type}" vod_code="${row.vod_code}"> ♡ </div>`;
        } else {
            $result = `<div class="btn-bookmark bookmark-off" bookmark="${row.bookmark}" goods_type="${row.goods_type}" vod_code="${row.vod_code}"> ♡ </div>`;
        }
        return $result;
    }

    function addRelation(row)
    {
        $img = `<li class="item item-book">
                    <a class="link" href="/eggtv/app/book?step=${row.goods_type}&book_no=${row.book_no}">
                        <img class="image image-book" src='${row.imgUrl}' alt="교재 이미지">
                    </a>
                    ${row.goods_type}
                </li>`;
        $(`.list-relation`).append($img);

    }
});
