/**
 * @des 优惠券操作类
 * @aucthor
 * @date 2015-01-22
 */
var couponOperate = (function() {

    /**
     * 常量
     */

    /**
     * 变量
     */
    var _global = {
        // 已选中的优惠券id
        couponIds: []
    };

    /**
     * 获取所有优惠券
     */
    function _getCoupons() {
        var regionId = $('input[name="addressId"]:checked').attr('regionId');
        var paymentModeType = $('input[name="paymentModeType"]:checked').val();
        var deliveryId = $('input[name="deliveryModeId"]:checked').val();
        var data = {
            'regionId': regionId,
            'paymentModeType': paymentModeType,
            'deliveryId': deliveryId
        };
        checkoutController.findCoupons(data, function(result) {
            _flushCouponlist(result);
        });
    }

    /**
     * 更新券列表
     */
    function _flushCouponlist(result) {
    	console.log(result);
    	if(result){
	        var availableCouponsLen = result. availableCoupons.length,
	            unAvailableCouponsLen = result.unAvailableCoupons.length,
	            $tmpl = $('#tmpl-coupons');
	
	        result.availableCouponsLen = availableCouponsLen;
	        result.unAvailableCouponsLen = unAvailableCouponsLen;
	
	        var templateCompile = Handlebars.compile($tmpl.val()),
	            template = templateCompile(result);
	
	        $('#j-coupons').html(template).show();
	        _flushRender();
    	}
    }
    
    /**
     * 刷新优惠券选中状态和可用状态
     */
    function _flushRender(){
    	
		var jCoupons = $('#j-coupons'),
			 useableCoupons = jCoupons.find('.j-tab:eq(0)');
    		 chkCoupons = useableCoupons.find('input.j-coupon');
    		
    	chkCoupons.each(function(index,el){
    		var $that = $(this);
    		if($that.data("selected")){
    			$that.prop('checked',true);
    		}
    		if(!$that.data("available-status")){
    			$that.attr('disabled',true);
    		}
    	});
		
    }

    /**
     * 选择优惠券时，更新已选中的优惠券id数组
     */
    function saveCouponId($this) {
        var couponId = $this.val();
        var couponIds = _getCouponIds();
        var newCouponIds = [];
        if ($this.prop('checked')) {
            if (couponIds.length === 0) {
                couponIds[0] = couponId;
            } else {
                couponIds[couponIds.length] = couponId;
            }
            _global.couponIds = couponIds;
        } else {
            for (var i = 0; i < couponIds; i++) {
                if (id != couponId[i]) {
                    newCouponIds.push(id);
                }
            }
            _global.couponIds = newCouponIds;
        }
    }

    /**
     * 选中优惠券
     */
    function _selectCoupon() {
        var $this = $(this);
        saveCouponId($this);

        var deliveryId = 0;
        var regionId = $('input[name="addressId"]:checked').attr("regionId");

        if (regionId !== undefined) {
            deliveryId = $('input[name="deliveryModeId"]:checked').val();
            var paymentModeType = $('input[name="paymentModeType"]:checked').val();

            var couponIdStr = _getCouponIds().join(',');
            var _selectCoupons = {
                'regionId': regionId,
                'deliveryId': deliveryId,
                'paymentModeType': paymentModeType,
                'couponIds': couponIdStr
            };
            checkoutController.selectedCoupon(_selectCoupons, function(data) {
            	if( data ){
	                if (data.useState) {
	                    //更新券列表
	                    _flushCouponlist(data);
	                } else {
	                    alert('选择优惠券失败');
	                }
	                console.log(_global.couponIds);
            	}
            });
        }
    }

    /**
     * 获取卡券ids
     */
    function _getCouponIds() {
        return _global.couponIds;
    }

    /**
     * 优惠券可用不可用切换
     */
    function _couponsToggle() {
        var $this = $(this),
            $coupons = $('#j-coupons');
        $coupons.find('.j-nav').removeClass('active');
        $this.addClass('active');
        $coupons.find('.j-tab').hide().eq($this.index()).show();
    }

    /**
     * 返回可用方法
     */
    return {
        getCouponIds: _getCouponIds,
        getCoupons: _getCoupons,
        selectCoupon: _selectCoupon,
        couponsToggle: _couponsToggle
    };

}());

// dom加载后执行
$(function() {

    // 获取所有优惠券
    $('#j-coupons-show').on('click', couponOperate.getCoupons);

    // 优惠券可用不可用切换
    $('#j-coupons').on('click', '.j-nav', couponOperate.couponsToggle)

    // 选中优惠券
    .on('click', '.j-coupon', couponOperate.selectCoupon);

});