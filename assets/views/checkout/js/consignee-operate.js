/**
 * @des 结算中心
 * @aucthor leoshen
 * @date 2015-01-29
 */
var consigneeOperate = (function() {

    /**
     * 常量
     */

    /**
     * 变量
     */
    var _global = {

    };

    /**
     * 页面加载后初始化收货人信息
     */
    function _init() {
        if ($('input[name=addressId]:checked').length > 0) {
            $('#btn_saveSelected').trigger('click');
        } else {
            $('#btn_changeAddress').trigger('click');
        }
    }

    /**
     * 保存地址
     */
    function _saveAddress() {

        var $checkedRadio = $('#pnl_recipient').find('input[name=addressId]:checked');
        var recipient=$checkedRadio.siblings("input[mark=recipient]").val();//收货人
        var regionProvince=$checkedRadio.siblings('.customer-address:eq(0)').text();
        var address=$checkedRadio.siblings('.detailAddressShow').text();
        var mobile=$checkedRadio.siblings("input[type=hidden][mark=mobile]").val();//手机号

        var result = {
            'recipient': recipient,
            'regionProvince': regionProvince,
            'address': address,
            'mobile': mobile
        };

        var $tmpl = $('#tmpl-consignee-address');

        var templateCompile = Handlebars.compile($tmpl.val()),
            template = templateCompile(result);

        $('#j-consignee-address').html(template).show();

        var regionId = $checkedRadio.attr("regionId");//id

        // console.log('regionId = ' + regionId);
        var data = {'regionId':regionId};
        checkoutController.getDeliveryMode(data, function(result){
            var $tmpl = $('#tmpl-delivery-mode'),
                data = {},
                lastMode = {};

            data.deliveryModes = result;

            var templateCompile = Handlebars.compile($tmpl.val()),
            template = templateCompile(data);

            $('#j-delivery-mode').html(template).show();
        });
    }

    /**
     * 返回可用方法
     */
    return {
        init: _init,
        saveAddress: _saveAddress
    };

}());

// dom加载后执行
$(function() {

    consigneeOperate.init();

});
