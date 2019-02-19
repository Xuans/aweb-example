"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const gulp = require("gulp");
const less = require("gulp-less");
const watch = require("gulp-watch");
const plumber = require("gulp-plumber");
const fs = require("fs");
const path = require("path");
const node_fetch_1 = require("node-fetch");
const nodemodules = `${__dirname}/node_modules`;
let staticExtname = '*(svg|eot|ttf|woff|woff2|gif|png|jpg|jpeg)', config = {
    init: {
        plugins: {
            source: ['node_modules/@aweb-plugins/**/*'],
            dest: 'src/main/webapp/plugins',
            tips: 'plugins node_modules拷贝src'
        },
        aweb: {
            source: ['node_modules/@aweb-template/AWEB/**/*', '!node_modules/@aweb-template/AWEB/**/package.json'],
            dest: 'src/main/webapp/dependence/AWEB',
            _dest: 'target/webapp/dependence/AWEB',
            tips: '拷贝AWEB文件到src'
        },
        editor: {
            source: ['node_modules/@aweb-template/editor/**/*', '!node_modules/@aweb-template/editor/**/package.json'],
            dest: 'src/main/webapp/',
            tips: '拷贝AUI编辑器文件'
        },
        img: {
            source: ['node_modules/@aweb-template/img/**/*', '!node_modules/@aweb-template/img/**/package.json'],
            dest: 'src/main/webapp/img',
            tips: '拷贝img文件'
        },
        bootloaderTemplate: {
            source: ['node_modules/@aweb-template/bootloaderTemplate/bootloaderTemplate.js'],
            dest: 'src/main/webapp/',
            tips: '拷贝bootloaderTemplate文件'
        },
        components: {
            source: ['node_modules/@aweb-components/**/*', '!node_modules/@aweb-components/**/*.json'],
            dest: 'target/webapp/dependence',
            tips: '拷贝@aweb-components文件'
        },
        lib: {
            source: ['node_modules/@aweb-lib/**/*', '!node_modules/@aweb-lib/**/*.json'],
            dest: 'target/webapp/dependence',
            tips: '拷贝@aweb-lib文件'
        },
        webpackConfig: {
            source: ['node_modules/@aweb-template/webpackConfig/webpack.config.js'],
            dest: './',
            tips: '拷贝webpack.config.js文件'
        },
        dict: {
            source: ['node_modules/@aweb-initApp/datadict/**/*.dict'],
            dest: 'src/main/datadict/',
            tips: '拷贝数据字典文件'
        },
        java: {
            source: ['node_modules/@aweb-initApp/java/**/*', '!node_modules/@aweb-initApp/java/**/package.json'],
            dest: 'src/main/java/cn/com/agree/aweb/',
            tips: '拷贝java服务'
        },
        pomX: {
            source: ['node_modules/@aweb-initApp/pomX/pom.xml'],
            dest: './',
            tips: 'maven 配置'
        },
        resources: {
            source: ['node_modules/@aweb-initApp/resources/**/*', '!node_modules/@aweb-initApp/resources/**/package.json'],
            dest: 'src/main/resources',
            tips: '资源配置'
        },
        sql: {
            source: ['node_modules/@aweb-initApp/sql/**/*', '!node_modules/@aweb-initApp/sql/**/package.json'],
            dest: 'src/main/resources',
            tips: '初始化脚本'
        },
        webXml: {
            source: ['node_modules/@aweb-initApp/webXml/**/*', '!node_modules/@aweb-initApp/webXml/**/package.json'],
            dest: 'src/main/webapp/WEB-INF',
            tips: '初始化web.xml'
        },
    },
    js: [{
            source: ['node_modules/@aweb-lib/**/*.js'],
            dest: 'target/webapp/dependence/',
            watch: ['node_modules/@aweb-lib/**/*.js'],
            tips: 'AWEB lib依赖库代码'
        },
        {
            source: ['node_modules/@aweb-components/**/*.js'],
            dest: 'target/webapp/dependence/',
            watch: ['node_modules/@aweb-components/**/*.js'],
            tips: 'AWEB 组件js代码'
        },
        {
            source: ['src/main/webapp/module/**/*.js'],
            dest: 'target/webapp/module/',
            watch: ['src/main/webapp/module/**/*.js'],
            tips: 'AUI module js代码'
        },
        {
            source: ['src/main/webapp/dependence/**/*.js', '!src/main/webapp/dependence/**/aweb.api.js', '!src/main/webapp/dependence/**/aweb.config.js'],
            dest: 'target/webapp/dependence/',
            watch: ['src/main/webapp/dependence/**/*.js', '!src/main/webapp/dependence/**/aweb.api.js', '!src/main/webapp/dependence/**/aweb.config.js'],
            tips: 'AUI dpendence js代码'
        }
    ],
    css: [
        {
            source: [
                'node_modules/@aweb-lib/**/*.css'
            ],
            dest: 'target/webapp/dependence/',
            watch: [
                'node_modules/@aweb-lib/**/*.css'
            ],
            tips: '@aweb-lib css 样式'
        },
        {
            source: [
                'node_modules/@aweb-components/**/*.css'
            ],
            dest: 'target/webapp/dependence/',
            watch: [
                'node_modules/@aweb-components/**/*.css'
            ],
            tips: '@aweb-components css 样式'
        },
        {
            source: [
                'src/main/webapp/dependence/**/*.css'
            ],
            dest: 'target/webapp/dependence/',
            watch: [
                'src/main/webapp/dependence/**/*.css'
            ],
            tips: 'src/main/webapp/dependence/下 css样式'
        }
    ],
    less: [{
            source: [
                'node_modules/@aweb-lib/**/*.less'
            ],
            dest: 'target/webapp/dependence/',
            watch: [
                'node_modules/@aweb-lib/**/*.less'
            ],
            tips: '@aweb-lib less 样式'
        },
        {
            source: [
                'node_modules/@aweb-components/**/*.less'
            ],
            dest: 'target/webapp/dependence/',
            watch: [
                'node_modules/@aweb-components/**/*.less'
            ],
            tips: '@aweb-components less 样式'
        },
        {
            source: [
                'src/main/webapp/dependence/**/*.less'
            ],
            dest: 'target/webapp/dependence/',
            watch: [
                'src/main/webapp/dependence/**/*.less'
            ],
            tips: 'src/main/webapp/dependence/下 less样式'
        }],
    static: [{
            source: [
                `node_modules/@aweb-lib/**/*.${staticExtname}`,
                `node_modules/@aweb-components/**/*.${staticExtname}`,
                `src/main/webapp/dependence/**/*.${staticExtname}`,
                `src/main/webapp/dependence/module/**/*.html`,
            ],
            dest: 'target/webapp/dependence/',
            watch: [
                `node_modules/@aweb-lib/**/*.${staticExtname}`,
                `node_modules/@aweb-components/**/*.${staticExtname}`,
                `src/main/webapp/dependence/**/*.${staticExtname}`,
                `src/main/webapp/dependence/module/**/*.html`,
            ],
            tips: '静态资源和HTML文件'
        }, {
            source: [
                `src/main/webapp/module/**`,
                `!src/main/webapp/module/**/*.awb`
            ],
            dest: 'target/webapp/module',
            watch: [
                `src/main/webapp/module/**`,
                `!src/main/webapp/module/**/*.awb`
            ],
            tips: 'HTML文件和MVVM.json'
        },
        {
            source: [
                `src/main/webapp/img/**/*`
            ],
            dest: 'target/webapp/img',
            watch: [
                `src/main/webapp/img/**/*`
            ],
            tips: '图片'
        },
    ],
    compileBootloader: {
        source: [
            `package.json`
        ],
        watch: [
            `package.json`
        ]
    },
    plugins: {
        source: `${__dirname}/src/main/webapp/plugins/`,
        watch: [`${__dirname}/src/main/webapp/plugins/**/*`],
        dest: `${__dirname}/src/main/webapp/dependence/AWEB/js`,
        _dest: `${__dirname}/target/webapp/dependence/AWEB/js`,
        tips: '初始化plugins index.js文件'
    },
    nsl: {
        source: `${__dirname}/src/main/webapp/config/国际化配置.fbcpt`,
        dest: `${__dirname}/target/webapp/NSL/`,
        watch: `src/main/webapp/config/国际化配置.fbcpt`,
        tips: '国际化配置'
    }
}, isWatch = false, initTask = [];
const showFinishText = (tips) => {
    console.log(`${(new Date()).toLocaleString()}:\t编译（${tips}）完成！`);
};
const showErrorText = (error) => {
    console.log(error.message);
};
const mkdir = (dir) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
const readdir = (file) => {
    return new Promise((resolve, reject) => {
        fs.readdir(file, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};
const readFile = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};
const stat = (file) => {
    return new Promise((resolve, reject) => {
        fs.stat(file, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};
const writeFile = (file, data) => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            fs.writeFile(file, data, 'utf8', (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        }
        catch (e) {
        }
    }));
};
const getLibComponentsDeps = (targetPath, dep) => {
    let result = [];
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            let itemPath = yield readdir(targetPath);
            for (let i = -1, item; item = itemPath[++i];) {
                let packagePath = `${targetPath}/${item}/package.json`;
                if (fs.existsSync(packagePath)) {
                    let data = yield readFile(packagePath), temp = {};
                    data = JSON.parse(data.toString());
                    if (data.main) {
                        temp.name = item;
                        // let map: any = {};
                        // map[item] = `${item}/${data.main}`;
                        temp.paths = {
                            // name:item,
                            [item]: `${item}/${data.main}`
                        };
                    }
                    if (data.exports) {
                        temp.exports = data.exports;
                    }
                    if (dep && data.dependencies) {
                        let dependencies = Object.keys(data.dependencies);
                        if (dependencies.length) {
                            let depStr = dependencies.join(',');
                            depStr = depStr.replace(/(?:[,]+\@aweb-template[^,]+)|(?:\@aweb-lib\/)|(?:\@aweb-components\/)|(?:\@aweb-plugins\/)/gi, '');
                            temp.deps = depStr.split(',');
                        }
                    }
                    if (data.cssDeps) {
                        temp.cssMap = data.cssDeps;
                    }
                    result.push(temp);
                }
            }
            resolve(result);
        }
        catch (error) {
            reject(error);
        }
    }));
};
const getAwebPath = (targetPath, parentPath) => __awaiter(this, void 0, void 0, function* () {
    let result = [];
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (fs.existsSync(targetPath)) {
                let dir = yield readdir(targetPath);
                for (let i = -1, item; item = dir[++i];) {
                    let subPath = `${targetPath}/${item}`;
                    if ((yield stat(subPath)).isFile()) {
                        if (path.extname(subPath) === '.css') {
                            // let css: any = {};
                            // css[`${parentPath}/${item}`] = `${parentPath}/${item}`
                            result.push({
                                cssMap: {
                                    [`${parentPath}/${item}`]: `${parentPath}/${item}`
                                }
                            });
                        }
                        if (path.extname(subPath) === '.js') {
                            let name = path.basename(subPath, '.js');
                            // let temp: any = {};
                            // temp.name = name
                            // temp[name] = `${parentPath}/${item}`;
                            result.push({
                                name: name,
                                paths: {
                                    [name]: `${parentPath}/${item}`
                                }
                            });
                        }
                    }
                }
            }
            resolve(result);
        }
        catch (error) {
            reject(error);
            console.log(error);
        }
    }));
});
const initBootloader = (initBooloaderJs) => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            let result = [];
            let componentsResult = yield getLibComponentsDeps(`${nodemodules}/@aweb-components`);
            let libsResult = yield getLibComponentsDeps(`${nodemodules}/@aweb-lib`, true);
            let cssResult = yield getAwebPath(`${nodemodules}/@aweb-template/AWEB/css`, 'AWEB/css');
            //    let jsResult:any= await getAwebPath(`${nodemodules}/@aweb-template/AWEB/js`,'AWEB/js');
            result = [...componentsResult, ...libsResult, ...cssResult];
            let booloaderJson = {
                shim: {
                    awebApi: {
                        "deps": ["jquery"]
                    }
                },
                paths: {
                    "awebIndex": "module/index/index",
                    "awebFresher": "AWEB/js/aweb.fresher",
                    "awebEnvironment": "AWEB/js/aweb.environment",
                    "awebApi": "AWEB/js/aweb.api",
                    "awebDependence": "AWEB/js/aweb.dependence",
                },
                css: [],
                cssMap: {}
            };
            for (let i = -1, item; item = result[++i];) {
                if (item.cssMap) {
                    booloaderJson.cssMap = Object.assign({}, booloaderJson.cssMap, item.cssMap);
                }
                if (item.paths) {
                    booloaderJson.paths = Object.assign({}, booloaderJson.paths, item.paths);
                }
                if (item.exports) {
                    let shimItem = booloaderJson.shim[item.name];
                    shimItem = shimItem || {};
                    shimItem.exports = item.exports;
                    booloaderJson.shim[item.name] = shimItem;
                }
                if (item.deps) {
                    let shimItem = booloaderJson.shim[item.name];
                    shimItem = shimItem || {};
                    shimItem.deps = item.deps;
                    booloaderJson.shim[item.name] = shimItem;
                }
            }
            booloaderJson.css = Object.keys(booloaderJson.cssMap);
            //生成bootloader.json
            yield writeFile(`${__dirname}/src/main/webapp/bootloader.json`, JSON.stringify(booloaderJson, null, 4));
            //生成bootloader.js
            if (initBooloaderJs) {
                let bootloaderTempData = yield readFile(`${__dirname}/src/main/webapp/bootloaderTemplate.js`);
                let firstIndex = bootloaderTempData.indexOf('/*config*/');
                let lastIndex = bootloaderTempData.lastIndexOf('/*config*/');
                let booloaderJsonS = {
                    "awebApi": {
                        name: 'awebApi',
                        path: 'dependence/AWEB/js/aweb.api',
                        deps: ['jquery']
                    },
                    "awebEnvironment": {
                        name: 'awebEnvironment',
                        path: 'dependence/AWEB/js/aweb.environment'
                    },
                    "awebFresher": {
                        name: 'awebEnvironment',
                        path: 'dependence/AWEB/js/aweb.fresher'
                    },
                    "awebIndex": {
                        name: 'awebIndex',
                        path: 'module/index/index'
                    }
                };
                result.map((item) => {
                    if (item.name) {
                        let pathC = item.paths[item.name];
                        booloaderJsonS[item.name] = {
                            name: item.name,
                            path: 'dependence/' + pathC
                        };
                        item.exports && (booloaderJsonS[item.name]['exports'] = item.exports);
                        item.deps && (booloaderJsonS[item.name]['deps'] = item.deps);
                    }
                });
                booloaderJsonS = JSON.stringify(booloaderJsonS, null, 4);
                bootloaderTempData = bootloaderTempData.slice(0, firstIndex) + booloaderJsonS.slice(1, booloaderJsonS.length - 1) + bootloaderTempData.slice(lastIndex);
                bootloaderTempData = bootloaderTempData.replace('__CSS_CONFIG_MAP__', `${JSON.stringify(booloaderJson.cssMap, null, 4)}`);
                yield writeFile(`${__dirname}/target/webapp/bootloader.js`, bootloaderTempData);
                showFinishText('生成bootloaderJs');
            }
            showFinishText('生成bootloaderJson');
            resolve();
        }
        catch (error) {
            reject(error);
            console.log(error);
        }
    }));
};
const initPluginsIndex = () => __awaiter(this, void 0, void 0, function* () {
    let pluginsPath = `${__dirname}/src/main/webapp/plugins`, appInterfaces = [], appInterfacesConst = [], interfacesMap = {}, interfacesMapItem, apiEntry = [];
    try {
        if (fs.existsSync(pluginsPath)) {
            let files = yield readdir(pluginsPath);
            let itemPath = files.map((item) => {
                return `${pluginsPath}/${item}`;
            });
            for (let i = -1, item; item = itemPath[++i];) {
                if ((yield stat(item)).isDirectory()) {
                    let packagePath = `${item}/package.json`;
                    if (fs.existsSync(packagePath)) {
                        let data = yield readFile(packagePath), datac = JSON.parse(data), docs = datac.docs, category = datac.category;
                        //常量
                        if (datac.const) {
                            appInterfacesConst = [...appInterfacesConst, ...datac.const];
                        }
                        if (interfacesMapItem = interfacesMap[category]) {
                            interfacesMap[category].children = [...interfacesMapItem.children, docs];
                        }
                        else {
                            interfacesMap[category] = { desp: category, children: [docs] };
                        }
                        apiEntry = [...apiEntry, `require('${datac.name}');`];
                    }
                }
            }
            yield writeFile(`${__dirname}/src/main/webapp/plugins/index.js`, apiEntry.join('\n').replace(/@aweb-plugins\//g, ""));
            for (let key in interfacesMap) {
                appInterfaces.push(interfacesMap[key]);
            }
            yield writeFile(`${__dirname}/src/main/webapp/dependence/AWEB/js/aweb.api.config.js`, `define(["jquery"], function ($) {  return {
                     appInterfaces:${JSON.stringify(appInterfaces)},
                     appInterfacesConst:${JSON.stringify(Array.from(new Set(appInterfacesConst)))}
                 }})`);
            showFinishText('拷贝plugins');
        }
        else {
        }
    }
    catch (error) {
        showErrorText(error);
    }
});
const runLess = (item) => {
    return () => {
        try {
            var pipe = gulp.src(item.source, { allowEmpty: true }).pipe(plumber()).pipe(less());
            pipe.pipe(gulp.dest(item.dest));
            showFinishText(item.tips);
        }
        catch (error) {
            showErrorText(error);
        }
    };
};
const run = (item, resolve) => {
    return () => {
        try {
            var pipe = gulp.src(item.source, { allowEmpty: true });
            pipe = pipe.pipe(gulp.dest(item.dest));
            if (item._dest) {
                pipe = pipe.pipe(gulp.dest(item._dest));
            }
            pipe.on('end', () => {
                showFinishText(item.tips);
                resolve && resolve();
            });
        }
        catch (error) {
            showErrorText(error);
        }
    };
};
const runNsl = (item) => {
    return () => __awaiter(this, void 0, void 0, function* () {
        try {
            let source = item.source, nslData, nslDataJ, property, lang, langMap = {};
            nslData = yield readFile(source);
            nslDataJ = JSON.parse(nslData);
            property = nslDataJ.property;
            lang = nslDataJ.lang;
            lang.map((item) => {
                langMap[`${item.name}`] = {};
            });
            for (let i = -1, item; item = property[++i];) {
                let key = item.key, value = item.value;
                for (let _i in value) {
                    if (langMap.hasOwnProperty(_i) && langMap[_i]) {
                        langMap[_i][key] = value[_i];
                    }
                }
            }
            if (!fs.existsSync(item.dest)) {
                yield mkdir(item.dest);
            }
            for (let key in langMap) {
                yield writeFile(`${item.dest}nsl_${key}.json`, JSON.stringify(langMap[key], null, 4));
            }
            showFinishText(item.tips);
        }
        catch (error) {
            showErrorText(error);
        }
    });
};
const runPlugins = (item) => {
    // let webpackConfig = require('./webpack.config.js');
    return () => __awaiter(this, void 0, void 0, function* () {
        try {
            let target = item.source, dir = yield readdir(target), jsContent = [], requireApp = [], constMap = {}, interfacesMap = {}, intefacesCategoryMap = {}, appInterfacesConst = [], appInterfaces;
            dir = dir.map((item) => {
                return `${target}/${item}`;
            });
            for (let i = -1, item; item = dir[++i];) {
                if ((yield stat(item)).isDirectory()) {
                    let packagePath = `${item}/package.json`;
                    if (fs.existsSync(packagePath)) {
                        let data = yield readFile(packagePath), dataC = JSON.parse(data), main = dataC.main, docs = dataC.docs, appName = `app.${docs.name}`, category = dataC.category, dependencies = [], content = yield readFile(`${item}/${main}`);
                        if (docs) {
                            if (typeof eval(content) === 'function') {
                                content = (eval(content)).toString();
                                if ((docs.belongTo === 'class' || docs.belongTo === 'closure') && content.substr(-2, 2) !== '()' && content.substr(-3, 3) !== '();') {
                                    content = content + '()';
                                }
                                if (dataC.dependencies) {
                                    for (let key in dataC.dependencies) {
                                        dependencies.push(`'${key}'`);
                                    }
                                    //    dependencies=Object.keys(dataC.dependencies);
                                }
                                requireApp.push(`'${appName}'`);
                                jsContent = [...jsContent, `define('${appName}',[${[...dependencies]}],function () {${appName}=${content}})`];
                            }
                            if (dataC.const && dataC.const.length) {
                                constMap[docs.name] = dataC.const;
                            }
                            interfacesMap[docs.name] = {
                                category: category,
                                docs: docs
                            };
                        }
                    }
                }
            }
            for (let key in interfacesMap) {
                let item = interfacesMap[key], interfacesMapItem;
                if (item) {
                    interfacesMapItem = intefacesCategoryMap[item.category];
                    if (interfacesMapItem) {
                        intefacesCategoryMap[item.category].children = [...interfacesMapItem.children, item.docs];
                    }
                    else {
                        intefacesCategoryMap[item.category] = { desp: item.category, children: [item.docs] };
                    }
                }
            }
            for (let key in constMap) {
                appInterfacesConst = [...appInterfacesConst, ...constMap[key]];
            }
            appInterfaces = Object.values(intefacesCategoryMap);
            yield writeFile(`src/main/webapp/dependence/AWEB/js/aweb.api.config.js`, `define([], function () {
                return{
                    appInterfaces:${JSON.stringify(appInterfaces, null, 4)},
                    appInterfacesConst:${JSON.stringify(appInterfacesConst, null, 4)}
                }
                })`);
            let content = `define(["jquery"],function($){${jsContent.join(`;\n`)};  require([${[...requireApp]} ]) })`.replace(/@aweb-plugins\//g, '');
            yield writeFile(`target/webapp/dependence/AWEB/js/aweb.api.js`, content);
            yield writeFile(`src/main/webapp/dependence/AWEB/js/aweb.api.js`, content);
            console.log("编译aweb.api.js完成");
        }
        catch (e) {
            console.log(e);
        }
    });
};
const compileLess = () => {
    for (let i = -1, item; item = config.less[++i];) {
        runLess(item)();
        if (item.watch && isWatch) {
            watch(item.watch, runLess(item));
        }
    }
};
const compileCss = () => {
    for (let i = -1, item; item = config.css[++i];) {
        run(item)();
        if (item.watch && isWatch) {
            watch(item.watch, run(item));
        }
    }
};
const compileJs = () => {
    for (let i = -1, item; item = config.js[++i];) {
        run(item)();
        if (item.watch && isWatch) {
            watch(item.watch, run(item));
        }
    }
};
const compileStatic = () => {
    for (let i = -1, item; item = config.static[++i];) {
        run(item)();
        if (item.watch && isWatch) {
            watch(item.watch, run(item));
        }
    }
};
const compileBootloader = () => {
    initBootloader(true);
    if (isWatch) {
        fs.watchFile(`${__dirname}/package.json`, {
            interval: 20
        }, function (curr, prev) {
            if (Date.parse(prev.ctime) == 0) {
                console.log('package.json文件被创建');
            }
            else if (Date.parse(curr.ctime) == 0) {
                console.log('package.json文件被删除');
            }
            else if (Date.parse(curr.mtime) != Date.parse(prev.mtime)) {
                console.log('package.json有变化');
                initBootloader(true);
            }
        });
    }
};
const compilePluigs = () => __awaiter(this, void 0, void 0, function* () {
    let plugins = config.plugins;
    runPlugins(plugins)();
    if (plugins.watch && isWatch) {
        watch(plugins.watch, runPlugins(plugins));
    }
});
const compilePageModule = (target = `${__dirname}/src/main/webapp/module`) => __awaiter(this, void 0, void 0, function* () {
    let data = yield readFile('./package.json');
    return node_fetch_1.default(`http://127.0.0.1:${JSON.parse(data).port || 7350}/compiler`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ target: target })
    }).then((response) => {
        return response.json();
    }).then((json) => {
        if (json.error) {
            if (json.error.statusCode == 401) {
                // User.logout();
            }
            return Promise.reject(new Error(json.error));
        }
        console.log(json.msg);
        return Promise.resolve();
    });
});
const compileNsl = () => {
    let nsl = config.nsl;
    runNsl(nsl)();
    if (nsl.watch && isWatch) {
        watch(nsl.watch, runNsl(nsl));
    }
};
//初始化的任务
(function () {
    let initConfig = config.init;
    let initKey = Object.keys(initConfig);
    initKey.forEach((i) => {
        initTask.push(`init${i}`);
        gulp.task(`init${i}`, () => {
            return new Promise(function (resolve, reject) {
                isWatch = false;
                run(initConfig[i], resolve)();
            });
        });
    });
}());
gulp.task('bootloader', () => __awaiter(this, void 0, void 0, function* () {
    isWatch = false;
    yield compileBootloader();
}));
gulp.task('widget', (done) => {
    isWatch = false;
    compileJs();
    compileCss();
    compileStatic();
    done();
});
gulp.task('pageModule', () => __awaiter(this, void 0, void 0, function* () {
    let argv, filePath;
    try {
        argv = JSON.parse(process.env.npm_config_argv).original;
    }
    catch (ex) {
        argv = process.argv;
    }
    argv = argv.slice(2);
    if (argv.length) {
        for (let i = -1, item; item = argv[++i];) {
            if (item.includes('--file=') && (filePath = item.replace('--file=', ''))) {
                yield compilePageModule(filePath);
            }
            else {
                console.log("请填写正确的参数格式  例如: --file=e:/test/demo");
            }
        }
    }
    else {
        yield compilePageModule();
    }
}));
gulp.task('nsl', () => __awaiter(this, void 0, void 0, function* () {
    isWatch = false;
    compileNsl();
}));
gulp.task('plugins', () => __awaiter(this, void 0, void 0, function* () {
    isWatch = false;
    yield compilePluigs();
}));
gulp.task('copy', gulp.series(...initTask));
gulp.task('init', gulp.series('copy', () => __awaiter(this, void 0, void 0, function* () {
    isWatch = false;
    yield compileBootloader();
    yield compilePluigs();
    yield compilePageModule();
    let data = yield readFile('./package.json'), data_json = JSON.parse(data);
    data_json.scripts.watch = `gulp watch`;
    yield writeFile('./package.json', JSON.stringify(data_json, null, 4));
})));
gulp.task('compile', gulp.series('plugins', () => __awaiter(this, void 0, void 0, function* () {
    isWatch = false;
    compileJs();
    compileCss();
    compileLess();
    compileStatic();
    compileBootloader();
    compileNsl();
    yield compilePageModule();
})));
gulp.task('watch', gulp.series('compile', () => __awaiter(this, void 0, void 0, function* () {
    isWatch = true;
    compileJs();
    compileCss();
    compileLess();
    compileStatic();
    compileBootloader();
    compilePluigs();
    compileNsl();
})));
//# sourceMappingURL=gulpfile.js.map