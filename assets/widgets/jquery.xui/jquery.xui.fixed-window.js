/**
 * 扩展ui - 定位窗口层
 *
 * @version 1.0
 * @create 2015-03-10
 * @modify
 */
define(['jquery.xui.masking'], function () {

    var _CONSTANT = {
        MASKING_ELEMENT_ID_SUFFIX: '-masking', // 用于定位层弹出指定id的遮罩层，避免与dialog的遮罩层冲突

        FIXED_WINDOW_ELEMENT_ID: 'xui-window-masking',
        FIXED_WINDOW_OPTIONS_DEFAULT_ZINDEX: 100001,
        FIXED_WINDOW_TEMPLATE_HTML:
            '<div class="xui-dialog" id="{{id}}">' +
                '<div class="xui-dialog-t"><span>{{title}}</span><s></s></div>' +
                '<div class="xui-dialog-c" id="{{id}}-c"></div>' +
            '</div>'
    };

    var _global = {
        selectorRange: window.name === '' ? window.document : window.parent.document // 选择器范围
    };

    /**
     * 创建指定宽高的定位窗口层
     * @param {String} id 待创建的dialog窗口的元素id
     * @param {String} title 待创建的dialog窗口的标题
     * @param {String} w 待创建的dialog窗口的宽度
     * @param {String} h 待创建的dialog窗口的高度
     * @param {Object} options 对象参数{
     *                         'html' : '使用直接的html作为文本内容填充',
     *                         'url': 'ajax返回的html内容',
     *                         'isIframe': '是否使用iframe'
     *                     }
     */
    function _fixedWindow(id, title, w, h, options) {

        // 为了让登录弹出窗口的回调函数里可以执行延迟函数，
        // 此方案为关闭时只是隐藏掉，再次点击时，如待创建的元素id是一个，则先移除原对象
        var $fixedWindowLast = $("#" + id, _global.selectorRange);
        if ($fixedWindowLast.length > 0) {
            $fixedWindowLast.remove();
        }

        var $body = $("body", _global.selectorRange);
        if ($body.data('init')) {
            return false;
        }
        $body.data('init', true);
        var html = options.html || '',
            url = options.url || '',
            isIframe = options.isIframe || false;

        // 打开遮罩背景层
        $.xmasking.show(id + _CONSTANT.MASKING_ELEMENT_ID_SUFFIX);

        var template = _CONSTANT.FIXED_WINDOW_TEMPLATE_HTML;
        template = template.replace(/{{id}}/gm, id);
        template = template.replace(/{{title}}/gm, title);

        // 创建指定宽高的定位窗口层

        $body.append(template);
        var $fixedlayer = $("#" + id, _global.selectorRange);
        var titleHeight = $fixedlayer.find('.xui-dialog-t').outerHeight();
        var borderWidth = $fixedlayer.css('borderWidth');
        var pupupHeight = h + titleHeight + (borderWidth * 2) + 'px';

        $fixedlayer.css({
            'margin-top': -h / 2 - titleHeight + 'px',
            'margin-left': -w / 2 + 'px',
            'width': w + 'px',
            'height': pupupHeight
        });

        // 关闭按钮事件
        $fixedlayer.find('s').on('click', function() {
             $fixedlayer.hide();
             $.xmasking.close(id + _CONSTANT.MASKING_ELEMENT_ID_SUFFIX);
        });

        var $content = $fixedlayer.find('#' + id + '-c').css({
            'height': h
        });

        if (isIframe && url !== '') {
            $content.append('<iframe frameborder="0" scrolling="no" width="100%" height="' + pupupHeight +
                '" id="popupifram" name="popupifram" allowtransparency="true" src="' + url + '"></iframe>');
        } else if (url !== '') {
            $content.load(url);
        } else  {
            $content.append(html);
        }
        $body.data('init', false);
    }

    $.xfixedWindow = _fixedWindow;
});
