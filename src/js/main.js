$(document).ready(function () {
    $("#lightSlider-main").lightSlider({
        item: 1,

        autoWidth: true,


        controls: true,
        pager:false,
        prevHtml: '',
        nextHtml: '',

        enableTouch: true,
        enableDrag: true,
        freeMove: true,
        swipeThreshold: 40,

    });
    $("#lightSlider-interests").lightSlider({
        item: 1,

        slideMargin: 10,
        auto: true,
        loop: true,
        pause: 5000,
        slideEndAnimation: true,

        controls: false,
        pager: true,
        prevHtml: '<i class="fa fa-chevron-left"></i>',
        nextHtml: '<i class="fa fa-chevron-right"></i>',

        enableTouch: true,
        enableDrag: true,
        freeMove: true,
        swipeThreshold: 40,
        pauseOnHover: true,

        responsive: [],
    });
    $("#lightSlider").lightSlider({
        item: 3,

        slideMargin: 15,
        auto: true,
        loop: true,
        pause: 2500,
        slideEndAnimation: true,

        controls: false,
        pager: true,
        /* prevHtml: '<i class="fa fa-chevron-left"></i>',
         nextHtml: '<i class="fa fa-chevron-right"></i>',*/

        adaptiveHeight: true,

        enableTouch: true,
        enableDrag: true,
        freeMove: true,
        swipeThreshold: 40,
        pauseOnHover: true,

        responsive: [
            {
                breakpoint: 991,
                settings: {
                    item: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    item: 1
                }
            }
        ],
    });
});