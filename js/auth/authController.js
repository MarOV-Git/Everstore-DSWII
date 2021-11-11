$(() => {

    const objAuth = new Autenticacion();

    $("#authFB").click(() => objAuth.authCuentaFacebook());

    $("#authGo").click(() => objAuth.authCuentaGoogle());



    $("#btnRegistroEmail").click(() => {
        const nombres = $('#nombreContactoReg').val();
        const email = $('#emailContactoReg').val();
        const password = $('#passwordReg').val();
        const auth = new Autenticacion();
        auth.crearCuentaEmailPass(email, password, nombres)
    });

    $("#btnInicioEmail").click(() => {
        const email = $('#emailSesion').val();
        const password = $('#passwordSesion').val();
        const auth = new Autenticacion()
        auth.autEmailPass(email, password)
    });

    $("#authTwitter").click(() => objAuth.authTwitter())


});
