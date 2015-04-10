(function() {
    $('.J-top').hover(function() {
        $(this).addClass('over');
    },function() {
        $(this).removeClass('over');
    });

    $('.J-top').click(function() {
        $(document).scrollTop(0);
        $('.J-bar').removeClass('over');
    });

    $(window).scroll(function() {
        $('.J-home-floor').each(function(key, value) {
            var scrolltop = $(document).scrollTop(),
                offsettop = $(this).offset().top,
                index = $('.J-home-floor').index(this);

                if ((offsettop - scrolltop ) < 100) {
                    $('.J-bar').removeClass('over');
                    $('.J-bar').eq(index).addClass('over');
                }
        });
    });

    $('.J-bar').click(function(){
        var index = $('.J-bar').index(this);
        var top = $('.J-home-floor').eq(index).offset().top;

        $(document.documentElement).animate({scrollTop:top});
        $(document.body).animate({scrollTop:top});
    });
}());

//@Note 修改同事的效果，调整了一些。是久远没有写效果的原因么，JQ都不兼容doc了。还需要写兼容模式。

