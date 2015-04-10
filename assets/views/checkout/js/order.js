$(function() {
	
	history.forward(1);

    //发票类型抬头的中英文切换
    var orderMiddleInvoiceTypePerson=$("#orderMiddleInvoiceTypePerson").text();
    var orderMiddleInvoiceTypeCompany=$("#orderMiddleInvoiceTypeCompany").text();
    var typeinvoce=$("#sel_invoiceType option");
     typeinvoce.each(function(index,el){
        if($(el).val()==1)
        { 
            $(el).text(orderMiddleInvoiceTypePerson);
        }else{
            $(el).text(orderMiddleInvoiceTypeCompany);
        }
    });


	$('#pnl_recipient input.detailAddress').each(function(index,el){
		var $that = $(this);
		var addressArray=$that.val().split("%$");
		addressArray[0]=addressArray[0]+Road;
		addressArray[1]=addressArray[1]+rq;
		addressArray[2]=addressArray[2]+Floor;
		addressArray[3]=addressArray[3]+Room;
		var addressResult=addressArray.join("");
		//分割处理后显示在span标签中
		$that.siblings('span.detailAddressShow').html(addressResult);
		//判断是否显示手机号还是固定电话
		var mobile=$that.siblings('input[type=hidden][mark=mobile]').val();
		if(mobile!=null&&mobile!=""){//存在手机号
			$that.siblings('span[mark=phoneShow]').html(mobile);
		}else{//只有固定电话
			var telphone=$that.siblings('input[mark=telephone0]').val();
			telphone=telphone+"-"+$that.siblings('input[mark=telephone1]').val();
			telphone=telphone+"-"+$that.siblings('input[mark=telephone2]').val();
			$that.siblings('span[mark=phoneShow]').html(telphone);
		}
	});
	
	function saveAddress(e){
		//防止提交表单
		e.preventDefault();
		return;
	}

	function cancelAddress(e){
		e.preventDefault();
		return;
	}
	$('#pnl_recipient').on('change','input[type=radio]',function(){
		var $that = $(this);
		$('#addNewAddress').parent().show();
		$('.personalInfo').removeClass('editAddress');
		 $('.recipient-address').hide();
		if($that.prop('checked')){
			$('.ad-operations').hide();
			$that.siblings('.ad-operations').show();
		}
	});
	
	checkForm('pnl_operation');
	
    /**@1全局变量**/

        var $_pnl_operation=$("#pnl_operation");
        // 选择收货地址显示对应的编辑和删除操作
        var oInputRadio = $('#pnl_recipient input[type=radio]');
        //收件人信息的新增操作按钮的div
        var $div_btn_addAddress=$("#addNewAddress").parent();
    

    /**@2页面初始化操作**/
        //根据收货人的个数采取相应的措施
        $("#addNewAddress").on('click',addRecipientAddress);

        addRecipientShow();

        radioChange();
    /**@3函数部分**/

        //判断是否存在收货人
        function addRecipientShow(){
            //1.页面初始化时判断是否添加收货人信息
            var recipientCount=$("#pnl_recipient div.personalInfo").length;
            //2.如果不存在收货人信息默认显示添加收货人信息
            if(recipientCount==0){
                $("#addNewAddress").trigger('click');
                lockSubmitOrder();
                
            }else if(recipientCount==1){//收货人只有一条信息
                unLockSubmitOrder();
                //页面初始化时默认选中最后一条收货人信息为收货地址
                hideReciOperation();
                var $showRecipient=$("#pnl_recipient").find("input[type=radio]:last");
                $showRecipient.prop("checked","checked");
                var $operation=$showRecipient.siblings('span.ad-operations');
                $operation.find("a.ad-delete").hide();
                $operation.show();
            }else{
                unLockSubmitOrder();
                //页面初始化时默认选中最后一条收货人信息为收货地址
                hideReciOperation();
                var $showRecipient=$("#pnl_recipient").find("input[type=radio]:last");
                $showRecipient.prop("checked","checked");
                $showRecipient.siblings('span.ad-operations').show();
            }
            
            $("#btn_saveAddress").bind('click',saveAddress);
            $("#btn_cancelAddress").bind('click',cancelAddress);
        }



         //只有一个收货人信息时不允许删除操作（删除按钮隐藏）
        function hideOperationOnlyOne(){
            var recipientCount=$("#pnl_recipient div.personalInfo").length;
            if(recipientCount==1){
                $("#pnl_recipient").find("a.ad-delete").hide();
            }else{
                $("#pnl_recipient").find("a.ad-delete").each(function(){
                    $(this).show();
                });
            }
        }


        //新增收货人地址时将待填元素置空
        function fnClearAddressEle(){
            $("#recipient").val('');
            $_pnl_operation.find("input.regionProvince").val('');
            $_pnl_operation.find("input.regionCity").val('');
            $_pnl_operation.find("input.regionCounty").val('');
            $_pnl_operation.find("input.regionStreet").val('');
            $_pnl_operation.find("select.province").empty();
            $_pnl_operation.find("select.city").empty();
            $_pnl_operation.find("select.county").empty();
            $_pnl_operation.find("select.street").empty();
            $_pnl_operation.find("select.city").css("display","inline-block");
            $_pnl_operation.find("select.county").css("display","inline-block");
            $_pnl_operation.find("select.street").css("display","inline-block");
            $("#dt-road").val('');
            $("#dt-community").val('');
            $("#dt-floor").val('');
            $("#dt-room").val('');
            $("#zip-code").val('');
            $("#phone-number").val('');
            $("#area-code").val('');
            $("#telephone-code").val('');
            $("#extension-code").val('');
            $("#emailAddress").val('');
        }
        //收货人选中按钮发生改变时，对应的操作显示
        function radioChange(){
            oInputRadio.each(function(index,el){
                var $that = $(this);
                if($that.prop('checked')){
                    $that.siblings('.ad-operations').show();
                }
            });
        }
        //显示收货人的新增操作按钮
        function addOperationShow(){
            $div_btn_addAddress.show();
        }
        
        //隐藏收货人的新增操作按钮
        function addOperationHide(){
            $div_btn_addAddress.hide();
        }
        //将所有的收件人的radio全部不选中
        function unCheckedReci(){
             //将所有收货人的radio设为全都不选中
            $("#pnl_recipient div.personalInfo input[type=radio]").each(function(index,el){
                $(this).prop("checked",false);
            });
        }
        //将所有的编辑删除操作按钮隐藏操作
        function hideReciOperation(){
            var $recipientInfosDiv=$("#pnl_recipient");
            $recipientInfosDiv.find("span.ad-operations").each(function(){
                $(this).hide();
            });
        }
        
        //创建收货人的信息
        function createAddressDiv(data,addressVO,showAddress,showPhone){
            var $recipientInfosDiv=$("#pnl_recipient");
            var $addAddressDivs=$('<div>',{"class":'personalInfo'});
            var $addAddressDiv=$('<div>',{"class":'play-tilte infoItem'});
            //将所有的收件人的radio全部不选中
            unCheckedReci();
            //将所有的编辑删除操作按钮隐藏操作
            hideReciOperation();
          
            var $addressId = $('<input>',{type:'radio',val:data.resultId,name:'addressId',checked:true});
            $addAddressDiv.append($addressId);

            if(addressVO.regionIds.length>3){
                $addAddressDiv.append($("<input type=\"hidden\" value=\""+addressVO.regionIds[3]+"\" mark=\"regionStreet\"/>"));
            }else{
                $addAddressDiv.append($("<input type=\"hidden\" value=\"\" mark=\"regionStreet\"/>"));
            }
            if(addressVO.regionIds.length>2){
                 $addAddressDiv.append($("<input type=\"hidden\" value=\""+addressVO.regionIds[2]+"\" mark=\"regionCounty\"/>"));
            }else{
                 $addAddressDiv.append($("<input type=\"hidden\" value=\"\" mark=\"regionCounty\"/>"));
            }
            if(addressVO.regionIds.length>1){
                $addAddressDiv.append($("<input type=\"hidden\" value=\""+addressVO.regionIds[1]+"\" mark=\"regionCity\"/>"));
            }else{
                $addAddressDiv.append($("<input type=\"hidden\" value=\"\" mark=\"regionCity\"/>"));
            }
            if(addressVO.regionIds.length>0){
                $addAddressDiv.append($("<input type=\"hidden\" value=\""+addressVO.regionIds[0]+"\" mark=\"regionProvince\"/>"));
            }else{
                $addAddressDiv.append($("<input type=\"hidden\" value=\"\" mark=\"regionProvince\"/>"));
            }

            $addAddressDiv.append($("<input type=\"hidden\" value=\""+addressVO.zipcode+"\" mark=\"zip-code\"/>"));
            $addAddressDiv.append($("<input type=\"hidden\" value=\""+addressVO.email+"\" mark=\"email\"/>"));
            $addAddressDiv.append($("<input class=\"detailAddress\" type=\"hidden\" value=\""+addressVO.address+"\" mark=\"address\"/>"));
            $addAddressDiv.append($('<input type="hidden" value="'+addressVO.mobile+'" mark="mobile"/>'));
            $addAddressDiv.append($('<input type="hidden" value="'+addressVO.telephone[0]+'" mark="telephone0"/>'));
            $addAddressDiv.append($('<input type="hidden" value="'+addressVO.telephone[1]+'" mark="telephone1"/>'));
            $addAddressDiv.append($('<input type="hidden" value="'+addressVO.telephone[2]+'" mark="telephone2"/>'));
            var regionNameStr="";
            if(addressVO.regionIds.length>0){
                regionNameStr=regionNameStr+addressVO.regionNames[0];
            }
            if(addressVO.regionIds.length>1){
                regionNameStr=regionNameStr+addressVO.regionNames[1];
            }
            if(addressVO.regionIds.length>2){
                regionNameStr=regionNameStr+addressVO.regionNames[2];
            }
            if(addressVO.regionIds.length>3){
                regionNameStr=regionNameStr+addressVO.regionNames[3];
            }
            $addAddressDiv.append($('<span mark="recipientName">'+addressVO.recipient+'</span>'));
            $addAddressDiv.append($('<span class="customer-address">'+regionNameStr+'</span>'));
            $addAddressDiv.append($('<span class="customer-address detailAddressShow" mark="detailAddress">'+showAddress+'</span>'));
            $addAddressDiv.append($('<span mark="phoneShow">'+showPhone+'</span>'));
            var $operation=$('<span class="ad-operations" style="display:inline;"></span>');
            $operation.append('<a class="ad-edit" href="javascript:;"> 编辑 </a>');
            $operation.append('<a class="ad-delete" href="javascript:;"> 删除</a>');
            $addAddressDiv.append($operation);
            $addAddressDivs.append($addAddressDiv);
            $recipientInfosDiv.append($addAddressDivs);
        }
        //收件人的验证
        function chk_recipientName(data){
            if(!$.trim(data.recipient)){
                $("#recipient").siblings('.validation').show();
                $("#recipient").css({borderColor:'#ed1b23'});
                return false;
            }else{
                $("#recipient").siblings('.validation').hide();
                $("#recipient").css({borderColor:"#d3d3d3"});
                return true;
            }
        }
        //收件人长度的验证
        function chk_recipientLength(){
           var $that=$(this);
           var val=$that.val();
           $that.val(val.substring(0,25));
           return false;
        }
        //收货人省市区地址的验证
        function chk_provinceAddress(){
            var provinces=$("#btn_saveAddress").parent().siblings('p:eq(1)').find('select:visible');
            var provincesLength=provinces.length;
            for(var i=0;i<provincesLength;i++){
                var districtId=$(provinces[i]).find("option:selected").val();
                if(districtId!=""&&districtId!="0"){
                    // addressVO.regionIds[i]=districtId;  
                    // addressVO.regionNames[i]= $(provinces[i]).find("option:selected").text(); 
                    $(provinces[i]).css({borderColor:'#d3d3d3'});
                    $(provinces[i]).siblings('.validation').hide();
                }else{
                    $(provinces[i]).css({borderColor:'#ed1b23'});
                    $(provinces[i]).siblings('.validation').show();
                    return false;
                }
                if(i==(provincesLength-1)){
                    return true;
                }
            }
        }
        //收货人详细地址的验证
        function chk_detailAddress(data){

            if(!$.trim(data.road) || !$.trim(data.community) || !$.trim(data.floor) || !$.trim(data.room)){
                $('#dt-road').siblings('.validation').html('请输入完整地址').show();
                $('.detailedAddress').find('input').css({borderColor:'#ed1b23'});
                return false;
            }else{
                 $('#dt-road').siblings('.validation').hide();
                 $('.detailedAddress').find('input').css({borderColor:'#d3d3d3'});
                 return true;
            }
        }
        //收件人邮编格式验证
        function chk_postcode(){
            var $postcode=$("#zip-code");
            var val=$postcode.val();
            var re=/^\d{6}$/;
            if(val!=null && val!=""){
                if(re.test($postcode.val())){
                    $postcode.css({borderColor:"#d3d3d3"});
                    $postcode.siblings('.validation').hide();
                    return true;
                }else{
                    $postcode.css({borderColor:"#ed1b23"});
                    $postcode.siblings('.validation').show();
                    return false;
                }
            }else{
                $postcode.css({borderColor:"#d3d3d3"});
                $postcode.siblings('.validation').hide();
                return true;
            }
            
        }
        //手机号和固定电话的验证
        function ch_phone(data){

            var formatMobile=false;
            var formatPhone = false;
            mobile=data.mobile;
            phone=$.trim(data.telephone[0])+"-"+$.trim(data.telephone[1])+"-"+$.trim(data.telephone[2]);  

            var re_mobile = formValidator.mobile[0];
            var re_phone = formValidator.tel[0];
            if(mobile!=null&&mobile!=""){//1.手记号不为空时
                if(re_mobile.test(mobile)){//手机格式正确
                    formatMobile=true;
                    //固定电话格式正确，或固定电话为空
                    if(re_phone.test(phone)||phone.length==2 ){
                        formatPhone=true;
                    }else{
                        formatPhone=false;
                    }
                }else{
                    formatMobile=false;
                }
            }else{//手机号为空
                formatMobile=true;
                if(re_phone.test(phone) && phone.length>2){//固定电话不为空并且格式正确
                    formatPhone=true;
                }else{
                    formatPhone=false;
                }
            }
            if(formatMobile && formatPhone){
                $('.mobile').find('input').css({borderColor:'#d3d3d3'});
                $('.mobile').find('.validation').hide();
            }else if(!formatMobile){
                $('.mobile').find('input').css({borderColor:'#ed1b23'});
                $('.mobile').find('.validation').html(formValidator.mobile[1]);
                $('.mobile').find('.validation').show();
            }else if(!formatPhone){
                $('.mobile').find('input').css({borderColor:'#ed1b23'});
                $('.mobile').find('.validation').html(formValidator.tel[1]);
                $('.mobile').find('.validation').show();
            }
            return formatMobile&&formatPhone;
        }
        //邮箱的验证
        function chk_email(){
            var $that=$("#emailAddress");
            var re_email=/^[\w\-]+@[0-9a-z\-]+(\.[a-z]{2,4}){1,2}$/i;
            var value=$that.val();
            if(re_email.test(value)||value==null||$.trim(value)==""){
                $that.css({borderColor:"#d3d3d3"});
                $that.siblings('.validation').hide();
                return true;
            }else{
                $that.css({borderColor:'#ed1b23'});
                $that.siblings('.validation').html(formValidator.email[1]).show();
                return false;
            }
        }
        //清空所有的检查样式
        function no_chkRecipient(){
            // var $chk_reminder=$("#pnl_recipient").find('.validation');
            // $chk_reminder.each(function(){
            //     $(this).hide();
            //     $(this).css({borderColor:"#d3d3d3"});
            // });
            $("#recipient").siblings('.validation').hide();
            $("#recipient").css({borderColor:"#d3d3d3"});

            var provinces=$("#btn_saveAddress").parent().siblings('p:eq(1)').find('select:visible');
            var provincesLength=provinces.length;
            for(var i=0;i<provincesLength;i++){
                 $(provinces[i]).css({borderColor:'#d3d3d3'});
                 $(provinces[i]).siblings('.validation').hide();
            }
            $('#dt-road').siblings('.validation').hide();
            $('.detailedAddress').find('input').css({borderColor:'#d3d3d3'});

            var $postcode=$("#zip-code");
            $postcode.css({borderColor:"#d3d3d3"});
            $postcode.siblings('.validation').hide();

            $('.mobile').find('input').css({borderColor:'#d3d3d3'});
            $('.mobile').find('.validation').hide();

            var $email=$("#emailAddress");
            $email.css({borderColor:"#d3d3d3"});
            $email.siblings('.validation').hide();
        }
        //删除收货人信息
        function deleteAddress(){
            var recipientId=$('#pnl_recipient').find(":radio:checked").val();
            // var $that=$(this);

            var recipientId={recipientId:recipientId};

            checkoutController.del(recipientId,function(data){
                //去掉所有的验证提示
                no_chkRecipient();
                if(data.result){//删除成功
                    $("#pnl_operation_biggest").append($("#pnl_operation"));
                    $that.parent().parent().parent().remove();
                    var showRadio=$('#pnl_recipient input[type=radio]:last');
                    showRadio.prop('checked','checked');
                    showRadio.siblings('span:last').show();
                    //重新初始化oInputRadio
                    oInputRadio = $('#pnl_recipient input[type=radio]');
                    radioChange();

                    hideOperationOnlyOne();
                    //显示新增按钮
                    addOperationShow();
                    //隐藏弹出的框-吕聪亮
                    $('#pnl_recipient div.confirm_delete').hide();
                }else{
                }   
            });
            return false;
        }
     /**@4绑定事件**/

        //绑定收件人名称不能超过25个字符
        $("#recipient").bind("keyup",chk_recipientLength);

    $('#txt_address').cascadeSelect({
        
        url: "/checkout/getRegionsByParentId", // 数据获取url
        parameter: "parentId", // 数据获取参数名称
        text: "name", // 定义JSON数据格式：选择名称
        value: "id", // 定义JSON数据格式：选择值
        hasChildren:"hasChild",
        emptyOptionName: "请选择", // 选择提示,null表示无提示
        emptyOptionValue:-1,
        cssClass: "cascadeSelect", // 下拉框css名称
        cssStyle: { "margin-right": "10px" }, // 下拉框左右css样式
        selectGroupClass:"cascadeSelectGroup",
        isFadeIn: true,// 是否渐显
        rootId:0,
    });

    function addRecipientAddress(){

        var $that = $(this);
        var oNewAddress = $div_btn_addAddress.siblings('.new-address');
        if(oNewAddress.is(':visible')){
            return;
        };
        $('#btn_saveSelected').hide();
		
	/*	$('#txt_address').cascadeSelect({
			loadParentsUrl:"/checkout/getAllRegionsById",
			lastNodeParameter:"regionId",
    		lastNodeId:nodeId,
			url: "/checkout/getRegionsByParentId", // 数据获取url
            parameter: "parentId", // 数据获取参数名称
            text: "text", // 定义JSON数据格式：选择名称
            value: "id", // 定义JSON数据格式：选择值
            hasChildren:"hasChild",
            emptyOptionName: "请选择", // 选择提示,null表示无提示
            emptyOptionValue:-1,
            cssClass: "cascadeSelect", // 下拉框css名称
            cssStyle: { "margin-right": "10px" }, // 下拉框左右css样式
            selectGroupClass:"cascadeSelectGroup",
            isFadeIn: true,// 是否渐显
            rootId:0,
		})*/
		
        //隐藏保存收货人信息按钮
        // addOperationHide();
        $('.personalInfo').removeClass('editAddress');

        radioChange();
        //将待填元素置空
        fnClearAddressEle();

        
        oNewAddress.css({display:'block'});
        oNewAddress.append($_pnl_operation);
        //去掉所有的验证提示
        no_chkRecipient();

        //显示新增地址
        $_pnl_operation.css({display:'block'});
        //点击取消
        $('.cancelAddress').click(function(){
            $_pnl_operation.hide();
            $that.parent().show();
            oNewAddress.hide();
            $('#btn_saveSelected').show();
        });
    }

    //删除收货地址
    $('.recipientInfo').on('click','.ad-delete',function(){
         $that=$(this);
         var confirmDelete = $that.parent().parent().find('.confirm_delete');
         confirmDelete.show();
         confirmDelete.css({left:$that.position().left-172,top:$that.position().top+26});
         //return;
    });

    //确定删除收货地址
    $('#pnl_recipient').on('click','button.toDelete',deleteAddress);
    //取消删除收货地址
    $('#pnl_recipient').on('click','button.toCancel',function(){
        var $that=$(this);
        $that.parent().parent().hide();
        return false;
    });
    $('#pnl_recipient').on('click','b.popupClose',function(){
        $(this).parent().hide();
        return false;
    });
    // 编辑收货地址
    $('#pnl_recipient').on('click','.ad-edit',function(){
    	
        var $that = $(this);
        var $recipientDiv=$that.parent();
        $recipientDiv.hide();
        //显示新增按钮
        addOperationShow();
        //获取收货人地址信息
        var $recipientId=$recipientDiv.siblings('input[type=radio]').val();//id
        var regionId=$recipientDiv.siblings('input[type=radio]').attr("regionId");//id
        var $recipientName=$recipientDiv.siblings('span:first').html();//收货人

        var $recipientProvinceId=$recipientDiv.siblings("input[mark=regionProvince]").val();//省
        var $recipientCityId=$recipientDiv.siblings("input[mark=regionCity]").val();//市
        var $recipientDistrictId=$recipientDiv.siblings("input[mark=regionCounty]").val();//区
        var $recipientStreetId=$recipientDiv.siblings("input[mark=regionStreet]").val();//街道

        var $recipientAddress=$recipientDiv.siblings("input.detailAddress[mark=address]").val();
        var $recipientMobile=$recipientDiv.siblings("input[type=hidden][mark=mobile]").val();//手机号
        var $telephone0=$recipientDiv.siblings("input[type=hidden][mark=telephone0]").val();//固定电话号0
        var $telephone1=$recipientDiv.siblings("input[type=hidden][mark=telephone1]").val();//固定电话号1
        var $telephone2=$recipientDiv.siblings("input[type=hidden][mark=telephone2]").val();//固定电话号2
        var $recipientZipcode=$recipientDiv.siblings("input[type=hidden][mark=zip-code]").val();
        var $recipientEmail=$recipientDiv.siblings("input[type=hidden][mark=email]").val();
        
        //去掉所有的验证提示
        no_chkRecipient();
        //添加收货人地址信息
        $("#recipient").val($recipientName);
        
        var addressArray=$recipientAddress.split("%$");
        $("#dt-road").val(addressArray[0]);
        $("#dt-community").val(addressArray[1]);
        $("#dt-floor").val(addressArray[2]);
        $("#dt-room").val(addressArray[3]);
        $("#zip-code").val($recipientZipcode);
        //手机号
        $("#phone-number").val($recipientMobile);
        //固定电话
        $("#area-code").val($telephone0);
        $("input[type=text][name=telephone-code]").val($telephone1);
        $("input[type=text][name=extension-code]").val($telephone2);
        
      
        $("#emailAddress").val($recipientEmail);

        $('#addNewAddress').parent().show();
        var oAddressDiv = $('.recipient-address');
        oAddressDiv.show();
        $('.personalInfo').removeClass('editAddress');
        $that.parents('.personalInfo').addClass('editAddress');
        $that.parents('.personalInfo').append(oAddressDiv);

        //将地区信息加载到input中为了调用region.js
//        var $editRecipientDiv=$recipientDiv.parent().next();
//        $editRecipientDiv.find("input.regionProvince").val($recipientProvinceId);
//        $editRecipientDiv.find("input.regionCity").val($recipientCityId);
//        $editRecipientDiv.find("input.regionCounty").val($recipientDistrictId);
//        $editRecipientDiv.find("input.regionStreet").val($recipientStreetId);
//        $('.address').each(function(index,el){
//            $(this).regionCascade();
//        });
        
        // 	初始化级联地址框
        $('#txt_address').cascadeSelect({
        	loadParentsUrl: "/checkout/getAllRegionsById", // 数据获取url
    		lastNodeParameter:"regionId",
    		lastNodeId: regionId,
            text: "name", // 定义JSON数据格式：选择名称
            value: "id", // 定义JSON数据格式：选择值
            cssStyle: { "margin-right": "10px" }, // 下拉框左右css样式
            url: "/checkout/getRegionsByParentId", // 数据获取url
            parameter: "parentId", // 数据获取参数名称
            rootId:0,//根节点Id
            hasChildren:"hasChild", // 定义JSON数据格式：是否含有子节点
            selectGroupName:"cascadeSelectGroup", //selelect 组的样式
            cssClass: "form-control input-sm", // 下拉框css名称
    	})
    	
        $('.cancelAddress').click(function(){
            oAddressDiv.hide();
            $(this).parents('.personalInfo').find('.ad-operations').show();
            $that.parents('.personalInfo').removeClass('editAddress');
        });
       
    });
    //支付详情
    $('.balance-container li').click(function(ev){
        var $that = $(this);
        var $oDetail = $that.find('.balance-detail');
        if($oDetail.css('display') == 'none'){
            $oDetail.show(200);
            $that.find('.showDetail').css({backgroundPosition:'-126px 0'});
        }else if($(ev.target).hasClass('showDetail')){
            $that.find('.showDetail').css({backgroundPosition:'-110px 0'});
            $oDetail.hide(200);
        };
    });
    
    //保存收货人信息
    $(".recipient-address").on("click",".saveAddress",function(){
        
        var $that=$(this);
        var $addressDiv=$that.parent().parent();
        var addressClass=$addressDiv.parent().attr("class");
        // var showId="";//收货信息的id
        var provinces=$that.parent().siblings('p:eq(1)').find('select:visible');
       
        if(addressClass=="new-address"){//新增地址
            var addressVO = {recipient:'',regionIds:[],regionNames:[],address:'',zipcode:'',mobile:'',telephone:[],email:[]};
            addressVO.recipient=$("#recipient").val();

            //验证收件人信息
            if(!chk_recipientName(addressVO)){
                return false;
            }
            //验证省市
           if(!chk_provinceAddress()){
                return false;
           }
            for(var i=0;i<provinces.length;i++){
                var districtId=$(provinces[i]).find("option:selected").val();
                if(districtId!=""&&districtId!=0){
                    addressVO.regionIds[i]=districtId;  
                    addressVO.regionNames[i]= $(provinces[i]).find("option:selected").text(); 
                    // $(provinces[i]).css({borderColor:'#d3d3d3'});
                    // $(provinces[i]).siblings('.validation').hide();
                }
            }

            var road=$("#dt-road").val();
            var community=$("#dt-community").val();
            var floor=$("#dt-floor").val();
            var room=$("#dt-room").val();
    
            var dataAddress={};

            dataAddress.road=road;
            dataAddress.community=community;
            dataAddress.floor=floor;
            dataAddress.room=room;

            //收货人详细地址的验证
            if(!chk_detailAddress(dataAddress)){
                return false;
            }

            //邮编格式的验证
            if(!chk_postcode()){
                return false;
            }
            
            addressVO.address=road+"%$"+community+"%$"+floor+"%$"+room;
            var showAddress=road+"路"+community+"小区"+floor+"楼"+room+"室";
            addressVO.zipcode=$("#zip-code").val();
            addressVO.mobile=$("#phone-number").val();
            addressVO.telephone[0]=$("#area-code").val();
            addressVO.telephone[1]=$("#area-code").parent().find("input[type=text][name=telephone-code]").val();
            addressVO.telephone[2]=$("#area-code").parent().find("input[type=text][name=extension-code]").val();
            var showPhone="";
            var hasPhone = false;
            if(addressVO.mobile!=null&&addressVO.mobile!=""){
                showPhone=addressVO.mobile;
                var re = /^(\+86[\s-])?1[3-9]\d{9}$/;
                if(re.test(showPhone)){
                    hasPhone = true;
                }
            }else{
                showPhone=addressVO.telephone[0]+"-"+addressVO.telephone[1]+"-"+addressVO.telephone[2];
                var re = /^(?:(?:0\d{2,3}[\-][1-9]\d{6,7})|(?:[48]00[\-][1-9]\d{6}))$/;
                if(re.test(showPhone)){
                    hasPhone = true;
                }
            }

           if(!ch_phone(addressVO)){
                return false;
           }
           if(!chk_email()){
                return false;
           }

            addressVO.email=$("#emailAddress").val();
            checkoutController.add(addressVO,function(data){
                if(data.resultId!=0){
                    createAddressDiv(data,addressVO,showAddress,showPhone);
                    $('.new-address').hide();
                    hideOperationOnlyOne();
                    //重新初始化收货人信息的radio
                    oInputRadio = $('#pnl_recipient input[type=radio]');
                    //显示新增按钮
                    addOperationShow();
                    //验证是否存在收货人信息-吕聪亮
                    addRecipientShow();
                }
            });

        }else{//编辑原有收货人信息
           
            var addressVO = {id:'',recipient:'',regionIds:[],regionNames:[],address:'',zipcode:'',mobile:'',telephone:[],email:[]};
            addressVO.id=$addressDiv.prev("div").find("input[type=radio][name=addressId]").val();
            addressVO.recipient=$("#recipient").val();
            for(var i=0;i<provinces.length;i++){
                var districtId=$(provinces[i]).find("option:selected").val();
                if(districtId!=""&&districtId!=0){
                    addressVO.regionIds[i]=districtId;  
                    addressVO.regionNames[i]= $(provinces[i]).find("option:selected").text();   
                }
            }

            var road=$("#dt-road").val();
            var community=$("#dt-community").val();
            var floor=$("#dt-floor").val();
            var room=$("#dt-room").val();
            addressVO.address=road+"%$"+community+"%$"+floor+"%$"+room;
            addressVO.zipcode=$("#zip-code").val();
            addressVO.mobile=$("#phone-number").val();
            addressVO.telephone[0]=$("#area-code").val();
            addressVO.telephone[1]=$("input[type=text][name=telephone-code]").val();
            addressVO.telephone[2]=$("input[type=text][name=extension-code]").val();
            addressVO.email=$("#emailAddress").val();
             //验证收件人信息
            if(!chk_recipientName(addressVO)){
                return false;
            }
            //验证省市
           if(!chk_provinceAddress()){
                return false;
           }
           addressVO.road=road;
           addressVO.community=community;
           addressVO.floor=floor;
           addressVO.room=room;
           if(!chk_detailAddress(addressVO)){
                return false;
           }
           if(!chk_postcode()){
                return false;
           }
           if(!ch_phone(addressVO)){
                return false;
           }
           if(!chk_email()){
                return false;
           }
            checkoutController.edit(addressVO,function(data){
                if(data.result){
                    //显示新增按钮
                    addOperationShow();
                    var $editAddressDiv=$addressDiv.prev('div');
                    $editAddressDiv.find('input[type=radio]').val(addressVO.id);
                    //将显示部分中隐藏域的地区进行刷新
                    if(addressVO.regionIds.length>3){
                        $editAddressDiv.find('input[type=hidden][mark=regionStreet]').val(addressVO.regionIds[3]);
                    }else{
                        $editAddressDiv.find('input[type=hidden][mark=regionStreet]').val(0);
                    }
                    if(addressVO.regionIds.length>2){
                        $editAddressDiv.find('input[type=hidden][mark=regionCounty]').val(addressVO.regionIds[2]);
                    }else{
                        $editAddressDiv.find('input[type=hidden][mark=regionCounty]').val(0);
                    }
                    if(addressVO.regionIds.length>1){
                        $editAddressDiv.find('input[type=hidden][mark=regionCity]').val(addressVO.regionIds[1]);
                    }else{
                        $editAddressDiv.find('input[type=hidden][mark=regionCity]').val(0);
                    }
                    if(addressVO.regionIds.length>0){
                        $editAddressDiv.find('input[type=hidden][mark=regionProvince]').val(addressVO.regionIds[0]);
                    }else{
                        $editAddressDiv.find('input[type=hidden][mark=regionProvince]').val(0);
                    }
                    
                    $editAddressDiv.find("input[type=hidden][mark=zip-code]").val(addressVO.zipcode);
                    $editAddressDiv.find("input[type=hidden][mark=email]").val(addressVO.email);
                    $editAddressDiv.find("input[type=hidden][mark=address]").val(addressVO.address);
                    $editAddressDiv.find("input[type=hidden][mark=mobile]").val(addressVO.mobile);
                    $editAddressDiv.find("input[type=hidden][mark=mobile]").val(addressVO.mobile);
                    $editAddressDiv.find("input[type=hidden][mark=telephone0]").val(addressVO.telephone[0]);
                    $editAddressDiv.find("input[type=hidden][mark=telephone1]").val(addressVO.telephone[1]);
                    $editAddressDiv.find("input[type=hidden][mark=telephone2]").val(addressVO.telephone[2]);


                    $editAddressDiv.find('span[mark=recipientName]').html(addressVO.recipient);
                   
                    var districtContent="";
                    for (var i = 0; i <addressVO.regionNames.length; i++) {
                        districtContent=districtContent+addressVO.regionNames[i];
                    };
                    $editAddressDiv.find("span.customer-address").html(districtContent);
                    $editAddressDiv.find('span[mark=detailAddress]').html(road+"路"+community+"小区"+floor+"楼"+room+"室");
                  
                   if(addressVO.mobile!=null&&addressVO.mobile!=""){
                        $editAddressDiv.find('span[mark=phoneShow]').html(addressVO.mobile);
                   }else{
                        $editAddressDiv.find('span[mark=phoneShow]').html(addressVO.telephone[0]+"-"+addressVO.telephone[1]+"-"+addressVO.telephone[2]);
                   }
                    $editAddressDiv.find("span.ad-operations").show();
                    $('.recipient-address').hide();
                   // $(this).parents('.personalInfo').find('.ad-operations').show();
                    $that.parents('.personalInfo').removeClass('editAddress');
                    //重新初始化收货人信息的radio
                    oInputRadio = $('#pnl_recipient input[type=radio]');
                    //验证是否存在收货人信息-吕聪亮
                    addRecipientShow();
                }
            });
        }
        $("div.reciever-address").show();
    });
});
