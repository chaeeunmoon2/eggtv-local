$(document).ready(function () {
  function popup_open_scroll() {
    docu_h = $(document).height();
    window_h = $(window).height();
    html_s = $("html").scrollTop();
    body_s = $("body").scrollTop();

    if (docu_h > window_h) {
      var scrollTop = html_s ? html_s : body_s; // Works for Chrome, Firefox, IE...
      $("html").addClass("noscroll").css("top", -scrollTop);
    }
  }
  function popup_close_scroll() {
    var scrollTop = parseInt($("html").css("top"));
    $("html").removeClass("noscroll");
    $("html,body").scrollTop(-scrollTop);
  }

  //본인인증 전체 동의
  $('.total_agree input[type="checkbox"]').on("click", function () {
    var check_status = $('.total_agree input[type="checkbox"]').is(":checked");
    if (check_status == true) {
      $(".other_agree").addClass("hide");
      $('.other_agree input[type="checkbox"]').prop("checked", true);
    } else {
      $(".other_agree").removeClass("hide");
      $('.other_agree input[type="checkbox"]').prop("checked", false);
    }
  });

  //통신사 선택
  $(".select-com").on("click", function () {
      console.log(".select-com");
    $(".select_box-com").stop().show();
    $(".shadow").stop().show();
  });
  $(".select-sex").on("click", function () {
      console.log(".select-sex");
    $(".select_box-sex").stop().show();
    $(".shadow").stop().show();
  });
  $(".select_box-com .value").on("click", function () {
    var value_data = $(this).data("value");
    $(".send_certification").addClass("red");
    $(".select-com").addClass("value");
    $(".select-com").text(value_data);
    $(".select-com").attr('data-num', $(this).data('num'));
    $(".select_box-com").stop().hide();
    $(".shadow").stop().hide();
  });
  $(".select_box-sex .value").on("click", function () {
    var value_data = $(this).data("value");
    $(".select-sex").addClass("value");
    $(".select-sex").text(value_data);
    $(".select-sex").attr('data-num', $(this).data('num'));
    $(".select_box-sex").stop().hide();
    $(".shadow").stop().hide();
  });
  //영역밖클릭시 닫기
  $("html").click(function (e) {
    if ($(e.target).hasClass("shadow")) {
      $(".select_box").stop().hide();
      $(".shadow").stop().hide();
    }
  });


  //이용약관 클릭시 팝업 노출
  $(".checkbox_agree").on("click", function () {
      NewChromeWindow.postMessage('https://safe.ok-name.co.kr/eterms/agreement_all.jsp;');
    // popup_open_scroll();
    // var this_name = $(this).data("title");
    // if (this_name == "개인정보 수집 / 이용 / 취급 위탁동의") {
    //   $("#agree_pop01").stop().show();
    // } else if (this_name == "본인확인 서비스 이용약관") {
    //   $("#agree_pop02").stop().show();
    // } else if (this_name == "고유식별정보처리 동의") {
    //   $("#agree_pop03").stop().show();
    // } else if (this_name == "통신사 이용약관") {
    //   $("#agree_pop04").stop().show();
    // } else if (this_name == "개인정보 제 3자 제공 동의") {
    //   $("#agree_pop05").stop().show();
    // }
  });

  $(".agree_pop .check a").on("click", function () {
    var this_pop_name = $(this).parents(".agree_pop");
    var this_check = $(this).data("name");
    console.log(this_pop_name);
    if (this_pop_name.hasClass("agree_pop01")) {
      $(".agree_pop01 .check a").removeClass("red");
      $(this).addClass("red");

      $(".agree_pop01 .textarea").removeClass("current");
      $("#" + this_check).addClass("current");
    } else if (this_pop_name.hasClass("agree_pop02")) {
      $(".agree_pop02 .check a").removeClass("red");
      $(this).addClass("red");

      $(".agree_pop02 .textarea").removeClass("current");
      $("#" + this_check).addClass("current");
    } else if (this_pop_name.hasClass("agree_pop03")) {
      $(".agree_pop03 .check a").removeClass("red");
      $(this).addClass("red");

      $(".agree_pop03 .textarea").removeClass("current");
      $("#" + this_check).addClass("current");
    } else if (this_pop_name.hasClass("agree_pop04")) {
      $(".agree_pop04 .check a").removeClass("red");
      $(this).addClass("red");

      $(".agree_pop04 .textarea").removeClass("current");
      $("#" + this_check).addClass("current");
    } else if (this_pop_name.hasClass("agree_pop05")) {
      $(".agree_pop05 .check a").removeClass("red");
      $(this).addClass("red");

      $(".agree_pop05 .textarea").removeClass("current");
      $("#" + this_check).addClass("current");
    }
  });
  $(".agree_pop .close_pass").on("click", function () {
    popup_close_scroll();
    $(".agree_pop").stop().hide();

    $(".agree_pop .check a").removeClass("red");
    $(".agree_pop .textarea").removeClass("current");

    $(".agree_pop .check a:first-child").addClass("red");
    $(".agree_pop .textarea.first").addClass("current");
  });
});
