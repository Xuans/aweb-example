(function () {
    var Performance = function () {
        },
        vendors = ['webkit', 'moz'],
        requestAnimationFrame = window.requestAnimationFrame,
        cancelAnimationFrame = cancelAnimationFrame,
        setTimeout = window.setTimeout,
        clearTimeout = window.clearTimeout;

    for (var x = 0; x < vendors.length && !requestAnimationFrame; ++x) {
        requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!requestAnimationFrame) {
        requestAnimationFrame = setTimeout;
    }
    if (!cancelAnimationFrame) {
        cancelAnimationFrame = clearTimeout;
    }

    Performance.prototype = {
        constructor: Performance,

        id: 'performanceDelayId',

        timeout: 220,
        frequency: 16.7,

        longDelay: function (callback) {
            var id;

            if ($.isFunction(callback)) {
                if (id = callback[this.id]) {
                    clearTimeout(id);
                    cancelAnimationFrame(id);
                }

                id = callback[this.id] = setTimeout(function () {
                    clearTimeout(id);
                    callback();
                }, this.timeout);
            }


        },
        shortDelay: function (callback) {
            var id;

            if ($.isFunction(callback)) {
                if (id = callback[this.id]) {
                    clearTimeout(id);
                    cancelAnimationFrame(id);
                }

                id = callback[this.id] = requestAnimationFrame(function () {
                    cancelAnimationFrame(id);

                    callback();

                }, this.frequency);
            }
        },
        setTimeout: function (timeout) {
            this.timeout = timeout;
        },
        getTimeout: function () {
            return this.timeout;
        },
        setFrequency: function (frequency) {
            this.frequency = frequency;
        },
        getFrequency: function () {
            return this.frequency;
        }
    };

    return new Performance();
})