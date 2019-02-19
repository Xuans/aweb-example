define(
    ['jquery', 'template'].concat(
        //懒加载js脚本模块
        aweb.transformJsConfig([
            'ctn'
        ])
    ).concat(
        //懒加载相对于 WebContent/dependence/ 下的样式
        aweb.transformCssConfig([
            'AUI/css/layout.ctn.css'
        ])
    ).concat(
        //懒加载相对于页面下的样式
        [
            'requireCss!./example.css'
        ]
    ),
    function ($, template) {
debugger;
        var linkTemplate=
            template.compile(
                '{{each list as item index}}'+
                '   <li class="example-link-item">'+
                '       <a target="_blank" href="{{item.href}}" title="{{item.name}}">{{item.name}}</a>'+
                '   </li>'+
                '{{/each}}'
            );

        return {
            //初始化
            load: function ($el, scope, handler) {

                //初始化

                $
                    .ajax({
                        url:'./module/example/customAweb/example.json',
                        type:'GET'
                    })
                    .done(function(response){
                        if(response && response.status){
                            $('[data-role="exampleLinkList"]',$el)
                                .empty()
                                .append(linkTemplate({
                                    list:response.content.result
                                }));
                        }else{
                            app.alert(response && response.errorMsg,app.alert.ERROR);
                        }
                        
                    });


                //事件绑定
                this.delegateEvents({
                    //刷新页面
                    'click.example [data-role="exampleBtnRefresh"]':function(){
                        handler.stepTo(0);
                    },
                    //关闭页面
                    'click.example [data-role="exampleBtnClose"]':function(){
                        app.close && app.close();
                    }
                });

            },
            //销毁
            unload: function ($el, scope, handler) {},
            //切出
            pause: function ($el, scope, handler) {},
            //切入
            resume: function ($el, scope, handler) {},
        };
    }
)