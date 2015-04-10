(function () {
    $('.J-siteP').mouseover(function() {
        var J_siteP = $(this);
        J_siteP.closest('.top-site-center').find('.center-list').addClass('show');
    });
    $('.J-siteP').mouseout(function() {
        var J_siteP = $(this);
        J_siteP.closest('.top-site-center').find('.center-list').removeClass('show');
    });

    ///////////////////////////////////////////////////////////

    $('.J-top-menu li').mouseover(function() {
        $(this).find('a').addClass('has-bg02');
    });

    $('.J-top-menu li').mouseout(function() {
        $(this).find('a').removeClass('has-bg02');
    });
}());

//@Note 可以用hover，不过内部调用的依旧是mouseenter，mouselever因此分开写更容易理解；
