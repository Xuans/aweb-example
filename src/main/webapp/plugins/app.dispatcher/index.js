(function () {
    var Event = function (timeout) {

        this.timeout = timeout;
        this.cache = {};
        this.delayHandler = {};
    };

    Event.prototype = {
        constructor: Event,
        //事件监听
        // cache: {},
        // delayHandler: {},
        //timeout:100,
        // $AW.on({
        //  'type1.namespace1.namespace2':callback1,
        //  'type2.namespace1.namespace2':callback2,
        // });
        // $AW.on('type1.namespace1.namespace2,type2.namespace1.namespace2',callback);
        // $AW.on('type1','namespace',callback);
        on: (function () {

            var context,
                method = {
                    '1': function (obj) {
                        var k, v, p;

                        for (k in obj) {
                            if (obj.hasOwnProperty(k)) {
                                v = obj[k];
                                p = k.split('.');

                                method['3'](p[0], p.slice(1, p.length).join('.'), v);
                            }
                        }
                    },
                    '2': function (type, callback) {
                        var types = type.split(','),
                            i, p;

                        for (i = types.length; type = types[--i];) {

                            p = type.split('.');

                            method['3'](p[0], p.slice(1, p.length).join('.'), callback);
                        }
                    },
                    '3': function (type, namespace, callback) {
                        var event;

                        event = (context.cache[type] || (context.cache[type] = []));
                        namespace = namespace || '';

                        if ($.isFunction(callback)) {
                            event.push({
                                callback: callback,
                                namespace: namespace || ''
                            });
                        }
                    }
                };

            return function () {
                context = this;

                method[arguments.length].apply(this, arguments);
            };
        }()),
        //$AW.off('type1.namespace1.namespace2,type2.namespace1.namespace2,');
        off: (function () {
            var removeCallbackByNamespace = function (events, namespace) {
                var j, event;

                for (j = events.length; event = events[--j];) {
                    if (event.namespace.indexOf(namespace) !== -1) {
                        events.splice(j, 1);
                        break;
                    }
                }
            };

            return function (type) {
                var types, key,
                    p, i, namespace;

                if (type) {
                    types = type.split(',');

                    for (i = types.length; type = types[--i];) {
                        p = type.split('.');

                        namespace = p.slice(1, p.length).join('.') || '';
                        type = p[0];

                        if (!type) {
                            for (key in this.cache) {
                                if (this.cache.hasOwnProperty(key)) {
                                    if (namespace) {
                                        removeCallbackByNamespace(this.cache[key] || [], namespace);
                                    } else {
                                        delete this.cache[key];
                                    }
                                }
                            }
                        } else {
                            if (namespace) {
                                removeCallbackByNamespace(this.cache[type] || [], namespace);
                            } else {
                                delete this.cache[type];
                            }
                        }
                    }
                } else {
                    this.cache = {};
                }
            }
        }()),
        dispatchEvent: function (type) {
            var types, i,
                props,
                namespaces, namespace, k, matchNamespace,
                events, event, j,
                args = arguments;

            if (type) {
                types = type.split(',');

                for (i = types.length; type = types[--i];) {
                    props = type.split('.');

                    namespaces = props.slice(1, props.length) || [];
                    type = props[0];
                    events = this.cache[type] || [];

                    if (namespaces.length) {

                        for (j = events.length; event = events[--j];) {
                            matchNamespace = true;

                            for (k = namespaces.length; namespace = namespaces[--k];) {
                                if (event.namespace.indexOf(namespace) === -1) {
                                    matchNamespace = false;
                                    break;
                                }
                            }

                            if (matchNamespace) {
                                event.callback.apply(event, args);
                            }
                        }
                    } else {
                        for (j = events.length; event = events[--j];) {
                            event.callback.apply(event, args);
                        }
                    }
                }
            }
        },
        //$AW.trigger('type1.namespace1.namespace2,type2.namespace1.namespace2,');
        trigger: function (type) {
            var context = this,
                args = arguments;

            if (this.timeout) {
                window.clearTimeout(this.delayHandler[type]);
                this.delayHandler[type] = window.setTimeout(function () {
                    context.dispatchEvent.apply(context, args);
                }, this.timeout);
            } else {
                context.dispatchEvent.apply(context, args);
            }
        }
    };

    return function (timeout) {
        return new Event(timeout);
    };
});
