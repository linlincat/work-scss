(function () {
    var Topnav = $('.J-top-navs'),
        Toplist = $('.J-top-navs-list');

    Topnav.click(function() {
        if (Toplist.hasClass('hide')) {
            Toplist.removeClass('hide');
        } else {
            Toplist.addClass('hide');
        }
    });
}());
