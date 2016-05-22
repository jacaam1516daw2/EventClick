 $(function () {
     /**
      * Datepicker calendario
      */
     $(".date").datepicker({
         dateFormat: 'dd/mm/yy'
     });

     /**
      * Filtro para tablas
      */
     $(document).ready(function () {
         (function ($) {
             $('#filter').keyup(function () {
                 var rex = new RegExp($(this).val(), 'i');
                 $('.searchable tr').hide();
                 $('.searchable tr').filter(function () {
                     return rex.test($(this).text());
                 }).show();
             })
         }(jQuery));
         $('#addUserPanel').hide();
         $('#userMailis').show();
         $('#add-user').click(function () {
             $('#addUserPanel').fadeIn("slow", function () {});
             $('#userMailis').fadeOut("slow", function () {});
         });
         $('#add-cancel').click(function () {
             $('#userMailis').fadeIn("slow", function () {});
             $('#addUserPanel').fadeOut("slow", function () {});
         });
         $('#error').hide();
         $('#add-register').prop('disabled', true);
         $("#confirm").keyup(function () {
             if ($('#password').val() === $('#confirm').val()) {
                 $('#add-register').prop('disabled', false);
                 $('#error').text('Correcto').show();
                 $('#error').css({
                     'color': 'green'
                 });
             } else {
                 $('#add-register').prop('disabled', true);
                 $('#error').text('Los passwords no coinciden').show();
                 $('#error').css({
                     'color': 'red'
                 });
             }
         });

     });
 });
