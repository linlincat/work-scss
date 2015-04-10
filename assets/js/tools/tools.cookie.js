/**
 * 工具类 - 存取cookie值
 * @version 1.0
 * @author xjq
 * @create 2015-02-09
 * @modify 2015-02-09
 */

var tools = tools || {};
tools.cookie = (function () {

    var SUBSITE_KEY = 'subsite'; // 站点信息
    var SUBSITE_EXPIRES = 3; // 3小时

    /**
     * 设置站点cookie信息
     * @param {String} value 站点信息字符串
     */
    function _setSubSite(value) {
        $.cookie(SUBSITE_KEY, value, {
            expires: SUBSITE_EXPIRES,
            path: '/',
            domain: BASE.TOP_LEVEL_DOMAIN
        });
    }

    /**
     * 获取站点cookie信息
     * @return {Object} 站点信息对象
     */
    function _getSubSite() {
        var subsite = $.cookie(SUBSITE_KEY);
        if (!subsite) {
            return null;
        }
        var subsiteArr = subsite.split('|'),
            subsiteObj = null;

        if (subsiteArr && subsiteArr.length > 2) {
            subsiteObj = {
                id: subsiteArr[0],
                name: subsiteArr[1],
                url: subsiteArr[2]
            };
        }
        return subsiteObj;
    }

    return {
        setSubSite: _setSubSite,
        getSubSite: _getSubSite
    };
}());

// test
// tools.cookie.setSubSite('41|万里店|http://172.31.1.101/');
// console.log(tools.cookie.getSubSite());
