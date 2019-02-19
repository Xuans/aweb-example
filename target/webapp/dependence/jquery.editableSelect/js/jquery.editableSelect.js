//可键入下拉框
(function ($) {

    $('body').append('<style>.editable-select-list > li:hover {color: white;background-color: #00AAFF;}</style>');

    $.fn.editableSelect = function () {
        var $elem;

        this.each(function () {
            var $wrapper,
                $select = $(this), $input, $triangle, $list,
                objID, rightPadding = 15,
                isFormControl = $select.parent().hasClass('controls'),
                isHide;
            //check if element is a select
            if ($select.is('select')) {
                isHide = !!~$select.css('width').indexOf('%');
                //wrap the original select
                $select.wrap($('<div/>'));
                $wrapper = $select.parent();
                $wrapper.css({
                    // display: isFormControl ? 'block' : 'inline-block',
                    position: isHide && $wrapper.css('position') === 'static' ? 'relative' : $wrapper.css('position'),
                    height:'100%'
                });

                //place an input which will represent the editable select
                $input = $('<input/>').insertBefore($select);

                //get and remove the original id and value
                objID = $select.attr('id');
                $select.removeAttr('id');
                $input.val($select.val());

                //add the attributes from the original select
                $input.attr({
                    autocomplete: 'off',
                    alt: $select.attr('alt'),
                    title: $select.attr('title'),
                    'class': $select.attr('class'),
                    name: $select.attr('name'),
                    disabled: $select.attr('disabled'),
                    tabindex: $select.attr('tabindex'),
                    id: objID,
                    placeHolder: $select.children(':disabled').text(),
                    'data-role': $select.attr('data-role')
                });
                $select.removeAttr('data-role');

                //get the editable css properties from the select
                $input.css({
                    padding: $select.css('padding'),
                    margin: $select.css('margin'),
                    width: isHide ? '' : $select.width() - rightPadding + parseInt($select.css('paddingRight')),
                    height:'100%',
                    border: 0,
                    borderRadius: '.33em',
                    fontFamily: $select.css('fontFamily'),
                    fontSize: $select.css('fontSize'),
                    background: $select.css('background'),
                    paddingRight: rightPadding
                });


                //add the triangle at the right
                $triangle = $('<div/>').css({
                    height: 0, width: 0,
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '7px solid #999',
                    marginBottom: '-7px'

                }).insertAfter($input);

                if (isHide) {
                    $triangle.css({
                        position: 'absolute',
                        top: '1.1em',
                        right: rightPadding - 10,
                        left: 'calc(100% - 19px)'
                    });
                } else {
                    $triangle.css({
                        position: 'absolute',
                        top: '.9em',
                        right:'12px'
                    })
                }

                //create the selectable list that will appear when the input gets focus
                $list = $('<ol class="editable-select-list"/>')
                    .css({
                        display: 'none',
                        listStyleType: 'none',
                        width: $select.outerWidth() - 2,
                        maxHeight: $(window).height() / 2,
                        overflow: 'auto',
                        padding: 0,
                        margin: 0,
                        border: 'solid 1px #ccc',
                        fontFamily: $input.css('fontFamily'),
                        fontSize: $input.css('fontSize'),
                        background: '#fff',
                        position: 'fixed',
                        zIndex: 1000000,
                        'overflow-x': 'hidden'
                    })
                    .insertAfter($triangle);


                //add options
                $select.children(':not(:disabled)').each(function (index, value) {
                    prepareOption($(value).attr('value'), $(value).text(), $wrapper);
                });
                $wrapper.on('mouseleave', function () {
                    $(this).children('ol').hide();
                });
                $input
                    .click(function (e) {
                        var $this = $(this),
                            $list = $this.siblings('ol').css('height', ''),
                            isBlock = $this.parent().css('display') === 'block',
                            offsetTop = parseInt($this.offset().top, 10) || 0,
                            top = isBlock ? (offsetTop + $this.outerHeight(true) - 1) : (offsetTop + $this.outerHeight(true) - (parseInt($this.css('margin-bottom')) || 0)),
                            height = '';

                        if (!($(window).height() > $list.height() + top)) {
                            if ((top = offsetTop - $list.height()) < 0) {
                                height = offsetTop - 10;
                                top = 10;
                            }
                        }

                        $list.css({
                            top: top,
                            display: 'block',
                            height: height,
                            width: $this.outerWidth(true)
                        });
                    })
                    .keyup(function (e) {
                        if (e.which == 13)	$(this).parent().trigger('mouseleave');
                    })
                    .change(function () {
                        var $this = $(this);
                        $this.attr('data-value', $this.val());
                    });
                $triangle.click(function () {
                    $(this).siblings('input').click();
                });
                $list.click(function (e) {
                    //bind click on this option
                    var $e = $(e.target || window.event.srcElement),
                        $this;

                    if ($e.is('li')) {
                        $this = $(this);
                        $this.siblings('input')
                            .val($e.text())
                            .trigger('change')//注意顺序
                            .attr('data-value', $e.attr('data-value'));
                        $this.hide();
                    }
                });
                //hide original element
                $select.css({visibility: 'hidden', display: 'none', position: 'absolute'});

                //save this instance to return it
                $elem = $input;
            } else {
                //not a select
                return false;
            }
        });//-end each

        /** public methods **/

        /**
         * Adds an option to the editable select
         * @param {String} value - the options value
         * @returns {void}
         */
        $elem.addOption = function (value, text) {
            var $parent = $(this).parent();

            if ($.isArray(value)) {
                if (typeof value[0] === 'string') {
                    for (var i = -1, item; (item = value[++i]);) {
                        prepareOption(item, item, $parent);
                    }
                } else if ($.isArray(value[0])) {
                    for (var i = -1, item; (item = value[++i]);) {
                        prepareOption(item[0], item[1], $parent);
                    }
                } else {
                    for (var i = -1, item; (item = value[++i]);) {
                        prepareOption(item.value, item.key, $parent);
                    }
                }
            } else if ($.isPlainObject(value)) {
                for (var p in value) {
                    prepareOption(p, value[p], $parent);
                }
            } else {
                prepareOption(value, text, $parent);
            }
        };

        /**
         * Removes a specific option from the editable select
         * @param {String, Number} value - the value or the index to delete
         * @returns {void}
         */
        $elem.removeOption = function (value) {
            var $this = $(this);
            if (!value) {
                $this.siblings('ol').children().remove();
            } else {
                switch (typeof(value)) {
                    case 'number':
                        $this.siblings('ol').children(':nth(' + value + ')').remove();
                        break;
                    case 'string':
                        $this.siblings('ol').children().each(function (index, optionValue) {
                            if ($(optionValue).attr('data-value') == value) {
                                $(optionValue).remove();
                            }
                        });
                        break;
                }
            }
        };


        /*
         *
         * 获取其值 真实值
         * */
        $elem.value = function () {
            return $(this).siblings('input').attr('data-value');
        };

        /**
         * Resets the select to it's original
         * @returns {void}
         */
        $elem.restoreSelect = function () {
            var $wrapper = $(this).parent(),
                $select = $wrapper.children('select'),
                objID = $elem.attr('id');

            $wrapper.off();
            $wrapper.children(':not(select)').off().remove();
            $select.unwrap();
            $wrapper = null;

            $select.css({visibility: '', display: '', position: ''});
            $select.attr({id: objID});
            $select = null;
        };

        //return the instance
        return $elem;
    };

    /** private methods **/

    function prepareOption(value, text, $wrapper) {
        text = $.trim(text || value);
        value = $.trim(value || text);
        $('<li data-value="' + value + '" title="' + text + '">' + text + '</li>').appendTo($wrapper.children('ol'));
    }


    var mousewheelHandler, hasWheel = false;
    $(window).on('mousewheel', function (e) {
        if (!hasWheel) {
            hasWheel = true;
            var $e = $(e.target || window.event.srcElement);
            if (!($e.hasClass('editable-select-list') || $e.parent().hasClass('editable-select-list'))) {
                $('.editable-select-list').hide();
            }
        }
        window.clearTimeout(mousewheelHandler);
        mousewheelHandler = setTimeout(function () {
            hasWheel = false;
        }, 100);
    });

}($));