(function ($form, auiCtx) {
        var $inputs = $("[id]", $form),
            i, item, domId, ins,
            variables = auiCtx && auiCtx.variables,
            $item, $checkedItem, $inputItem;

        if (variables && (i = $inputs.length)) {
            for (; item = $inputs[--i];) {
                ins = variables[item.id];
                if (ins && $.isFunction(ins.resetValue)) {
                    ins.resetValue();
                }
            }
        } else if ($inputs.length) {
            for (i = -1; item = $inputs[++i];) {
                $item = $(':input,img,.text-div,.wangEditor-txt', item).not(':button, :submit, :reset,:disabled');
                $inputItem = $(':input', item).not(':radio,:checkbox');
                $checkedItem = $(':checked', item).not(':disabled');

                $inputItem.length && $inputItem.val('').removeAttr('selected');
                $checkedItem.length && $checkedItem.removeAttr('checked');

            }
        }

    })