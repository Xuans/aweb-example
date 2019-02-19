(function (undefined) {

	(function (factory) {
		"use strict";

		// amd module
		if (typeof define === "function" && define.amd) {
			define(["jquery", "widget",'multiselect'], factory);
		}
		// global
		else {
			factory();
		}

	})
	(function ($, widget) {
		"use strict";
		//模拟数据,
		var testData = {},

			render = function( $selector, option,attr, css,auiCtx){
				var moveOption = {},moveOptionArr= [], fieldsTemp,
					id = attr.id+ "_multipleChoiceListBox",
					keys = option.columns.keys,
					fields = option.columns.fields,
					tempHtml = '<div class="multiplechoicelistbox-container"> '
					//左侧撤销和重做操作按钮
					+'<div class="multiplechoicelistbox-operation-left">'
					+' <div id="_id__undo" class="_undoHidden_">'//撤销
					+' <span>'
					+'<i class="fa fa-reply-all"></i>'
					+'</span>'
					+' </div>'
					+' <div  id="_id__redo" class="_redoHidden_">'//重做
					+'<span>'
					+'<i class="fa fa-history"></i>'
					+'</span>'
					+' </div>'
					//隐藏触发按钮
					+' <button id="_id__leftClick" type="button" class="multiplechoicelistbox-nodisplay"></button>'
					+' <button id="_id__rightClick" type="button" class="multiplechoicelistbox-nodisplay"></button>'
					+'</div>'
				
					//左侧框
					+'<div class="multiplechoicelistbox-list">'
					+'<div class="multiplechoicelistbox-list-title">'
					+'<span>_leftTitle_</span>'
					+'</div>'
					+'<div class="multiplechoicelistbox-list-wrapper">'
					+'<div class="multiplechoicelistbox-list-header">'
					+'<label class="multiplechoicelistbox-checkbox-wrapper">'
					+'<span class="multiplechoicelistbox-checkbox">'
					+'<input type="checkbox" class="multiplechoicelistbox-checkbox-input" name="" id="_id__allLeftCheckbox">'
					+'<span class="multiplechoicelistbox-checkbox-inner"></span>'
					+'</span>'
					+'</label>'
					+'<span class="multiplechoicelistbox-list-header-selected">'
					+'<span id="_id__leftStaticItem">'
					+'   总共：0'
					+'</span>'
					+'<span class="multiplechoicelistbox-list-header-title"></span>'
					+'</span>'
					+'</div>'
					//搜索框
					+'<div class="multiplechoicelistbox-list-body-search-wrapper _searchHidden_ "> '
					+'<input type="text"  class="multiplechoicelistbox-input multiplechoicelistbox-list-search" value="" id="_id__leftSearch">'
					+'<span class="multiplechoicelistbox-list-search-action">'
					+'<i class="fa fa-search"></i>'
					+'</span>	'
					+'</div>'
					//框体内容
					+'<div class="multiplechoicelistbox-list-body _withsearchClass_ ">'
					+'<div class="multiplechoicelistbox-list-content-title _contentTitleHidden_">'
					+'<div class="multiplechoicelistbox-list-content-title-wrapper" >'
					+'<div class="multiplechoicelistbox-list-content-item" id="_id__leftTitle">'
					//        							+'<label class="multiplechoicelistbox-checkbox-wrapper">'
					//        							   +'<span class="multiplechoicelistbox-checkbox">'
					//        									+'<input type="checkbox" class="multiplechoicelistbox-checkbox-input" >'
					//        								+'</span>'
					//        							+'</label>'
					//        								+'<span class="multiplechoicelistbox-list-content-item-span">标题1</span>'
					//        								+'<span class="multiplechoicelistbox-list-content-item-span">标题2</span>	'
					+'</div>'
					+'</div>'
					+'</div>'
				
					+'<ul id="_id_" class="multiplechoicelistbox-list-content" >'
					//        					+'<div class="multiplechoicelistbox-visible " style="height: 30px;">'
					//        						+'<li class="multiplechoicelistbox-list-content-item" title="content2-description of content2">'
					//        							+'<label class="multiplechoicelistbox-checkbox-wrapper">'
					//        								+'<span class="multiplechoicelistbox-checkbox">'
					//        									+'<input type="checkbox" class="multiplechoicelistbox-checkbox-input" name="on" >'
					//        										+' <span class="multiplechoicelistbox-checkbox-inner"></span>'
					//        								+'</span>'
					//        							+'</label>'
					//        							+'<span class="multiplechoicelistbox-list-content-item-span">content2</span>'
					//        							+'<span class="multiplechoicelistbox-list-content-item-span">content22</span>'
					//        						+'</li>'
					//        				  +'</div>'
					+'</ul>'
					+'<div class="multiplechoicelistbox-list-body-left-not-found">Not Found</div>'
					+'</div>'
					+'</div>'
					+'</div>'
					//中间操作按钮
					+'<div class="multiplechoicelistbox-operation">'
					+' <button id="_id__rightSelected" type="button" class="multiplechoicelistbox-btn" disabled="disabled">'
					+'<span>'
					+' <i class="fa fa-angle-right"></i>'
					+' </span>'
					+'</button>'
					+' <button  id="_id__leftSelected" type="button" class="multiplechoicelistbox-btn" disabled="disabled">'
					+'<span>'
					+'  <i class="fa fa-angle-left"></i>'
					+'</span>'
					+'</button>'
					+'</div>'
				
					//右侧框
					+'<div class="multiplechoicelistbox-list">'
					+'<div class="multiplechoicelistbox-list-title">'
					+'<span>_rightTitle_</span>'
					+'</div>'
					+'<div class="multiplechoicelistbox-list-wrapper">'
					+'<div class="multiplechoicelistbox-list-header">'
					+'<label class="multiplechoicelistbox-checkbox-wrapper">'
					+'<span class="multiplechoicelistbox-checkbox">'
					+'<input type="checkbox" class="multiplechoicelistbox-checkbox-input" name="" id="_id__allRightCheckbox">'
					+'<span class="multiplechoicelistbox-checkbox-inner"></span>'
					+'</span>'
					+'</label>'
					+'<span class="multiplechoicelistbox-list-header-selected">'
					+'<span id="_id__rightStaticItem">'
					+'总共：0'
					+'</span>'
					+'<span class="multiplechoicelistbox-list-header-title"></span>'
					+'</span>'
					+'</div>'
					//搜索框
					+'<div class="multiplechoicelistbox-list-body-search-wrapper _searchHidden_"> '
					+'<input type="text"  class="multiplechoicelistbox-input multiplechoicelistbox-list-search " value="" id="_id__rightSearch">'
					+'<span class="multiplechoicelistbox-list-search-action">'
					+'<i class="fa fa-search"></i>'
					+'</span>	'
					+'</div>'
					//框体内容
					+'<div class="multiplechoicelistbox-list-body  _withsearchClass_ ">'
					//列头
					+'<div class="multiplechoicelistbox-list-content-title _contentTitleHidden_">'
					+'<div class="multiplechoicelistbox-list-content-title-wrapper" >'
					+'<div class="multiplechoicelistbox-list-content-item" id="_id__rightTitle">'
					+'</div>'
					+'</div>'
					+'</div>'
					//内容
					+'<ul id= "_id__to" class="multiplechoicelistbox-list-content" >'
					+'</ul>'
					+'<div class="multiplechoicelistbox-list-body-right-not-found">Not Found</div>'
					+'</div>'
					+'</div>'
					+'</div>'
					+'</div>';
				
				
				tempHtml = tempHtml.replace(/_id_/g, id)
					.replace(/_leftTitle_/, option.title && option.title.leftTitle ? $AW.nsl(option.title.leftTitle, attr.id, auiCtx) : "")//左侧标题
					.replace(/_rightTitle_/, option.title && option.title.rightTitle ?  $AW.nsl(option.title.rightTitle, attr.id, auiCtx) : "")//右侧标题
					.replace(/_undoHidden_/, option.display && option.display.undoFlag ? "" : "multiplechoicelistbox-nodisplay")//撤销按钮
					.replace(/_redoHidden_/, option.display && option.display.redoFlag ? "" : "multiplechoicelistbox-nodisplay")//重做按钮
					.replace(/_searchHidden_/g, option.display && option.display.searchFlag ? "" : "multiplechoicelistbox-nodisplay")//搜索框
					.replace(/_withsearchClass_/g, option.display && option.display.searchFlag ? "multiplechoicelistbox-list-body-with-search" : "")
					.replace(/_contentTitleHidden_/g, option.display && option.display.titleFlag ? "" : "multiplechoicelistbox-nodisplay");
				
				$selector.append(tempHtml);
				
				//列标题;
				var $leftTitle = $('#'+id+'_leftTitle',$selector),
				    $rightTitle = $('#'+id+'_rightTitle',$selector),i,
                    leftData,rightData,
					 refresh = function(data){
					   var i,len,tempLeftOption,tempRightOption,liTemp,item;
						if(data === 'auiAjaxTest'){
							data = testData;
						}
						$('#'+id,$selector).empty();
						$('#'+id+'_to',$selector).empty();
						 tempLeftOption = "";
						 tempRightOption = "";
						 liTemp = '<div class="multiplechoicelistbox-visible _multiplechoicelistbox-disabled_" style="height: 30px;">'
							+'<li class="multiplechoicelistbox-list-content-item">'
							+'<label class="multiplechoicelistbox-checkbox-wrapper">'
							+'<span class="multiplechoicelistbox-checkbox">'
							+'<input _disabled_ type="checkbox" class="multiplechoicelistbox-checkbox-input" id = "_liId_">'
							+'<span class="multiplechoicelistbox-checkbox-inner"></span>'
							+'</span>'
							+'</label>';

						if(fields.length !== 0){
							if(data && data.leftOption && $.isArray(data.leftOption)){
								$('#'+id+'_leftStaticItem' ,$selector).text( $AW.nsl('总共：', attr.id, auiCtx) + data.leftOption.length);
								for( i =0, len = data.leftOption.length; i < len; i++){
									 item = data.leftOption[i];
									tempLeftOption  +=liTemp.replace(/_liId_/, item.id)
										.replace(/_multiplechoicelistbox-disabled_/, item.disable === 'true' || item.disable === true ? "multiplechoicelistbox-disabled": "")
										.replace(/_disabled_/, item.disable === 'true' || item.disable === true ? 'disabled="disabled"' : '');
									$.each(keys, function(key, value){
										$.each(item, function(key2, value2){
											if(value === key2){
												tempLeftOption +='<span class="multiplechoicelistbox-list-content-item-span">'+item[key2]+'</span>';
											}
										});
									});
									tempLeftOption += '</li></div>';
								}
							}

							if(data && data.rightOption && $.isArray(data.rightOption)){
								$('#'+id+'_rightStaticItem' ,$selector).text( $AW.nsl('总共：', attr.id, auiCtx)+data.rightOption.length);
								for( i =0, len = data.rightOption.length; i < len; i++){
									 item = data.rightOption[i];
									tempRightOption  +=liTemp.replace(/_liId_/, item.id)
										.replace(/_multiplechoicelistbox-disabled_/, item.disable === 'true' || item.disable === true ? "multiplechoicelistbox-disabled": "")
										.replace(/_disabled_/, item.disable === 'true' || item.disable === true ? 'disabled="disabled"' : '');
									$.each(keys, function(key, value){
										$.each(item, function(key2, value2){
											if(value === key2){
												tempRightOption +='<span class="multiplechoicelistbox-list-content-item-span">'+item[key2]+'</span>';
											}
										});
									});
									tempRightOption += '</li></div>';
								}
							}
						}
						$('#'+id,$selector).append(tempLeftOption);
						$('#'+id+'_to',$selector).append(tempRightOption);
					},
					 getOption = function(){
						var leftOptionArr = [],
							rightOptionArr = [],
							allOption ={},allOptionArr = [];
						$('#'+id+' div li',$selector).each(function(index, value){//左侧
							var item = {};
							var $checkbox = $(value).find("label").find("span").find('input[type="checkbox"]');
							item["id"]= $checkbox.attr("id");
							item["disable"] = $checkbox.attr("disabled") ? true : false;
							$(value).children("span").each(function(index2, value2){
								if(value2 && keys[index2]){
									item[keys[index2]] = $(value2).text();
								}
							});
							leftOptionArr.push(item);
							allOptionArr.push(item);
						});
						allOption["left"] = leftOptionArr;

						$('#'+id+'_to div li',$selector).each(function(index, value){//右侧
							var item = {};
							var $checkbox = $(value).find("label").find("span").find('input[type="checkbox"]');
							item["id"]= $checkbox.attr("id");
							item["disable"] = $checkbox.attr("disabled") ? true : false;
							$(value).children("span").each(function(index2, value2){
								if(value2 && keys[index2]){
									item[keys[index2]] = $(value2).text();
								}
							});
							rightOptionArr.push(item);
							allOptionArr.push(item);
						});
						allOption["right"] = rightOptionArr;

						return {
							leftOptionArr:leftOptionArr,//[{'id':"",'disable': true,'item1':"",...}]
							rightOptionArr: rightOptionArr,//[{'id':"",'disable': true,'item1':"",...}]
							allOption: allOption,//{'left':[{'id':"",'disable': true,'item1':"",...}], 'right':[{'id':"",'disable': true,'item1':"",...}]}
							allOptionArr: allOptionArr//[{'id':"",'disable': true,'item1':"",...}]
						}
					};


				$leftTitle.append('<label class="multiplechoicelistbox-checkbox-wrapper">'
					+'<span class="multiplechoicelistbox-checkbox">'
					+'<input type="checkbox" class="multiplechoicelistbox-checkbox-input multiplechoicelistbox-disablevisible" >'
					+'</span>'
					+'</label>');
				$rightTitle.append('<label class="multiplechoicelistbox-checkbox-wrapper">'
					+'<span class="multiplechoicelistbox-checkbox">'
					+'<input type="checkbox" class="multiplechoicelistbox-checkbox-input multiplechoicelistbox-disablevisible" >'
					+'</span>'
					+'</label>');
				for(i =0; i < fields.length;i++){
					fieldsTemp =  $AW.nsl(fields[i], attr.id, auiCtx);
					$leftTitle.append('<span class="multiplechoicelistbox-list-content-item-span">'+ fieldsTemp +'</span>	');
					$rightTitle.append('<span class="multiplechoicelistbox-list-content-item-span">'+ fieldsTemp +'</span>	');
				}
				$('#'+id ,$selector).multiselect({
				afterMoveToRight:function($left, $right, $options){
					moveOptionArr = [];
					$options.each(function(index, value){
						var item = {};
						var $li = $(value).find("li");

						var $checkbox = $li.find("label").find("span").find('input[type="checkbox"]');
						item["id"] =  $checkbox.attr("id");
						item["disable"] =  $checkbox.attr("disabled") ? true : false;
						$li.children("span").each(function(index, value){
							if(value && keys[index]){
								item[keys[index]] = $(value).text();
							}
						});

						moveOptionArr.push(item);
					});
					//触发点击事件
					$('#'+id+'_rightClick',$selector).trigger('click');

				},
				afterMoveToLeft: function($left, $right, $options){
					moveOptionArr = [];
					$options.each(function(index, value){
						var item = {};
						var $li = $(value).find("li");
						var $checkbox = $li.find("label").find("span").find('input[type="checkbox"]');
						item["id"] =  $checkbox.attr("id");
						item["disable"] =  $checkbox.attr("disabled") ? true : false;
						$li.children("span").each(function(index, value){
							if(value && keys[index]){
								item[keys[index]] = $(value).text();
							}
						});

						moveOptionArr.push(item);
					});
					$('#'+id+'_leftClick',$selector).trigger('click');
				},
				search:{//搜索框
					$left: $('#'+id+'_leftSearch' ,$selector),
					$right:$('#'+id+'_rightSearch' ,$selector)
				},
				allCheckbox:{//全选框
					$allLeftCheckbox: $('#'+id+'_allLeftCheckbox' ,$selector),
					$allRightCheckbox:$('#'+id+'_allRightCheckbox' ,$selector)
				},
				staticItem:{//头部统计
					$leftStaticItem: $('#'+id+'_leftStaticItem' ,$selector),
					$rightStaticItem: $('#'+id+'_rightStaticItem' ,$selector)
				},
				moveBtn:{//中间移动操作按钮
					$moveLeftBtn: $('#'+id+'_leftSelected', $selector),
					$moveRightBtn: $('#'+id+'_rightSelected' ,$selector)
				},
				ignoreDisabled: true,
				moveToRightMaxLen: option.moveToRightMaxLen,
				moveToRightMaxLenTip: option.moveToRightMaxLenTip,
				moveToLeftMaxLen: option.moveToLeftMaxLen,
				moveToLeftMaxLenTip: option.moveToLeftMaxLenTip
				}, $selector);
			
				//创建模拟数据
				testData.leftOption = [];
				testData.rightOption = [];

				for( i= 0; i < 10; i++){
						leftData = {};
						leftData.id = 'left'+i;

						if(i === 2){
							leftData.disable = true;
						}else{
							leftData.disable = false;
						}

						 rightData = {};
						rightData.id = 'left'+i;
						rightData.disable = false;

						$.each(keys, function(index, value){
							rightData[value] = fields[index]+i+index;
							leftData[value] = fields[index]+i+index;
						});


						testData.leftOption.push(leftData);
						testData.rightOption.push(rightData);
			}
				if(window.auiApp){
				   refresh(testData);
			    }
            //自定义样式
            if(css && css.cssCode && css.cssCode.className){
                $selector.addClass(css.cssCode.className)
            }
			//样式解析渲染
			if(!$.isEmptyObject(css) && css.style){
				var style =css.style,menuListHoverObj;
				style.title && $.each($('.multiplechoicelistbox-list-title span',$selector),function (index,item) {
					$(item).css(style.title);
				});
				style.menuList && $.each($('.multiplechoicelistbox-list-content-item',$selector),function (index,item) {
					$(item).css(style.menuList);
				});
				if(style.menuListHover){
					menuListHoverObj = JSON.parse(JSON.stringify(style.menuListHover));
					$AW.cssHover('.multiplechoicelistbox-list-content-item',$selector,style.menuListHover,':hover');
					$AW.cssHover('.multiplechoicelistbox-list-content li:hover>label>span.multiplechoicelistbox-checkbox input[type="checkbox"].multiplechoicelistbox-checkbox-input+span',$selector,{'border-color':menuListHoverObj['background-color']},'::before');
				}
				style.checkBox && $AW.cssHover('span.multiplechoicelistbox-checkbox input[type="checkbox"].multiplechoicelistbox-checkbox-input+span',$selector,style.checkBox,':after');
				$AW.cssHover('span.multiplechoicelistbox-checkbox input[type="checkbox"].multiplechoicelistbox-checkbox-input:checked+span',$selector,style.checkBox,':before');
				$AW.cssHover('span.multiplechoicelistbox-checkbox input[type="checkbox"].multiplechoicelistbox-checkbox-input.multiplechoicelistbox-indeterminate+span',$selector,style.checkBox,'::before');
				style.button && $('button.multiplechoicelistbox-btn',$selector).css(style.button);
				style.search && $.each($('.multiplechoicelistbox-list-search',$selector),function (index,item) {
					$(item).css(style.search)
				});
				style.active && $AW.cssHover('button.multiplechoicelistbox-btn',$selector,style.active,'');
				style.listbox && $AW.cssHover('.multiplechoicelistbox-list-wrapper',$selector,style.listbox,'');
				style.itemspan && $AW.cssHover('.multiplechoicelistbox-list-content-item-span',$selector,style.itemspan,'');
				
			}

			//外部调用接口
			return {
				refresh: refresh,//初始化数据
				moveOptionArr: function(){//移动的数据
					return moveOptionArr;
				},
				getOption: getOption,
				leftOptionArr:function(){
					return getOption().leftOptionArr;
				},//[{'id':"",'disable': true,'item1':"",...}]
				rightOptionArr: function(){
					return getOption().rightOptionArr;
				},//[{'id':"",'disable': true,'item1':"",...}]
				allOption: function(){
					return getOption().allOption;
				},//{'left':[{'id':"",'disable': true,'item1':"",...}], 'right':[{'id':"",'disable': true,'item1':"",...}]}
				allOptionArr: function(){
					return getOption().allOptionArr;
				},//[{'id':"",'disable': true,'item1':"",...}]
				display: function (result, input1, input2, condition) {
					this[result ? 'hide' : 'show']();
				},
				show: function () {
					$selector.removeClass('hide');
				},
				hide: function () {
					$selector.addClass('hide');
				}
			}

			};

		if (!widget.component.other ) {
			widget.component.other = {};
		}

		widget.component.other.multipleChoiceListBox = function ($selector, oOption, oAttr, oCss,auiCtx) {

				return render($selector, oOption, oAttr, oCss,auiCtx);
		};

		return widget;
	});
})();