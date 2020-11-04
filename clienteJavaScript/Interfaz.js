/*Autores
    Nikola Dyulgerov
    Ramón Jesús Martínez
    Cristian Petrov */
$(document).ready(
    function(){
        $('#panel').hide();
        $('#enviar').click(
            function(){
                $('#monitor').hide(); //Esperar respuesta del monitor y entonces mostrar panel
                $('#panel').show();
            }
        );
    }
)