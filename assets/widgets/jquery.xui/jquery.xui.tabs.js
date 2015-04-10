/**
 * 初始化tabs页签切换功能
 *
 * @version 1.0
 * @create 2015-03-12
 * @modify
 */

define(function () {
    var _CONSTANT = {
        TABS_SELECTOR: '.xui-tabs',
        TABS_TAB_SELECTOR: '.xui-tab',
        TABS_TAB_CONTENT_SELECTOR: '.xui-tab-content',
        TABS_TAB_PANEL_SELECTOR: '.xui-tab-pane',
        TABS_TAB_ACTIVITE_SELECTOR: 'active'
    };

    /**
     * 通用页签切换渲染器
     *
     *   <ul class="xui-tabs">
     *       <li class="xui-tab">页签一</li>
     *       <li class="xui-tab">页签二</li>
     *   </ul>
     *   <div class="xui-tab-content">
     *       <div class="xui-tab-pane active">页签一内容</div>
     *       <div class="xui-tab-pane">页签二内容</div>
     *   </div>
     *
     * @param {String} events  一个或多个用空格分隔的事件类型和可选的命名空间，如"click"或"keydown.myPlugin"
     * @param {String} selector  设置container的范围，默认为document
     */
    function _tabs(events, selector) {
        var $container = selector ? $(selector) : $(document),
            $tabs = $(_CONSTANT.TABS_SELECTOR, $container);

        if ($tabs.length === 0) {
            return;
        }
        events = events || 'click';

        var _toggerTab = function(event) {
            var $this = $(this),
                index = $this.index(),
                $currTabs = event.data.$currTabs;

            $this.addClass(_CONSTANT.TABS_TAB_ACTIVITE_SELECTOR).siblings().removeClass(_CONSTANT.TABS_TAB_ACTIVITE_SELECTOR);
            $currTabs.siblings(_CONSTANT.TABS_TAB_CONTENT_SELECTOR).find(_CONSTANT.TABS_TAB_PANEL_SELECTOR)
                .eq(index).addClass(_CONSTANT.TABS_TAB_ACTIVITE_SELECTOR)
                .siblings().removeClass(_CONSTANT.TABS_TAB_ACTIVITE_SELECTOR);
        };

        // 遍历所有符合条件的页签，绑定页签切换事件
        $tabs.each(function() {
            var $currTabs = $(this);
            $currTabs.find(_CONSTANT.TABS_TAB_SELECTOR).on(events, {'$currTabs': $currTabs}, _toggerTab);
        });
    }

    $.xtabs = _tabs;
});
