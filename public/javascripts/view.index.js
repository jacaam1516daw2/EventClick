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
    });
});
