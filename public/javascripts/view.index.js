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
     });
 });
