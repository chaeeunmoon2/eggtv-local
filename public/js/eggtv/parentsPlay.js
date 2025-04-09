$(function () {
    $.ajax({
        'url': `/eggtv/guid/parents-play`,
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

            data.forEach(function (value) {
                addBookData('book', value);
            });
            addLastRow();
            console.log(data);
        },
    });


    function addBookData(name, row) {
        $img = `<li class="item item-book">
                    <a class="link" href="${row.webUrl}">
                        <img class="image image-book" src='${row.thumbUrl}' alt="교재 이미지">
                    </a>
                </li>`;
        $(`.list-${name}`).append($img);

    }

    function addRowData(name, row) {
        $img = `<li class="item item-book">
                    <a class="link" href="#" onclick="return false;">
                        <img class="image image-book" src='${row.img}' alt="교재 이미지">
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
});
