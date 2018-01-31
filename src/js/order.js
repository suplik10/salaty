$(document).on('click touchstart', '.order-product', function (e) {
    var url = $(this).attr('data-link');
    $.nette.ajax({
        type: 'POST',
        url: url,
        success: function () {
            $('#productModal').modal();
        }
    });
});