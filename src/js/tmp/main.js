$(document).ready(function() {
    $("#lightSlider").lightSlider({
        item: 3,
        slideMargin: 10,
        auto: !0,
        controls: !0,
        prevHtml: '<i class="fa fa-chevron-left"></i>',
        nextHtml: '<i class="fa fa-chevron-right"></i>',
        enableTouch: !0,
        enableDrag: !0,
        freeMove: !0,
        swipeThreshold: 40
    });
});