avalon.ready(function () {

    var userInfo = avalon.define({
        $id: 'userInfo',
        init: false,
        result: false,
        loginName: '',

        getUserInfo: function () {
            var callback = function (data) {
                userInfo.init = true;
                userInfo.result = data.result;
                userInfo.loginName = data.loginName;
            };

            // 模拟异步请求登录信息
            setTimeout(function () {
                callback({
                    result: true,
                    loginName: 'likej2ee@qq.com'
                });
            }, 4000);
        }
    });

    userInfo.getUserInfo();

    // 模拟页面加载，dom加载完需要一点时间
    setTimeout(function () {
        avalon.scan();
    }, 1000);
});
