$(function () {

    let play_count = 0;
    $.ajax({
        'url': `/eggtv/playStep`,
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
            for (var key in data) {
                $title = `<div class="date_top">
                    <span class="logo">
                        <img class="image-logo" src="${data[key].goodsTypeIconUrl}" alt="스탭로고" style="width: 9rem !important;">
                    </span>
                    <p class="date">${data[key].start_date} ~ ${data[key].end_date}</p>
                </div>`;
                $list = `<ul class="list list-play list-play${key}"> </ul>`;
                list = ".list-play"+play_count;
                $(`.contents`).append($title);
                $(`.contents`).append($list);
                for (var key2 in data[key].books) {
                    addBookData(list, data[key].books[key2], data[key].goods_type);
                    preloadImage(data[key].books[key2].bookImage, 'img-book-' + data[key].goods_type + data[key].books[key2].book_no);
                }
                play_count++;
            }
            console.log(data);
        },
    });


    function addBookData(list, row, goods_type) {
        $img = `<li class="item item-book">
                    <a class="link item-contents" href="#" onclick="return false;" data-step="${goods_type}" data-book_no="${row.book_no}">
                        <img class="image image-book" src='${defaultBookImg}' alt="교재 이미지" loading="lazy" id="img-book-${goods_type + row.book_no}" >
                    </a>
                </li>`;
        $(list).append($img);

    }
    // Flutter Native로 데이터를 보냄
    $(document).on('click', '.item-contents', function () {
        let step = $(this).data('step');
        let book_no = $(this).data('book_no');
        let new_play = step == 'GREEN' || step == 'YELLOW' || step == 'BLUE'? '&new_play=1' : '';
        location.href = `/eggtv/app/book?step=${step}&book_no=${book_no}${new_play}`;
    });
});
