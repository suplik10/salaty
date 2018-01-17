$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip(), $("#lightSlider-main").lightSlider({
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
    }), $("#lightSlider").lightSlider({
        item: 3,
        slideMargin: 15,
        auto: !0,
        loop: !0,
        pause: 2500,
        slideEndAnimation: !0,
        controls: !1,
        pager: !0,
        adaptiveHeight: !0,
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
});