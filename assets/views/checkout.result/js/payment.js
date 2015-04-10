$(function() {
    //数量加号
    $(".reduce-g").click(function() {
        var inputnum = $(this).parent().find(".input-goods input").val();
        inputnum++;
        $(this).parent().find(".input-goods input").val(inputnum);
		$(this).parent().find(".oper-goods").removeClass("plus-g").addClass("plus-gh");
    });

    //数量减号
    $(".plus-g").click(function() {
        var inputnum = $(this).parent().find(".input-goods input").val();
        inputnum--;
        if (inputnum <= 0) {
            inputnum = 0;
			$(this).removeClass("plus-gh").addClass("plus-g");
        }else{
			
		}
        $(this).parent().find(".input-goods input").val(inputnum);
		
    });
	
	//全选
	$(".select-box").click(function(){
		$(this).toggleClass("active-box");
	})
	
	//领取赠品
	
	$(".collect").hover(function(){
		$(".get-gift-content").show();
	})
	$(".get-gift-content b").click(function(){
		$(".get-gift-content").hide();
	})
	$(".undo").click(function(){
		$(".get-gift-content").hide();
	})
	
	
	 //导航菜单fixed
    var offset_top, offset_top_ie6;
    var isIe6 = false;

    if ($("#cart-popup").length > 0) {
        offset_top = $(".cart-popup").offset().top;
        offset_top_ie6 = 0;
    } else {
	}

    $(function() {
    	var container = $('.detail-tab-contain');
    	if(container.offset()){
        	offset_top = container.offset().top;
        	offset_top_ie6 = -(offset_top - $('.datail-match').height());
    	}        
    });

    $(window).scroll(function() {
        if ($(window).scrollTop() > offset_top) {
            if (isIe6) {
                $("html").css('position', 'fixed');
				$("#cart-popup").css({
                    "position": "absolute",
                    "z-index": "1000"
                });
				$(".cart-popup").show();
                $("#cart-popup")[0].style.setExpression('top', 'eval((document.documentElement).scrollTop + ' + offset_top_ie6 + ') + "px"');
            } else {
                $("#cart-popup").css({
                    "position": "fixed",
                    "top": "0",
                    "z-index": "1000"
                });
				$(".cart-popup").show();
            }
        } else {
            $("#cart-popup").css({
                "position": "static",
                "top": "0",
                "z-index": "0"
            });
        }

    })
	
	function showPopup(){
		var scrollHeight = $(window).height();
		var scrollwidth = $(document).width();
		var $pop_backPopup = $("#pop_backPopup");
		bagHeight = $pop_backPopup.height();
		bagWidth = $("#pop_backPopup").width();
	   	$pop_backPopup.css("left",(scrollwidth - bagWidth)/2);
	   	$pop_backPopup.css("top",(scrollHeight - bagHeight)/2);
	    $pop_backPopup.show();
	}
	//背景弹出
	$("#btn_nextBtn").click(function(){
		var $jShadow = $("#j-shadow");
		$jShadow.show();  
	    $jShadow.css("height",$(document).height());  
        $jShadow.css("width",$(document).width());  

		var $radio = $('#chk_cardPayment');
		if($radio.length>0 && $radio.prop('checked')){
			$('#pop_cardPayment').show();
			return false;
		}
		showPopup();
	});

	// 福卡支付下一步
	$('#btn_cardPayment').click(function(){
		$('#form_payment').submit();
		$('#pop_cardPayment').hide();
		showPopup();
	});
	// 修改支付方式
	$('#arc_changePayment').click(function(){
		$('#j-shadow').hide();
		$('#pop_cardPayment').hide();
	});
        
	//弹出框取消继续购物
	$(".back-popup i").click(
		function (){
			$(this).parents(".back-popup").hide();
			$(".j-shadow").hide();
		} 
	);
	
	//重置浏览器，对弹出背景的高宽重新定义
	$(window).resize(function(){
		var $shadow = $("#j-shadow"),
			$document = $(document);
		if($shadow.length > 0){
			$shadow.css({
				"width" :$(document).width(),
				"height" : $(document).height()
			});		   
		}
	});	
	
	//查看订单详情
	$('#anc_viewOrder').click(function(){
		var queryArray = [];
		var queryJson = {};
		queryArray = location.search.substring(1).split('&');
		for(var i=0;i<queryArray.length;i++){
			 var name = queryArray[i].split('=')[0];
			 var value =  queryArray[i].split('=')[1];
			 queryJson[name]= value;
		}
		this.href = '/member/orderDetail?orderId='+queryJson.orderId;																																																																																																																											
	});

})