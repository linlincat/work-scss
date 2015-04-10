/**
 * 扩展ui - 屏幕锁
 *
 * @version 1.0
 * @create 2015-03-10
 * @modify
 */
define(['jquery.xui.masking'], function () {

    var _CONSTANT = {
        WINDOW_LOCK_LAYER_ELEMENT_ID: 'xui-lock-layer',
        WINDOW_LOCK_LAYER_ZINDEX: 100001,
        WINDOW_LOCK_ELEMENT_ID: 'xui-lock',
        WINDOW_LOCK_CLASS: 'xui-lock'
    };

    var _global = {
        selectorRange: window.name === '' ? window.document : window.parent.document // 选择器范围
    };

    /**
     * 屏幕锁
     * @param {Boolean} flag  true为加锁， false为解锁
     */
    function lock(flag) {
        if (flag !== undefined && !flag) {
            $.xmasking.close(_CONSTANT.WINDOW_LOCK_LAYER_ELEMENT_ID);
                $('#' + _CONSTANT.WINDOW_LOCK_ELEMENT_ID, _global.selectorRange).remove();
        } else {
            $.xmasking.show(_CONSTANT.WINDOW_LOCK_LAYER_ELEMENT_ID,
                    {'zindex': _CONSTANT.WINDOW_LOCK_LAYER_ZINDEX});
            $('body', _global.selectorRange).append('<div class="' + _CONSTANT.WINDOW_LOCK_CLASS
                    + '" id="' + _CONSTANT.WINDOW_LOCK_ELEMENT_ID + '">请稍候...</div>');
        }
    }

    if (!$.xui) {
        $.xui = {};
    }

    $.xlock = lock;
});
