$(function () {
    let contents;
    $.ajax({
        'url': "/eggtv/guid/vod/eggtalk",
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
            contents = data;
            console.log(data);

            emptyRow();
            data.contents.forEach(function (value) {
                addRowData(value);
            });
            addLastRow();
        },
    });

    function addRowData(row) {
        let $img = `<li class="item">
                    <a class="link item-contents" href="#" onclick="return false;" data-vod_code="${row.vod_code}">
                        <div class="imgarea">
                            <img class="image image-eggletter" src='${row.subThumImg}' alt="${row.content_title}">
                        </div>

                        <div class="textarea" style="min-height: 3rem">
                            <p class="title">
                            ${row.content_title}
                            </p>
                        </div>
                    </a>
                </li>`;
        $('.list-eggletter').append($img);

    }
    function emptyRow() {
        $('.list').empty();
    }

    // 가운데 정렬 해결하기위해 임시 마지막줄
    function addLastRow() {

        for(i = 0; i<6; i++) {
            $img = `<li class="item item-video">
                    <a class="link" href="#" onclick="return false;">
                        <img class="image image-video" src='#' alt="" ismember="0">
                        <div class="item-title">
                        </div>
                    </a>
                    <div class="item-category">
                    </div>
                </li>`;
            $('.list').append($img);

        }
    }

    // Flutter Native로 데이터를 보냄
    $(document).on('click', '.item-contents', function () {
        let vodCode = $(this).data('vod_code');
        contents.startPlayIndex = contents.contents.findIndex(value => value.vod_code == vodCode);
        console.log(vodCode);
        console.log(contents);
        NewMediaInfoList.postMessage(JSON.stringify(contents));
    });

});
