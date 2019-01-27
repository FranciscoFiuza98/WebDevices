$(document).ready(function() {
    getPendentes();
    $('#admin-pendente').click(function() {
        $(this).parent().addClass('active');
        $('#admin-utilizadores').parent().removeClass('active');
        $('#admin-departamentos').parent().removeClass('active');
        $('#admin-setores').parent().removeClass('active');
        $('#admin-adicionarDispositivo').parent().removeClass('active');
        $('#admin-consultarDispositivo').parent().removeClass('active');
        $('#admin-monitorizarDispositivo').parent().removeClass('active');
    });
    $('#admin-utilizadores').click(function() {
        $(this).parent().addClass('active');
        $('#admin-pendente').parent().removeClass('active');
        $('#admin-departamentos').parent().removeClass('active');
        $('#admin-setores').parent().removeClass('active');
        $('#admin-adicionarDispositivo').parent().removeClass('active');
        $('#admin-consultarDispositivo').parent().removeClass('active');
        $('#admin-monitorizarDispositivo').parent().removeClass('active');
    });
    $('#admin-departamentos').click(function() {
        $(this).parent().addClass('active');
        $('#admin-utilizadores').parent().removeClass('active');
        $('#admin-pendente').parent().removeClass('active');
        $('#admin-setores').parent().removeClass('active');
        $('#admin-adicionarDispositivo').parent().removeClass('active');
        $('#admin-consultarDispositivo').parent().removeClass('active');
        $('#admin-monitorizarDispositivo').parent().removeClass('active');
    });
    $('#admin-setores').click(function() {
        $(this).parent().addClass('active');
        $('#admin-utilizadores').parent().removeClass('active');
        $('#admin-departamentos').parent().removeClass('active');
        $('#admin-pendente').parent().removeClass('active');
        $('#admin-adicionarDispositivo').parent().removeClass('active');
        $('#admin-consultarDispositivo').parent().removeClass('active');
        $('#admin-monitorizarDispositivo').parent().removeClass('active');
    });
    $('#admin-adicionarDispositivo').click(function() {
        $(this).parent().addClass('active');
        $('#admin-utilizadores').parent().removeClass('active');
        $('#admin-departamentos').parent().removeClass('active');
        $('#admin-setores').parent().removeClass('active');
        $('#admin-pendente').parent().removeClass('active');
        $('#admin-consultarDispositivo').parent().removeClass('active');
        $('#admin-monitorizarDispositivo').parent().removeClass('active');
    });
    $('#admin-consultarDispositivo').click(function() {
        $(this).parent().addClass('active');
        $('#admin-utilizadores').parent().removeClass('active');
        $('#admin-departamentos').parent().removeClass('active');
        $('#admin-setores').parent().removeClass('active');
        $('#admin-adicionarDispositivo').parent().removeClass('active');
        $('#admin-pendente').parent().removeClass('active');
        $('#admin-monitorizarDispositivo').parent().removeClass('active');
    });
    $('#admin-monitorizarDispositivo').click(function() {
        $(this).parent().addClass('active');
        $('#admin-utilizadores').parent().removeClass('active');
        $('#admin-departamentos').parent().removeClass('active');
        $('#admin-setores').parent().removeClass('active');
        $('#admin-adicionarDispositivo').parent().removeClass('active');
        $('#admin-consultarDispositivo').parent().removeClass('active');
        $('#admin-pendente').parent().removeClass('active');
    });
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });

    function getPendentes() {
        $.ajax({
            type: 'GET',
            url: '/getPendentes',
            //os dados recebidos do model estão na variável data
            success: function(result) {
                //criação de uma tabela para demonstração dos resultados recebidos
                if (result.status == 200) {
                    var txt = "";
                    result.data.forEach(function(row) {
                        for (var i = 0; i < result.data.length; i++) {
                            txt += result.data[i];
                        }
                    });
                    //envia a tabela construida para a view e mostra o resultado (txt) no object com ID result
                    $("#pendentes").html(txt);
                }
            },
            error: function(data) {
                console.log(data);
            }
        });
    }
});
