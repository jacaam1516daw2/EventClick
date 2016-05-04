$(function () {
    $('#init').hide();
    $('#alta').fadeIn("slow");
    //$('#alta').hide();
    $('#add-new').click(function () {
        $('#init').fadeOut("slow");
        $('#alta').fadeIn("slow");
    });
});
