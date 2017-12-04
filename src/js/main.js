$(document).ready(function () {
    $("#lightSlider").lightSlider({
        item: 3,

        slideMargin: 10,
        auto: true,

        controls: true,
        prevHtml: '<i class="fa fa-chevron-left"></i>',
        nextHtml: '<i class="fa fa-chevron-right"></i>',

        enableTouch:true,
        enableDrag:true,
        freeMove:true,
        swipeThreshold: 40,
    });
});