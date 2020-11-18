$(document).ready(function () {
    

    $('#searchTable tfoot th').not('.exclude').each( function () {
        $(this).html( '<input class="form-control" type="text" placeholder="Buscar..." />' );
    } );
 
    // DataTable
    var table = $('#searchTable').DataTable({
        "language": language,
        ajax: {
            url: '/interfaz/llegadas',
            dataSrc: ""
        },
        columns: [
            { "data": "id_tienda" },
            { "data": "nombre_tienda" },
            { "data": "id_cliente" },
            { "data": "hora_llegada" },
        ],
        initComplete: function () {
            // Apply the search
            this.api().columns().every( function () {
                var that = this;
 
                $( 'input', this.footer() ).on( 'keyup change clear', function () {
                    if ( that.search() !== this.value ) {
                        that
                            .search( this.value )
                            .draw();
                    }
                } );
            } );
        }
    });
     
    $('.dataTables_length').addClass('bs-select');
    
});
