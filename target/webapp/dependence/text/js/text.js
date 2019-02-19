!function () {
    var e = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"], t = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, n = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im, r = "undefined" != typeof location && location.href, a = r && location.protocol && location.protocol.replace(/\:/, ""), i = r && location.hostname, o = r && (location.port || void 0), s = [];
    define(function () {
        var u, p, l;
        return "undefined" != typeof window && window.navigator && window.document ? p = function (e, t) {
            var n = u.createXhr();
            n.open("GET", e, !0), n.onreadystatechange = function (e) {
                if(4 === n.readyState && n.status < 400 ){
                    t(n.responseText);
                }else{
                    if(4 === n.readyState){
	                    app && app.alert && (app.alert("页面请求错误，错误信息：" + n.status + n.statusText + "，URL：" + n.responseURL, app.alert.ERROR));
	                    app.shelter && app.shelter.hideAll();
                    }
                }
            }, n.send(null)
        } : "undefined" != typeof process && process.versions && process.versions.node ? (l = require.nodeRequire("fs"), p = function (e, t) {
            t(l.readFileSync(e, "utf8"))
        }) : "undefined" != typeof Packages && (p = function (e, t) {
            var n, r, a = "utf-8", i = new java.io.File(e), o = java.lang.System.getProperty("line.separator"), s = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(i), a)), u = "";
            try {
                for (n = new java.lang.StringBuffer, r = s.readLine(), r && r.length() && 65279 === r.charAt(0) && (r = r.substring(1)), n.append(r); null !== (r = s.readLine());)n.append(o), n.append(r);
                u = String(n.toString())
            } finally {
                s.close()
            }
            t(u)
        }), u = {
            version: "1.0.2", strip: function (e) {
                if (e) {
                    e = e.replace(t, "");
                    var r = e.match(n);
                    r && (e = r[1])
                } else e = "";
                return e
            }, jsEscape: function (e) {
                return e.replace(/(['\\])/g, "\\$1").replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r")
            }, createXhr: function () {
                var t, n, r;
                if ("undefined" != typeof XMLHttpRequest)return new XMLHttpRequest;
                for (n = 0; n < 3; n++) {
                    r = e[n];
                    try {
                        t = new ActiveXObject(r)
                    } catch (a) {
                    }
                    if (t) {
                        e = [r];
                        break
                    }
                }
                if (!t)throw new Error("createXhr(): XMLHttpRequest not available");
                return t
            }, get: p, parseName: function (e) {
                var t = !1, n = e.indexOf("."), r = e.substring(0, n), a = e.substring(n + 1, e.length);
                return n = a.indexOf("!"), n !== -1 && (t = a.substring(n + 1, a.length), t = "strip" === t, a = a.substring(0, n)), {
                    moduleName: r,
                    ext: a,
                    strip: t
                }
            }, xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/, useXhr: function (e, t, n, r) {
                var a, i, o, s = u.xdRegExp.exec(e);
                return !s || (a = s[2], i = s[3], i = i.split(":"), o = i[1], i = i[0], !(a && a !== t || i && i !== n || (o || i) && o !== r))
            }, finishLoad: function (e, t, n, r, a) {
                n = t ? u.strip(n) : n, a.isBuild && (s[e] = n), r(n)
            }, load: function (e, t, n, s) {
                if (s.isBuild && !s.inlineText)return void n();
                var p = u.parseName(e), l = p.moduleName + "." + p.ext, c = t.toUrl(l), f = s && s.text && s.text.useXhr || u.useXhr;
                !r || f(c, a, i, o) ? u.get(c, function (t) {
                    u.finishLoad(e, p.strip, t, n, s)
                }) : t([l], function (e) {
                    u.finishLoad(p.moduleName + "." + p.ext, p.strip, e, n, s)
                })
            }, write: function (e, t, n, r) {
                if (t in s) {
                    var a = u.jsEscape(s[t]);
                    n.asModule(e + "!" + t, "define(function () { return '" + a + "';});\n")
                }
            }, writeFile: function (e, t, n, r, a) {
                var i = u.parseName(t), o = i.moduleName + "." + i.ext, s = n.toUrl(i.moduleName + "." + i.ext) + ".js";
                u.load(o, n, function (t) {
                    var n = function (e) {
                        return r(s, e)
                    };
                    n.asModule = function (e, t) {
                        return r.asModule(e, s, t)
                    }, u.write(e, o, n, a)
                }, a)
            }
        }
    })
}();