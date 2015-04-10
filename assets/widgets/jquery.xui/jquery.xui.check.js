/**
 * jQuery.xcheck 用于美化浏览器原生的 select 控件。
 * @version: 1.1.0
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        factory();
    }
}(function() {

    var C_BASE             = 'xui',

        C_CHECK            = C_BASE + '-check',
        C_CHECKBOX         = C_BASE + '-checkbox',
        C_RADIO            = C_BASE + '-radio',

        C_DISABLED         = '-disabled',
        C_CHECKED          = '-checked',
        C_DISABLED_CHECKED = C_DISABLED + C_CHECKED,

        EL_SELECTED     = 'input[type=radio], input[type=checkbox]',

        D_xuiOBJ           = 'xui-obj';

    $.fn.xcheck = function(operateName) {
        var els = Check.extract(this);


        if (typeof operateName === 'string') {
            var operateArauments = Array.prototype.slice.call(arguments, 1);
            els.each(function(i, select) {
                var xuiObj = $(select).data(D_xuiOBJ);
                if (xuiObj) {
                    xuiObj[operateName].apply(xuiObj, operateArauments);
                }
            });
        }
        else {
            els.each(function(i, select) {
                new Check($(select));
            });
        }

        return this;
    };

    function Check(el) {
        this.el = el;
        this.el.data(D_xuiOBJ, this);
        this.node = el[0];
        this.initialize();
    }

    Check.extract = function(els) {
        var result = $();

        els.each(function() {
            var el = $(this);
            result = result.add(el.is(EL_SELECTED) ? el : el.find(EL_SELECTED));
        });

        return result;
    };

    Check.prototype = {
        constructor: Check,

        ui: null,               // ui element
        el: null,               // source input element
        node: null,             // is a dom object for el

        init: false,            // is init
        disabled: false,        // is disabled
        checked: false,         // is checked

        checkbox: false,        // is checkbox
        radio: false,           // is radio

        className: false,       // ui class name

        initialize: function() {
            if (this.init) { return; }

            switch(this.el.attr('type').toLowerCase()) {
                case 'checkbox':
                    this.checkbox = true;
                    this.className = C_CHECKBOX;
                    break;
                case 'radio':
                    this.radio = true;
                    this.className = C_RADIO;
                    break;
                default:
                    return;
            }

            this.ui = this.el.closest('.' + this.className);
            if (!this.ui.length) {
                this.ui = $('<div class="' + this.className + '"></div>');
                this.ui.insertAfter(this.el).append(this.el);
            }

            this.bindEvent();
            this.refresh();

            this.init = true;
        },

        bindEvent: function() {
            this.el.bind('change.' + C_CHECK, $.proxy(this, 'changeHandler'));
        },

        changeHandler: function() {
            if (this.node.checked) {
                this.check();
            }
            else {
                this.uncheck();
            }
        },

        refresh: function() {
            if (this.node.checked) {
                this.check();
            }
            else {
                this.uncheck();
            }

            if (this.node.disabled) {
                this.disable();
            }
            else {
                this.enable();
            }
        },

        destroy: function() {
            if (!this.init) { return; }

            if (this.ui) {
                this.ui.after(this.el).remove();
                delete this.ui;
            }

            this.el.unbind('.' + C_CHECK);
            this.init = false;
        },

        enable: function() {
            this.disabled = false;

            if (this.node.disabled) {
                this.node.disabled = false;
            }

            if (this.ui) {
                this.ui.removeClass(
                    this.className + C_DISABLED + ' ' +
                    this.className + C_DISABLED_CHECKED
                );
            }
        },

        disable: function() {
            this.disabled = true;

            if (!this.node.disabled) {
                this.node.disabled = true;
            }

            if (this.ui) {
                this.ui.addClass(this.className + C_DISABLED);

                if (this.checked) {
                    this.ui.addClass(this.className + C_DISABLED_CHECKED);
                }
            }
        },

        check: function() {
            var self = this;

            this.checked = true;

            if (!this.node.checked) {
                this.node.checked = true;
            }

            if (this.ui) {
                this.ui.addClass(this.className + C_CHECKED);

                if (this.disabled) {
                    this.ui.addClass(this.className + C_DISABLED_CHECKED);
                }
            }

            if (this.radio) {
                this.getAllRadio(this.el).each(function() {
                    if (this !== self.node) {
                        var xuiobj = $(this).data(D_xuiOBJ);
                        if (xuiobj) {
                            xuiobj.uncheck();
                        }
                    }
                });
            }
        },

        uncheck: function() {
            this.checked = false;

            if (this.node.checked) {
                this.node.checked = false;
            }

            if (this.ui) {
                this.ui.removeClass(
                    this.className + C_CHECKED + ' ' +
                    this.className + C_DISABLED_CHECKED
                );
            }
        },

        toggle: function() {
            if (this.node.checked) {
                this.uncheck();
            }
            else {
                this.check();
            }
        },

        getAllRadio: function(radio) {
            var form = radio.closest('form');

            if (!form.length) {
                form = $('body');
            }

            return form.find('input[type=radio][name="' + radio.attr('name') + '"]');
        }
    };
}));
