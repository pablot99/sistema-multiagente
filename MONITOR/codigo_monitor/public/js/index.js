function getXML(id) {
    $.ajax({
        url : '/interfaz/logXML',
        type : 'GET',
        data : {
            '_id' : id
        },
        dataType:'json',
        success : function(data) {              
            $('#textarea-xml').val(data["mensaje_xml"]);
        },
        error : function(request,error)
        {
            console.log(`error al intentar obtener xml para el modal: ${request}, ${error}`);
        }
    });
}


function startMonitor(){
    $.ajax({
        url : '/interfaz/start',
        type : 'GET',
        success : function() {              
            alert("Arrancado")
        },
        error : function(request,error)
        {
            console.log(`error al intentar obtener xml para el modal: ${request}, ${error}`);
        }
    });
}


$(document).ready(function () {
    

    $('#searchTable tfoot th').not('.exclude').not('.select').each( function () {
        $(this).html( '<input class="form-control" type="text" placeholder="Buscar..." />' );
    } );

 
    // DataTable
    var table = $('#searchTable').DataTable({
        "language": language,
        ajax: {
            url: '/interfaz/log',
            dataSrc: ""
        },
        columns: [
            { "data": "hora_recepcion" },
            { "data": "id_emisor" },
            { "data": "id_receptor" },
            { "data": "tipo_mensaje" },
            { "data": "_id", render:(data) => { return `<button onclick=getXML('${data}') class="btn btn-primary" data-toggle="modal" data-target="#modalXML">Ver XML</button>`} }
        ],
        initComplete: function () {
            // Apply the search
            this.api().columns([0,1,2]).every( function () {
                var that = this;
 
                $( 'input', this.footer() ).on( 'keyup change clear', function () {
                    if ( that.search() !== this.value ) {
                        that
                            .search( this.value )
                            .draw();
                    }
                } );
            } );

            this.api().columns([3]).every( function () {
                var column = this;
                var select = $('<select><option value=""></option></select>')
                    .appendTo( $(column.footer()).empty() )
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
 
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );
 
                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option value="'+d+'">'+d+'</option>' )
                } );
            } );
        }
    });
     
    $('.dataTables_length').addClass('bs-select');
    
});
