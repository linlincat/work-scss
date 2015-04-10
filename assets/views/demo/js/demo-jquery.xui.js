/**
 * 扩展ui示例
 *
 * @version 1.0
 * @create 2015-03-10
 * @modify
 */
var demoJqueryXui = (function () {

    function _showMasking() {
        require(['jquery.xui.masking'], function () {
            $.xmasking.show({
                bgColor: 'red',
                zindex: 100
            });
        });
    }

    function _closeMasking() {
        require(['jquery.xui.masking'], function () {
            $.xmasking.close();
        });
    }

    function _lock() {
        require(['jquery.xui.lock'], function () {
            $.xlock();
        });
    }

    function _unLock() {
        require(['jquery.xui.lock'], function () {
            $.xlock(false);
        });
    }

    function _fixedWindowShow() {
        require(['jquery.xui.fixed-window', 'jquery.xui.placeholder'], function () {
            $.xfixedWindow('j-dialog-style1', 'id = j-dialog-style1', 420, 212, {
                html:
                '<div class="other-notes">' +
                    '<textarea name="" id="" cols="30" rows="10" placeholder="请填写备注，1-500字以内"></textarea>' +
                    '<div class="xui-dialog-c-btn">' +
                        '<div class="box">' +
                            '<span class="confirm" id="">确定</span>' +
                            '<span class="cancel" id="">取消</span>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            });

            $('textarea').xplaceHolder();
        });
    }

    function _dialogShow() {
        require(['jquery.xui.dialog'], function () {
            $.xdialog(function () {
                $.xdialog({
                    title: '提示',
                    msg: '商品数量不是最小起订的倍数',
                    msgDes: '请检查修改后再提交~',
                    noButton: true
                });
            }, function () {
                alert('您点击了取消按钮！');
            }, {
                title: '提示信息',
                msg: '提示信息内容',
                msgDes: '提示信息内容补充说明</br>balabala...',
                confirm: '确认删除',
                cancel: '保存订单'
            });
        });
    }

    function _placeHolder() {
        require(['jquery.xui.placeholder'], function () {
            $('input').xplaceHolder();
            $('textarea').xplaceHolder();
        });
    }

    function _tabs() {
        require(['jquery.xui.tabs'], function () {
            $.xtabs();
        });
    }

    return {
        showMasking: _showMasking,
        closeMasking: _closeMasking,
        lock: _lock,
        unLock: _unLock,
        fixedWindowShow: _fixedWindowShow,
        dialogShow: _dialogShow,
        placeHolder: _placeHolder,
        tabs: _tabs
    };

}());

$('#j-masking-show').on('click', demoJqueryXui.showMasking);
$('#j-masking-close').on('click', demoJqueryXui.closeMasking);

$('#j-lock').on('click', demoJqueryXui.lock);
$('#j-unlock').on('click', demoJqueryXui.unLock);

$('#j-fixed-window-show').on('click', demoJqueryXui.fixedWindowShow);

$('#j-dialog-show').on('click', demoJqueryXui.dialogShow);

$('#j-placeholder').on('click', demoJqueryXui.placeHolder);

$('#j-tabs').on('click', demoJqueryXui.tabs);
