$(document).on('click', '.order-product', function (e) {
    var url = $(this).attr('data-link');
    $.nette.ajax({
        type: 'POST',
        url: url,
        success: function () {
            $('#exampleModal').modal();
        }
    });
});