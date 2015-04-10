/**
 * 工具类 - 操作字符串
 * @version 1.0
 * @author xjq
 * @create 2015-02-08
 * @modify 2015-02-08
 */

var tools = tools || {};
tools.string = (function () {

    var PRICE_COMMA_REG = /(\d{1,3})(?=(\d{3})+(?:$|\D))/g; // 金额每三位加英文,

    /**
     * 去除字符串前后逗号
     * @return {String} str 字符串
     */
    function _trimComma(str) {
        if (str) {
            str = str.replace(/^,/g, '');
            str = str.replace(/,$/g, '');
        } else {
            str = '';
        }
        return str;
    }

    /**
     * 格式化金额值，每三位以逗号分隔
     * @param  {String/Number} str 金额值
     */
    function _formatPriceValue(str) {
        if (!$.isNumeric(str)) {
            return '';
        }
        str = (+str).toFixed(2);
        return str.replace(PRICE_COMMA_REG, '$1,');
    }

    return {
        trimComma: _trimComma,
        formatPriceValue: _formatPriceValue
    };
}());

// test
// console.log(tools.string.trimComma(',1,2,3,'));
// console.log(tools.string.formatPriceValue(2000000));
