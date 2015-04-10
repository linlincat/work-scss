/**
 * jQuery.xselect 用于美化浏览器原生的 select 控件。
 * @version: 1.1.0
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        factory();
    }
}(function() {

    var C_BASE               = 'xui',                              // 基础类名，所有 baseui 控件通用
        C_SELECT             = C_BASE + '-select',                 // select 控件类名
        C_SELECT_HEAD        = C_SELECT + '-head',                 // head 类名
        C_SELECT_TEXT            = C_SELECT + '-text',             // head 中文本块类名
        C_SELECT_TR              = C_SELECT + '-tr',               // 三角图标类名
        C_SELECT_OPTION_LIST_BOX = C_SELECT + '-option-list-box',  // 选项列表类名
        C_SELECT_OPTION_LIST = C_SELECT + '-option-list',          // 选项列表类名
        C_SELECT_OPTION      = C_SELECT + '-option',               // 选项类名

        C_SELECTED           = '-selected',                        // 选项选中状态类名后缀
        C_DISABLED           = '-disabled',                        // 组件禁用状态类名后缀

        EL_SELECTED          = 'select',                           // select 元素选择器

        D_XUIOBJ             = 'xui-obj',
        D_UI_OPTION          = 'xui-ui-option',                    // 控件选项元素，存储在 select 选项元素中
        D_OPTION             = 'xui-option';                       // select 选项元素，存储在控件选项元素中

    $.fn.xselect = function(operateName) {
        // is operate
        if (typeof operateName === 'string') {
            var els              = Select.extract(this, true),
                operateArauments = Array.prototype.slice.call(arguments, 1),
                results          = $(),
                isEmpty          = true,
                notJQuery        = false;

            els.each(function(i, el) {
                var xuiObj = $(el).data(D_XUIOBJ);
                if (xuiObj) {
                    var result = xuiObj[operateName].apply(xuiObj, operateArauments);

                    if (result !== undefined) {
                        isEmpty = false;                    // 标示有返回结果
                        if (!(result && result.jquery)) {
                            notJQuery = true;               // 标示返回结果不是 jQuery 对象
                        }
                    }

                    results = results.add(result);
                }
            });

            return (isEmpty   ? this :
                    notJQuery ? results.toArray() :
                                results);
        }
        // is init
        else {
            Select.extract(this).each(function(i, select) {
                new Select($(select));
            });
            return this;
        }
    };

    function Select(el) {
        this.el = el;
        this.el.data(D_XUIOBJ, this);
        this.node = el[0];
        this.initialize();
    }

    /**
     * 从给定的 jQuery 对象中提取 select 元素（及 UI 元素）。
     * @param els {JQuery} 待提取的 jQuery 对象
     * @param andUI {Boolean} 是否包含 UI 元素
     */
    Select.extract = function(els, andUI) {
        var result = $();

        els.each(function() {
            var el = $(this);
            result = result.add(el.is(EL_SELECTED) ? el : el.find(EL_SELECTED));
            andUI && (result = result.add(el.is('.' + C_SELECT) ? el : el.find('.' + C_SELECT)));
        });

        return result;
    };

    Select.prototype = {
        constructor: Select,

        ui: null,                    // ui element
        uiHead: null,                // ui .head element
        uiText: null,                // ui .text element
        uiTr: null,                  // ui .tr element
        uiOptionListBox: null,       // ui .option-list-box element
        uiOptionList: null,          // ui .option-list element
        uiSelectedOption: null,      // ui selected .option element

        el: null,                    // source select element

        init: false,                 // is init
        disabled: false,             // is disabled

        initialize: function() {
            var ui;

            // 避免重复初始化
            if (this.init) { return; }

            ui = this.el.closest('.' + C_SELECT);
            if (!ui.length) {
                ui = $(
                    '<div class="' + C_SELECT + '">' +
                        '<div class="' + C_SELECT_HEAD + '">' +
                            '<div class="' + C_SELECT_TEXT + '"></div>' +
                            '<i class="' + C_SELECT_TR + '"></i>' +
                        '</div>' +
                        '<div class="' + C_SELECT_OPTION_LIST_BOX + '">' +
                            '<ul class="' + C_SELECT_OPTION_LIST + '"></ul>' +
                        '</div>' +
                    '</div>'
                );

                ui.insertAfter(this.el).append(this.el);
            }

            this.ui           = ui;
            this.uiHead       = ui.find('> .' + C_SELECT_HEAD);
            this.uiText       = this.uiHead.find('> .' + C_SELECT_TEXT);
            this.uiTr         = this.uiHead.find('> .' + C_SELECT_TR);
            this.uiOptionListBox = ui.find('> .' + C_SELECT_OPTION_LIST_BOX);
            this.uiOptionList = this.uiOptionListBox.find('> .' + C_SELECT_OPTION_LIST);

            if (!this.uiOptionListBox.find('> iframe').length) {
                this.uiOptionListBox.append('<iframe src="javascript:"></iframe>');
            }

            this.ui.data(D_XUIOBJ, this);

            this.bindEvent();
            this.refresh();

            this.init = true;
        },

        // 为 UI 及其对应的 select 绑定事件，所有的事件绑定操作都在此处理。
        bindEvent: function() {
            this.el.bind('change.' + C_SELECT, $.proxy(this, 'changeHandler'));
            this.uiHead.bind('click.' + C_SELECT, $.proxy(this, 'headClickHandler'));
            this.uiOptionList.delegate('.' + C_SELECT_OPTION, 'click.' + C_SELECT,
                                       $.proxy(this, 'optionClickHandler'));
            this.ui.bind('mouseleave', $.proxy(this, 'mouseLeaveSelect'));
        },

        // select 的 mouseleave 事件
        mouseLeaveSelect: function(e) {
            this.fold();
        },

        // select 的 change 事件
        changeHandler: function(e) {
            this._select(this.el.find('option:selected'));
        },

        // 点击 UI 的头部事件
        headClickHandler: function(e) {
            this.toggle();
        },

        // 点击选项事件
        optionClickHandler: function(e) {
            this.select($(e.currentTarget).data(D_OPTION));
            this.hideOptionList();
        },

        // 刷新 UI
        refresh: function() {
            this.refreshOptionList();
            this._select(this.el.find('option:selected'));
            if (this.el.is(':disabled')) {
                this.disable();
            }
        },

        // 切换收起/展开状态，如果当前 UI 为禁用状态，则不做操作。
        toggle: function() {
            if (!this.disabled) {
                this.toggleOptionList();
            }
        },

        // 收起下拉菜单，如果当前 select 为禁用状态，则不做操作。
        fold: function() {
            if (!this.disabled) {
                this.hideOptionList();
            }
        },

        // 展开下拉菜单，如果当前 select 为禁用状态，则不做操作。
        unfold: function() {
            if (!this.disabled) {
                this.openOptionList();
            }
        },

        // 切换打开/关闭选项列表
        toggleOptionList: function() {

            if (this.uiOptionListBox.is(':hidden')) {

                this.openOptionList();

                var $win,
                iframeTop = 0;

                if ($(window.parent.document).find('#j-membright').length === 0) {
                    // 非iframe
                    $win = $(window);
                    iframeTop = 0;
                } else {
                    //iframe
                    $win = $(window.parent);
                    iframeTop = $('#j-membright', window.parent.document).offset().top;
                }

                var winHeight = $win.height(),
                scollHeight = $win.scrollTop(),
                ulHeight = this.uiOptionListBox.height(),
                selectHeight = this.uiHead.height(),
                headTop = this.uiHead.offset().top,
                selectTop = headTop + iframeTop;

                if((winHeight + scollHeight - selectTop - selectHeight) < ulHeight) {
                    this.uiOptionListBox.css({ top: -ulHeight, borderTop: '#ddd 1px solid', borderBottom: 'none' });
                } else {
                    this.uiOptionListBox.css({ top: '25px', borderTop: 'none', borderBottom: '#ddd 1px solid' });
                }

            } else {
                this.hideOptionList();
            }

        },

        // 打开选项列表
        openOptionList: function() {
            this.uiOptionListBox.show();
        },

        // 关闭选项列表
        hideOptionList: function() {
            this.uiOptionListBox.hide();
        },

        // 刷新选项列表
        refreshOptionList: function() {
            var self = this;

            self.uiOptionList.empty();

            self.el.find('> option').each(function(i, option) {
                var uiOption;

                option = $(option);
                uiOption = $('<a class="' + C_SELECT_OPTION + '" href="javascript:"><span>' + option.text() + '</span></a>');

                uiOption.data(D_OPTION, option);
                option.data(D_UI_OPTION, uiOption);

                self.uiOptionList.append($('<li></li>').append(uiOption));
            });
        },

        // 获取 select 对应的 ui 元素
        getUI: function() {
            return this.ui;
        },

        select: function(option) {
            var self = this;

            // 所传入选项必须属于当前对象内的下拉列表
            option = option.filter(function() {
                return $(this).closest('select')[0] === self.node;
            });

            if (option.length === 0) {
                return;
            }
            else if (option.length > 1) {
                option = option.eq();
            }

            if (option[0].selected !== true) {
                option[0].selected = true;
                this.el.trigger('change');
            }
            else {
                this._select(option);
            }
        },

        _select: function(option) {
            var uiOption = option.data(D_UI_OPTION),
                selClassName = C_SELECT_OPTION + C_SELECTED;

            if (this.uiSelectedOption) {
                this.uiSelectedOption.removeClass(selClassName);
            }

            if (option && option.length) {
                this.uiText.text(option.text());
                uiOption.addClass(selClassName);
                this.uiSelectedOption = uiOption;
            }
            else {
                this.uiText.text('');
                this.uiSelectedOption = null;
            }
        },

        destroy: function() {
            if (!this.init) { return; }

            this.el.unbind('.' + C_SELECT);
            this.el.removeData(D_XUIOBJ);

            this.ui.after(this.el).remove();

            this.el.find('option').each(function() {
                $(this).removeData(D_UI_OPTION);
            });

            this.init = false;
        },

        disable: function() {
            this.node.disabled = true;
            this.ui.addClass(C_SELECT + C_DISABLED);
            this.disabled = true;
            this.hideOptionList();
        },

        enable: function() {
            this.node.disabled = false;
            this.ui.removeClass(C_SELECT + C_DISABLED);
            this.disabled = false;
        }
    };
}));
