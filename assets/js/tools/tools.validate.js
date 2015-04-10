/**
 * 工具类 - 通用校验
 * @version 1.0
 * @author xjq
 * @create 2015-02-08
 * @modify 2015-03-17
 */

var tools = tools || {};
tools.validate = (function () {

    /**
      * 获取字符串长度，一个汉字算2个字符
      * @param {String} string 字符串
      */
    // function _getStringLen(string) {
    //     return string.replace(/[^x00-xff]/g, "aa").length;
    // }

    /**
     * @param {String} inpSelector      文本输入标签选择器
     * @param {String} tipSelector      提示语显示标签选择器
     * @param {Number} limitLen         限定字符数量
     * @param {String} emtpyTip         为空错误提示内容
     * @param {String} exceedErrorTip   超出限定字符数时提示内容
     */
    function _validCurrMsg(inpSelector, tipSelector, limitLen, emtpyTip, exceedErrorTip) {
        var inpValue = $(inpSelector).val(),
            currLen = inpValue.length, // _getStringLen(inpValue),
            tipInTime = '目前为{{currLen}}个字符，您还可以输入{{surplusLen}}个字符',
            tip = '';

        if (currLen === 0) {

            if (emtpyTip !== undefined && emtpyTip !== null) {
                $(tipSelector).html(emtpyTip).removeClass('right').addClass('wrong');
                return false;
            }
            $(tipSelector).html('');
            return true;
        }

        if (currLen <= limitLen) {

            tip = tipInTime.replace('{{currLen}}', Math.ceil(currLen));
            tip = tip.replace('{{surplusLen}}', Math.ceil(limitLen - currLen));

            $(tipSelector).html(tip).removeClass('wrong').addClass('right');
            return true;
        }

        $(tipSelector).html(exceedErrorTip).removeClass('right').addClass('wrong');
        return false;
    }

    return {
        validCurrMsg: _validCurrMsg
    };
}());
