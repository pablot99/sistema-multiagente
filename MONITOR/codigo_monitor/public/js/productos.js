$(document).ready(() => {
    
    $('#tableListaProductos').DataTable({
        "searching": true, 
        "language":language
    });

    $('.dataTables_length').addClass('bs-select');

});