$(() => {
    const a = new Autenticacion();
    $("#authFB").click(() => a.authCuentaFacebook()),
        $("#authGo").click(() => a.authCuentaGoogle()),
        $("#btnRegistroEmail").click(() => {
            const a = $("#nombreContactoReg").val(),
                t = $("#emailContactoReg").val(),
                c = $("#passwordReg").val();
            new Autenticacion().crearCuentaEmailPass(t, c, a);
        }),
        $("#btnInicioEmail").click(() => {
            const a = $("#emailSesion").val(),
                t = $("#passwordSesion").val();
            new Autenticacion().autEmailPass(a, t);
        }),
        $("#authTwitter").click(() => a.authTwitter());
});
