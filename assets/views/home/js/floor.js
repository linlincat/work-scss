(function() {
    var Floor_nav_li = $('.J-floor-nav li'),
        Floor_change = $('.J-floor-change');

        Floor_nav_li.mouseover(function() {
            var Floor_new = $(this),
                index = $(this).index(),
                F_class= Floor_new.closest('.floor-right').find('.J-floor-nav li').eq(index).attr('data-class'),
                Get_box = Floor_new.closest('.floor-right'),
                Get_now_li = Get_box.find('.J-floor-nav li'),
                Get_now_box = Get_box.find('.J-floor-change');

            Get_now_li.eq(index).addClass(F_class).siblings().removeClass(F_class);
            Get_now_box.eq(index).removeClass('hide').siblings('.J-floor-change').addClass('hide');
        });
}());

//@Note 每个楼层的主色不一样，因此为了节省脚本结构的复杂程度，还是
//沿用了data-**；其实有另一个不错的思路，相比这个多一层结构，就是
//经过楼层的时候便获取到相应的索引位置。就目前共能还是可以优化，但
//没有必要，多了一个元素但方法却能比较完善，因此不许做其它改动；
