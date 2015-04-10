/**
 * xui 的使用方式和 jquery ui 基本相同。
 *
 * 其中 xselect 方法用于操作下拉列表控件；在无参调用时，将初始化下拉列表；
 * 而在传入一个字符串参数时，该字符串代表操作名称，将执行该操作。
 *
 * xcheck 用于操作单/复选框，其调用方式与 xselect 相同。
 *
 * 这两个方法都可以在任何 jQuery 对象中调用，调用时将在 jQuery 对象中查找出所有可操作的元素并进行相关操作（如 select, input 等）。
 * 操作完成后，若无明确说明，将直接返回调用时的 jQuery 对象以方便进行链式调用，比如现有如下结构：
 *
 * ```html
 * <form id="form"><select id="select"></select></form>
 * ```
 *
 * 那么 `$('#form').xselect()` 与 `$('#select').xselect()` 效果相同。
 */
require(['jquery.xui.select'], function () {
     var form = $('#xui-select');

    form.xselect();

    $.each([ 'init', 'destroy', 'disable', 'enable' ], function(i, operateName) {
        $('#select-' + operateName).click(function() {
            form.xselect(operateName === 'init' ? undefined : operateName);
        });
    });

    $('#select-add-option').click(function() {
        form.find('select').append(function() {
            return '<option>option ' + ($(this).find('option').length + 1) + '</option>';
        });
        form.xselect('refresh');
        form.xselect('select', form.find('select option:last-child'));
    });

    $('#select-remove-option').click(function() {
        form.find('option:last-child').remove();
        form.xselect('refresh');
        form.xselect('select', form.find('select option:last-child'));
    });

    $('#select-select').keyup(function() {
        var number = parseInt($(this).val(), 10);
        if (number) {
            form.find('option:nth-child(' + number + ')').each(function() {
                this.selected = true;
            });
        }
        form.find('select').trigger('change');
    });
});


require(['jquery.xui.check'], function () {
    var checkboxForm = $('#xui-check-checkbox'),
    radioForm = $('#xui-check-radio'),
    literalsForm = $('#xui-check-literals'),

    allForm = checkboxForm.add(radioForm).add(literalsForm);

    allForm.xcheck();

    $.each(['init', 'check', 'uncheck', 'toggle', 'disable', 'enable', 'destroy'], function(i, operateName) {
        $('#check-' + operateName).click(function() {
            allForm.xcheck(operateName === 'init' ? undefined : operateName);
        });
    });
});
