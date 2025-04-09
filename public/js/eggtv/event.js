$(function () {
    let listData;
    let viewContents;
    $.ajax({
        'url': "/eggtv/event",
        'method': 'get',
        'data': {
            'event' : $("#event").val()
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
            listData = data;
            console.log(data);
            let step = data.watchMenu.contents;
            let category = data.watchMenu.category;
            console.log(step);
            for (let key in step) {
                addWatchMenu('gubun1', key);
            }
            for (let key in category) {
                addWatchMenu('gubun3', category[key]);
            }
        },
    });

    function setContentsData()
    {
        $.ajax({
            'url': "/eggtv/event/view",
            'method': 'get',
            'data': {
                'event' : $("#event").val()
            },
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
    $("#gubun1").on('change', function() {
        let step = listData.watchMenu.contents[$(this).val()];
        $("#gubun2").empty();
        let $menu = `<option value="all"> 에피소드 전체 </option>`;
        $(`#gubun2`).append($menu);
        for (let key in step) {
            console.log(key);
            addWatchMenu('gubun2', step[key]);
        }
    });
    $("#gubun1, #gubun2, #gubun3").on('change', function() {
        let list = listData.contents;
        console.log(list);
        $(".list").empty();


        if($("#gubun1").val() != 'all') {
            list = list.filter(content => content.goods_type == $("#gubun1").val());
        }
        if($("#gubun2").val() != 'all') {
            list = list.filter(content => content.content_title == $("#gubun2").val());
        }
        if($("#gubun3").val() != 'all') {
            list = list.filter(content => content.category == $("#gubun3").val());
        }
        list.forEach(function (value) {
            addRowData(value);
        });
    });

    function addRowData(value) {
        let $bookmark = getBookmarkTag(value);
        let $img = `<li class="item">
                    <a href="#" onclick="return false;" class="item-contents" data-vod_code="${value.vod_code}">
                <div class="thumnail">
                    <img src='${value.img_url}' alt="${value.content_title}" ismember="${value.ismember}" id="img-${value.vod_code}"/>
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
        $('.list').append($img);

    }

    function addWatchMenu(menu, data) {
        $menu = `<option value="${data}"> ${data} </option>`;
        $(`#${menu}`).append($menu);
    }

    function emptyMenu(menu) {
        $(`.${menu}`).empty();
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

    // Flutter Native로 데이터를 보냄
    $(document).on('click', '.item-contents', function () {
        let vodCode = $(this).data('vod_code');
        setContentsData();
        viewContents.startPlayIndex = viewContents.contents.findIndex(value => value.vod_code == vodCode);
        console.log(vodCode);
        console.log(viewContents);
        NewMediaInfoList.postMessage(JSON.stringify(viewContents));
    });

});
