$(function () {
    let listData;
    let viewContents = {};
    $.ajax({
        'url': "/eggtv/" + $("#menu").val(),
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
            listData = data;
            console.log(data);
            let step = data.watchMenu.contents;
            let category = data.watchMenu.category;
            console.log(step);
            for (let key in step) {
                console.log(key);
                addWatchMenu('gubun1', key);
            }
            for (let key in category) {
                console.log(key);
                addWatchMenu('gubun3', category[key]);
            }

            emptyRow();
            data.contents.forEach(function (value) {
                addRowData(value);
                preloadImage(value.img_url, 'img-' + value.vod_code);
            });
        },
    });

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
            list = list.filter(content => content.goods_type.toUpperCase() == $("#gubun1").val());
        }
        if($("#gubun2").val() != 'all') {
            list = list.filter(content => content.content_title == $("#gubun2").val());
        }
        if($("#gubun3").val() != 'all') {
            list = list.filter(content => content.category == $("#gubun3").val());
        }
        list.forEach(function (value) {
            addRowOnData(value);
        });
    });

    function addRowData(value) {
        let $bookmark = getBookmarkTag(value);
        let progress = value.watchingTime * 100 / value.mediaTotalTime;
        let $img = ''
        if($("#listType").val() == 'audio') {
            $img = `<li class="item">
                    <a href="#" onclick="return false;" class="item-contents" data-vod_code="${value.vod_code}">
                <div class="thumnail">
                    <img src='${defaultAudioImg}' alt="${value.content_title}" ismember="${value.ismember}" id="img-${value.vod_code}"/>
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

        } else {
            $img = `<li class="item">
                    <a href="#" onclick="return false;" class="item-contents" data-vod_code="${value.vod_code}">
                        <div class="thumnail">
                            <img src='${defaultVideoImg}' alt="${value.content_title}" ismember="${value.ismember}" id="img-${value.vod_code}"/>
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
        $('.list').append($img);

    }

    // 이미지를 사전로드 하지않음
    function addRowOnData(value) {
        let $bookmark = getBookmarkTag(value);
        let progress = value.watchingTime * 100 / value.mediaTotalTime;
        let $img = ''
        if($("#listType").val() == 'audio') {
            $img = `<li class="item">
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

        } else {
            $img = `<li class="item">
                    <a href="#" onclick="return false;" class="item-contents" data-vod_code="${value.vod_code}">
                        <div class="thumnail">
                            <img src='${value.img_url}' alt="${value.content_title}" ismember="${value.ismember}" id="img-${value.vod_code}"/>
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

    function setContentsData()
    {
        $.ajax({
            'url': "/eggtv/" + $("#menu").val() + "/view/",
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
            },
        });

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
