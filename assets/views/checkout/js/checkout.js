function checkoutOperate(op){
	if(op === BIZ_OPER.SAVEADDRESSDIV){
		//获取配送方式并展开
		//getDeliveryMode();
		
	}else if(op==BIZ_OPER.EDITADDRESSDIV){
		//获取会员的可用地址
		//showMemberAddress();
		
	}else if(op==BIZ_OPER.SAVEDELIVERYMODEDIV){
		//获取结算规则
		//getCheckouRule();
		//获取运费
		//getFreight();
		//清空优惠券、积分
	}else if(op==BIZ_OPER.EDITDELIVERYMODEDIV){
		//获取配送方式并展开
		//getDeliveryMode();
	}else if(op==BIZ_OPER.SHOWCOUPONS){
		//获取优惠券列表
		//getCoupons();
	}else if(op==BIZ_OPER.SELECTCOUPON){
		//执行优惠券奖励，刷新券列表
		//selectCoupon();
		//calculateAmount();
	}else if(op==BIZ_OPER.SHOWPOINTRULE){
		//获取可用积分和积分规则
		//getPointRule();
	}else if(op==BIZ_OPER.POINTPAY){
		//输入积分，进行校验计算
		//calculateAmount();
	}else if(op==BIZ_OPER.SUBMITORDER){
		//验证必填项，验证支付密码，提交订单
	}
}

function getDeliveryMode(){
	var regionId = $('input[name="addressId"]:checked').attr("regionId");
	var data={"regionId":regionId};
	checkoutController.getDeliveryMode(data,function(result){
		console.log(result);
	});
}

function findCoupons(){
	var data = {};
	checkoutController.findCoupons(data,function(result){
		console.log(result);
	});
}

function showMemberAddress(){
	//展示会员地址库即可
}

function getCheckouRule(){
	//获取结算优惠规则
}

/**已选中券id*/
var couponIds = {};


/**
 * 计算应付金额
 */
var yuan = '&yen;';
function calculateAmount(){
	//计算运费
	var totalFeright = $('#j-total-freight').val();
	//设置总运费
	$('#j-total-freight-info').html(yuan+totalFeright);
	//设置运费冲抵
	$('#j-service-freight-info').html(yuan+0);
	//设置运费冲抵
	$('#j-discount-freight-info').html(yuan+0);
	//设置运费合计
	$('#j-real-freight-info').html(yuan+totalFeright);

	//应付金额=商品总金额-订单优惠金额+运费总金额
	var totalAmount = $('#j-total-amount').val();
	var discountAmount = $('#j-discount-amount').val();
	
	var payableAmount = parseFloat(totalAmount) - parseFloat(discountAmount) + parseFloat(totalFeright);
	$('#j-payable-amount').html(yuan + payableAmount.toFixed(2));
}


/**
*获取积分规则
*/
function getPointRule(){
	var totalFeright = $('#j-total-freight').val();
	var availablePoint = 0;
	if(totalFeright>0){
		var data={"freight": totalFeright};
		checkoutController.getPoint(data,function(result){
			if(result){
				availablePoint = result.availablePoint;
			}
			console.log(result);
		});
	}
	$('#j-canusepoint-value').val(availablePoint);
	$('#canUsePoint').html(availablePoint);
}

function usePoint(e){
	e.preventDefault();
	var point = $('#txt_point').val();
	var pointValue = $('#j-canusepoint-value').val();
	if(point>pointValue){
		alert('您使用的积分超过了可使用的范围');
		$('#txt_point').val(pointValue);
		return;
	}
}

//激活优惠券
function activateCoupon(e){
	e.preventDefault();
	var couponNumber = $('#txt_couponNumber').val();
	var data = {"shortNum":couponNumber};
	couponController.activate(data,function(result){
		console.log(result);
	});
}

//去结算
function createOrder(){
	var $payAndDelivery=$('#payAndDelivery');
	var paymentModeType=$payAndDelivery.find("input[name='paymentModeType']:checked").val();
	var deliveryModeType=$payAndDelivery.find("input[name='deliveryModeId']:checked").val();
	var $invoiceId=$('#invoiceId');
	var invoiceStatus=$invoiceId.find("input[name='invoiceStatus']:checked").val();

	var addressId=$("#pnl_recipient").find("input[name='addressId']:checked").val();
	var remark = $('#txt_remark').val();
	var couponIds = couponOperate.getCouponIds();
	
	var idStr="";
	var $goodsList=$("#goodsListId");
	$goodsList.find('input[name="goodsId"]').each(function(index, element){
		if(index==0){
			idStr=$(this).val();
		}else{
			idStr=idStr+","+$(this).val();
		}
	});
	var itemIds= $('#itemIds').val();
	
	var freight = $('#j-total-freight').val();
	var freightServiceFee = 0;
	var invoiceType = $('#sel_invoiceType').val();
	var title = $('#title').val();
	var point = $('#txt_point').val();
	
	var data={"deliveryModeId":deliveryModeType,"freightRuleId":1,"invoiceStatus":invoiceStatus,"paymentModeType":paymentModeType,
			"addressId":addressId,"remark":"","goodsId":idStr,"itemIds":itemIds,"freight":freight,"freightServiceFee":freightServiceFee,
			"invoiceType":invoiceType,"title":title, "remark":remark, "couponIds":couponIds, "point":point};
			
	$('#j-submit-order-wait').show();
	lockSubmitOrder();
	checkoutController.createOrder(data,function(data){
		$('#j-submit-order-wait').hide();
		unLockSubmitOrder();
		if(data.result){
			var url="/checkout/submitOrder?paymentModeType="+data.paymentModeType+"&orderId="+data.orderDTO.id;
			window.location.href=url;
		}else{
			alert(data.resultMsg);
		}
	});
}

// 提交订单
function submitForm(){
	//判断是否可以提交
	//1.是否保存了收货人信息和支付配送方式
	var $that = $(this);
	var $saveInfo = $that.siblings('.save-info');
	if($('#pnl_recipient_biggest').hasClass('operation-focus')){
		$saveInfo.hide();
		$that.siblings('.save-address').show();
		return;
	};
	if($('#payAndDelivery').hasClass('operation-focus')){
		$saveInfo.hide();
		$that.siblings('.save-payment').show();
		return;
	};
	$saveInfo.hide();
	//2.是否存在收件人信息
	if($("#pnl_recipient").find("div.personalInfo").length>0){
		createOrder();
	}else{
		alert(peoleInfor);
		return false;
	}
}



// 锁定提交订单按钮
function lockSubmitOrder() {
	$('#j-submit-order').off('click')
			.addClass("submit-order-disabled");
}

// 解锁提交订单按钮
function unLockSubmitOrder() {
	$('#j-submit-order').on('click', submitForm)
			.removeClass("submit-order-disabled");
}

//###修改地址按钮
function changeAddress(e){
	e.preventDefault();
	var $pnlRecipient = $('#pnl_recipient_biggest');
	// 如果没有保存支付方式
	if($('#payAndDelivery').hasClass('operation-focus')){
		$pnlRecipient.find('.kind-info').show();
		return;
	};
	$pnlRecipient.find('.kind-info').hide();
	$pnlRecipient.addClass('operation-focus');
}
$('#btn_changeAddress').click(changeAddress);

//###保存收货人信息
function saveAddress(e){
	e.preventDefault();
	var $that = $(this);
	var $payAndDelivery = $('#payAndDelivery');
	$('#pnl_recipient_biggest').removeClass('operation-focus');
	$payAndDelivery.addClass('operation-focus');
	$payAndDelivery.find('.kind-info').css('display','inline-block');
	$payAndDelivery.find('.kind-text').hide();

	//获取收货地址
	consigneeOperate.saveAddress();
}
$('#btn_saveSelected').click(saveAddress);

//###修改支付方式按钮
function changePayment(e){
	e.preventDefault();
	var $that = $(this);
	// 如果还没有保存地址
	if($('#pnl_recipient_biggest').hasClass('operation-focus')){
		$that.siblings('.kind-text').css('display','inline-block');
		return;
	};
	$that.siblings('b').hide();
	$('#payAndDelivery').addClass('operation-focus');
}
$('#btn_changepayment').click(changePayment);

//###保存支付和配送方式
function savePayment(e){
	e.preventDefault();
	var $payAndDelivery = $('#payAndDelivery');
	var $pnlBalance = $('#pnl_balance');

	$payAndDelivery.removeClass('operation-focus');
	$payAndDelivery.find('.kind-info').hide();

	$pnlBalance.find('.kind-info').css('display','inline-block');

	//显示保存后的层内容
	deliveryOperate.saveDelivery();
}
$('#btn_savePayment').click(savePayment);

//显示激活码
function showActivateCode(){
	$('#sec_codeInput').show();
}
$('#btn_codeInput').click(showActivateCode);

//选择准时达日期和时间
var $oDatePicker = $('#date-picker');
// 初始化日期
var aweekDay=['周日','周一','周二','周三','周四','周五','周六'];
var nowDay = new Date();
var nowDate = nowDay.getDate();
var nowDay_index = nowDay.getDay();
var $deliveryDate = $oDatePicker.find('.deliveryDate li:gt(0)');
$deliveryDate.each(function(index,el){

	var $that = $(this);
	var dayText = aweekDay[nowDay_index];
	nowDay.setDate(nowDate+index);
	var newMonth = nowDay.getMonth()+1;
	var newDate = nowDay.getDate();
	var dateStr = toDouble(newMonth)+'-'+toDouble(newDate);
	
	$that.find('span').html(dayText);
	$that.find('i').html(dateStr);
	nowDay_index++;
	if(nowDay_index==7){
		nowDay_index = 0;
	}

});
function toDouble(num){
	return num>9 ? num:'0'+num;
}
//日期和时间选择
$('#date-input').click(function(){
	var $that = $(this);
	$that.css({borderBottom:'none'});
	$oDatePicker.show();
	$('.remindInfo').hide();
	$oDatePicker.css({left:$that.position().left+20,top:$that.position().top+$that.outerHeight()-1});
});
$oDatePicker.on('click','.weekDay',function(){
	var $that = $(this);
	$('.weekDay').removeClass('current');
	$('.timeInterval').removeClass('current');
	$that.addClass('current');
});
$oDatePicker.on('click','.timeInterval', function() {
	var $that = $(this);
	$('.timeInterval').removeClass('current');
	$that.addClass('current');
	$('.weekDay').each(function(index,el){
		var $self = $(this);
		var $oDateInput = $('#date-input');
		if($self.hasClass('current')){
			$oDateInput.find('span').html($self.find('span').html());
			$oDateInput.find('i').html($self.find('i').html());
			$oDateInput.find('i').html(function(index,html){
				var html = html+' '+$that.find('span').html();
				return html;
			});
			$('#freight b').html($that.find('b').html());
			$oDateInput.css({borderBottom:"1px solid #005aaa"});
		}
	$oDatePicker.hide();
	});
});
$oDatePicker.on('click','.randomDate',function(){
	$oDatePicker.hide();
	var $oDateInput = $('#date-input');
	$oDateInput.find('span').html('任意日期');
	$oDateInput.find('i').html('(普通快递)');
	$oDateInput.css({borderBottom:"1px solid #005aaa"});
	$('#freight b').html('&yen;0.00');
});

// 初始化静态渲染效果
var _init = (function () {
	
	var hidePresentLastLine = function () {
		var $this = $(this),
			$line = $this.find('.j-present-line:last');
			
		if ($line.next().length === 0) {
			$line.hide();
		}
	};
	
	// 购物车列表最后的分割线渲染处理
	var $goods = $('.j-good');
	$('#j-other-promotions').each(hidePresentLastLine);
	$goods.each(hidePresentLastLine);
	$goods.filter(':last').removeClass('list');
}());




function validAdditionalInfo () {
	var exceedErrorTip = '对不起，您的输入已超过最大限制！';
	checkoutValidate.valiCurrMsg('#j-additional-info', '#j-additional-info-tip',
		24, null, exceedErrorTip);
}

$('#j-additional-info').on('keyup', validAdditionalInfo);
history.forward(1);