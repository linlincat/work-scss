(function () {
    var Input_ele = $('.J-search_top input');

    Input_ele.focus(function() {
        if (this.value === this.defaultValue) {
            this.value = "";
        }
    });

    Input_ele.blur(function() {
        if (this.value === "") {
            this.value = this.defaultValue;
        }
    });
}());

//@Note 用原生JS的方式，可以不用明确具体的默认值，当然可以val() 保存一个变量；
//但这些写，比较高大上一丢丢；
