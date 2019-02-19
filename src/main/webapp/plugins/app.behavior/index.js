(function () {
    var _b = function (input1, input2, condition, callback) {
        var _input2, result;

        input2 = decodeURIComponent(input2);
        _input2 = input2;
        try {
            input2 = JSON.parse(input2);
        } catch (e) {
            input2 = _input2;
        }

        switch (condition) {
            case 'lt':
                result = (input1 < input2);
                break;
            case 'eq':
                result = (input1 === input2);
                break;
            case 'gt':
                result = (input1 > input2);
                break;
            case 'not':
                result = (input1 !== input2);
                break;
            case 'includes':
            case 'notIncludes':
                if (input2 instanceof Array) {
                    result = ($.inArray(input1, input2) !== -1);
                } else if (input2 instanceof Object) {
                    result = (input1 in input2);
                } else {
                    result = input2 && (input2.toString().indexOf(input1) !== -1);
                }

                if (condition === 'notIncludes') {
                    result = !result;
                }
                break;
            case 'startsWith':
                result = input2 && (input2.toString().indexOf(input1) === 0);
                break;
        }

        callback && callback(result, input1, input2, condition);
    };

    _b.LESS_THAN = 'lt';
    _b.EQUAL = 'eq';
    _b.GREAT_THAN = 'gt';
    _b.NOT = 'not';
    _b.INCLUDES = 'inclues';
    _b.NOT_INCLUDES = 'notInclues';
    _b.STARTS_WITH = 'startsWith';

    return _b;
});

