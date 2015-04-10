// 前端日历组件
(function () {

    function loadDateInput () {
        var $this = $(this);
        if ($this.data('init')) {
            return;
        }
        $this.data('init', true);
        require([ 'jquery.date.input' ], function () {
            $($.date_input.initialize);
        });
    }

    $('#j-date-input-init').on('click', loadDateInput);
}());
