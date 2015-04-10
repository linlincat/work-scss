/**
 * 给文本元素加placeholder效果
 *
 * @version 1.0
 * @create 2015-03-12
 * @modify
 */

define(function () {

    var _CONSTANT = {
        PLACEHOLDER_CLASS: 'xui-placeholder', // className
        PLACEHOLDER_DOM: 'xui-obj' // dom,为了缓存创建的dom对象
    };

    /**
     * 给选中的文本框jQuery包装集设置placeholder
     * 可描述输入字段预期值的提示信息(hint)。 该提示会在输入字段为空时显示,并会在字段获得焦点时消失
     * <div class="xui-myholder">
     *     <input type="text" class="j-myholder" placeholder="提示文字"/>
     *     <label for="j-myholder"></label>
     * </div>
     *
     * @param {Object} options
     */
    function _placeHolder(options) {

        // 若支持placeholder特性，则不开启兼容性处理
        var _isPlaceholderSupport = 'placeholder' in document.createElement('input');
        if (_isPlaceholderSupport) {
            return false;
        }

        $(this).each(function(i, node) {
            new XuiPlaceHolder($(node));
        });
    }

    function XuiPlaceHolder(el) {
        this.el = el; // jqObj
        this.el.data(_CONSTANT.PLACEHOLDER_DOM, this);
        this.node = el[0];
        this.initialize();
    }

    XuiPlaceHolder.prototype = {
        constructor: XuiPlaceHolder,

        ui: null, // ui element
        el: null, // source input element
        node: null, // is a dom object for el

        init: false, // is init

        initialize: function() {
            if (this.init) {
                return;
            }

            this.className = _CONSTANT.PLACEHOLDER_CLASS;
            this.ui = this.el.closest('.' + this.className);
            if (!this.ui.length) {
                this.ui = $('<div class="' + this.className + '"><label for="' + this.node.id + '">' + this.el.attr('placeholder') + '</label></div>');
                this.ui.insertAfter(this.el).append(this.el); // 将新建的ui追加到当前el后面，然后将el挪移添加进ui元素中

                var el_height = this.el.css('height'),
                    el_padding_top = this.el.css('padding-top'),
                    el_padding_bottom = this.el.css('padding-bottom'),
                    el_height_int = parseInt(el_height.replace('px', ''), 10),
                    el_padding_top_int = parseInt(el_padding_top.replace('px', ''), 10),
                    el_padding_bottom_int = parseInt(el_padding_bottom.replace('px', ''), 10);

                if (this.node.nodeName === 'INPUT') {
                    this.el.prev('label').css({
                        'height': this.el.css('height'),
                        'line-height': this.el.css('height'),
                        'padding': this.el.css('padding')
                    });
                }
                this.el.prev('label').css({
                    'width': this.el.css('width'),
                    'padding': this.el.css('padding'),
                    'font-size': this.el.css('font-size')
                });
                this.ui.css({
                    'float': this.el.css('float'),
                    'height': el_height_int + el_padding_top_int + el_padding_bottom_int + 2,
                    'margin': this.el.css('margin')
                });
                this.el.css({
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'margin': 0,
                    'z-index': 2
                });
            }

            this.keyup();
            this.init = true;
        },

        keyup: function() {
            this.el.on('keyup', function() {
                var $this = $(this),
                    value = $this.val();
                if (value !== '') {
                    $this.prev().hide();
                } else {
                    $this.prev().show();
                }
            });
        }
    };

    $.fn.xplaceHolder = _placeHolder;
});
