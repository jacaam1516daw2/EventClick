$(function () {
    // $('#init').hide();
    //$('#alta').fadeIn("slow");
    $('#alta').hide();
    $('#add-new').click(function () {
        $('#init').fadeOut("slow");
        $('#alta').fadeIn("slow");
    });
});

$(function () {
    $(".date").datepicker({
        dateFormat: 'dd/mm/yy'
    });
});

$(function () {
    $('#add-newEvent').click(function () {
        $('#init').fadeIn("slow");
        $('#alta').fadeOut("slow");
        $.ajax({
            type: "POST",
            url: "/",
            data: JSON.stringify({}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                //listaEventClick = data.listaEventClick;
            },
        });
    });
});
