$(document).ready(function () {
    $.nette.init();
    $('[data-toggle="tooltip"]').tooltip();
    $("#lightSlider-main").lightSlider({
        item: 1,

        autoWidth: true,


        controls: true,
        pager: false,
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
    $("#lightSlider-rules").lightSlider({
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
        pager: false,
        /* prevHtml: '<i class="fa fa-chevron-left"></i>',
         nextHtml: '<i class="fa fa-chevron-right"></i>',*/

        adaptiveHeight: false,

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
        ]
    });

    $('.select2').select2();
});

$(".scroll-to-form").click(function (e) {
    e.preventDefault();
    var divergence = 0;
    if ($(window).width() > 768) {
        divergence = 80
    }
    var target = $(this).attr("href");
    $("html, body").animate({scrollTop: $(target).offset().top - divergence}, 600);
});

$(document).on('change', '.wallet-user', function () {
    var url = $('.change-user-link').attr('data-link');
    $.nette.ajax({
       url: url,
       type: 'POST',
       data: {userId: $(this).val()}
    });
});
