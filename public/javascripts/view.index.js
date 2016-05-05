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
        /* title = $('#title').val();
         subtitle = $('#subtitle').val();
         description = $('#description').val();
         author = $('#author').val();
         isActive = $('#isActive').val();
         initDate = $('#initDate').val();
         endDate = $('#endDate').val();*/
        $('#init').fadeIn("slow");
        $('#alta').fadeOut("slow");
        /*$.ajax({
            type: "POST",
            url: "/newEvent",
            data: JSON.stringify({
                title: title,
                subtitle: subtitle,
                description: description,
                //author: author,
                isActive: isActive,
                initDate: initDate,
                endDate: endDate
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {},
        });*/
    });
});
