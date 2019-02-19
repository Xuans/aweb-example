/**
 * @author quanyongxu@cfischina.com
 */
( /* <global> */function (undefined) {

	(function (factory) {
		"use strict";

		// amd module
		if (typeof define === "function" && define.amd) {
			define(["jquery", "widget"], factory);
		}
		// global
		else {
			factory();
		}

	})
		(function ($, widget) {
			"use strict";

			var CONST = {
				renderRightMenu: 'renderRightMenu',
				ajax: 'ajax',
				auiAjaxTest: 'auiAjaxTest'
			},
				fakeData = {
					"content": {
						"treeDatas": [{
							"id": "access",
							"pId": "accesssss",
							"name": "顶级菜单",
							"open": true,
							"remark": "15010100000030000000",
							"checked": "false"
						}, {
							"id": "homePage",
							"pId": "access",
							"name": "父菜单",
							"open": true,
							"remark": "15010100000030000001",
							"checked": "false"
						}, {
							"id": "gridhome",
							"pId": "homePage",
							"name": "子菜单1",
							"open": true,
							"remark": "15010100000030000002",
							"checked": "false"
						}, {
							"id": "flow",
							"pId": "homePage",
							"name": "子菜单2",
							"open": true,
							"remark": "15010100000030000014",
							"checked": "false"
						}]
					}, "errorMsg": null, "errorMsgList": null, "status": true
				};

			var ZTreeCallbackHandlers = function (contextMenuCallback, $context) {
				this.contextMenuCallback = contextMenuCallback;
				this.$context = $context;
			},
				//i18n
				translateData = function (data, id,auiCtx) {
					var i, item;
					for (i = data.length; item = data[--i];) {
						if (auiCtx) {
							item.name = $AW.nsl(item.name, id, auiCtx);
						}

					}
				};
			function renderCss($ul, $selector, css) {
				var style;
				//自定义样式
				if (css && css.cssCode && css.cssCode.className) {
					$selector.addClass(css.cssCode.className)
				}
				if (!$.isEmptyObject(css) && css.style) {
					style = css.style;
					if (style.checkbox) {
						$AW.cssHover('.ztree li span.button.chk.checkbox_false_full_focus', $selector, style.checkbox, ':before');
						$AW.cssHover('.ztree li span.button.chk.checkbox_true_part_focus', $selector, style.checkbox, ':before');
						$AW.cssHover('.ztree li span.button.chk.checkbox_true_full', $selector, style.checkbox, ':before');
						$AW.cssHover('.ztree li span.button.chk.checkbox_true_full_focus', $selector, style.checkbox, ':before');
						$AW.cssHover('.ztree li span.button.chk.checkbox_true_part', $selector, style.checkbox, ':before');
					}
					style.font && $('.ztree *', $selector).css(style.font);
					style.fontHover && $AW.cssHover('.ztree li a', $selector, style.fontHover, ':hover');
					$AW.cssHover('.ztree li a.curSelectedNode', $selector, style.fontHover, '');
					if (style.openAndCloseBtn) {
						$AW.cssHover('.ztree li span.button.root_open', $selector, style.openAndCloseBtn, ':before');
						$AW.cssHover('.ztree li span.button.root_close', $selector, style.openAndCloseBtn, ':before');
						$AW.cssHover('.ztree li span.button.bottom_close', $selector, style.openAndCloseBtn, ':before');
						$AW.cssHover('.ztree li span.button.bottom_open', $selector, style.openAndCloseBtn, ':before');
					}
				}
			}

			ZTreeCallbackHandlers.prototype = {
				renderRightMenu: function (event, treeId, treeNode, contextMenuItems) {
					var context = this,
						$parent = this.$context || $('body'),
						$menu = $("<div tabIndex='0'  hidefocus='true' class='ztree-right-menu'><ul></ul></div>"),
						$renderTo = $menu.find("ul"),
						$item;

					arguments.length === 3 && (contextMenuItems = treeNode);

					if (context.$currentMenu) {
						context.dispose();
					}

					$.each(contextMenuItems, function (index, itemConfig) {
						$item = $('<li id="' + itemConfig.id + '">' + itemConfig.name + '</li>');
						if (itemConfig.handler) {
							$item.one("click.zTree", function () {
								var callback;
								if (typeof itemConfig.handler == "function") {
									itemConfig.handler.apply(this, arguments);
								} else if (itemConfig.handler === CONST.ajax && (callback = context.contextMenuCallback)) {
									if (!!(callback = callback[itemConfig.data.uuid])) {
										$.ajax(callback);
									}
								}

								context.hide();
							});
						}

						$renderTo.append($item);
					});

					$menu.one("click.ztree", function () {
						context.hide();
					});
					$menu.one("blur.ztree", function () {
						context.hide();
					});

					$parent.append($menu);
					context.$currentMenu = $menu;

					var documentHeight = $(document).height() - scrollY,
						listHeight = $menu.height(),
						offSetTop = $(event.target).offset() && $(event.target).offset().top, offset;

					if ((listHeight + offSetTop) > documentHeight) {
						offset = documentHeight - listHeight;
					} else {
						offset = event.clientY;
					}
					$menu.css({
						"top": offset + "px",
						"left": event.clientX + "px",
						"display": "block",
						"outline-color": "#f1f1f1",
						zIndex: 1060
					}).trigger("focus");
					//this.hide();
				},

				hide: function () {
					this.$currentMenu.hide();
				},

				dispose: function () {
					if (!this.$currentMenu) {
						return;
					}
					this.$currentMenu.children().off('click.zTree');
					this.$currentMenu.remove();
					this.$currentMenu = undefined;
				}
			};

			widget.on([widget.STATUS.WIDGET_INIT, widget.STATUS.WIDGET_UPDATE].join('.component.zTree,') + '.component.zTree', function (type, oWidget) {
				var zTreeWidget, option, callback, optionChange;

				oWidget && oWidget.length && oWidget.each(function (index, elem) {

					zTreeWidget = oWidget.eq(index);


					if (zTreeWidget && zTreeWidget.href && zTreeWidget.href() === 'component.zTree') {

						option = zTreeWidget.option();
						if (callback = option.callback) {

							optionChange = false;

							callback.map(function (elem) {
								var contextMenu;

								if (elem.handler === CONST.ajax) {

									if (!elem.data) {
										elem.data = {};
										optionChange = true;
									}


									if (elem.data.active !== true) {
										elem.data.active = true;

										elem.data.uuid = app.getUID();

										elem.data.order = 'api';
										elem.data.code = '##_VAR##.delegateAjaxEvent("' + elem.data.uuid + '",##_AJAX_OPTION##)';//当order不为空时，传参为data而不是response

										optionChange = true;
									}

									if (!elem.data.name) {
										elem.data.name = '树状菜单' + elem.type + '事件';
										optionChange = true;
									}

								} else {

									if (!elem.data) {
										elem.data = {};
										optionChange = true;
									}

									if (elem.data.active !== false) {
										elem.data.active = false;
										optionChange = true;
									}

									if (elem.handler === CONST.renderRightMenu && (contextMenu = elem.contextMenu)) {
										contextMenu.map(function (elem) {
											if (elem.handler === CONST.ajax) {
												if (!elem.data) {
													elem.data = {};
													optionChange = true;
												}


												if (elem.data.active !== true) {
													elem.data.active = true;

													elem.data.uuid = app.getUID();

													elem.data.order = 'api';
													elem.data.code = '##_VAR##.delegateContextMenuEvent("' + elem.data.uuid + '",##_AJAX_OPTION##)';//当order不为空时，传参为data而不是response

													optionChange = true;
												}

												if (!elem.data.name) {
													elem.data.name = '菜单' + elem.name + '事件';
													optionChange = true;
												}
											} else {
												if (!elem.data) {
													elem.data = {};
													optionChange = true;
												}

												if (elem.data.active !== false) {
													elem.data.active = false;
													optionChange = true;
												}
											}
										});
									}

								}
							});

							if (optionChange) {
								zTreeWidget.option(option, true);
							}
						}


					}

				})
			});


			widget.component.zTree = function ($selector, option, attr, css, auiCtx) {
				var  setting,
					i, item, callback,
					$div, $ul,
					callbackHandlers,
					type, id,
					events = {}, contextMenu = {},
					selectedNode;


                setting = option.setting;

				callbackHandlers = new ZTreeCallbackHandlers(contextMenu, $selector);
				$div = $selector;

				$ul = $div.find('ul');

				for (item in attr) {
					if(attr.hasOwnProperty(item)){
                        if (attr[item] === 'false' || attr[item] === '') {
                            $ul.removeAttr(item);
                        }
                        else {
                            $ul.attr(item, item === 'id' ? 'render_' + attr[item] : attr[item]);
                        }

                        $div.removeAttr(item);
					}

				}

				if ((callback = option.callback) && callback.length) {
					setting.callback = {};

					for (i = callback.length; item = callback[--i];) {
						if (type = item.type) {
							if (events[type]) {
								events[type].push(i);
							} else {
								events[type] = [i];
								setting.callback[type] = (function (type) {
									return function () {
										var callbacks = events[type],
											handler,
											count, i, item,
											args = arguments,
											length = args.length;

										for (i = length; item = args[--i];) {
											if (item && item.tId) {
												selectedNode = item;
												break;
											} else {
												selectedNode = null;
											}
										}

										for (count = -1; item = callback[callbacks[++count]];) {
											if ($.isPlainObject(item.ajax)) {
												if (!item.ajax._success) {
													item.ajax._success = item.ajax.success;
												}

												item.ajax.success = function (item) {
													return function (response) {
														var a = args;

														Array.prototype.splice.call(a, 0, 0, response);

														if ($.isFunction(item.handler)) {
															item.handler.apply(callbackHandlers, a);
														} else if (item.handler === CONST.ajax) {
															item.ajax._success.apply(callbackHandlers, a);
														} else {
															callbackHandlers[item.handler].apply(callbackHandlers, a);
														}
													}
												}(item);

												$.ajax(item.ajax);

											} else {
												if ($.isFunction(handler = item.handler)) {
													handler.apply(callbackHandlers, args);
												} else if ($.isFunction(handler = callbackHandlers[item.handler])) {
													Array.prototype.splice.call(args, length, 0, item.contextMenu);
													handler.apply(callbackHandlers, args);
												}
											}
										}
									}
								}(type));
							}
						}
					}
				}
				renderCss($ul, $div, css);

				$div.attr('id', attr.id);
				id = $div.attr('id');

				return {
					refresh: function (data) {
						var datas;
						if (data === CONST.auiAjaxTest) {
							datas = JSON.parse(JSON.stringify(fakeData.content.treeDatas));
							translateData(datas, id, auiCtx);
							$.fn.zTree.init($ul, setting, datas);
						} else {
							datas = JSON.parse(JSON.stringify(data));
							translateData(datas, id, auiCtx);
							$.fn.zTree.init($ul, setting, datas);
						}
					},

					destroy: function () {
						$.fn.zTree.destroy($ul.attr('id'));
						callbackHandlers.dispose();
					},

					getTreeObj: function () {
						return $.fn.zTree.getZTreeObj($ul.attr('id'));
					},


					callbackHandlers: callbackHandlers,
					delegateAjaxEvent: function (uuid, ajaxOption) {
						var c = callback,
							i, item;

						for (i = c.length; item = c[--i];) {
							if (item && item.data && item.data.uuid === uuid) {
								item.ajax = ajaxOption;
							}
						}

					},
					delegateContextMenuEvent: function (uuid, ajaxOption) {
						contextMenu[uuid] = ajaxOption;
					},


					// return JSON treeNode object
					getSelectedNode: function () {
						return selectedNode;
					},
					// return String node id
					getSelectedNodeID: function () {
						return selectedNode && selectedNode.tId;
					},

					//return Array(JSON)
					getSelectedNodes: function () {
						return $.fn.zTree.getZTreeObj($ul.attr('id')).getCheckedNodes();
					},

					//nodes={
					//  nodes:Array(JSON),
					//  flag:Boolean
					// }
					checkNodes: function (nodes) {
						if (nodes && nodes.nodes) {
							var treeObj = $.fn.zTree.getZTreeObj($ul.attr('id')),
								i, item, items, flag = nodes.flag;

							for (items = nodes.nodes, i = items.length; item = items[--i];) {
								treeObj.checkNode(item, flag, false);
							}
						}
					},

					// 一个行为类型方法的 实现
					display: function (result, input1, input2, condition) {
						this[result ? 'hide' : 'show']();
					},
					show: function () {
						$div.removeClass('hide');
					},
					hide: function () {
						$div.addClass('hide');
					}
				}
			};


			return widget;
		});
})();