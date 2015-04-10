require(['jquery.lazyload'], function () {

    function init() {
        $("img.j-lazyload").lazyload({
            threshold: 50,
            effect: "fadeIn",
            failurelimit: 0,
            placeholder: '/resource/assets/img/spacer.png',
            skip_invisible: false /* 设置不忽略隐藏图片 */
        });
    }

    // dom 加载完成后执行
    init();
});
