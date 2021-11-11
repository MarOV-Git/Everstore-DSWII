class Crud {
    constructor() {
        this.db = firebase.firestore();
        const settings = { timestampsInSnapshots: true }
        this.db.settings(settings)
    }

    insertarLibro(nombre, price, autor, categoria, imglink) {
        return this.db.collection('libros').add({
                nombre: nombre,
                price: price,
                categoria: categoria,
                autor: autor,
                imglink: imglink,
                fecha: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(refDoc => {
                console.log(`Id del libro => ${refDoc.id}`);
            })
            .catch(error => {
                console.log(`Error creando el libro => ${error}`);
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


    consultarRecientes() {
        this.db.collection(`libros`).orderBy("fecha", "desc").limit(5).onSnapshot(querySnapshot => {
            $('#contenido').empty()
            if (querySnapshot.empty) {} else {
                querySnapshot.forEach(lib => {
                    let libHtml = this.obtenerCover(
                        lib.data().imglink,
                        lib.data().nombre,
                        lib.data().autor
                    )
                    $('#contenido').append(libHtml)
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



    subirPortadaLibro(file, uid){
        const refStorage = firebase.storage()
        .ref(`coverBooks/${uid}/${file.name}`)


        const task = refStorage.put(file)
        task.on('state_changed', snapshot => {
            const porcentaje = snapshot.bytesTransferred / snapshot.totalBytes * 100;
            $('#pbLibro').attr('style', `width:${porcentaje}%`);
            $('#pbLibro').text(`${porcentaje}%`);
            console.log('cargando');
        },
      err =>{
        alert(`Error subiendo el archivo ${error.message}!!`);
      },
      ()=>{
        task.snapshot.ref.getDownloadURL()
        .then( url => {
            console.log(url)
            sessionStorage.setItem('imgNewCover', url)
        })
        .catch(err => {
          alert(`Error obteniendo downloadURL ${error.message} !!`);
        })
      }
    )}

    obtenerCover(link,title,autor) {
        return `
        <div class="col-sm">
        <div style="height: 300px;background: url('${link}'), url('img/default.jpg');background-size: cover;background-position: center;width: 100%;"></div>
          <p class="cov-title">${title}</p>
            <p class="cov-little">${autor}</p>
        </div>
`
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
