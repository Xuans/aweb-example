/**
 * @author hefuxiang@agree.com.cn
 * Date: 2017.04.03
 */
( /* <global> */function (undefined) {

	(function (factory) {
		"use strict";

		// amd module
		if (typeof define === "function" && define.amd) {
			define(["jquery", "widget","jtopo.0.4.8.min"], factory);
		}
		// global
		else {
			factory();
		}

	})
	(function ($, widget) {
		"use strict";

		var classRegExp = /medium-\d+/;

		function render($selector, option, attr, css,formOption, auiCtx) {

			var template = '<label>_label_<canvas></canvas></label>',
				$canvas,
				stage,
				scene,
                arr,
				testData = [
					{
						'id': 'treeId1',
						'pId': '',
						'text': 'rootNode',
//                          'img' : 'dependence/jtopo/img/center.png',
						'extraData': {}
					},
					{
						'id': 'treeId1_1',
						'pId': 'treeId1',
						'text': 'treeId1_1',
//                          'img' : 'dependence/jtopo/img/center.png',
						'extraData': {}
					},
					{
						'id': 'treeId1_2',
						'pId': 'treeId1',
						'text': 'treeId1_2',
//                          'img' : 'dependence/jtopo/img/center.png',
						'extraData': {}
					},
					{
						'id': 'treeId1_3',
						'pId': 'treeId1',
						'text': 'treeId1_3',
//                          'img' : 'dependence/jtopo/img/center.png',
						'extraData': {}
					},
					{
						'id': 'treeId1_1_1',
						'pId': 'treeId1_1',
						'text': 'treeId1_1_1',
//                          'img' : 'dependence/jtopo/img/center.png',
						'extraData': {}
					},
					{
						'id': 'treeId1_1_2',
						'pId': 'treeId1_1',
						'text': 'treeId1_1_2',
//                          'img' : 'dependence/jtopo/img/center.png',
						'extraData': {}
					},
					{
						'id': 'treeId1_1_3',
						'pId': 'treeId1_1',
						'text': 'treeId1_1_3',
//                          'img' : 'dependence/jtopo/img/center.png',
						'extraData': {}
					},
					{
						'id': 'treeId1_1_4',
						'pId': 'treeId1_1',
						'text': 'treeId1_1_4',
//                          'img' : 'dependence/jtopo/img/center.png',
						'extraData': {}
					},
					{
						'id': 'treeId1_2_1',
						'pId': 'treeId1_2',
						'text': 'treeId1_2_1',
//                          'img' : 'dependence/jtopo/img/center.png',
						'extraData': {}
					},
					{
						'id': 'treeId1_2_2',
						'pId': 'treeId1_2',
						'text': 'treeId1_2_2',
//                          'img' : 'dependence/jtopo/img/blue.png',
						'extraData': {}
					},
					{
						'id': 'treeId1_2_3',
						'pId': 'treeId1_2',
						'text': 'treeId1_2_3',
//                          'img' : 'dependence/jtopo/img/center.png',
						'extraData': {}
					},
					{
						'id': 'treeId1_2_4',
						'pId': 'treeId1_2',
						'text': 'treeId1_2_4',
//                          'img' : 'dependence/jtopo/img/center.png',
						'extraData': {}
					},
				],
                refresh = function (data) {
				   var i,item,rootNode,arrs;
                    //清除内容
                    scene.clear();

                    for ( i = 0; i < data.length; i++) {
                         item = data[i];
                        //根节点
                        if (!item.pId) {
                             rootNode = new JTopo.Node(item.text);

                            rootNode.fontColor = '0,0,0';
                            rootNode.attr('id', item.id);
                            rootNode.attr('extraData', item.extraData);
                            item.img && rootNode.setImage(item.img);

                            scene.add(rootNode);

                            generateTree(data, scene, rootNode);

                            if (option.layoutWidthHeight) {
                                 arrs = option.layoutWidthHeight.split(',');
                                // 树形布局
                                scene.doLayout(JTopo.layout.TreeLayout('down', parseInt(arrs[0],10), parseInt(arrs[1],10)));
                            } else {
                                // 树形布局
                                scene.doLayout(JTopo.layout.TreeLayout('down', 90, 120));
                            }

                            break;
                        }
                    }
                },
                generateTree = function (data, scene, parentNode) {
				    var i,item,childNode,link;
                    if (data) {
                        for ( i = 0; i < data.length; i++) {
                             item = data[i];
                            if (item.pId === parentNode.attr('id')) {
                                 childNode = new JTopo.Node(item.text);

                                childNode.fontColor = '0,0,0';
                                childNode.attr('id', item.id);
                                childNode.attr('extraData', item.extraData);
                                item.img && childNode.setImage(item.img);

                                scene.add(childNode);
                                 link = new JTopo.FlexionalLink(parentNode, childNode);
                                scene.add(link);

                                generateTree(data, scene, childNode);
                            }
                        }
                    }
                };

			$selector.attr("id", attr.id || '');

			$selector.append(template);


			$canvas = $selector.find('canvas');
			//设置画布宽高
			if (option.widthAndHeight) {
				 arr = option.widthAndHeight.split(',');
				$canvas.attr('width', parseInt(arr[0],10));
				$canvas.attr('height', parseInt(arr[1],10));
			}

			stage = new JTopo.Stage($canvas[0]);
			scene = new JTopo.Scene();
			stage.add(scene);
			scene.alpha = 1;

			if (option.scaleXY) {
				 arr = option.scaleXY.split(',');
				scene.scaleX = parseFloat(arr[0]);
				scene.scaleY = parseFloat(arr[1]);
			}

			refresh(testData);

			return $.extend(scene, {
				'getSelectedNodeId': function () {
					return scene.currentElement.id;
				},
				'getSelectedNodeText': function () {
					return scene.currentElement.text;
				},
				'getSelectedNode': function () {
					return scene.currentElement;
				},
				'refresh': refresh,

				display:function(result) {
					this[result ? 'hide' : 'show']();
				}
			});
		}

		if (!widget.component.other) {
			widget.component.other = {};
		}

		widget.component.other.topology = function ($selector, oOption, oAttr, oCss, auiCtx) {
			var
				formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};

				return render( $selector, oOption, oAttr,oCss, formOption, auiCtx);
			};


		return widget;
	});
})();