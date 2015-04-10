/**
 * 扩展ui - 遮罩层
 *
 * @version 1.0
 * @create 2015-03-10
 * @modify
 */
define(function () {

    var _CONSTANT = {
        MASKING_OPTIONS_DEFAULT_OPACITY: 0.3, // 遮罩层默认透明度
        MASKING_OPTIONS_DEFAULT_BGCOLOR: '#666', // 遮罩层默认颜色值
        MASKING_OPTIONS_DEFAULT_ZINDEX: 2000, // 遮罩层的zindex
        MASKING_ELEMENT_ID: 'xui-masking'
    };

    var _global = {
        selectorRange: window.name === '' ? window.document : window.parent.document // 选择器范围
    };

    /**
     * 遮罩背景层
     * @param {String} id 指定元素的id属性
     * @param {Object} options 扩展参数(比如改变文字颜色啥的)
     */
    function _show(id, options) {
        if (typeof id === 'object') {
            options = id;
            id = undefined;
        }
        id = id || _CONSTANT.MASKING_ELEMENT_ID;
        var opacity = options && options.opacity ? options.opacity : _CONSTANT.MASKING_OPTIONS_DEFAULT_OPACITY,
            bgColor = options && options.bgColor ? options.bgColor : _CONSTANT.MASKING_OPTIONS_DEFAULT_BGCOLOR,
            zindex = options && options.zindex ? options.zindex : _CONSTANT.MASKING_OPTIONS_DEFAULT_ZINDEX,
            maskSelector = '#' + id,
            $shadow = $(maskSelector, _global.selectorRange);
        if ($shadow.length > 0) {
            if (typeof options !== 'undefined' && options !== null) {
                $shadow.css({
                    'filter': 'Alpha(Opacity=' + (opacity * 100) + ')',
                    '-moz-opacity': opacity,
                    '-khtml-opacity': opacity,
                    'opacity': opacity,
                    'background-color': bgColor,
                    'z-index': zindex
                });
            }
            $shadow.show();
            return false;
        }
        var scrollHeight = $(_global.selectorRange).height();
        $('body', _global.selectorRange).append('<div id="' + id + '"></div>');
        $(maskSelector, _global.selectorRange).css({
            'position': 'absolute',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': scrollHeight + 'px',
            'filter': 'Alpha(Opacity=' + (opacity * 100) + ')',
            '-moz-opacity': opacity,
            '-khtml-opacity': opacity,
            'opacity': opacity,
            'background-color': bgColor,
            'z-index': zindex
        });
    }

    /**
     * 关闭背景遮罩层
     * @param {String} id 指定元素的id属性
     */
    function _close(id) {
        id = id || _CONSTANT.MASKING_ELEMENT_ID;
        $('#' + id, _global.selectorRange).remove();
    }

    /**
     * 重置背景遮罩层
     * @param {String} id 指定元素的id属性
     */
    function _resize(id) {
        id = id || _CONSTANT.MASKING_ELEMENT_ID;
        var $shadow = $('#' + id, _global.selectorRange),
            $document = $(_global.selectorRange);
        if ($shadow.length > 0) {
            $shadow.css({
                'width': $document.width(),
                'height': $document.height()
            });
        }
    }

    $.xmasking = {
        show: _show,
        close: _close,
        resize: _resize
    };
});
