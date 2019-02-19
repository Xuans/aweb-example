# README

> 开发AWEB 项目

1. 右键点击 --> `初始化AWEB项目`

2. 安装下载依赖包

    ```sh
     npm install 
   ```
   
3. 初始化项目并监听文件 （文件改动会实时监听无需编译）

   ```sh
      npm run watch  
   ```
4. 启动前端服务器 

   ```sh
      npm run server  
   ```
    以上步骤完成后就可以开发一个AWEB项目啦~~~~
    
 
------------------------------------------
> 项目添加第三方依赖
   
   在项目的node_modules/@aweb-lib新建第三方文件
   
 - css依赖 




> 重新初始化项目 (会把项目还原为初始状态，一般用于新建项目，如项目已经修改过了，谨慎操作)
  
   ```sh
      npm run init  
   ```


> 初始化命令 列表 (需更新或初始化一部分内容时操作)
   - 初始化插件    
   
        ```sh
            npm run initplugins
        ```
   - 初始化WEB文件的字体样式   
   
        ```sh
             npm run initaweb
        ```
   - 初始化的编辑器（页面模型，国际化，菜单配置，主题配置）
      
        ```sh
             npm run initeditor
        ```
   - 初始化bootloaderTemplate
   
        ```sh
             npm run initbootloaderTemplate
        ```
   - 初始化组件 
   
        ```sh
            npm run initcomponents
        ```
   - 初始化aweb插件
      
        ```sh
            npm run initlib
        ```
   - 初始化webpackConfig 
   
        ```sh
            npm run initwebpackConfig
        ```   
   - 初始化字典 
   
        ```sh
            npm run initdict
        ```  
   - 初始化java文件
   
        ```sh
            npm run initjava
        ```  
   - 初始化maven配置
        ```sh
            npm run initpomX
        ```  
   - 初始化资源配置 
        ```sh
            npm run initresources
        ```  


> 单独编译的命令 列表
   - 全量编译
        ```sh
            npm run compile
        ```  
   -  编译组件 
        ```sh
            npm run widget
        ```  
   -  编译页面模型 
   
        ```sh
            npm run pageModule
        ```  
   -  编译国际化文件
   
         ```sh
             npm run nsl
         ```  
   -  编译插件 
        ```sh
            npm run plugins
        ```  


> 监听命令
   - 监听源文件，若有任何更改，会编译到对应的位置,无须再执行编译的命令
      ```sh
          npm run plugins
      ``` 

<!--日志 Start--> 

## AIBS表格 更新日志
- V6.0.6  
 1. 行下拉按钮添加宽度可配置功能；
 2. 修复按钮在屏幕最低部的时候被遮住的问题


## 普通按钮 更新日志
- V6.0.8（20190128） 修复按钮组件setter接口的iconPosition参数不生效的问题；


 ## 表单 更新日志
 
 - V6.0.6 修复编译 less 报错的问题；
 
 

## 日期/时间选择器 更新日志
- V6.0.5 （20190123） 将 setValue 入参格式不符合预期时的alert提示注释； 


## 日期时间选择器 更新日志
- V6.0.3 （20190123）
    - 将 setValue 入参格式不符合预期时的alert提示注释；
    - 将 HTML 模板更新到 foundationForm 的新模板；


## 普通输入框 更新日志
- V6.0.3 （20190123）
    - 修复浮点格式时，超过20位时显示不正常的问题；


## 普通下拉框 更新日志

- V6.0.7 修复校验成功时，没有清空错误提示的情况；



## HTML 标签 更新日志
- V6.0.6  
    1. 修复resize重绘方法在表格隐藏时被触发执行时报错的问题
- V6.0.7
    1. 修复getRow接口获取数据重复的问题


## 顶部导航栏 更新日志
- V6.0.5  
    1. 修复样式配置的logo样式配置失效的问题
- V6.0.6
    1. 修复右侧一级菜单时，获取不到元素 id 报错提示；


## 弹窗容器 更新日志
- V6.0.4 (20190123)
    - 修复重置表单配置项无效的问题（需要同时升级 app.validate 到 6.0.1）


## validate 更新日志
- V6.0.1(20190123)
    1. 修复错误提示没有国际化的问题；（需要更新 AUI2 到 5.1.20）
    2. 增加单个元素自定义错误提示方式（需要更新 AUI2 到 5.1.20）
- V6.0.4 
    1. 增加数据校验处理；
        如果空数组，则转化成空字符串`''`；否则将其序列化（JSON.stringify）
 <!--日志 End-->