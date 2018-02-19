$(document).ready(function() {
    $.nette.init(), $('[data-toggle="tooltip"]').tooltip(), $("#lightSlider-main").lightSlider({
        item: 1,
        autoWidth: !0,
        controls: !0,
        pager: !1,
        prevHtml: "",
        nextHtml: "",
        enableTouch: !0,
        enableDrag: !0,
        freeMove: !0,
        swipeThreshold: 40
    }), $("#lightSlider-interests").lightSlider({
        item: 1,
        slideMargin: 10,
        auto: !0,
        loop: !0,
        pause: 5e3,
        slideEndAnimation: !0,
        controls: !1,
        pager: !0,
        prevHtml: '<i class="fa fa-chevron-left"></i>',
        nextHtml: '<i class="fa fa-chevron-right"></i>',
        enableTouch: !0,
        enableDrag: !0,
        freeMove: !0,
        swipeThreshold: 40,
        pauseOnHover: !0,
        responsive: []
    }), $("#lightSlider-rules").lightSlider({
        item: 1,
        slideMargin: 10,
        auto: !0,
        loop: !0,
        pause: 5e3,
        slideEndAnimation: !0,
        controls: !1,
        pager: !0,
        prevHtml: '<i class="fa fa-chevron-left"></i>',
        nextHtml: '<i class="fa fa-chevron-right"></i>',
        enableTouch: !0,
        enableDrag: !0,
        freeMove: !0,
        swipeThreshold: 40,
        pauseOnHover: !0,
        responsive: []
    }), $("#lightSlider").lightSlider({
        item: 3,
        slideMargin: 15,
        auto: !0,
        loop: !0,
        pause: 2500,
        slideEndAnimation: !0,
        controls: !1,
        pager: !1,
        adaptiveHeight: !1,
        enableTouch: !0,
        enableDrag: !0,
        freeMove: !0,
        swipeThreshold: 40,
        pauseOnHover: !0,
        responsive: [ {
            breakpoint: 991,
            settings: {
                item: 2
            }
        }, {
            breakpoint: 768,
            settings: {
                item: 1
            }
        } ]
    }), $(".select2").select2();
}), $(".scroll-to-form").click(function(a) {
    a.preventDefault();
    var b = 0;
    $(window).width() > 768 && (b = 80);
    var c = $(this).attr("href");
    $("html, body").animate({
        scrollTop: $(c).offset().top - b
    }, 600);
}), $(document).on("change", ".wallet-user", function() {
    var a = $(".change-user-link").attr("data-link");
    $.nette.ajax({
        url: a,
        type: "POST",
        data: {
            userId: $(this).val()
        }
    });
});