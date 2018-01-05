$.nette.ext('toast', {
    load: function () {
        if ($('.toast').length > 0) {
            setTimeout(function () {
                $('.toast').removeClass('show');
            }, 5000);
        }
    }
});
$(document).ready(function () {
    if ($('.toast').length > 0) {
        setTimeout(function () {
            $('.toast').removeClass('show');
        }, 5000);
    }
});
$(document).on('click', '*[data-dismiss="toast"]', function () {
    $(this).parent('.toast').removeClass('show');
});