/**
 * 工具类 - 操作时间日期
 * @version 1.0
 * @author xjq
 * @create 2015-02-09
 * @modify 2015-02-09
 */

var tools = tools || {};
tools.date = (function () {

    /**
     * 格式化时间毫秒数
     * @param {Number} milliscond 时间毫秒数
     * @return {Object}
     */
    function _formatTimeMills(milliscond) {
        var d = Math.floor(milliscond / (1000 * 60 * 60 * 24)),
            h = Math.floor(milliscond / (1000 * 60 * 60)) % 24,
            m = Math.floor(milliscond / (1000 * 60)) % 60,
            s = Math.floor(milliscond / 1000) % 60;
        return {
            'd': d, // 天数
            'h': h, // 小时
            'm': m, // 分钟
            's': s // 秒杀
        };
    }

    /**
     * 格式化时间，不足十位的前补零
     * @param {Number} n    待操作的时间值
     * @return {String}
     */
    function _formatTime(n) {
        if (n === null || n === undefined) {
            return '00';
        }
        if (n.toString().length === 1) {
            return '0' + n;
        }
        return n.toString();
    }

    return {
        formatTimeMills: _formatTimeMills, // 格式化时间毫秒数
        formatTime: _formatTime // 格式化时间，不足十位的前补零
    };
}());

// test
// console.log(tools.date.formatTimeMills(new Date('2015-02-09') - new Date('2015-02-07')));
// console.log(tools.date.formatTime(8));
