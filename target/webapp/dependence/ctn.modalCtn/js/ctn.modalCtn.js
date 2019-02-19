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
            define(["jquery", "widget"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget) {
        "use strict";

        var renderModel = function ($modal, css) {
            var style;
            //自定义样式
            if (css && css.cssCode && css.cssCode.className) {
                $modal.addClass(css.cssCode.className)
            }
            if (css && (style = css.style)) {
                style.title && $AW.cssHover('.modal-header', $modal, style.title, '');
                style.titleContent && $AW.cssHover('.modal-header h4', $modal, style.titleContent, '');
                style.icon && $AW.cssHover('.alert-close', $modal, style.icon, '');
                style.content && $AW.cssHover('.modal-body', $modal, style.content, '');

                style.modalFoot && $AW.cssHover('.modal-footer', $modal, style.modalFoot, '');
                style.confirmBtn && $AW.cssHover('.modal-footer .btn.btn-focus ', $modal, style.confirmBtn, '');
                style.cancelBtn && $AW.cssHover('.modal-footer .btn.btn-normal ', $modal, style.cancelBtn, '');
                style.ignoreBtn && $AW.cssHover('.modal-footer .btn.btn-custom ', $modal, style.ignoreBtn, '');
                style.confirmBtn && $AW.cssHover('.modal-footer .btn.btn-focus ', $modal, style.confirmBtn, ':hover');
                style.cancelBtn && $AW.cssHover('.modal-footer .btn.btn-normal ', $modal, style.cancelBtn, ':hover');
                style.ignoreBtn && $AW.cssHover('.modal-footer .btn.btn-custom ', $modal, style.ignoreBtn, ':hover');
            }
        };

        widget.on([widget.STATUS.WIDGET_INIT, widget.STATUS.WIDGET_UPDATE].join('.ctn.modalCtn,') + '.ctn.modalCtn', function (type, oWidget) {
            var modalWidget, name;
            oWidget && oWidget.length && oWidget.each(function (index, elem) {

                modalWidget = oWidget.eq(index);

                if (modalWidget.href && modalWidget.href() === 'ctn.modalCtn') {

                    if (type === widget.STATUS.WIDGET_INIT) {
                        name = '关闭"' + modalWidget.name() + '"窗口';

                        modalWidget.on({
                            desp: name,
                            type: 'click',
                            selector: "###_ID## [data-role='confirm']",
                            handler: "_parseFunction_function (e){$('###_ID##',$el).modal('hide');}",
                            handlerText: '隐藏弹窗（hide）'
                        }).on({
                            desp: name,
                            type: 'click',
                            selector: "###_ID## [data-role='cancel']",
                            handler: "_parseFunction_function (e){$('###_ID##',$el).modal('hide');}",
                            handlerText: '隐藏弹窗（hide）'
                        });


                    }
                }
            })
        });
        widget.ctn.modalCtn = function ($widget, oOption, attr, css, auiCtx) {
	        var id,
		        $modal;
	        //i18n
	        id = $widget.attr('id');
	        oOption.title && (oOption.title = $AW.nsl(oOption.title, id, auiCtx));
	        oOption.btnConfirm && (oOption.btnConfirm = $AW.nsl(oOption.btnConfirm, id, auiCtx));
	        oOption.btnCancel && (oOption.btnCancel = $AW.nsl(oOption.btnCancel, id, auiCtx));
	        oOption.btnIgnore && (oOption.btnIgnore = $AW.nsl(oOption.btnIgnore, id, auiCtx));

	        app.modal.warp($widget, oOption);

	        $modal=$widget.parent();

	        if (css) {

		        renderModel($modal, css);
	        }

	        if(oOption.reset){
		        $modal.on('hidden', function () {
			        app.reset($modal,auiCtx);
		        });
	        }

	        return {
		        show: function (e, size) {
			        var option = $.extend(true, {}, oOption, size);
			        option.show = this.show;
			        app.modal(option);
		        },
		        hide: function () {
			        $modal.attr('id', $widget.attr('id'));
			        $modal.modal('hide');
		        },
		        display: function (disable, input1, input2, condition) {
			        disable ? this.hide() : this.show();
		        },
		        destroy:function () {
			        $modal.off().empty();
		        }
	        };
        };

        widget.ctn.modalCtn.theme = function ($modal) {
           if(!$modal.attr('id')){
            renderModel($modal, widget.css('ctn.modalCtn', {}));
           }
         };

        return widget;
    });
})();
