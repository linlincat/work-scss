$(function() {
    var Height_01 = $('.J-health-add1').offset().top;
    var Height_02 = $('.J-health-add2').offset().top;

    $('.J-edit0').click(function() {
        $('.J-user-infos').removeClass('hide');
        $("html,body").animate({scrollTop:Height_01},100);
    });

    $('.J-edit1').click(function() {
        $('.J-user-info').removeClass('hide');
        $("html,body").animate({scrollTop:Height_02},100);
    });

    $('.J-del').click(function() {
        var J_this = $(this);
        J_this.closest('.J-wrap').find('.y-ture').removeClass('hide');
    });

    $('.J-btn-true').click(function() {
        $(this).parents('.y-ture').addClass('hide');
    });
    $('.J-btn-cancel').click(function() {
        $(this).parents('.y-ture').addClass('hide');
    });


    $('.J-join').click(function() {
        $('.J-user-infos').removeClass('hide');
    });

    $('.J-user-infos .J-add').click(function() {
        $('.J-user-infos').addClass('hide');
    });
    $('.J-user-infos .J-cancel').click(function() {
        $('.J-user-infos').addClass('hide');
    });


    $('.J-joins').click(function() {
        $('.J-user-info').removeClass('hide');
    });

    $('.J-user-info .J-adds').click(function() {
        $('.J-user-info').addClass('hide');
    });
    $('.J-user-info .J-cancels').click(function() {
        $('.J-user-info').addClass('hide');
    });
});

//@Note 为了思路上更清楚，所以很直白的写了这个现实隐藏的效果；

