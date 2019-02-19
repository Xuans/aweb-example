(function () {
    var TYPE = {
            MONEY: "money",
            BANDCARD: "bandcard"
        },
        transFun = function (num, type) {
            var arr = [], str = "";
            switch (type) {
                case "money":
                    num = num.toFixed(2);
                    num = parseFloat(num);
                    num = num.toLocaleString();
                    if (num.indexOf(".") === -1) {
                        num = num + ".00"
                    }
                    return num;
                    break;
                case "bandcard":
                    num = num.toString();
                    if (num.length !== 16) {
                        return
                    }
                    arr = num.split("");
                    arr.splice(4, 0, " ");
                    arr.splice(9, 0, " ");
                    arr.splice(14, 0, " ");
                    str = arr.join("");
                    return str;
                    break;

                default:
                    break;
            }
        };

    transFun.TYPE = TYPE;
    return transFun;
});
