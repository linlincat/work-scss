(function() {
    var page = $(".J-carousel-ul01 li").length;
    var i = 0;
    var w = $(".J-carousel-ul01 li").eq(0).width();
    var timeId = null;
    $(".J-carousel-ul01").width(page*w);

    timeId = setInterval(function(){
        if( i == page-1 ){
            $(".J-carousel-ul01").animate({ left : '0px'}, "slow");
            i = 0;
            $(".J-carousel-ul02 li").eq(i).addClass("hover").siblings().removeClass("hover");
            }else{
            i++;
            $(".J-carousel-ul01").animate({ left : '-='+w }, "slow");
            $(".J-carousel-ul02 li").eq(i).addClass("hover").siblings().removeClass("hover");
         }
    },6000);

    $(".J-carousel-ul02 li").mouseover(function(){
        if( !$(".J-carousel-ul01").is(":animated") ){
            i = $(this).index();
            $(".J-carousel-ul02 li").eq(i).addClass("hover").siblings().removeClass("hover");
            $(".J-carousel-ul01").animate({ left : -w*i }, "slow");
        }
    });
}());

//@Note  进行了更进一步的用户体验，目前最大化的防止用户恶意滑动轮播图；

