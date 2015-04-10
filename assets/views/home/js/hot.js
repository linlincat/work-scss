(function() {
    var Hot_title = $('.J-hot-title'),
        Hot_title_h2 = $('.J-hot-title h2'),
        Hot_box = $('.J-hot-box');

        Hot_title_h2.mouseover(function() {
            var index = parseInt($(this).attr('data-index'));

            if ($(this).find('i').hasClass('J-i')) {
                $('.J-i').addClass('ihover');
            }

            $(this).addClass('white-font').css({backgroundColor : $(this).attr('data-bg')}).siblings().removeClass('white-font').css({backgroundColor : ""});
            Hot_box.eq(index).removeClass('hide').siblings('.J-hot-box').addClass('hide');

        });

        Hot_title_h2.mouseout(function() {
            if ($(this).find('i').hasClass('J-i')) {
                $('.J-i').removeClass('ihover');
            }
        });
}());

//@Note 这个完全可以去优化一丢丢，但也没有必要了，因为data-**这个方式已经节省了很多复杂的行为
//在死路上已经做到了基本的流畅；
