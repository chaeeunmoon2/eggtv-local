$(function () {

    let contents = {};
    //GetVideoList();

    // Flutter Native로 데이터를 보냄
    $(document).on('click', '.item', function () {
        // console.log(contents);
        let vodCode = $(this).data('vod_code');
        contents.startPlayIndex = contents.contents.findIndex(value => value.vod_code == vodCode);
        // NewMediaInfoList.postMessage(JSON.stringify(contents));
    });

    // 기간별 (주간/월간) 누적 시청기록을 보여준다.
    // function GetVideoList(){
    //     $.ajax({
    //         'url': '/eggtv/top-view',
    //         'method': 'get',
    //         'data': {},
    //         'dataType': 'json',
    //         'headers' : {
    //             'Authorization' : "Bearer " + $("#token").val()
    //         },
    //         error: function (request, error) {
    //             console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
    //         },
    //         success: function (data) {
    //             var count = 1;
    //             data.forEach(function (value) {
    //
    //                 $video = `
    //                     <li class="swiper-slide item" data-num="${count}" data-vod_code="${value.vod_code}" data-category="${value.category}">
    //                         <a href="#" onclick="return false;">
    //                             <div class="thumnail">
    //                                 <img src="${value.img_url}" alt="" />
    //                                 <span class="view_count"><em>${value.view_count}번</em> 봤어요!</span>
    //                             </div>
    //                             <div class="info">
    //                                 <p class="title">
    //                                     <span class="pointG">${value.goods_type}</span> ${value.content_title}
    //                                 </p>
    //                                 <p class="category">${value.category}</p>
    //                             </div>
    //                         </a>
    //                     </li>`;
    //                 $('.swiper-wrapper').append($video);
    //                 count++;
    //             });
    //             GetVideoDataList();
    //         },
    //     });
    // }

    // 기간별 (주간/월간) 누적 시청기록을 보여준다.
    // function GetVideoDataList(){
    //     $.ajax({
    //         'url': '/eggtv/top-view/view',
    //         'method': 'get',
    //         'data': {},
    //         'dataType': 'json',
    //         'headers' : {
    //             'Authorization' : "Bearer " + $("#token").val()
    //         },
    //         error: function (request, error) {
    //             console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
    //         },
    //         success: function (data) {
    //             contents = data;
    //         },
    //     });
    // }

    $(document).ready(function (){
        OnUiLoadingEnd.postMessage('');
    });
});
