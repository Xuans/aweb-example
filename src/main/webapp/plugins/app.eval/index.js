(function (str) {

                    var func;

                    eval('func=' + str.replace('_parseFunction_', ''));

                    return func;
                });
            
