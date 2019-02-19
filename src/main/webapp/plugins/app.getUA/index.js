(function () {
    var TYPE = {
            WEIXIN_IPAD: 'weixin iPad',
            WEIXIN_IPHONE: 'weixin iPhone',
            WEIXIN_ANDROID_PHONE: 'weixin androidPhone',
            WEIXIN_ANDROID_PAD: 'weixin androidPad',

            ALIPAY_IPAD: 'Alipay iPad',
            ALIPAY_IPHONE: 'Alipay iPhone',
            ALIPAY_ANDROID_PHONE: 'Alipay androidPhone',
            ALIPAY_ANDROID_PAD: 'Alipay androidPad',

            //手机网页
            IPHONE: 'iPhone',
            IPAD: 'iPad',
            ANDROID_PHONE: 'androidPhone',
            ANDROID_PAD: 'androidPad',

            //PC浏览器
            MSIE: 'IE6~10' || 'Ionic IE6~10',//考虑在本地IE浏览器运行时的情况
            IE11: 'IE11' || 'Ionic IE11', //考虑在本地IE11浏览器运行时的情况
            MICROSOFT_EDGE: 'Edge' || 'Ionic Edge',//考虑在本地Edge浏览器运行时的情况
            PC_NOT_IE: 'PC' || 'Ionic',//考虑在本地浏览器运行时的情况


            //类似于Ionic在本地搭建服务器的APP
            IONIC_IPAD: 'Ionic iPad',
            IONIC_IPHONE: 'Ionic iPhone',
            IONIC_ANDROID_PHONE: 'Ionic androidPhone',
            IONIC_ANDROID_PAD: 'Ionic androidPad',

            //类似于cordova的本地APP
            CORDOVA_IPAD: 'Cordova iPad',
            CORDOVA_IPHONE: 'Cordova iPhone',
            CORDOVA_ANDROID_PHONE: 'Cordova androidPhone',
            CORDOVA_ANDROID_PAD: 'Cordova androidPad'

        },
        config = [
            /* {  name: 'android',
             reg: /android/i
             },
             {
             name: 'ios',
             reg: /\(i[^;]+;( U;)? CPU.+Mac OS X/i
             },*/
            //环境
            {
                name: 'Cordova',
                reg: /^file/i
            },
            {
                name: 'Ionic',
                reg: /^http:\/\/localhost:8080/i
            },
            {
                name: 'weixin',
                reg: /MicroMessenger/i
            },
            {
                name: 'Alipay',
                reg: /Alipay/i
            },
            /*{
             name:'MQQBrower',
             reg:/MQQBROWSER/i
             },
             {
             name:'UC Browser',
             reg:/UCWEB/i
             },*/

            //设备
            {
                name: 'androidPhone',
                reg: /^(?=.*(Android))(?=.*(Mobile)).+$/i
            },
            {
                name: 'androidPad',
                reg: /^(?=.*(Android))(?!.*(Mobile)).+$/i
            },
            {
                name: 'iPad',
                reg: /iPad/i
            },
            {
                name: 'iPhone',
                reg: /iPhone/i
            },
            //浏览器
            {
                name: 'IE6~10',
                reg: /MSIE/i
            },
            {
                name: 'IE11',
                reg: /Trident\/7\.0/i
            },
            {
                name: 'Edge',
                reg: /Edge/i
            }

        ],

        len = config.length,


        getUAFunc = function () {
            var
                UA = navigator.userAgent,
                url = document.URL,
                result = [],
                item, reg, k;

            if (UA && url) {

                for (k = 0; k < len; k++) {
                    if ((item = config[k]) && (reg = item.reg) && reg.test(UA)) {
                        result.push(item.name);
                    }
                }
            }
            result = (result.length ? result.join(' ') : TYPE.PC_NOT_IE);
            return result
        };
    getUAFunc.TYPE = TYPE;


    return getUAFunc
});
