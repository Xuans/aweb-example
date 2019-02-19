(function(){
    require(['widget','awebFresher'],function(){
        var colors={
            SUCCESS:$AW.fresher.variablesCopy['@sSuccessColor']||'#23ad44',
            ERROR:$AW.fresher.variablesCopy['@sErrorColor']||'#f05050',
            INFO:$AW.fresher.variablesCopy['@sInfoColor']||'#3db9ff',
            WARNING:$AW.fresher.variablesCopy['@sWarningColor']||'#ffba00'
        };
        colors._DEFAULT=colors.INFO;

        app.tips=function(title,msg,type){

            if(!type || type==='_DEFAULT'){
                type='INFO';
            }

            if(colors[type]){
                app.modal({
                    title:title,
                    content: '<div class="aui-ide-modal-content">' +
                                '<i class="'+ app.alert[type.toLowerCase()] +'" style="color:'+ colors[type] +'"></i>'+
                                '<p data-role="message">'+ msg +'</p>'+
                            '</div>',
                    isDialog:true,
                    isLargeModal:false,
                    btnConfirm:false,
                    btnCancel:false
                  })
            }
        }; 
        
        for(var k in colors){
            if(colors.hasOwnProperty(k)){
                app.tips[k]=k;
            }
        }

    })
})