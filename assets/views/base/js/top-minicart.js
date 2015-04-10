(function () {
    var Minicart = $('.J-top-minicart'),
        Miniaccount = $('.J-minicart-account'),
        Miniboxs = $('.J-minicart-boxs');

    Minicart.mouseover(function() {
        $(this).addClass('hover');
        Miniboxs.removeClass('hide');
    });

    Minicart.mouseout(function() {
        $(this).removeClass('hover');
        Miniboxs.addClass('hide');
    });

    Miniaccount.click(function() {
        Miniboxs.addClass('hide');
    });
}());

//@Note 结算按钮点击的时候，应该跳转【购物车恢复初始化*本应加入移除hover，但你隐藏的那一个瞬间已经是离开了，因此这也算是一个思维上的收获】
