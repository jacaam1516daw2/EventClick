 $(document).ready(function () {
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
         (function ($) {
             $('#filter').keyup(function () {
                 var rex = new RegExp($(this).val(), 'i');
                 $('.searchable tr').hide();
                 $('.searchable tr').filter(function () {
                     return rex.test($(this).text());
                 }).show();
             })
         }(jQuery));



         /**
          * Animación añadir usuarios de notificación
          */
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

         /**
          * Validaciones de formularios
          */
         $('#error').hide();
         $('#add-register').prop('disabled', true);

         $("#nameClick").keyup(function () {
             if ($('#password').val() != '' && $('#confirm').val() != '' && $('#nameClick').val() != '' && $('#emailClick').val() != '') {
                 $('#add-register').prop('disabled', false);
             } else {
                 $('#add-register').prop('disabled', true);
             }
         });

         $("#emailClick").keyup(function () {
             if ($('#password').val() != '' && $('#confirm').val() != '' && $('#nameClick').val() != '' && $('#emailClick').val() != '') {
                 $('#add-register').prop('disabled', false);
             } else {
                 $('#add-register').prop('disabled', true);
             }
         });

         $("#confirm").keyup(function () {
             if ($('#password').val() === $('#confirm').val()) {
                 if ($('#password').val() != '' && $('#confirm').val() != '' && $('#nameClick').val() != '' && $('#emailClick').val() != '') {
                     $('#add-register').prop('disabled', false);
                 }
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

         $("#password").keyup(function () {
             if ($('#password').val() === $('#confirm').val()) {
                 if ($('#password').val() != '' && $('#confirm').val() != '' && $('#nameClick').val() != '' && $('#emailClick').val() != '') {
                     $('#add-register').prop('disabled', false);
                 }
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
