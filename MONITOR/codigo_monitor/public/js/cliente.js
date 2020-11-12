$(document).ready(() => {
    $('#tableListaConocidas tfoot th').not('.exclude').each(function () {
        $(this).html('<input class="form-control" type="text" placeholder="Buscar..." />');
    });

    $('#tableUbicacionesActuales tfoot th').not('.exclude').each(function () {
        $(this).html('<input class="form-control" type="text" placeholder="Buscar..." />');
    });

    $('#tableComunicacionesClientes tfoot th').not('.exclude').each(function () {
        $(this).html('<input class="form-control" type="text" placeholder="Buscar..." />');
    });




    $('#tableListaVisitadas').DataTable({
        searching: true, // false to disable search (or any other option)
        autoWidth: true,
        language: language,
        ajax: {
            url: 'interfaz/pruebaJson',
            dataSrc: ""
        },
        language: language,
        columns: [
            { "data": "ID" },
            { "data": "Nombre" },
            { "data": "Tienda" },
            { "data": "Entrada" },
            { "data": "Salida" }
        ]
    });

    $('#tableListaClientes').DataTable({
        searching: true,
        language: language

    });

    function booleanToSymbol(data) {
        if (data === 'NO') {
            return '<span style="color:red"><i class="fa fa-times-circle"></i></span>';
        }
        else {
            return '<span style="color:green"><i class="fa fa-check"></i></span>';
        }
    }
    $('#tableListaConocidas').DataTable({
        searching: true, // false to disable search (or any other option)
        language: language,
        initComplete: function () {
            // Apply the search
            this.api().columns().every(function () {
                var that = this;
                $('input', this.footer()).on('keyup change clear', function () {
                    if (that.search() !== this.value) {
                        that.search(this.value).draw();
                    }
                });
            });
        },
        columnDefs:
            [{
                "targets": [3], // your case first column
                "className": "text-center",
            }],
        columns: [
            { "data": "ID-Cliente" },
            { "data": "Nombre Cliente" },
            { "data": "Tienda" },
            { "data": "Visitada", render: (data) => { return booleanToSymbol(data) } },
            { "data": "Grado de conexion" }
        ]
    });

    $('#tableUbicacionesActuales').DataTable({
        "searching": true, // false to disable search (or any other option)
        "language": language,
        initComplete: function () {
            // Apply the search
            this.api().columns().every(function () {
                var that = this;
                $('input', this.footer()).on('keyup change clear', function () {
                    if (that.search() !== this.value) {
                        that.search(this.value).draw();
                    }
                });
            });
        },
        "columns": [
            { "data": "ID-Cliente" },
            { "data": "Nombre Cliente" },
            { "data": "ID-Tienda" },
            { "data": "Nombre Tienda" }
        ]
    });

    $('#tableComunicacionesClientes').DataTable({
        "searching": true, // false to disable search (or any other option)
        "language": language,
        initComplete: function () {
            // Apply the search
            this.api().columns().every(function () {
                var that = this;
                $('input', this.footer()).on('keyup change clear', function () {
                    if (that.search() !== this.value) {
                        that.search(this.value).draw();
                    }
                });
            });
        },
        "columns": [
            { "data": "ID-Cliente Emisor" },
            { "data": "Nombre Cliente Emisor" },
            { "data": "ID-Cliente Receptor" },
            { "data": "Nombre Cliente Receptor" },
            { "data": "ID-Tienda" },
            { "data": "Nombre Tienda" },
            { "data": "Hora" },
            { "data": "Tiendas Comunicadas" }

        ]
    });

    $('.dataTables_length').addClass('bs-select');

});