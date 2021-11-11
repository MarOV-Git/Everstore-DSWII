class Crud {
    constructor() {
        this.db = firebase.firestore();
        const settings = { timestampsInSnapshots: true }
        this.db.settings(settings)
    }

    insertarProducto(nombre, price, developer, distribuitor) {
        return this.db.collection('productos').add({
                nombre: nombre,
                price: price,
                developer: developer,
                distribuitor: distribuitor
            })
            .then(refDoc => {
                console.log(`Id del post => ${refDoc.id}`);
            })
            .catch(error => {
                console.log(`Error creando el post => ${error}`);
            })
    }

    consultarTodosItems() {
        this.db.collection(`productos`).onSnapshot(querySnapshot => {

            $('#contenido').empty()
            if (querySnapshot.empty) {} else {
                querySnapshot.forEach(prod => {
                    let prodHtml = this.obtenerListaTemplate(
                        prod.id,
                        prod.data().nombre,
                        prod.data().price,
                        prod.data().developer,
                        prod.data().distribuitor
                    )
                    $('#contenido').append(prodHtml)
                })
            }


        })
    }

    delete(id) {
        this.db.collection("productos").doc(id).delete().then(() => {
            alert("Producto eliminado con éxito!");
            $('#deleteModal').modal('toggle');
        }).catch((error) => {
            alert("Error al eliminar producto: ", error);
        });
    }


    obtenerListaTemplate(id, nombre, price, developer, distribuitor) {
        return `
    <tr>
      <td>${id}</td>
      <td>${nombre}</td>
      <td>${price}</td>
      <td>${developer}</td>
      <td>${distribuitor}</td>
      <td><button class="btn btn-danger" onclick="eliminar('${id}')" data-toggle="modal" data-target="#deleteModal">Eliminar</button></td>
    </tr> `
    }
}
