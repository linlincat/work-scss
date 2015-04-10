/**
 * 默认的，插件会在 scroll-target 元素外面包裹一个 scroll-box 元素，该元素宽度自适应，
 * 而高度等于初始化时 scroll-target 的高度，另外，该元素并不提供边框，内边距，外边距等任何视觉样式，
 * 如果需要添加边框等样式，可以在 scroll-target 的外面包裹一个 scroll-wrap 元素，如下：
 *
 * ```html
 * <div class="scroll-wrap">
 *     <div class="scroll-target">content...</div>
 * </div>
 * ```
 *
 * 待初始化后（`$('.scroll-target').scrollBox();`），将变为如下结构：
 *
 *
 * ```html
 * <div class="scroll-wrap">
 *     <div class="scroll-box">
 *         <div class="scroll-target">content ...</div>
 *         other elements ...
 *     </div>
 * </div>
 * ```
 *
 * 因此，可以 scroll-wrap 添加边框，或者设置其宽度以限定滚动元素宽度等。
 */
(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['jquery.mousewheel'], factory);
    }
    else {
        factory();
    }
})(function() {

'use strict';

var isIe6 = /msie 6/i.test(navigator.userAgent),

    C_LEFT = 'left',
    C_RIGHT = 'right',
    C_TOP = 'top',
    C_BOTTOM = 'bottom',

    C_SCROLL_BOX = 'scroll-box',
    C_SCROLL_TARGET = 'scroll-target',
    C_SCROLL_CORNER = 'scroll-corner',

    C_SCROLL_BAR = 'scroll-bar',
    C_SCROLL_TRACK = 'scroll-track',
    C_SCROLL_THUMB = 'scroll-thumb',
    C_SCROLL_BUTTON = 'scroll-button',
    C_SCROLL_BUTTON_TOP = C_SCROLL_BUTTON + '-' + C_TOP,
    C_SCROLL_BUTTON_BOTTOM = C_SCROLL_BUTTON + '-' + C_BOTTOM,
    C_SCROLL_BUTTON_LEFT = C_SCROLL_BUTTON + '-' + C_LEFT,
    C_SCROLL_BUTTON_RIGHT = C_SCROLL_BUTTON + '-' + C_RIGHT,

    C_HORIZONTAL_SCROLL_BAR = 'scroll-bar-horizontal',
    C_VERTICAL_SCROLL_BAR = 'scroll-bar-vertical',

    D_SCROLLBOX_OBJ = 'scroll-box-obj',
    D_SCROLLBAR_OBJ = 'scroll-bar-obj',

    doc = $(document),
    win = $(window),

    userDrag = (function() {
        //判定对样式的支持
        var getStyleName = (function(){
            var prefixes = ['', '-ms-','-moz-', '-webkit-', '-khtml-', '-o-'],
                reg_cap = /-([a-z])/g;

            function getStyleName(css, el) {
                el = el || document.documentElement;
                var style = el.style,test;
                for (var i=0, l=prefixes.length; i < l; i++) {
                    test = (prefixes[i] + css).replace(reg_cap,function($0,$1){
                        return $1.toUpperCase();
                    });
                    if(test in style){
                        return test;
                    }
                }
                return null;
            }

            return getStyleName;
        }());

        var userSelect = getStyleName("user-select");

        return {
            disable: function() {
                if (typeof userSelect === "string") {
                    document.documentElement.style[userSelect] = "none";
                }
                document.unselectable = "on";
                document.onselectstart = function() {
                    return false;
                }
                document.ondragstart = function() {
                    return false;
                }
            },

            enable: function() {
                if (typeof userSelect === "string") {
                    document.documentElement.style[userSelect] = "text";
                }
                document.unselectable = "off";
                document.onselectstart = null;
                document.ondragstart = null;
            }
        }

    }());


$.fn.scrollBox = function(operateName) {
    if (typeof operateName === 'string') {
        var operateArauments = Array.prototype.slice.call(arguments, 1);
        this.each(function(i, node) {
            var scrollBox = $(node).data(D_SCROLLBOX_OBJ);
            if (scrollBox) {
                scrollBox[operateName].apply(scrollBox, operateArauments);
            }
        });
    }
    else {
        this.each(function(i, node) {
            scrollBoxFactory($(node));
        });
    }
};

function scrollBoxFactory(el) {
    var i, l, ScrollBarClass, scrollBar;

    for (i = scrollBoxFactory.classes.length - 1; i >= 0; i--) {
        ScrollBarClass = scrollBoxFactory.classes[i];
        if (ScrollBarClass.isTarget(el)) {
            scrollBar = new ScrollBarClass(el);
            break;
        }
    }

    return scrollBar;
}

scrollBoxFactory.classes = [];

var Class = (function() {
    // Class
    // -----------------
    // Thanks to:
    //  - http://mootools.net/docs/core/Class/Class
    //  - http://ejohn.org/blog/simple-javascript-inheritance/
    //  - https://github.com/ded/klass
    //  - http://documentcloud.github.com/backbone/#Model-extend
    //  - https://github.com/joyent/node/blob/master/lib/util.js
    //  - https://github.com/kissyteam/kissy/blob/master/src/seed/src/kissy.js


    // The base Class implementation.
    function Class(o) {
        // Convert existed function to Class.
        if (!(this instanceof Class) && isFunction(o)) {
            return classify(o)
        }
    }

    // Create a new Class.
    //
    //  var SuperPig = Class.create({
    //    Extends: Animal,
    //    Implements: Flyable,
    //    initialize: function() {
    //      SuperPig.superclass.initialize.apply(this, arguments)
    //    },
    //    Statics: {
    //      COLOR: 'red'
    //    }
    // })
    //
    Class.create = function(parent, properties) {
        if (!isFunction(parent)) {
            properties = parent
            parent = null
        }

        properties || (properties = {})
        parent || (parent = properties.Extends || Class)
        properties.Extends = parent

        // The created class constructor
        function SubClass() {
            // Call the parent constructor.
            parent.apply(this, arguments)

            // Only call initialize in self constructor.
            if (this.constructor === SubClass && this.initialize) {
                this.initialize.apply(this, arguments)
            }
        }

        // Inherit class (static) properties from parent.
        if (parent !== Class) {
            mix(SubClass, parent, parent.StaticsWhiteList)
        }

        // Add instance properties to the subclass.
        implement.call(SubClass, properties)

        // Make subclass extendable.
        return classify(SubClass)
    }


    function implement(properties) {
        var key, value

        for (key in properties) {
            value = properties[key]

            if (Class.Mutators.hasOwnProperty(key)) {
                Class.Mutators[key].call(this, value)
            } else {
                this.prototype[key] = value
            }
        }
    }


    // Create a sub Class based on `Class`.
    Class.extend = function(properties) {
        properties || (properties = {})
        properties.Extends = this

        return Class.create(properties)
    }


    function classify(cls) {
        cls.extend = Class.extend
        cls.implement = implement
        return cls
    }


    // Mutators define special properties.
    Class.Mutators = {

        'Extends': function(parent) {
            var existed = this.prototype
            var proto = createProto(parent.prototype)

            // Keep existed properties.
            mix(proto, existed)

            // Enforce the constructor to be what we expect.
            proto.constructor = this

            // Set the prototype chain to inherit from `parent`.
            this.prototype = proto

            // Set a convenience property in case the parent's prototype is
            // needed later.
            this.superclass = parent.prototype
        },

        'Implements': function(items) {
            isArray(items) || (items = [items])
            var proto = this.prototype, item

            while (item = items.shift()) {
                mix(proto, item.prototype || item)
            }
        },

        'Statics': function(staticProperties) {
            mix(this, staticProperties)
        }
    }


    // Shared empty constructor function to aid in prototype-chain creation.
    function Ctor() {
    }

    // See: http://jsperf.com/object-create-vs-new-ctor
    var createProto = Object.__proto__ ?
            function(proto) {
                return { __proto__: proto }
            } :
        function(proto) {
            Ctor.prototype = proto
            return new Ctor()
        }


    // Helpers
    // ------------

    function mix(r, s, wl) {
        // Copy "all" properties including inherited ones.
        for (var p in s) {
            if (s.hasOwnProperty(p)) {
                if (wl && indexOf(wl, p) === -1) continue

                // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
                if (p !== 'prototype') {
                    r[p] = s[p]
                }
            }
        }
    }


    var toString = Object.prototype.toString

    var isArray = Array.isArray || function(val) {
        return toString.call(val) === '[object Array]'
    }

    var isFunction = function(val) {
        return toString.call(val) === '[object Function]'
    }

    var indexOf = Array.prototype.indexOf ?
            function(arr, item) {
                return arr.indexOf(item)
            } :
        function(arr, item) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] === item) {
                    return i
                }
            }
            return -1
        }

    return Class
}());

var ScrollBar = Class.extend({

    bar: null,               // 滚动条元素
    track: null,             // 滚动轨道元素
    thumb: null,             // 滚动块元素，在 track 元素中
    firstButton: null,       // 滚动条中的第一个按钮
    lastButton: null,        // 滚动条中的最后一个按钮
    buttons: null,           // 所有的按钮元素

    barLength: undefined,    // 滚动条的长度
    trackLength: undefined,  // 滚动轨道的长度
    thumbOffset: undefined,  // 滚动块相对于滚动轨道起始位置的偏移值
    thumbLength: undefined,  // 滚动块的长度

    hidden: false,           // 是否隐藏
    visible: true,           // 是否显示

    /**
     * 初始化一个滚动条元素
     */
    initialize: function() {
        this.bar         = $('<div class="' + C_SCROLL_BAR    + '"></div>');
        this.firstButton = $('<a   class="' + C_SCROLL_BUTTON + '" href="javascript:"></a>');
        this.lastButton  = $('<a   class="' + C_SCROLL_BUTTON + '" href="javascript:"></a>');
        this.track       = $('<div class="' + C_SCROLL_TRACK  + '"></div>');
        this.thumb       = $('<a   class="' + C_SCROLL_THUMB  + '" href="javascript:"></a>');

        this.thumbOffset = 0;

        this.bar.append(
            this.firstButton,
            this.track.append(
                this.thumb
            ),
            this.lastButton
        );

        this.buttons = this.firstButton.add(this.lastButton);

        this.bar.data(D_SCROLLBAR_OBJ, this);
    },

    /** 获取滚动条的高度 */
    getBarHeight: function() {
        return this.bar.outerHeight();
    },

    /** 获取滚动条的宽度 */
    getBarWidth: function() {
        return this.bar.outerWidth();
    },

    /** 隐藏滚动条 */
    hide: function() {
        if (this.visible) {
            this.bar.hide();
            this.hidden = true;
            this.visible = false;
        }
    },

    /** 显示滚动条 */
    show: function() {
        if (this.hidden) {
            this.bar.show();
            this.hidden = false;
            this.visible = true;
        }
    },

    /**
     * 依据所提供的相关数据，更新滚动条的状态
     * @param barLength {Integer} 滚动条的长度，单位像素。
     * @param viewportPercent {Double} 视口长度占总内容长度的百分比。
     * @param scrollPercent {Double} 已滚动内容长度占总内容长度的百分比。
     */
    update: function(barLength, viewportPercent, scrollPercent) {
        this._setBarLength(barLength);
        this._setThumbLength(this.trackLength * viewportPercent);
        this._changeThumbOffset(this._getOffsetNumberByPercent(scrollPercent));
    },

    /**
     * 移动滚动块
     * @param moveLength {Integer} 移动长度，单位像素，为负值时向反方向移动
     */
    moveThumb: function(moveLength) {
        var offset = this.thumbOffset + moveLength;
        this._changeThumbOffset(offset);
    },

    /**
     * 返回滑块滚动的百分比
     */
    getThumbScrollPercent: function() {
        return this.thumbOffset / (this.trackLength - this.thumbLength);
    },

    /** 获取滚动条长度 */
    getBarLength: function() {
        return this.barLength;
    },

    /** 设置滚动条长度，同时会引起轨道长度的改变 */
    _setBarLength: function(barLength) {
        this.barLength = barLength;
    },

    /** 获取滚动轨道长度 */
    getTrackLength: function() {
        return this.trackLength;
    },

    /** 获取滚动块长度 */
    getThumbLength: function() {
        return this.trumbLength;
    },

    /** 设置滚动块长度 */
    _setThumbLength: function(trumbLength) {
        this.trumbLength = trumbLength;
    },

    /**
     * 修改滚动块的位置
     * @param offset {Integer} 滚动块相对于轨道起始位置的偏移值
     */
    _changeThumbOffset: function(offset) { },

    /**
     * 根据滚动内容长度的百分比值计算滑块的偏移量
     * @param percent {Double} 已滚动内容长度占总内容长度的百分比。
     */
    _getOffsetNumberByPercent: function(percent) {
        percent = Math.min(Math.max(0, percent), 1);
        return (this.trackLength - this.thumbLength) * percent;
    }
});

var HorizontalScrollBar = ScrollBar.extend({

    horizontal: true,     // 水平滚动条标识
    leftButton: null,     // 左移动按钮
    rightButton: null,    // 右移动按钮

    initialize: function() {
        HorizontalScrollBar.superclass.initialize.call(this);

        this.leftButton = this.firstButton;
        this.rightButton = this.lastButton;

        this.bar.addClass(C_HORIZONTAL_SCROLL_BAR);
        this.leftButton.addClass(C_SCROLL_BUTTON + '-' + C_LEFT);
        this.rightButton.addClass(C_SCROLL_BUTTON + '-' + C_RIGHT);
    },

    /** 设置滚动条长度 */
    _setBarLength: function(length) {
        length = Math.max(0, length);

        this.barLength = length;
        this.bar.width(length);

        this.trackLength = this.barLength - this.firstButton.outerWidth() - this.lastButton.outerWidth();
        this.track.width(this.trackLength);
    },

    /** 设置滚动块长度 */
    _setThumbLength: function(length) {
        length = Math.min(Math.max(20, length), this.trackLength);
        this.thumbLength = length;
        this.thumb.width(this.thumbLength);
    },

    /**
     * 修改滚动块的位置
     * @param offset {Integer} 滚动块相对于轨道起始位置的偏移值
     */
    _changeThumbOffset: function(offset) {
        this.thumbOffset = Math.min(Math.max(0, offset), this.trackLength - this.thumbLength);
        this.thumb.css('left', this.thumbOffset);
    }
});

var VerticalScrollBar = ScrollBar.extend({

    vertical: true,        // 垂直滚动条标识
    topButton: null,       // 上移动按钮
    bottomButton: null,    // 下移动按钮

    initialize: function() {
        VerticalScrollBar.superclass.initialize.call(this);

        this.topButton = this.firstButton;
        this.bottomButton = this.lastButton;

        this.bar.addClass(C_VERTICAL_SCROLL_BAR);
        this.topButton.addClass(C_SCROLL_BUTTON + '-' + C_TOP);
        this.bottomButton.addClass(C_SCROLL_BUTTON + '-' + C_BOTTOM);
    },

    /** 设置滚动条长度 */
    _setBarLength: function(length) {
        length = Math.max(0, length);

        this.barLength = length;
        this.bar.height(length);

        this.trackLength = this.barLength - this.firstButton.outerHeight() - this.lastButton.outerHeight();
        this.track.height(this.trackLength);
    },

    /** 设置滚动块长度 */
    _setThumbLength: function(length) {
        length = Math.min(Math.max(20, length), this.trackLength);
        this.thumbLength = length;
        this.thumb.height(this.thumbLength);
    },

    /**
     * 修改滚动块的位置
     * @param offset {Integer} 滚动块相对于轨道起始位置的偏移值
     */
    _changeThumbOffset: function(offset) {
        this.thumbOffset = Math.min(Math.max(0, offset), this.trackLength - this.thumbLength);
        this.thumb.css('top', this.thumbOffset);
    }
});

var ScrollBox = Class.extend({

    Statics: {
        defaultConfig: {            // 默认配置
            theme: 'default',       // 主题名称
            vertical: true,         // 是否有垂直滚动条
            horizontal: true,       // 是否有水平滚动条
            overlay: false          // 启用滚动条覆盖模式
        }
    },

    scrollBox: null,                // 一般包含滚动目标以及滚动条
    scrollTarget: null,             // 滚动目标，通过设置其 scrollTop 以及 scrollLeft 以实现滚动
    scrollCorner: null,             // 滚动条边角，当同时显示垂直滚动条及水平滚动条时，将显示该元素
    verticalScrollBar: null,        // 垂直滚动条元素
    horizontalScrollBar: null,      // 水平滚动条元素

    config: null,                   // 配置对象

    initialize: function(el) {
        if (this.init) { return; }

        this.el = el;
        this.node = el[0];
        this.el.data(D_SCROLLBOX_OBJ, this);

        this.config = $.extend({}, this.constructor.defaultConfig);
        this.setup();
        this.bindEvents();

        this.init = true;
    },

    updateTargetInfo: function() {
        this.scrollTargetInfo = {
            paddingTop : parseInt(this.scrollTarget.css('padding-top'), 10) || 0,
            paddingLeft : parseInt(this.scrollTarget.css('padding-left'), 10) || 0,
            paddingRight : parseInt(this.scrollTarget.css('padding-right'), 10) || 0,
            paddingBottom : parseInt(this.scrollTarget.css('padding-bottom'), 10) || 0
        };
    },

    updateTarget: function() {
        this.updateTargetInfo();

        var width = this.scrollBox.width(),
            height = this.scrollBox.height(),

            info = this.scrollTargetInfo,

            marginRight = 0,
            marginBottom = 0;

        width -= info.paddingLeft + info.paddingRight;
        height -= info.paddingTop + info.paddingBottom;

        if (!this.config.overlay) {
            if (this.verticalScrollBar) {
                width -= this.verticalScrollBar.getBarWidth();
                marginRight = this.verticalScrollBar.getBarWidth();
            }

            if (this.horizontalScrollBar) {
                height -= this.horizontalScrollBar.getBarHeight();
                marginBottom = this.horizontalScrollBar.getBarHeight();
            }
        }

        this.scrollTarget.css({
            width: width,
            height: height,
            marginRight: marginRight,
            marginBottom: marginBottom
        });
    },

    updateScrollBars: function() {
        this.updateVerticalScrollBar();
        this.updateHorizontalScrollBar();
        this.updateScrollCorner();
    },

    updateVerticalScrollBar: function() {
        if (this.verticalScrollBar) {
            this.verticalScrollBar.bar.css({
                top: 0,
                right: 0
            });

            this.verticalScrollBar.update(
                this.getVerticalScrollBarHeight(),
                this.getVerticalShowPercent(),
                this.getVerticalScrollPercent()
            );

            if (this.verticalScrollBar.trackLength === this.verticalScrollBar.thumbLength) {
                this.verticalScrollBar.hide();
            }
            else {
                this.verticalScrollBar.show();
            }
        }
    },

    updateHorizontalScrollBar: function() {
        if (this.horizontalScrollBar) {
            this.horizontalScrollBar.bar.css({
                bottom: (isIe6 && this.scrollBox.innerHeight() % 2 === 1) ? -1  : 0,
                left: 0
            });

            this.horizontalScrollBar.update(
                this.getHorizontalScrollBarWidth(),
                this.getHorizontalShowPercent(),
                this.getHorizontalScrollPercent()
            );

            if (this.horizontalScrollBar.trackLength === this.horizontalScrollBar.thumbLength) {
                this.horizontalScrollBar.hide();
            }
            else {
                this.horizontalScrollBar.show();
            }
        }
    },

    updateScrollCorner: function() {
        if (this.verticalScrollBar && this.verticalScrollBar.visible && this.horizontalScrollBar && this.horizontalScrollBar.visible) {
            if (!this.scrollCorner) {
                this.scrollCorner = this.createScrollCorner();
                this.scrollBox.append(this.scrollCorner);
            }

            this.scrollCorner.css({
                bottom: 0,
                right: 0
            }).show();
        }
        else if (this.scrollCorner) {
            this.scrollCorner.hide();
        }
    },

    /**
     * 装配组件，封装原始内容
     */
    setup: function() {
        this.addThemeClass();

        if (this.verticalScrollBar)   { this.addState('vertical');   }
        if (this.horizontalScrollBar) { this.addState('horizontal'); }
        if (this.config.overlay)      { this.addState('overlay');    }

        this.updateTarget();
        this.updateScrollBars();
    },

    /**
     * 销毁滚动条，将其内容恢复到原始状态
     */
    destroy: function() {
    },

    /**
     * 绑定相关事件
     */
    bindEvents: function() {
        this.verticalScrollBar && this.bindScrollBarEvents(this.verticalScrollBar);
        this.horizontalScrollBar && this.bindScrollBarEvents(this.horizontalScrollBar);

        this.scrollTarget.mousewheel($.proxy(this, 'mousewheelScrollTargetEvent'));
        this.scrollTarget.scroll($.proxy(this, 'scrollTargetScrollEvent'));

        if (typeof this.bindEndemicEvents === 'function') {
            this.bindEndemicEvents();
        }
    },

    bindScrollBarEvents: function(scrollBar) {
        scrollBar.bar.mousewheel($.proxy(this, 'mousewheelScrollBarEvent'));
        scrollBar.bar.mouseenter($.proxy(this, 'mouseenterScrollBarEvent'));
        scrollBar.bar.mouseleave($.proxy(this, 'mouseleaveScrollBarEvent'));
        scrollBar.thumb.mousedown($.proxy(this, 'mousedownScrollBarThumbEvent'));
        scrollBar.buttons.mousedown($.proxy(this, 'mousedownScrollBarButtonEvent'));
    },

    /** 点击滚动条按钮的事件 */
    mousedownScrollBarButtonEvent: function(e) {
        var button = $(e.currentTarget);

        if (button.hasClass(C_SCROLL_BUTTON_TOP)) {
            this.clickTopButtonEvent.apply(this, arguments);
        }
        else if (button.hasClass(C_SCROLL_BUTTON_BOTTOM)) {
            this.clickBottomButtonEvent.apply(this, arguments);
        }
        else if (button.hasClass(C_SCROLL_BUTTON_LEFT)) {
            this.clickLeftButtonEvent.apply(this, arguments);
        }
        else if (button.hasClass(C_SCROLL_BUTTON_RIGHT)) {
            this.clickRightButtonEvent.apply(this, arguments);
        }

        this.updateScrollBars();
    },

    /** 按下滚动条滚动块的事件 */
    mousedownScrollBarThumbEvent: function(e) {
        var thumb = $(e.currentTarget),
            bar = thumb.closest('.' + C_SCROLL_BAR).data(D_SCROLLBAR_OBJ),
            ox = e.pageX,
            oy = e.pageY;

        doc.bind('mousemove.' + C_SCROLL_THUMB, $.proxy(mousemoveHandler, this));
        doc.bind('mouseup.' + C_SCROLL_THUMB, $.proxy(mouseupHandler, this));
        bar.bar.addClass(C_SCROLL_BAR + '-hold');
        userDrag.disable();

        function mousemoveHandler(e) {
            this.moveScrollBar = true;

            if (bar.horizontal) {
                bar.moveThumb(e.pageX - ox);
                this.horizontalScroll(
                    bar.getThumbScrollPercent() * (this.getContentWidth() - this.getTargetWidth())
                );
            }
            else {
                bar.moveThumb(e.pageY - oy);
                this.verticalScroll(
                    bar.getThumbScrollPercent() * (this.getContentHeight() - this.getTargetHeight())
                );
            }

            ox = e.pageX;
            oy = e.pageY;
        }

        function mouseupHandler() {
            this.moveScrollBar = false;
            doc.unbind('mousemove.' + C_SCROLL_THUMB);
            doc.unbind('mouseup.' + C_SCROLL_THUMB);
            bar.bar.removeClass(C_SCROLL_BAR + '-hold');
            userDrag.enable();
        }
    },

    /** 目标滚动事件 */
    scrollTargetScrollEvent: function(e) {
        if (this.moveScrollBar !== true) {
            this.updateScrollBars();
        }
    },

    /** 鼠标滚轮在滚动目标上滚动的事件 */
    mousewheelScrollTargetEvent: function(e) {
        this.verticalScroll(this.getScrollTop() - Math.max(e.deltaFactor, 50) * e.deltaY);
        return false;
    },

    /** 鼠标滚轮在滚动条上滚动的事件 */
    mousewheelScrollBarEvent: function() {
    },

    /** 鼠标移入滚动条的事件 */
    mouseenterScrollBarEvent: function(e) {
        var scrollBar = $(e.currentTarget);
        scrollBar.addClass(C_SCROLL_BAR + '-hover');
    },

    /** 鼠标移出滚动条的事件 */
    mouseleaveScrollBarEvent: function(e) {
        var scrollBar = $(e.currentTarget);
        scrollBar.removeClass(C_SCROLL_BAR + '-hover');
    },

    clickTopButtonEvent: function() {},
    clickBottomButtonEvent: function() {},
    clickLeftButtonEvent: function() {},
    clickRightButtonEvent: function() {},

    /** 创建一个滚动盒元素 */
    createScrollBox: function() {
        return $('<div class="' + C_SCROLL_BOX + '" style="overflow: hidden;"></div>');
    },

    /** 创建一个边角元素 */
    createScrollCorner: function() {
        return $('<div class="' + C_SCROLL_CORNER + '"></div>');
    },

    /** 创建滚动目标元素 */
    createScrollTarget: function() {
        return $('<div class="' + C_SCROLL_TARGET + '" style="overflow: hidden;"></div>');
    },

    /** 添加主题类，或者其相关状态类 */
    addThemeClass: function(stateName) {
        stateName = stateName ? '-' + stateName : '';
        this.scrollBox.addClass(C_SCROLL_BOX + '-' + this.config.theme + stateName);
    },

    /** 删除主题类，或者其相关状态类 */
    removeThemeClass: function(stateName) {
        stateName = stateName ? '-' + stateName : '';
        this.scrollBox.removeClass(C_SCROLL_BOX + '-' + this.config.theme + stateName);
    },

    /** 添加状态 */
    addState: function(stateName) {
        this.scrollBox.addClass(C_SCROLL_BOX + '-' + stateName);
        this.addThemeClass(stateName);
        this[stateName] = true;
    },

    /** 移除状态 */
    removeState: function(stateName) {
        this.scrollBox.removeState(C_SCROLL_BOX + '-' + stateName);
        this.removeThemeClass(stateName);
        delete this[stateName];
    },

    getVerticalScrollBarHeight: function() {
        var height = this.scrollBox.innerHeight();

        if (this.horizontalScrollBar) {
            height -= this.horizontalScrollBar.getBarHeight();
        }

        return height;
    },

    getHorizontalScrollBarWidth: function() {
        var width = this.scrollBox.innerWidth();

        if (this.verticalScrollBar) {
            width -= this.verticalScrollBar.getBarWidth();
        }

        return width;
    },

    /**
     * 垂直滚动
     * @param percent {Number} 滚动量
     */
    verticalScroll: function(count) {
        count = Math.min(Math.max(0, count), this.getContentHeight() - this.getTargetHeight());
        this.scrollTarget.scrollTop(count);
    },

    /**
     * 水平滚动
     * @param percent {Number} 滚动量
     */
    horizontalScroll: function(count) {
        count = Math.min(Math.max(0, count), this.getContentWidth() - this.getTargetWidth());
        this.scrollTarget.scrollLeft(count);
    },

    /** 获取视口高度相对于内容高度的百分比 */
    getVerticalShowPercent: function() {
        return this.getTargetHeight() / this.getContentHeight();
    },

    /** 获取视口宽度相对于内容宽度的百分比 */
    getHorizontalShowPercent: function() {
        return this.getTargetWidth() / this.getContentWidth();
    },

    /** 获取内容滚动高度相对于内容高度的百分比 */
    getVerticalScrollPercent: function() {
        return Math.max(this.getScrollTop() / (this.getContentHeight() - this.getTargetHeight()) || 0, 0);
    },

    /** 获取内容滚动宽度相对于内容宽度的百分比 */
    getHorizontalScrollPercent: function() {
        return Math.max(this.getScrollLeft() / (this.getContentWidth() - this.getTargetWidth()) || 0, 0);
    },

    getContentHeight: function() {},
    getContentWidth: function() {},
    getTargetWidth: function() {},
    getTargetHeight: function() {},
    getScrollTop: function() {},
    getScrollLeft: function() {}
});

var DefaultScrollBox = ScrollBox.extend({
    Statics: {
        isTarget: function() {
            return true;
        }
    },

    setup: function() {
        this.scrollBox           = this.createScrollBox();
        this.scrollTarget        = this.el.addClass(C_SCROLL_TARGET);

        this.verticalScrollBar   = this.config.vertical ? new VerticalScrollBar() : undefined;
        this.horizontalScrollBar = this.config.horizontal ? new HorizontalScrollBar() : undefined;

        this.scrollTarget.css('overflow', 'hidden');

        this.scrollBox
            .css({
                overflow: 'hidden'
            })
            .insertAfter(this.el)
            .append(this.verticalScrollBar ? this.verticalScrollBar.bar : null)
            .append(
                this.scrollTarget
            )
            .append(this.horizontalScrollBar ? this.horizontalScrollBar.bar : null);

        this.constructor.superclass.setup.call(this);
    },

    clickTopButtonEvent: function() {
        this.verticalScroll(this.getScrollTop() - this.getContentLineHeight());
    },
    clickBottomButtonEvent: function() {
        this.verticalScroll(this.getScrollTop() + this.getContentLineHeight());
    },
    clickLeftButtonEvent: function() {
        this.horizontalScroll(this.getScrollLeft() - this.getCharWidth() * 2.5);
    },
    clickRightButtonEvent: function() {
        this.horizontalScroll(this.getScrollLeft() + this.getCharWidth() * 2.5);
    },

    getContentHeight: function() {
        return this.scrollTarget[0].scrollHeight;
    },

    getContentWidth: function() {
        return this.scrollTarget[0].scrollWidth;
    },

    getTargetWidth: function() {
        return this.scrollTarget.innerWidth();
    },

    getTargetHeight: function() {
        return this.scrollTarget.innerHeight();
    },

    getScrollTop: function() {
        return this.scrollTarget.scrollTop();
    },

    getScrollLeft: function() {
        return this.scrollTarget.scrollLeft();
    },

    getContentLineHeight: function() {
        var lineHeight = parseInt(this.scrollTarget.css('line-height'), 10),
            p;

        if (!lineHeight) {
            p = $('<p style="position: absolute; left: 0; top: 0; visibility: hidden; padding: 0; margin: 0; border: 0;">x</p>');
            this.scrollTarget.append(p);
            lineHeight = p.height();
            p.remove();
        }

        lineHeight = Math.max(lineHeight, 20);

        return lineHeight;
    },

    getCharWidth: function() {
        var charWidth, p;

        p = $('<p style="position: absolute; left: 0; top: 0; visibility: hidden; padding: 0; margin: 0; border: 0;">x</p>');
        this.scrollTarget.append(p);
        charWidth = p.width();
        p.remove();

        charWidth = Math.max(charWidth, 10);

        return charWidth;
    }
});
scrollBoxFactory.classes.push(DefaultScrollBox);

var TextareaScrollBox = ScrollBox.extend({
    Statics: {
        isTarget: function(el) {
            return el.is('textarea');
        },

        defaultConfig: $.extend({}, ScrollBox.defaultConfig, {
            horizontal: false
        })
    },

    setup: function() {
        this.scrollBox = this.createScrollBox();
        this.scrollTarget = this.el.addClass(C_SCROLL_TARGET);

        this.verticalScrollBar  = new VerticalScrollBar();

        this.scrollBox
            .css('overflow', 'hidden')
            .insertAfter(this.el)
            .append(this.verticalScrollBar.bar)
            .append(
                this.scrollTarget
            );

        this.el.css('overflow', 'hidden');

        this.constructor.superclass.setup.call(this);

        this.addState('textarea');
    },

    bindEndemicEvents: function() {
        this.scrollTarget.keydown($.proxy(this, 'textareaKeydownEvent'));
        this.scrollTarget.keyup($.proxy(this, 'textareaKeyupEvent'));
    },

    textareaKeydownEvent: function() {
        this.updateScrollBars();
    },

    textareaKeyupEvent: function() {
        this.updateScrollBars();
    },

    verticalScroll: function(count) {
        count = Math.max(0, count);
        count = Math.min(count, this.getContentHeight() - this.getTargetHeight());

        this.scrollTarget.scrollTop(count);
    },

    mousewheelScrollTargetEvent: function(e) {
        this.verticalScroll(this.getScrollTop() - e.deltaFactor * e.deltaY);
    },

    clickTopButtonEvent: function() {
        var scrollCount = Math.max(parseInt(this.scrollTarget.css('line-height'), 10) || 20, 12);
        this.verticalScroll(this.getScrollTop() - scrollCount);
    },

    clickBottomButtonEvent: function() {
        var scrollCount = Math.max(parseInt(this.scrollTarget.css('line-height'), 10) || 20, 12);
        this.verticalScroll(this.getScrollTop() + scrollCount);
    },

    getContentHeight: function() {
        return this.scrollTarget[0].scrollHeight;
    },

    getContentWidth: function() {
        return this.scrollTarget[0].scrollWidth;
    },

    getTargetWidth: function() {
        return this.scrollTarget.innerWidth();
    },

    getTargetHeight: function() {
        return this.scrollTarget.innerHeight();
    },

    getScrollTop: function() {
        return this.scrollTarget.scrollTop();
    },

    getScrollLeft: function() {
        return this.scrollTarget.scrollLeft();
    }
});
scrollBoxFactory.classes.push(TextareaScrollBox);

var NoHorizontalScrollBox = DefaultScrollBox.extend({
    Statics: {
        isTarget: function(el) {
            return !el.data('horizontal');
        },

        defaultConfig: $.extend({}, ScrollBox.defaultConfig, {
            horizontal: false
        })
    },

    setup: function() {
        this.scrollBox           = this.createScrollBox();
        this.scrollTarget        = this.el.addClass(C_SCROLL_TARGET);

        this.verticalScrollBar   = this.config.vertical ? new VerticalScrollBar() : undefined;
        this.horizontalScrollBar = this.config.horizontal ? new HorizontalScrollBar() : undefined;

        this.scrollTarget.css('overflow', 'hidden');

        this.scrollBox
            .css({
                overflow: 'hidden'
            })
            .insertAfter(this.el)
            .append(this.verticalScrollBar ? this.verticalScrollBar.bar : null)
            .append(
                this.scrollTarget
            )
            .append(this.horizontalScrollBar ? this.horizontalScrollBar.bar : null);

        /**
         * ScrollBxo装配组件，封装原始内容
         */
        this.addThemeClass();
        if (this.verticalScrollBar)   { this.addState('vertical');   }
        if (this.horizontalScrollBar) { this.addState('horizontal'); }
        if (this.config.overlay)      { this.addState('overlay');    }

        this.updateTarget();
        this.updateScrollBars();
    }
});
scrollBoxFactory.classes.push(NoHorizontalScrollBox);


});
