/**
 * @des 结算中心 -配送方式模块儿
 * @aucthor xjq
 * @date 2015-02-02
 */
var deliveryOperate = (function() {

    /**
     * 常量
     */

    /**
     * 变量
     */
    var _global = {

    };

    /**
     * 保存配送方式
     */
    function _saveDelivery (argument) {
        var paymentModeType = $('#payAndDelivery').find('input[name=paymentModeType]:checked').data("text");
        var deliveryMode = $('#payAndDelivery').find('input[name=deliveryModeId]:checked').data("text");


        var result = {
            'paymentModeType': paymentModeType,
            'deliveryMode': deliveryMode
        };

        var $tmpl = $('#tmpl-delivery-mode-save');

        var templateCompile = Handlebars.compile($tmpl.val()),
            template = templateCompile(result);

        $('#j-delivery-mode-save').html(template).show();

        //获取运费
        _getFreight(calculateAmount);
        $('#pnl_balance').find('.kind-info').show();
    }

    /**
     * 获取运费
     */
   function _getFreight(callback) {

        //获取运费
        var regionId = $('input[name="addressId"]:checked').attr("regionId");
        var freightFee = 0;
        if (regionId !== undefined) {
            var deliveryModeId = $('input[name="deliveryModeId"]:checked').val();
            var data = {
                "regionId": regionId,
                "deliveryModeId": deliveryModeId
            };

            checkoutController.getFreight(data, function(result) {
                if (result.result) {
                    //修改运费
                    freightFee = result.tip;
                    $('#j-total-freight').val(result.tip);
                    callback();
                } else {
                    alert(yunfeiChange);
                }
            });
        }
    }

    /**
     * 返回可用方法
     */
    return {
        saveDelivery: _saveDelivery
    };

}());