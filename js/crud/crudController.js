$(() => {
    const t = new Crud();
    $(".cat").click(function (e) {
        const o = $("#name-val").attr("data-email"),
            a = $(this).text();
        console.log(a), console.log(o), $(".cat").css("color", "#625261"), $(".cat-all").css("color", "#625261"), $(".cat-all").css("border-color", "#625261"), $(this).css("color", "#89BEB3"), t.consultarMisLibros(`${o}`, `${a}`);
    }),
        $(".cat-all").click(function (e) {
            const o = $("#name-val").attr("data-email"),
                a = $(this).text();
            console.log(a), console.log(o), $(this).css("border-color", "#89BEB3"), $(".cat").css("color", "#625261"), $(this).css("color", "#89BEB3"), t.consultarMisLibros(`${o}`, `${a}`);
        }),
        $("#btnUpdate").click(() => {
            if (null != firebase.auth().currentUser) {
                const a = $("#data-id").html(),
                    r = $("#nombreLibroAct").val(),
                    i = $("#precioLibroAct").val(),
                    l = $("#autorAct").val(),
                    n = $("#cboCategoria option:selected").text();
                var e = "null" == sessionStorage.getItem("imgNewCover") ? null : sessionStorage.getItem("imgNewCover"),
                    o = "null" == sessionStorage.getItem("imgNewPdf") ? null : sessionStorage.getItem("imgNewPdf");
                const c = 360 == $("#pbLibro").width(),
                    s = 360 == $("#pbPDF").width();
                0 == c && (e = $("#data-imgaux").html()),
                    0 == s && (o = $("#data-pdfaux").html()),
                    "" == r || "" == i || "" == l
                        ? Swal.fire({ icon: "error", title: "Oops...", text: "No deje espacios en blanco!" })
                        : "Categoria" == n
                        ? Swal.fire({ icon: "error", title: "Oops...", text: "Tiene que seleccionar una categoría!" })
                        : t.actualizarLibro(a, r, i, l, n, e, o).then((t) => {
                              Swal.fire({ icon: "success", title: "Libro actualizado correctamente", showConfirmButton: !1, timer: 2e3 }),
                                  $("#updateModal").modal("toggle"),
                                  $("#pbLibro").val(null),
                                  $("#pbPDF").val(null),
                                  $("#pbLibro").width("0px"),
                                  $("#pbPDF").width("0px");
                          });
            } else alert("Para insertar un producto necesita estar autenticado.");
        }),
        $("#btnRegistroLibro").click(() => {
            if (null != firebase.auth().currentUser) {
                const e = $("#nombreLibroReg").val(),
                    o = $("#precioLibroReg").val(),
                    a = $("#autorReg").val(),
                    r = $("#cboCategoria option:selected").text(),
                    i = "null" == sessionStorage.getItem("imgNewCover") ? null : sessionStorage.getItem("imgNewCover"),
                    l = "null" == sessionStorage.getItem("imgNewPdf") ? null : sessionStorage.getItem("imgNewPdf"),
                    n = 360 == $("#pbLibro").width(),
                    c = 360 == $("#pbPDF").width();
                "" == e || "" == o || "" == a
                    ? Swal.fire({ icon: "error", title: "Oops...", text: "No deje espacios en blanco!" })
                    : "Categoria" == r
                    ? Swal.fire({ icon: "error", title: "Oops...", text: "Tiene que seleccionar una categoría!" })
                    : 0 == n || 0 == c
                    ? Swal.fire({ icon: "error", title: "Oops...", text: "No ha subido ninguna imagen!" })
                    : 0 == c
                    ? Swal.fire({ icon: "error", title: "Oops...", text: "No ha subido ningun pdf!" })
                    : t.insertarLibro(e, o, a, r, i, l);
            } else alert("Para insertar un producto necesita estar autenticado.");
        }),
        $("#btnCarrito").click(() => {
            const e = $("#data-email").text(),
                o = $("#data-imglink").text(),
                a = $("#data-nombre").text(),
                r = $("#data-autor").text(),
                i = $("#data-price").text(),
                l = $("#data-categoria").text(),
                n = $("#data-pdflink").text(),
                c = $("#data-idlibro").text(),
                s = atob(n);
            t.registrarCarrito(e, o, a, r, i, l, s, c), $("#carritoModal").modal("toggle");
        }),
        $("#btnDelete").click(() => {
            const e = $("#data").text();
            t.delete(e);
        }),
        $("#btnDeleteCarrito").click(() => {
            const e = $("#data-email").text();
            console.log(e);
            const o = $("#data").text();
            $("#totalPrecio").html("00.00"), t.deleteCarrito(e, o);
        }),
        $("#pagarCarrito").click(() => {
            const e = $("#name-val").attr("data-email"),
                o = $("#nomTarjeta").val(),
                a = $("#numTarjet").val(),
                r = $("#fechaTarjeta").val(),
                i = $("#codigoTarjeta").val(),
                l = $("#cvcTarjeta").val(),
                n = $("#totalPrecio").html();
            "" == o || "" == a || "" == r || "" == i || "" == l
                ? Swal.fire({ icon: "error", title: "Oops...", text: "No deje espacios en blanco!" })
                : 16 != a.length
                ? Swal.fire({ icon: "error", title: "Oops...", text: "La tarjeta tiene que tener 16 digitos!" })
                : 5 != r.length
                ? Swal.fire({ icon: "error", title: "Oops...", text: "Inserte correctamente la fecha de vencimiento, Ejm: 11/23" })
                : 3 != l.length
                ? Swal.fire({ icon: "error", title: "Oops...", text: "El código CVC solo cuenta con 3 dígitos." })
                : 5 != i.length
                ? Swal.fire({ icon: "error", title: "Oops...", text: "El código postal cuenta con 5 dígitos." })
                : "00.00" == n
                ? Swal.fire({ icon: "error", title: "Oops...", text: "No has añadido ningún elemento a tu carrito" })
                : (t.confirmarCarrito(e),
                  $("#auxPrecio").html("00.00"),
                  $("#totalPrecio").html("00.00"),
                  window.setTimeout(function () {
                      window.location.href = "misLibros.html";
                  }, 1500));
        }),
        $("#btnUploadPDF").on("change", (t) => {
            const e = t.target.files[0],
                o = firebase.auth().currentUser;
            new Crud().subirPdf(e, o.uid);
        }),
        $("#btnUploadFile").on("change", (t) => {
            const e = t.target.files[0],
                o = firebase.auth().currentUser;
            new Crud().subirPortadaLibro(e, o.uid);
        });
});
