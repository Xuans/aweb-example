/*
 * @license
 *
 * Multiselect v2.3.5
 * http://crlcu.github.io/multiselect/
 *
 * Copyright (c) 2016 Adrian Crisan
 * Licensed under the MIT license (https://github.com/crlcu/multiselect/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
    throw new Error('multiselect requires jQuery');
}

;(function ($) {
    'use strict';

    var version = $.fn.jquery.split(' ')[0].split('.');

    if (version[0] < 2 && version[1] < 7) {
        throw new Error('multiselect requires jQuery version 1.7 or higher');
    }
})(jQuery);

;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module depending on jQuery.
        define(['jquery'], factory);
    } else {
        // No AMD. Register plugin with global jQuery object.
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    var Multiselect = (function($) {
        /** Multiselect object constructor
         *
         *  @class Multiselect
         *  @constructor
        **/
        function Multiselect( $select, settings, $selector ) {
            var id = $select.prop('id');
            this.$selector = $selector;
            this.$left = $select;
            this.$right = $( settings.right ).length ? $( settings.right ) : $('#' + id + '_to',$selector);
            this.actions = {
                $leftSelected:  $( settings.leftSelected ).length ? $( settings.leftSelected ) : $('#' + id + '_leftSelected',$selector),
                $rightSelected: $( settings.rightSelected ).length ? $( settings.rightSelected ) : $('#' + id + '_rightSelected',$selector),

                $undo:          $( settings.undo ).length ? $( settings.undo ) : $('#' + id + '_undo', $selector),
                $redo:          $( settings.redo ).length ? $( settings.redo ) : $('#' + id + '_redo', $selector),

            };

            settings.leftSelected = undefined;
            settings.right = undefined;
            settings.rightSelected = undefined;
            settings.undo = undefined;
            settings.redo = undefined;

            this.options = {
                keepRenderingSort:  settings.keepRenderingSort,
                submitAllLeft:      settings.submitAllLeft !== undefined ? settings.submitAllLeft : true,
                submitAllRight:     settings.submitAllRight !== undefined ? settings.submitAllRight : true,
                search:             settings.search,
                allCheckbox:        settings.allCheckbox,
                staticItem:         settings.staticItem,
                moveBtn:            settings.moveBtn,
                ignoreDisabled:     settings.ignoreDisabled !== undefined ? settings.ignoreDisabled : false,
                moveToRightMaxLen:  settings.moveToRightMaxLen,
                moveToRightMaxLenTip: settings.moveToRightMaxLenTip,
                moveToLeftMaxLen:   settings.moveToLeftMaxLen,
                moveToLeftMaxLenTip:settings.moveToLeftMaxLenTip
            };

             settings.keepRenderingSort = undefined;
             settings.submitAllLeft = undefined; 
             settings.submitAllRight = undefined;
             settings.search = undefined;
             settings.ignoreDisabled = undefined;
             settings.moveToRightMaxLen = undefined;
             settings.moveToRightMaxLenTip = undefined;
             settings.moveToLeftMaxLen = undefined;
             settings.moveToLeftMaxLenTip = undefined;
             

            this.callbacks = settings;

            this.init();
        }

        Multiselect.prototype = {
            init: function() {
                var self = this;
                self.undoStack = [];
                self.redoStack = [];

                //保持初始排序
                if (self.options.keepRenderingSort) {
                    self.skipInitSort = true;

                    if (self.callbacks.sort !== false) {
                        self.callbacks.sort = function(a, b) {
                            return $(a).data('position') > $(b).data('position') ? 1 : -1;
                        };
                    }

                    self.$left.find('option').each(function(index, option) {
                        $(option).data('position', index);
                    });

                    self.$right.find('option').each(function(index, option) {
                        $(option).data('position', index);
                    });
                }

                //初始
                if ( typeof self.callbacks.startUp == 'function' ) {
                    self.callbacks.startUp( self.$left, self.$right );
                }

                //自定义排序
                if ( !self.skipInitSort && typeof self.callbacks.sort == 'function' ) {
                    self.$left.mSort(self.callbacks.sort);

                    self.$right.each(function(i, select) {
                        $(select).mSort(self.callbacks.sort);
                    });
                }
                

                //搜索过滤
                // Append left filter
                if (self.options.search && self.options.search.left) {
                    self.options.search.$left = $(self.options.search.left);
                    self.$left.before(self.options.search.$left);
                }

                // Append right filter
                if (self.options.search && self.options.search.right) {
                    self.options.search.$right = $(self.options.search.right);
                    self.$right.before($(self.options.search.$right));
                }

                // Initialize events
                self.events();
            },

            events: function() {
                var self = this;

                //搜索框事件
                // Attach event to left filter
                if (self.options.search && self.options.search.$left) {
                    self.options.search.$left.on('keyup', function(e) {
                        if (self.callbacks.fireSearch(this.value)) {
                            var $toShow = self.$left.find('div:multiselectsearch("' + this.value + '")').mShow();
                            var $all = self.$left.find('div');
                            var $toHide = self.$left.find('div:not(:multiselectsearch("' + this.value + '"))');
                            //未找到提示
                            if($all.length === $toHide.length){
                            	$('.multiplechoicelistbox-list-body-left-not-found',self.$selector).css({"display":"inline"});
                            }else{
                            	$('.multiplechoicelistbox-list-body-left-not-found',self.$selector).css({"display":"none"});
                            }
                            $toHide.mHide();
                        } else {
                        	$('.multiplechoicelistbox-list-body-left-not-found',self.$selector).css({"display":"none"});
                            self.$left.find('div').mShow();
                        }
                    });
                }

                // Attach event to right filter
                if (self.options.search && self.options.search.$right) {
                    self.options.search.$right.on('keyup', function(e) {
                        if (self.callbacks.fireSearch(this.value)) {
                        	var $toShow = self.$right.find('div:multiselectsearch("' + this.value + '")').mShow();
                        	var $all = self.$right.find('div');
                            var $toHide = self.$right.find('div:not(:multiselectsearch("' + this.value + '"))');
                            //未找到提示
                            if($all.length === $toHide.length){
                            	$('.multiplechoicelistbox-list-body-right-not-found',self.$selector).css({"display":"inline"});
                            }else{
                            	$('.multiplechoicelistbox-list-body-right-not-found',self.$selector).css({"display":"none"});
                            }
                            $toHide.mHide();
                        } else {
                        	$('.multiplechoicelistbox-list-body-right-not-found',self.$selector).css({"display":"none"});
                            self.$right.find('div').mShow();
                        }
                    });
                }


              //点击左侧选择器，改变统计数据
                self.$left.on('click', 'div li label span input', function(e) {
                	//左侧侧计数
                  	 var allLen = self.$left.find('div').length;
                  	 var selectedLen = self.$left.find('div:multiselectallchecked').length;
                  	 var $disableChecked = self.$left.find('div:multiselectdisablechecked');
                  	 var text = "总共："+ allLen;
	               	if(selectedLen !== 0){
	               		text = "已选："+selectedLen+"/"+text;
	               		//改变右移动按钮可点击
	               		self.options.moveBtn && self.options.moveBtn.$moveRightBtn.removeAttr('disabled');
	               		if($disableChecked.length !== 0 || selectedLen !== allLen){
	               			self.options.allCheckbox.$allLeftCheckbox.prop('indeterminate', true).addClass('multiplechoicelistbox-indeterminate');
	               		}else if(selectedLen === allLen){
	               			self.options.allCheckbox.$allLeftCheckbox.prop('indeterminate', false).removeClass('multiplechoicelistbox-indeterminate');
	               		}
	               	}else{
	               	   //改变右移动按钮不可点击
	               		self.options.moveBtn && self.options.moveBtn.$moveRightBtn.attr('disabled', 'disabled');
	               		self.options.allCheckbox.$allLeftCheckbox.prop('indeterminate', false).removeClass('multiplechoicelistbox-indeterminate');
	               	}
	               	self.options.staticItem && self.options.staticItem.$leftStaticItem.text(text);
	               	
                });
                

               
              //点击右侧侧选择器，改变统计数据
                self.$right.on('click', 'div li label span input', function(e) {
                	//右侧计数
	               	 var allLen = self.$right.find('div').length;
	               	 var selectedLen = self.$right.find('div:multiselectallchecked').length;
	               	var $disableChecked = self.$right.find('div:multiselectdisablechecked');
	               	 var text = "总共："+ allLen;
                	if(selectedLen !== 0){
                		text = "已选："+selectedLen+"/"+text;
                		//改变左移动按钮
	               		self.options.moveBtn && self.options.moveBtn.$moveLeftBtn.removeAttr('disabled');
	               		if($disableChecked.length !== 0 || selectedLen !== allLen){
	               			self.options.allCheckbox.$allRightCheckbox.prop('indeterminate', true).addClass('multiplechoicelistbox-indeterminate');
	               		}else if(selectedLen === allLen){
	               			self.options.allCheckbox.$allRightCheckbox.prop('indeterminate', false).removeClass('multiplechoicelistbox-indeterminate');
	               		}
                	}else{
                		//改变左移动按钮不可点击
	               		self.options.moveBtn && self.options.moveBtn.$moveLeftBtn.attr('disabled', 'disabled');
	               		self.options.allCheckbox.$allRightCheckbox.prop('indeterminate', false).attr("checked", false).removeClass('multiplechoicelistbox-indeterminate');
	               	}
                	self.options.staticItem && self.options.staticItem.$rightStaticItem.text(text);
               	 
                });
                
                //左侧全选事件
                self.options.allCheckbox.$allLeftCheckbox.on('click', function(e) {
                	var allLen = self.$left.find('div').length;
                	var text = "总共："+ allLen;
                	var $disableChecked = self.$left.find('div:multiselectdisablechecked');
                	var $ablechecked=self.$left.find('div:multiselectablechecked');
                	
                	if($(this).attr("checked") === 'checked' && allLen !== 0){
                		text = "已选："+$ablechecked.length+"/"+text;
                		//改变右移动按钮可点击
                		 self.options.moveBtn && self.options.moveBtn.$moveRightBtn.removeAttr('disabled');
                		 $disableChecked.find("li").find("label").find("span").find('input[type="checkbox"]').attr("checked",false);
                     	$ablechecked.find("li").find("label").find("span").find('input[type="checkbox"]').attr("checked",true);
                 		if($ablechecked.length !== allLen){//未全选
                 			self.options.allCheckbox.$allLeftCheckbox.prop('indeterminate', true).addClass('multiplechoicelistbox-indeterminate');
                 		}else{
                 			self.options.allCheckbox.$allLeftCheckbox.prop('indeterminate', false).removeClass('multiplechoicelistbox-indeterminate');
                 		}
                	}else{
                		//改变右移动按钮不可点击
                		self.options.moveBtn && self.options.moveBtn.$moveRightBtn.attr('disabled', 'disabled');
                		$ablechecked.find("li").find("label").find("span").find('input[type="checkbox"]').attr("checked",false);
                		self.options.allCheckbox.$allLeftCheckbox.prop('indeterminate', false).removeClass('multiplechoicelistbox-indeterminate');
                		
                	}
                	self.options.staticItem && self.options.staticItem.$leftStaticItem.text(text);
                });
                
                //右侧全选事件
                self.options.allCheckbox.$allRightCheckbox.on('click', function(e) {
                	var allLen = self.$right.find('div').length;
                	var text = "总共："+ allLen;
                	var $disableChecked = self.$right.find('div:multiselectdisablechecked');
                	var $ablechecked=self.$right.find('div:multiselectablechecked');
                	if($(this).attr("checked") === 'checked' && allLen !== 0){
                		text = "已选："+allLen+"/"+text;
                		//改变左移动按钮可点击
                		self.options.moveBtn && self.options.moveBtn.$moveLeftBtn.removeAttr('disabled');
                		$disableChecked.find("li").find("label").find("span").find('input[type="checkbox"]').attr("checked",false);
                    	$ablechecked.find("li").find("label").find("span").find('input[type="checkbox"]').attr("checked",true);
                		if($ablechecked.length !== allLen){//未全选
                			self.options.allCheckbox.$allRightCheckbox.prop('indeterminate', true).addClass('multiplechoicelistbox-indeterminate');
                		}else{
                			self.options.allCheckbox.$allRightCheckbox.prop('indeterminate', false).removeClass('multiplechoicelistbox-indeterminate');
                		}
                	}else{
                		//改变左移动按钮不可点击
	               		self.options.moveBtn && self.options.moveBtn.$moveLeftBtn.attr('disabled', 'disabled');
	               		$ablechecked.find("li").find("label").find("span").find('input[type="checkbox"]').attr("checked",false);
                		self.options.allCheckbox.$allRightCheckbox.prop('indeterminate', false).removeClass('multiplechoicelistbox-indeterminate');
                	}
                	self.options.staticItem && self.options.staticItem.$rightStaticItem.text(text);
                });


                //点击向右移按钮，左框移到右框
                self.actions.$rightSelected.on('click', function(e) {
                    e.preventDefault();
                    var $allOptions = self.$left.find('div');
                    var $allSelectOptions = self.$left.find('div:multiselectallchecked');
                    var $options = self.$left.find('div:multiselecthecked');
                    if ( $options.length ) {
                    	//清除全选按钮样式
                        if($options.length === $allSelectOptions.length){
                        	self.options.allCheckbox && self.options.allCheckbox.$allLeftCheckbox.removeClass("multiplechoicelistbox-indeterminate");
                        	self.options.allCheckbox && self.options.allCheckbox.$allLeftCheckbox.attr("checked",false);
                        }
                        
                        if(self.options.moveToRightMaxLen && $options.length > self.options.moveToRightMaxLen ){
                     		app.alert(self.options.moveToRightMaxLenTip || '超过可同时移动个数');
                     		self.options.moveBtn && self.options.moveBtn.$moveRightBtn.attr('disabled', 'disabled');
                     		self.options.staticItem && self.options.staticItem.$leftStaticItem.text("总共："+$allOptions.length);
                     		return false;
                     	}
                                     	
                    	var allLen = $allOptions.length - $options.length;
                    	var selectedLen = $allSelectOptions.length - $options.length;
                    	//显示统计数据
                    	var text = "总共："+ allLen;
                    	if(selectedLen !== 0){
                    		text = "已选："+selectedLen+"/"+text;
                    		//改变右移动按钮可点击
                   		    self.options.moveBtn && self.options.moveBtn.$moveRightBtn.removeAttr('disabled');
                    	}else{
                    		//改变右移动按钮不可点击
                    		self.options.moveBtn && self.options.moveBtn.$moveRightBtn.attr('disabled', 'disabled');
                    	}
                    	//左侧计数
                    	self.options.staticItem && self.options.staticItem.$leftStaticItem.text(text);
                    	//右侧计数
                    	 var rightAllLen = self.$right.find('div').length+ $options.length;
                    	 var rightSelectedLen = self.$right.find('div:multiselectallchecked').length;
                    	 var righttext = "总共："+ rightAllLen;
                     	if(rightSelectedLen !== 0){
                     		righttext = "已选："+rightSelectedLen+"/"+righttext;
                     	}
                     	self.options.staticItem && self.options.staticItem.$rightStaticItem.text(righttext);
                    	 
                    	                         
                        self.moveToRight($options, e);
                        if (self.options.search && self.options.search.$right && self.options.search.$left) {//触发两边搜索框搜索
                        	self.options.search.$right.trigger("keyup");
                        	self.options.search.$left.trigger("keyup");
                        }
                    }else{
                    	self.callbacks.tips && app.alert(self.callbacks.tips,app.alert.SHOW_TYPE.WARNING);
                    }                                   

                    $(this).blur();
                });

                //点击向左移按钮，右框移到左框
                self.actions.$leftSelected.on('click', function(e) {
                    e.preventDefault();
                    var $allOptions = self.$right.find('div');
                    var $allSelectOptions = self.$right.find('div:multiselectallchecked');
                    var $options = self.$right.find('div:multiselecthecked');
                    
                    if ( $options.length ) {
                    	//清除全选按钮样式
                    	if($options.length === $allSelectOptions.length){
                    		self.options.allCheckbox && self.options.allCheckbox.$allRightCheckbox.removeClass("multiplechoicelistbox-indeterminate");
                        	self.options.allCheckbox && self.options.allCheckbox.$allRightCheckbox.attr("checked",false);
                    	}
                    	if(self.options.moveToLeftMaxLen && $options.length > self.options.moveToLeftMaxLen ){
                     		app.alert(self.options.moveToLeftMaxLenTip || '超过可同时移动个数');
                     		self.options.moveBtn && self.options.moveBtn.$moveLeftBtn.attr('disabled', 'disabled');
                     		self.options.staticItem && self.options.staticItem.$rightStaticItem.text("总共："+$allOptions.length);
                     		return false;
                     	}
                        	var allLen = $allOptions.length - $options.length;
                        	var selectedLen = $allSelectOptions.length - $options.length;
                        	//显示统计数据
                        	var text = "总共："+ allLen;
                        	if(selectedLen !== 0){
                        		text = "已选："+selectedLen+"/"+text;
                        		//改变左移动按钮
        	               		self.options.moveBtn && self.options.moveBtn.$moveLeftBtn.removeAttr('disabled');
                        	}else{
                        		//改变左移动按钮不可点击
        	               		self.options.moveBtn && self.options.moveBtn.$moveLeftBtn.attr('disabled', 'disabled');
                        	}
                        	//右侧
                        	self.options.staticItem && self.options.staticItem.$rightStaticItem.text(text);
                        	//左侧侧计数
	                       	 var leftAllLen = self.$left.find('div').length+ $options.length;
	                       	 var leftSelectedLen = self.$left.find('div:multiselectallchecked').length;
	                       	 var lefttext = "总共："+ leftAllLen;
                        	if(leftSelectedLen !== 0){
                        		lefttext = "已选："+leftSelectedLen+"/"+lefttext;
                        	}
                        	self.options.staticItem && self.options.staticItem.$leftStaticItem.text(lefttext);                        	                       	
                    	
                        self.moveToLeft($options, e);
                        if (self.options.search && self.options.search.$left && self.options.search.$right) {//触发两边搜索框搜索
                        	self.options.search.$right.trigger("keyup");
                        	self.options.search.$left.trigger("keyup");
                        }
                    }else{
                    	self.callbacks.tips && app.alert(self.callbacks.tips,app.alert.SHOW_TYPE.WARNING);
                    }
                    $(this).blur();
                });



                self.actions.$undo.on('click', function(e) {
                    e.preventDefault();

                    self.undo(e);
                });

                self.actions.$redo.on('click', function(e) {
                    e.preventDefault();
                    self.redo(e);
                });


            },

            moveToRight: function( $options, event, silent, skipStack ) {
                var self = this;

                if ( typeof self.callbacks.moveToRight == 'function' ) {
                    return self.callbacks.moveToRight( self, $options, event, silent, skipStack );
                } else {
                    if ( typeof self.callbacks.beforeMoveToRight == 'function' && !silent ) {
                        if ( !self.callbacks.beforeMoveToRight( self.$left, self.$right, $options ) ) {
                            return false;
                        }
                    }
                    $options.each(function(index, option) {
                        var $option = $(option);
                        if (self.options.ignoreDisabled && $option.is(':disabled')) {
                            return true;
                        }
                        self.$right.move($option);
                    });

                    if ( !skipStack ) {
                        self.undoStack.push(['right', $options ]);
                        self.redoStack = [];
                    }

                    if ( typeof self.callbacks.sort == 'function' && !silent && !self.doNotSortRight ) {
                        self.$right.mSort(self.callbacks.sort);
                    }

                    if ( typeof self.callbacks.afterMoveToRight == 'function' && !silent ) {
                        self.callbacks.afterMoveToRight( self.$left, self.$right, $options );
                    }

                    return self;
                }
            },

            moveToLeft: function( $options, event, silent, skipStack ) {
                var self = this;

                if ( typeof self.callbacks.moveToLeft == 'function' ) {
                    return self.callbacks.moveToLeft( self, $options, event, silent, skipStack );
                } else {
                    if ( typeof self.callbacks.beforeMoveToLeft == 'function' && !silent ) {
                        if ( !self.callbacks.beforeMoveToLeft( self.$left, self.$right, $options ) ) {
                            return false;
                        }
                    }

                    $options.each(function(index, option) {
                        var $option = $(option);

                        self.$left.move($option);
                    });

                    if ( !skipStack ) {
                        self.undoStack.push(['left', $options ]);
                        self.redoStack = [];
                    }

                    if ( typeof self.callbacks.sort == 'function' && !silent ) {
                        self.$left.mSort(self.callbacks.sort);
                    }

                    if ( typeof self.callbacks.afterMoveToLeft == 'function' && !silent ) {
                        self.callbacks.afterMoveToLeft( self.$left, self.$right, $options );
                    }

                    return self;
                }
            },

            undo: function(event) {
                var self = this;
                var last = self.undoStack.pop();

                if ( last ) {
                    self.redoStack.push(last);

                    switch(last[0]) {
                        case 'left':
                            self.moveToRight(last[1], event, false, true);
                            break;
                        case 'right':
                            self.moveToLeft(last[1], event, false, true);
                            break;
                    }
                }
            },

            redo: function(event) {
                var self = this;
                var last = self.redoStack.pop();

                if ( last ) {
                    self.undoStack.push(last);

                    switch(last[0]) {
                        case 'left':
                            self.moveToLeft(last[1], event, false, true);
                            break;
                        case 'right':
                            self.moveToRight(last[1], event, false, true);
                            break;
                    }
                }
            }
        }

        return Multiselect;
    })($);

    $.multiselect = {
        defaults: {
            /** will be executed once - remove from $left all options that are already in $right
             *
             *  @method startUp
             *  @attribute $left jQuery object
             *  @attribute $right jQuery object
            **/
            startUp: function( $left, $right ) {},

            /** will be executed each time before moving option[s] to right
             *
             *  IMPORTANT : this method must return boolean value
             *      true    : continue to moveToRight method
             *      false   : stop
             *
             *  @method beforeMoveToRight
             *  @attribute $left jQuery object
             *  @attribute $right jQuery object
             *  @attribute $options HTML object (the option[s] which was selected to be moved)
             *
             *  @default true
             *  @return {boolean}
            **/
            beforeMoveToRight: function($left, $right, $options) { return true; },

            /**  will be executed each time after moving option[s] to right
             *
             *  @method afterMoveToRight
             *  @attribute $left jQuery object
             *  @attribute $right jQuery object
             *  @attribute $options HTML object (the option[s] which was selected to be moved)
            */
            afterMoveToRight: function($left, $right, $options) {},

            /** will be executed each time before moving option[s] to left
             *
             *  IMPORTANT : this method must return boolean value
             *      true    : continue to moveToRight method
             *      false   : stop
             *
             *  @method beforeMoveToLeft
             *  @attribute $left jQuery object
             *  @attribute $right jQuery object
             *  @attribute $options HTML object (the option[s] which was selected to be moved)
             *
             *  @default true
             *  @return {boolean}
            **/
            beforeMoveToLeft: function($left, $right, $options) { return true; },

            /**  will be executed each time after moving option[s] to left
             *
             *  @method afterMoveToLeft
             *  @attribute $left jQuery object
             *  @attribute $right jQuery object
             *  @attribute $options HTML object (the option[s] which was selected to be moved)
            */
            afterMoveToLeft: function($left, $right, $options) {},

            /** sort options by option text
             *
             *  @method sort
             *  @attribute a HTML option
             *  @attribute b HTML option
             *
             *  @return 1/-1
            **/
            sort: function(a, b) {
                if (a.innerHTML == 'NA') {
                    return 1;
                } else if (b.innerHTML == 'NA') {
                    return -1;
                }

                return (a.innerHTML > b.innerHTML) ? 1 : -1;
            },

            /**  will tell if the search can start
             *
             *  @method fireSearch
             *  @attribute value String
             *
             *  @return {boolean}
            */
            fireSearch: function(value) {
                return value.length >= 1;
            }
        }
    };

    var ua = window.navigator.userAgent;
    var isIE = (ua.indexOf("MSIE ") + ua.indexOf("Trident/") + ua.indexOf("Edge/")) > -3;

    $.fn.multiselect = function( options, $selector ) {
        return this.each(function() {
            var $this    = $(this),
                data     = $this.data('crlcu.multiselect'),
                settings = $.extend({}, $.multiselect.defaults, $this.data(), (typeof options === 'object' && options));

            if (!data) {
                $this.data('crlcu.multiselect', (data = new Multiselect($this, settings, $selector)));
            }
        });
    };

    // append options
    // then set the selected attribute to false
    $.fn.move = function( $options ) {
        this
            .append($options)
            //.find('option')
           // .prop('selected', false);
        return this;
    };

    $.fn.removeIfEmpty = function() {
        if (!this.children().length) {
            this.remove();
        }

        return this;
    };

    $.fn.mShow = function() {
        this.removeClass('hidden').show();

        if ( isIE ) {
            this.each(function(index, option) {
                // Remove <span> to make it compatible with IE
                if($(option).parent().is('span')) {
                    $(option).parent().replaceWith(option);
                }

                $(option).show();
            });
        }

        return this;
    };

    $.fn.mHide = function() {
        this.addClass('hidden').hide();

        if ( isIE ) {
            this.each(function(index, option) {
                // Wrap with <span> to make it compatible with IE
                if(!$(option).parent().is('span')) {
                    $(option).wrap('<span>').hide();
                }
            });
        }

        return this;
    };

    // sort options then reappend them to the select
    $.fn.mSort = function(callback) {
        this
            .find('option')
            .sort(callback)
            .appendTo(this);

        return this;
    };

    //搜索框搜索伪类
    $.expr[":"].multiselectsearch = function(elem, index, meta) {
    	var $spans = $(elem).find("li").find("span");
    	var flag = false;
    	$spans.each(function(index, value){
    		if($(value).text().toUpperCase().indexOf(meta[3].toUpperCase()) >= 0){
    			flag = true;
    			return ;
    		}
    	});
    	return flag;
    }
    
    //选择移动项选择器伪类：选择显示的
    $.expr[":"].multiselecthecked = function(elem, index, meta) {
    	var $checkbox = $(elem).find("li").find("label").find("span").find('input[type="checkbox"]');
    	if($($checkbox[0]).attr("checked") === 'checked' && !$(elem).hasClass("hidden")){
    		$($checkbox[0]).attr("checked",false);//取消勾选状态
    		return true;
    	}else{
    		return false;
    	}
    }
  //选择全部勾选选择器伪类：包括未显示的
    $.expr[":"].multiselectallchecked = function(elem, index, meta) {
    	var $checkbox = $(elem).find("li").find("label").find("span").find('input[type="checkbox"]');
    	if($($checkbox[0]).attr("checked") === 'checked'){
    		return true;
    	}else{
    		return false;
    	}
    }
    
    //选择为不可编辑的复选框选择器伪类：包括未显示的
    $.expr[":"].multiselectdisablechecked = function(elem, index, meta) {
    	return $(elem).hasClass("multiplechoicelistbox-disabled");
    }
    
    //可编辑的复选框选择器伪类：包括未显示的
    $.expr[":"].multiselectablechecked = function(elem, index, meta) {
    	return !$(elem).hasClass("multiplechoicelistbox-disabled");
    }
    
}));

