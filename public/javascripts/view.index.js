$(function () {
    /**
     * Datepicker calendario
     */
    $(".date").datepicker({
        dateFormat: 'dd/mm/yy'
    });

    /*$('#add-send').click(function () {
        $.ajax({
            url: 'http://localhost:8080/api/users',
            type: 'GET',
            data: '', // or $('#myform').serializeArray()
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                for (var i = 0; i < data.users.length; i++) {
                    console.log(data.users);
                    console.log(data);
                }
            },
        });
    });*/
});
