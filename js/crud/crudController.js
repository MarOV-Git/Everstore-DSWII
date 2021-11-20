$(() => {

    const crud = new Crud()



    $('.cat').click(function(event) {
        const email = $('#name-val').attr("data-email");
        const miCategoria = $(this).text()
        console.log(miCategoria);
        console.log(email);
        $('.cat').css('color', '#625261');
        $('.cat-all').css('color', '#625261');
        $('.cat-all').css('border-color', '#625261');
        $(this).css('color', '#89BEB3');
        crud.consultarMisLibros(`${email}`, `${miCategoria}`);
    });


    $('.cat-all').click(function(event) {
        const email = $('#name-val').attr("data-email");
        const miCategoria = $(this).text()
        console.log(miCategoria);
        console.log(email);
        $(this).css('border-color', '#89BEB3');
        $('.cat').css('color', '#625261');
        $(this).css('color', '#89BEB3');
        crud.consultarMisLibros(`${email}`, `${miCategoria}`);
    });




    $('#btnUpdate').click(() => {
        const user = firebase.auth().currentUser

        if (user == null) {
            alert(`Para insertar un producto necesita estar autenticado.`)
            return
        } else {
            const id = $('#data-id').html();
            const nombre = $('#nombreLibroAct').val()
            const price = $('#precioLibroAct').val()
            const autor = $('#autorAct').val()
            const categoria = $('#cboCategoria option:selected').text()
            var imagelink = sessionStorage.getItem('imgNewCover') == 'null' ? null : sessionStorage.getItem('imgNewCover')
            var pdflink = sessionStorage.getItem('imgNewPdf') == 'null' ? null : sessionStorage.getItem('imgNewPdf')
            const uploadedOrNot = $('#pbLibro').width() == 360 ? true : false;
            const pdfOrNot = $('#pbPDF').width() == 360 ? true : false;

            if (uploadedOrNot == false) {
                imagelink = $('#data-imgaux').html()

            }
            if (pdfOrNot == false) {
                pdflink = $('#data-pdfaux').html()
            }

            if (nombre == "" || price == "" || autor == "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No deje espacios en blanco!',
                })
            } else if (categoria == "Categoria") {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Tiene que seleccionar una categoría!',
                })
            } else {
                crud.actualizarLibro(id, nombre, price, autor, categoria, imagelink, pdflink).then(resp => {
                    Swal.fire({
                        icon: 'success',
                        title: `Libro actualizado correctamente`,
                        showConfirmButton: false,
                        timer: 2000
                    })

                    $('#updateModal').modal('toggle');
                    $('#pbLibro').val(null);
                    $('#pbPDF').val(null);
                    $('#pbLibro').width('0px');
                    $('#pbPDF').width('0px');
                });

            }


        }

    })




    $('#btnRegistroLibro').click(() => {
        const user = firebase.auth().currentUser

        if (user == null) {
            alert(`Para insertar un producto necesita estar autenticado.`)
            return
        } else {
            const nombre = $('#nombreLibroReg').val()
            const price = $('#precioLibroReg').val()
            const autor = $('#autorReg').val()
            const categoria = $('#cboCategoria option:selected').text()
            const imagelink = sessionStorage.getItem('imgNewCover') == 'null' ? null : sessionStorage.getItem('imgNewCover')
            const pdflink = sessionStorage.getItem('imgNewPdf') == 'null' ? null : sessionStorage.getItem('imgNewPdf')
            const uploadedOrNot = $('#pbLibro').width() == 360 ? true : false;
            const pdfOrNot = $('#pbPDF').width() == 360 ? true : false;
            if (nombre == "" || price == "" || autor == "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No deje espacios en blanco!',
                })
            } else if (categoria == "Categoria") {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Tiene que seleccionar una categoría!',
                })
            } else if (uploadedOrNot == false || pdfOrNot == false) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No ha subido ninguna imagen!',
                })
            } else if (pdfOrNot == false) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No ha subido ningun pdf!',
                })
            } else {
                crud.insertarLibro(nombre, price, autor, categoria, imagelink, pdflink)
            }
        }

    })


    $('#btnCarrito').click(() => {
        const email = $('#data-email').text();
        const imglink = $('#data-imglink').text();
        const nombre = $('#data-nombre').text();
        const autor = $('#data-autor').text();
        const precio = $('#data-price').text();
        const categoria = $('#data-categoria').text();
        const pdflink = $('#data-pdflink').text();
        const idlibro = $('#data-idlibro').text();
        const pdflinkdecode = atob(pdflink);
        crud.registrarCarrito(email, imglink, nombre, autor, precio, categoria, pdflinkdecode, idlibro);
        $('#carritoModal').modal('toggle');
    })



    $('#btnDelete').click(() => {
        const id = $('#data').text();
        crud.delete(id)

    })

    $('#btnDeleteCarrito').click(() => {
        const email = $('#data-email').text();
        console.log(email);
        const id = $('#data').text();
        $('#totalPrecio').html('00.00');
        crud.deleteCarrito(email, id)
    })


    $('#pagarCarrito').click(() => {
        const email = $('#name-val').attr("data-email");
        const nombre = $('#nomTarjeta').val()
        const numero = $('#numTarjet').val()
        const fecha = $('#fechaTarjeta').val()
        const codigo = $('#codigoTarjeta').val()
        const cvc = $('#cvcTarjeta').val()
        const total = $('#totalPrecio').html()
        if (nombre == "" || numero == "" || fecha == "" || codigo == "" || cvc == "") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No deje espacios en blanco!',
            })
        } else if (numero.length != 16) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'La tarjeta tiene que tener 16 digitos!',
            })
        } else if (fecha.length != 5) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Inserte correctamente la fecha de vencimiento, Ejm: 11/23',
            })
        } else if (cvc.length != 3) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El código CVC solo cuenta con 3 dígitos.',
            })
        } else if (codigo.length != 5) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El código postal cuenta con 5 dígitos.',
            })
        } else if (total == '00.00') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No has añadido ningún elemento a tu carrito',
            })
        } else {
            crud.confirmarCarrito(email)
            $('#auxPrecio').html('00.00');
            $('#totalPrecio').html('00.00');
            window.setTimeout(function() {

                window.location.href = "misLibros.html";
            }, 1500);
        }
    })


    $('#btnUploadPDF').on('change', e => {
        const file = e.target.files[0]

        const user = firebase.auth().currentUser

        const crud = new Crud();

        crud.subirPdf(file, user.uid)
    });


    $('#btnUploadFile').on('change', e => {
        const file = e.target.files[0]

        const user = firebase.auth().currentUser

        const crud = new Crud();

        crud.subirPortadaLibro(file, user.uid)
    });
});