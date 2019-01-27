$(document).ready(function() {

    $('#perfil').click(function() {
        $(this).parent().addClass('active');
        $('#adicionarDispositivo').parent().removeClass('active');
        $('#consultarDispositivo').parent().removeClass('active');
        $('#monitorizarDispositivo').parent().removeClass('active');
        document.title = "Meu Perfil";
    });
    $('#adicionarDispositivo').click(function() {
        $(this).parent().addClass('active');
        $('#perfil').parent().removeClass('active');
        $('#consultarDispositivo').parent().removeClass('active');
        $('#monitorizarDispositivo').parent().removeClass('active');
        document.title = "Adicionar Dispositivo";
    });
    $('#consultarDispositivo').click(function() {
        $(this).parent().addClass('active');
        $('#perfil').parent().removeClass('active');
        $('#adicionarDispositivo').parent().removeClass('active');
        $('#monitorizarDispositivo').parent().removeClass('active');
        document.title = "Consultar Dispositivo";
    });
    $('#monitorizarDispositivo').click(function() {
        $(this).parent().addClass('active');
        $('#perfil').parent().removeClass('active');
        $('#adicionarDispositivo').parent().removeClass('active');
        $('#consultarDispositivo').parent().removeClass('active');
        document.title = "Monitorizar Dispositivo";

    });


    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });
});