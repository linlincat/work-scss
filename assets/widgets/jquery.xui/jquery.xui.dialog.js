/**
 * 扩展ui - 模态对话框
 *
 * @version 1.0
 * @create 2015-03-10
 * @modify
 */
define(['jquery.xui.fixed-window'], function () {

    var _CONSTANT = {
        DIALOG_TEMPLATE_HTML:
'<dl class="xui-dialog xui-dialog" id="xui-dialog{{zindex}}" data-zindex="{{zindex}}">' +
    '<dt class="xui-dialog-t"><span>{{title}}</span><s id="xui-dialog-close{{zindex}}" data-zindex="{{zindex}}"></s></dt>' +
    '<dd class="xui-dialog-c">' +
        '<div class="xui-dialog-c-tip" id="xui-dialog-c-tip{{zindex}}">{{msg}}</div>' +
        '<div class="xui-dialog-c-btn">' +
            '<div class="box">' +
                '<span class="confirm" id="xui-dialog-confirm{{zindex}}" data-zindex="{{zindex}}">{{confirm}}</span>' +
                '<span class="cancel" id="xui-dialog-cancel{{zindex}}" data-zindex="{{zindex}}">{{cancel}}</span>' +
            '</div>' +
        '</div>' +
    '</dd>' +
'</dl>',

        DIALOG_DEFAULT_MESSAGE_ICON: 'info',
        DIALOG_DEFAULT_MESSAGE: 'Hello World~~',
        DIALOG_DEFAULT_TITLE: '提示',
        DIALOG_DEFAULT_CONFIRM: '确定',
        DIALOG_DEFAULT_BUTTON_MARGIN: 10
    };

    var _global = {
        selectorRange: window.name === '' ? window.document : window.parent.document, // 选择器范围
        zindex: 100000, // dialog层次参数
        dialogSelector: [] // 记录创建的dialog的选择器，为了实现队列效果，先进先出原则，按创建dialog层的顺序显示层
    };

    /**
     * 创建对话框
     * @param {Function} fnConfirm 确定按钮事件
     * @param {Function} fnCancel 取消按钮事件
     * @param {Function} fnClose 关闭按钮事件
     * @param {Object} options 扩展参数
     *        {
     *            'title':'提示', // 提示框的标题
     *            'msg': 'Hello World~~', // 提示信息内容
     *            'msgDes': '', // 提示信息内容补充说明
     *            'msgIcon': 'info', // 提示信息前面的小图标
     *            'confirm':'确定', // 确认按钮文案
     *            'cancel':'取消', // 取消按钮文案
     *            'noButton': false, // 是否有按钮，有些需求希望没有确定取消按钮，只做消息提示用
     *            'opacity':'0.3'
     *        }
     */
    function _dialog(fnConfirm, fnCancel, fnClose, options) {

        // 处理参数
        if (typeof fnConfirm === 'object' && null !== fnConfirm) {
            options = fnConfirm;
        }
        if (typeof fnCancel === 'object' && null !== fnCancel) {
            options = fnCancel;
        }
        if (typeof fnClose === 'object' && null !== fnClose) {
            options = fnClose;
        }

        // 对话框渲染
        var _dialogRenderer = function(html) {
            // 初始化默认参数
            options = options || {};
            var title = options.title || _CONSTANT.DIALOG_DEFAULT_TITLE,
                msg = options.msg || _CONSTANT.DIALOG_DEFAULT_MESSAGE,
                msgDes = options.msgDes || '',
                msgIcon = options.msgIcon || _CONSTANT.DIALOG_DEFAULT_MESSAGE_ICON,
                confirm = options.confirm || _CONSTANT.DIALOG_DEFAULT_CONFIRM,
                cancel = options.cancel;

            var shadowOptions = {
                'opacity': options.opacity,
                'bgColor': options.bgColor,
                'zindex': options.zindex || _global.zindex
            };

            var message = '<p class="msg"><s class="' + msgIcon + '"></s>' +
                    msg + '</p><p class="msg-des">' + msgDes + '</p>';

            // 遮罩层
            $.xmasking.show(shadowOptions);
            html = html.replace(/{{zindex}}/gm, _global.zindex);
            html = html.replace(/{{title}}/gm, title);
            html = html.replace(/{{msg}}/gm, message);
            html = html.replace(/{{confirm}}/gm, confirm);
            html = html.replace(/{{cancel}}/gm, cancel);

            $('body', _global.selectorRange).append(html);
            _global.dialogSelector.push('#xui-dialog' + _global.zindex);

            // 获取刚创建的对话框元素
            var $dialog = $('#xui-dialog' + _global.zindex, _global.selectorRange),
                $confirm = $dialog.find('#xui-dialog-confirm' + _global.zindex),
                $cancel = $dialog.find('#xui-dialog-cancel' + _global.zindex),
                $close = $dialog.find('#xui-dialog-close' + _global.zindex);

            // 是否显示取消按钮
            if (cancel) {
                $cancel.show();
            } else {
                $cancel.hide();
            }

            // 是否显示确定按钮
            if (options.noButton) {
                $confirm.hide();
                $cancel.hide();
            } else {
                // 万恶的ie6需要动态设定父元素宽度
                var confirmW = $confirm.is(':visible') ? $confirm.outerWidth() : 0,
                    cancelW = $cancel.is(':visible') ? $cancel.outerWidth() : 0;

                $confirm.parent().width(confirmW + cancelW +
                        (_CONSTANT.DIALOG_DEFAULT_BUTTON_MARGIN * 2 + 1));
            }

            // 设置对话框定位层级
            $dialog.css({
                'z-index': _global.zindex
            });

            // 最先创建的dialog层显示，其余均隐藏
            for (var i = 0, length = _global.dialogSelector.length; i < length - 1; i++) {
                $(_global.dialogSelector[i + 1]).hide();
            }

            // 关闭对话框
            var _close = function() {
                var _zindex = $(this).data('zindex');
                if (undefined !== _zindex) {
                    $('#xui-dialog' + _zindex, _global.selectorRange).remove();
                    _global.dialogSelector.shift();
                    if (_global.dialogSelector.length > 0) {

                        // 若dialog层存在则不需要关闭遮罩层，并且将(_zindex + 1)的层显示
                        $('#xui-dialog' + (_zindex - 1), _global.selectorRange).show();
                        return;
                    } else {
                        _global.zindex = 10000;
                    }
                }
                $.xmasking.close();
            };

            // 确认按钮
            $confirm.click(_close);
            if (typeof fnConfirm === 'function' && fnConfirm.constructor === Function) {
                $confirm.click(fnConfirm);
            }

            // 取消按钮
            $cancel.click(_close);
            if (typeof fnCancel === 'function' && fnCancel.constructor === Function) {
                $cancel.click(fnCancel);
            }

            // 关闭按钮
            $close.click(_close);
            if (typeof fnClose === 'function' && fnClose.constructor === Function) {
                $close.click(fnClose);
            }

            _global.zindex--;
        };

        _dialogRenderer(_CONSTANT.DIALOG_TEMPLATE_HTML);
    }

    $.xdialog = _dialog;
});
