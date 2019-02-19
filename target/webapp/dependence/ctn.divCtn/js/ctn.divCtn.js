/**
 * Created by quanyongxu@agree.com.cn on 2016/8/15 0015.
 */
/*!
 * Javascript library v3.0
 *
 * Date: 2016.04.21
 */

/**
 * @author quanyongxu@cfischina.com
 */
( /* <global> */function (undefined) {

	(function (factory) {
		"use strict";

		// amd module
		if (typeof define === "function" && define.amd) {
			define(["jquery", "widget", 'ctn'], factory);
		}
		// global
		else {
			factory();
		}

	})
	(function ($, widget) {
		"use strict";

		widget.ctn.divCtn = function (obj, oOption, attr, oCss,auiCtx) {
			var Ctn = $AW.ctn,
				i,
				titleInfo = oOption.titleInfo,
				pick = true,
				elLength = (titleInfo && titleInfo.elements && titleInfo.elements.length) || 0;

				oOption.infoData =[];
				Ctn.renderHeader(oOption, obj, oCss,auiCtx);
				//插入信息栏
				if(elLength){
					for(i = 0;i < elLength;i++){
						oOption.infoData.push([titleInfo.fields[i],titleInfo.keys[i],"",titleInfo.elements[i].infoType,titleInfo.elements[i].infoIcon,titleInfo.elements[i].isShowTitle])
					}
					renderCtn();
                }
            //渲染方法
				function renderCtn () {
                    var i,
                        infoData = oOption.infoData,
                        infoDataLength = infoData.length,
                        infoArr = [], type,
                        infoSearch = '<div class="dc-title-search"><input placeholder="搜索关键词"><i class="iconfont icon-topbar-search"></i></input></div>',
                        infoTitle = '<div class="dc-title-info">_TITLE_: <span class="dc-title-infoData">_TITLE_DATA_</span></div>',
                        staticTitle = '<div class="dc-title-info" data="_DATA_">_NAME_ <div class="dc-title-icon _MARGINL_" >' +
                            '_ICON_TEMP_' +
                            '<span class="dc-title-iconInfo">_ICON_NAME_</span>' +
                            '</div></div>',
                        iconTemp = '<i class="_ICON_CLASS_"></i>',
                        $titleDiv = obj.children("div[data-widget-role='header']"),
                        $packBtn = $('<button class="dc-packup-btn">收起</button>'),
                        $obj = $(obj);


                    $titleDiv.empty().append('<div class="dc-header" style="float:left">' + oOption.header + '</div>');


                    infoArr.push('<div class="dc-title-ctn" style="float:_loc_">'.replace(/_loc_/, oOption.infoPosition === "right" ? 'right' : 'left'));
                    for (i = 0; i < infoDataLength; i++) {
                        switch (infoData[i][3]) {
                            case "text":
                                infoArr.push(infoTitle.replace(/_TITLE_/, infoData[i][0]).replace(/_TITLE_DATA_/, infoData[i][2]));
                                break;

                            case "search":
                                infoArr.push(infoSearch);
                                break;
							case "statistics":
								infoArr.push(staticTitle.replace(/_DATA_/,infoData[i][1])
									.replace(/_NAME_/, infoData[i][5] ? infoData[i][0] + ":" : '')
                                    .replace(/_MARGINL_/, infoData[i][5] ? 'dc-title-icon-l' : '')
                                    .replace(/_ICON_TEMP_/, infoData[i][4] === "" ? "" : iconTemp.replace(/_ICON_CLASS_/, infoData[i][4]))
                                    .replace(/_ICON_NAME_/, infoData[i][2]));
                                break;
                        }
                    }

					$titleDiv.append(infoArr.join(''));
					
					// 信息轮播
					$(".dc-title-ctn").animate({top:"0px"});
					

                    //收起按钮
                    if (oOption.packupBtn) {

                        $obj.addClass("dc-title-pick").append($packBtn);

                        $packBtn.off('.packBtn').on('click.packBtn', function () {
                            var $this = $(this);

                            if (pick) {
                                $obj.css('height', oOption.pickupHeight);
                                $this.text("展开");
                                pick = false;
                            } else {
                                $obj.css('height', 'auto');
                                $this.text("收起");
                                pick = true;
                            }
                        });
                    }
                }
				// oCss.style.titleInfo && $AW.cssHover('.dc-title-infoData', obj.children("div[data-widget-role='header']"), oCss.style.titleInfo, '');
				oCss.style.titleInfo && $AW.cssHover('.dc-title-info', obj.children("div[data-widget-role='header']"), oCss.style.titleInfo, '');
				oCss.style.stateIcon && $AW.cssHover('.dc-title-icon', obj.children("div[data-widget-role='header']"), oCss.style.stateIcon, '');
				oCss.style.infoData && $AW.cssHover('.dc-title-infoData', obj.children("div[data-widget-role='header']"), oCss.style.infoData, '');
				return {
					display: function (result, input1, input2, condition) {
						this[result ? 'hide' : 'show']();
					},
					show: function () {
						obj.removeClass('hide');
					},
					hide: function () {
						obj.addClass('hide');
					},
                    collapseHeader: function(collapse,animate){
                        Ctn.collapseHeader(collapse,animate,obj);
					},
					setHeader:function (headerText) {
                        if(oOption.header){
                            Ctn.setHeader(headerText,obj);
                        }else{
                            oOption.header = headerText;
                            Ctn.renderHeader(oOption, obj, oCss,auiCtx);
                        }
					},
					setInfo:function (data){
						var i,
							infoData = oOption.infoData,
							infoDataLength = infoData.length;
							
						for(i = 0;i<infoDataLength;i++){
							if(data.hasOwnProperty(infoData[i][1])){
								infoData[i][2] = data[infoData[i][1]]
							}
                        }
                        renderCtn()

					},
					setStateIcon: function (data) {
						var setObj = {
							'background-color' : data.backgroundColor,
							color: data.color
						};
						data && $AW.cssHover('.dc-title-icon', obj.children("div[data-widget-role='header']"), setObj, '');
					}
				}
			};

		return widget;
	});
})();