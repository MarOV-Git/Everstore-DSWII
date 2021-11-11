$(() => {

    const crud = new Crud()

    $('#btnAdd').click(() => {
        const user = firebase.auth().currentUser

        if (user == null) {
            Alert(`Para insertar un producto necesita estar autenticado.`)
            return
        } else {
            const nombre = $('#nameProduct').val()
            const price = $('#priceProduct').val()
            const developer = $('#developerProduct').val()
            const distribuitor = $('#distribuitorProduct').val()

            crud.insertarProducto(nombre, price, developer, distribuitor)
                .then(
                    resp => {
                        alert(`Producto registrado correctamente`)
                        $('#nameProduct').val('')
                        $('#priceProduct').val('')
                        $('#developerProduct').val('')
                        $('#distribuitorProduct').val('')
                    })
                .catch(err => {
                    alert(`Error => ${err}`)
                })
        }

    })

    $('#btnDelete').click(() => {
        const id = $('#data').text();
        crud.delete(id)

    })

});
