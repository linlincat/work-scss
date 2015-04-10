 /**
 * 工具类 - 操作浏览器对象模型BOM
 * @version 1.0
 * @author xjq
 * @create 2015-02-08
 * @modify 2015-02-08
 */

var tools = tools || {};
tools.bom = (function (window) {

    /**
     * 根据参数名获取地址栏参数值
     * @param {String} name 参数名
     * @param {String} s 指定的查询字符串
     * @return {String} 返回参数值
     */
    function _getQueryStringRegExp(name, s) {
        var reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i');
        var uri = '';
        if (s) {
            uri = s;
        } else {
            uri = window.location.search;
        }
        if (reg.test(uri)) {
            var result = decodeURIComponent(RegExp.$2.replace(/\+/g, ' '));
            return result === '' ? '' : result;
        }
        return '';
    }

    /**
     * 获取参数数组
     * @param {Boolean} isDecode 是否对参数进行解码操作，默认true
     * @return {Array}
     */
    function _getQueryStringArgs(isDecode) {

        // 取得查询字符串并去掉开头的问号
        var location = window.location;
        var qs = (location.search.length > 0 ? location.search.substring(1) : '');

        // 保存数据的对象
        var args = {};

        // 取得每一项
        var items = qs.split('&');
        var item = null,
            name = null,
            value = null,
            i;

        // 逐个将每一项添加到args对象中
        for (i = 0; i < items.length; i++) {
            item = items[i].split('=');
            if (arguments.length === 1 && !isDecode) {
                name = item[0];
                value = item[1];
            } else {
                name = decodeURIComponent(item[0]);
                value = decodeURIComponent(item[1]);
            }
            args[name] = value;
        }

        return args;
    }

    return {
        getQueryStringRegExp: _getQueryStringRegExp,
        getQueryStringArgs: _getQueryStringArgs
    };
}(window));
