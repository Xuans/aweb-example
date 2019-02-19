define(['jquery'], function ($) {
	var global=window,
		widget,$AW,
		dispatcher=app.dispatcher(100);

	$AW=widget = {

		queryString: function (key) {
			var search = global.location.search || document.location.search,
				decoder = global.decodeURI || global.decodeURIComponent,
				rKey = new RegExp('\\b' + key + '=([^$&]+)'),
				value;

			value = search.match(rKey);
			value = value && value[1];

			return value ? decoder(value) : '';
		},
		//浏览器运行
		getCurrentLanguage:function () {
			return this.language || (this.language = widget.queryString('lang') || widget.queryString('language') || navigator.language)
		},
		//AUI运行
		getLanguage: function () {
			return (this.language =app.getData('language') || app.queryString('language') || navigator.language);
		},
		nsl: (function () {
			var matchRegex = function (key, value, str) {
					var PLACEHOLDER_NUM_G = /\{(\d{1,})\}/g,
						REPLACEMENT_NUM_G = '(.*)',
						result = false,
						order, regex, match, keys, j, len;

					if(key===undefined ||key==='' || key===null){
						return '';
					}else{
						if(key.toString){
							key=key.toString();
						}

						order = key.match(PLACEHOLDER_NUM_G);
						if (order) {
							regex = new RegExp(key.replace(PLACEHOLDER_NUM_G, REPLACEMENT_NUM_G));// regex=/哈哈.*，.*，.*/

						} else {
							regex = new RegExp(key, 'g');
						}

						match = str.match(regex);

						if (match) {
							keys = {};
							if (order) {
								for (j = 1, len = match.length; j < len; ++j) {
									keys[order[j - 1]] = match[j];
									/*
									 *   keys={
									 *       '{0}':'你'，
									 *       '{1}'：'我'，
									 *       '{2}'：'他'
									 *   };
									 * */
								}
								result = value.replace(PLACEHOLDER_NUM_G, function (matcher) {
									return keys[matcher];
								});
							} else {
								result = str.replace(regex, value);
							}
						}
						return result;
					}
				},
				getTranslatorResult = function (str, nslList, lang) {
					var result = false,

						length, item, key, value;


					if (str && nslList && lang) {

						switch (Object.prototype.toString.apply(nslList)) {
							case '[object Object]':
								for (key in nslList) {
									if (nslList.hasOwnProperty(key)) {
										value = nslList[key];
										result = matchRegex(key, value, str)
									}
									if (result !== false) {
										break
									}
								}

								break;

							case '[object Array]':
								for (length = nslList.length; item = nslList[--length];) {
									key = item.key;
									value = item.value[lang];

									if (key) {

										result = matchRegex(key, value, str)
									}
									if (result !== false) {
										break
									}
								}
								break;

							default:
								//do nothing
								break;

						}

						return result
					}
				};

			return function (newStr, id, auiCtx, lang) {
				var widgetNSL, pageNSL, globalNSL, result = false, language, str;

				if (aweb.translate && !!(str = newStr + '')) {

					switch (arguments.length) {
						case 1://如果传入一个参数，默认拿全局国际化
							if(window.auiApp){
                                language = $AW.getLanguage();
							}else{
                                language = this.getCurrentLanguage();
							}
                            // language = this.getCurrentLanguage();
							(globalNSL = $AW.viewer.nsl) && (result = getTranslatorResult(str, globalNSL, language));
							break;

						default://默认传入三个参数，第四个可选
                            if(window.auiApp){
                                language = lang|| $AW.getLanguage();
                            }else{
                                language = lang || this.getCurrentLanguage();
                            }
                            /*language = lang || this.getCurrentLanguage();*/
							if ((widgetNSL = auiCtx.widgetNSL) && (widgetNSL = widgetNSL[id]) && widgetNSL.length) {
								result = getTranslatorResult(str, widgetNSL, language);
							}

							if (result === false && (pageNSL = auiCtx.pageNSL) && pageNSL.length) {
								result = getTranslatorResult(str, pageNSL, language);
							}

							if (result === false && (globalNSL = $AW.viewer.nsl)) {
								result = getTranslatorResult(str, globalNSL, language)
							}

							break;
					}

				}

				return result || newStr;
			}
		}()),
		_css: {},
		css: (function () {
			var delEmptyObj = function (obj) {
					return obj ? JSON.parse(JSON.stringify(obj)
						.replace(/"[^"]+":"",?/g, '')
						.replace(/,}/g, '}')) : {};
				};
			return function (href, css) {
				var level,
					level1, level2,
					level3 = css && css.style || {},
					themes = css && css.theme || '',
					themeName = [], variables,
					themeData,
                    item,
					newCss = {
					    cssCode:css && css.cssCode && css.cssCode,
						style: {},
						theme: css && css.theme
					};
				variables = $AW.fresher.variablesCopy;
				themeData = $AW.fresher.theme && $AW.fresher.theme[href];
				if (themeData) {
					level1 = themeData._default;

					if (themeData.css && !$.isEmptyObject(themeData.css.theme)) {
						for(i=-1;item = themeData.css.theme[++i];){
                            var value = item.name;
                            if (themes && themes[value] !== "") {
                                themeName.push(themes[value]);
                            }
						}


						level2 = themeData[themeName.join(" ")];
					}
				}
				level1 = delEmptyObj(level1, 1);
				level2 = delEmptyObj(level2, 2);
				level3 = delEmptyObj(level3, 3);

				level = JSON.stringify($.extend(true, {}, level1, level2, level3));

				level = level.replace(/@[^"]+/g, function (key) {
					return variables[key];
				});

				newCss.style = JSON.parse(level);

				return newCss;
			}
		}()),
        cssHover: (function () {
            var /*
				 *
				 * cache[style]={
				 *   name:className,
				 *   map:{
				 *       key1:true,
				 *       key2:true
				 *   }
				 *   keys:[key1,key2]
				 * }
				 *
				 *
				 * */
                STYLE_TEMP = '<style id="awebStyleTag" type="text/css">_content_</style>',
                STYLE_TAG_LENGTH = 31,
                STYLE_TEMP_ID = 'awebStyleTag',
                IN_IE =!!navigator.userAgent.match(/Trident(?!\/7\.0)/i),
                WIDGTE_TIMEOUT = IN_IE ? 220 : 16,
                PAGE_TIMEOUT = IN_IE ? 220 : 16,

				accumulator=0,
                cache = {},
                conflictMap = {},
                times = 0,
                $body = $('body'),
                $style,


                delayHandler,
                delayRender = function () {
                    var html, str, style;

                    if ($style) {
                        $style.remove();
                    }

                    html = [];

                    for (str in cache) {
                        if (cache.hasOwnProperty(str)) {
                            style = cache[str];

                            if (str && style) {
                                html.push(style.keys.join(str) + str);
                            }
                        }
                    }

                    mergeStyleSheet();

                    $style = $(STYLE_TEMP.replace(/_content_/, html.join('')));
                    $style.appendTo($body);

                    if (global.aweb.log) {
                        console.log('刷新页面%d次', ++times);
                    }
                },
                mergeStyleSheet = function () {
                    var style, link,
                        styleTextList=[],
                        linkTextList=[],
                        i, content,
                        body;

                    //仅仅用于IE
                    if (IN_IE) {
                        style = document.getElementsByTagName('style');
                        link = document.getElementsByTagName('link');


                        if (style.length + link.length > STYLE_TAG_LENGTH) {
                            //把style标签中的样式存入，然后删掉该标签，但保留第一个
                            //因为由getElementsByTagName方法返回值是nodeList，所以删除时循环用倒序
                            for (i = style.length; ~--i;) {

                                if (style.id !== STYLE_TEMP_ID) {
                                    content = style[i];
                                    styleTextList.push(content.innerHTML);
                                    content.parentNode.removeChild(content);
                                }
                            }

                            //在IE中只有在31之内的link标签才能通过其styleSheet.cssText获取样式
                            //无法的获取复制到一个数组aCloneLink中
                            for (i = link.length; ~--i;) {
                                content = link[i];

                                if (content.getAttribute && content.getAttribute('rel') === 'stylesheet') {
                                    if (content.styleSheet) {
                                        styleTextList.push(content.styleSheet.cssText);
                                    } else {
                                        linkTextList.push(content.cloneNode(true));
                                    }

                                    if (i) {
                                        content.parentNode.removeChild(content);
                                    }
                                }
                            }

                            body = $body[0];

                            //通过前面的删除，前31个link或者style标记最多只剩下2个
                            //通过重新增加link节点的方法激活其styleSheet属性，从而获取样式
                            for (i = linkTextList.length; --i;) {
                                content = linkTextList[i];
                                body.appendChild(content);
                                styleTextList.push(content.styleSheet.cssText);
                                body.removeChild(content);
                            }

                            $body.append('<style type="text/css">' + styleTextList.reverse().join('') + '</style>');

                            global.CollectGarbage();
                        }
                    }
                };

            return function (select, $selector, content, pseudo, isBrother) {
                if (content) {
                    setTimeout(function () {
                        var str = JSON.stringify(content || {})
                            //IE Filter first !!!
                                .replace(/"(progid[^"]+)"/g, function (str, match) {
                                    return '__IE_FILTER__' + match.replace(/,/g, '##IEDIVIDER##') + '__IE_FILTER__"';//注意这里要多个"
                                })
                                //remove undefined
                                .replace(/,[^:]+:"undefined"/g, '')
                                .replace(/\b[^:]+:"undefined",/g, '')

                                //replace ,"-->;
                                .replace(/",(")?/g, '";$1')
                                .replace(/":(\d+),/g, '":$1;')
                                .replace(/"/g, '')

                                //resume
                                .replace(/__IE_FILTER__[^_]+__IE_FILTER__/g, function (str, match) {
                                    return str
                                        .replace('__IE_FILTER__', '')
                                        .replace(/##IEDIVIDER##/, 'g')
                                        .replace('__IE_FILTER__', '');

                                }),
                            style, className,
                            key,hasSameStyle=false;

                        if (str !== '{}') {
                            if (!(style = cache[str])) {
                                style = cache[str] = {
                                    name: 'aw' + (++accumulator).toString(36),
                                    map: {},
                                    keys: []
                                }
                            }else{
                                hasSameStyle = true;
                            }
                            className = style.name;
                            key = '.' + className + (isBrother ? '' : ' ') + select + pseudo;


                            if (!conflictMap[key] && !hasSameStyle) {
                                conflictMap[key] = str;
                            } else if (conflictMap[key] !== str) {
                                className = 'aw-' + app.getUID().substr(0, 16);
                                key = '.' + className + (isBrother ? '' : ' ') + select + pseudo;

                                conflictMap[key] = str;
                            }


                            $selector.addClass(className);

                            if (!style.map[key]) {
                                style.map[key] = true;
                                style.keys.push(key);

                                clearTimeout(delayHandler);
                                delayHandler = setTimeout(delayRender, PAGE_TIMEOUT);
                            }
                        }
                    }, WIDGTE_TIMEOUT);
                }
            };
        }()),
		transformThemeVariables: function (variables) {
			var data = {};
			if (variables) {
				$.each(variables, function (index, elem) {
					if (elem.name && elem.desp) {
						var key = '@' + elem.name,
							obj = {
								desp: elem.desp,
								name: key
							}, css;
						if (typeof elem.cssAttrs === 'string') {
							css = elem.cssAttrs.split(" ");
						} else {
							css = elem.cssAttrs;
						}
						$.each(css, function (idx, c) {
							(data[c] || (data[c] = [])).push(obj);
						});
						data[key] = elem.defaultValue;
					}
				});
			}
			return data;
		},
		fresher: {
			variablesCopy: {},
			theme: {},
			timeout: 100
		},
		data: {},
		layout: {},
		component: {},
		ctn: {},
		custom: {},
		frame: {},
		viewer: {
			nsl: {}
		},
		package: {},
		mobile: {},


        STATUS: {
            RESUME: 'resume',
            WIDGET_INIT:'widget_init',
            WIDGET_APPEND: 'widget_append',
            WIDGET_DELETE: 'widget_delete',
            WIDGET_UPDATE: 'widget_update',
            EVENT_APPEND: 'event_append',
            EVENT_DELETE: 'event_delete',
            EVENT_UPDATE: 'event_update',
            LIFECYCLE_APPEND: 'lifecycle_append',
            LIFECYCLE_DELETE: 'lifecycle_delete',
            LIFECYCLE_UPDATE: 'lifecycle_update',
            WIDGET_NAME:'widget_name',
            CSS_UPDATE:'css_update'
        },

		on:function(){
			dispatcher.on.apply(dispatcher,arguments);
            return this;
		},
		trigger:function(){
			dispatcher.trigger.apply(dispatcher,arguments);
		},
		off:function () {
            dispatcher.off.apply(dispatcher,arguments);
            return this;
        }
	};

	return widget;
});