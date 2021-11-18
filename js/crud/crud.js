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
        this.db.collection(`libros`).onSnapshot(querySnapshot => {

            $('#contenidoCompleto').empty()
            if (querySnapshot.empty) {} else {
                querySnapshot.forEach(lib => {
                    let libHtml = this.obtenerListaTemplate(
                        lib.data().imglink,
                        lib.data().nombre,
                        lib.data().autor,
                        lib.data().price,
                        lib.data().categoria,
                        lib.id
                    )
                    $('#contenidoCompleto').append(libHtml)
                })
            }


        })
    }




    consultarCarrito(email) {
        this.db.collection(`${email}-carrito`).onSnapshot(querySnapshot => {

            $('#carritoCompleto').empty()
            if (querySnapshot.empty) {} else {
                querySnapshot.forEach(lib => {
                    var actual = parseFloat($('#totalPrecio').html());
                    var auxiliar = parseFloat(lib.data().precio);
                    let libHtml = this.obtenerCarritoTemplate(
                        lib.data().imglink,
                        lib.data().nombre,
                        lib.data().autor,
                        lib.data().precio,
                        lib.id
                    )
                    $('#totalPrecio').html((actual+auxiliar).toFixed(2))
                    $('#carritoCompleto').append(libHtml)
                })
            }


        })
    }


   confirmarCarrito(email) {
        this.db.collection(`${email}-carrito`).onSnapshot(querySnapshot => {

            if (querySnapshot.empty) {} else {
                querySnapshot.forEach(lib => {
                this.db.collection(`${email}-libros`).add({
                          imglink: lib.data().imglink,
                          nombre: lib.data().nombre,
                          autor: lib.data().autor,
                          categoria: lib.data().categoria
                      })

                    this.db.collection(`${email}-carrito`).doc(`${lib.id}`).delete().then(() => {
                      Swal.fire({
                          icon: 'success',
                          title: `¡Gracias por tu compra!`,
                          showConfirmButton: false,
                          timer: 2000
                        })

                        window.setTimeout(function() {

                            window.location.href = "misLibros.html";
                        }, 1500);
}).catch((error) => {
  Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `Ha ocurrido un error ${error}`,
    })
});
                    $('#totalPrecio').html('00.00')
                })
            }


        })
    }





    registrarCarrito(email,imglink,nombre,autor,precio,categoria){
  const libros = this.db.collection(`${email}-libros`).where("nombre", "==", nombre);
  libros.get().then( (qsnapshot) => {
    if (qsnapshot.docs.length > 0) {
      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ya has comprado este libro',
        })
          $('#carritoModal').modal('toggle');
  }
  else{
      const usuario = this.db.collection(`${email}-carrito`).where("nombre", "==", nombre);
        usuario.get().then( (qsnapshot) => {
          if (qsnapshot.docs.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Este libro ya ha sido añadido al carrito',
              })
                $('#carritoModal').modal('toggle');
        }
        else{
          return this.db.collection(`${email}-carrito`).add({
                  email: email,
                  imglink: imglink,
                  nombre: nombre,
                  autor: autor,
                  precio: precio,
                  categoria: categoria
              })
              .then(refDoc => {
                Swal.fire({
                    icon: 'success',
                    title: `Libro añadido al carrito`,
                    showConfirmButton: false,
                    timer: 2000
                  })
                  $('#carritoModal').modal('toggle');
              })
              .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Ha ocurrido un error al añadir el libro: ${error}`,
                  })
              })

              }

        })
      }
      })

    }


    consultarXcategoria(categoria) {
        this.db.collection(`libros`).where('categoria','==', categoria).onSnapshot(querySnapshot => {

            switch(categoria){
              case "Terror":
              $('#listaTerror').empty()
              if (querySnapshot.empty) {} else {
                  querySnapshot.forEach(lib => {
                      let libHtml = this.obtenerLista(
                          lib.data().imglink,
                          lib.data().nombre,
                          lib.data().autor,
                          lib.data().price,
                          lib.id,
                          categoria
                      )
                      $('#listaTerror').append(libHtml)
                  })
              }
              break;
              case "Acción":
              $('#listaAccion').empty()
              if (querySnapshot.empty) {} else {
                  querySnapshot.forEach(lib => {
                      let libHtml = this.obtenerLista(
                          lib.data().imglink,
                          lib.data().nombre,
                          lib.data().autor,
                          lib.data().price,
                          lib.id,
                          categoria
                      )
                      $('#listaAccion').append(libHtml)
                  })
              }
              break;
              case "Fantasía":
              $('#listaFantasia').empty()
              if (querySnapshot.empty) {} else {
                  querySnapshot.forEach(lib => {
                      let libHtml = this.obtenerLista(
                          lib.data().imglink,
                          lib.data().nombre,
                          lib.data().autor,
                          lib.data().price,
                          lib.id,
                          categoria
                      )
                      $('#listaFantasia').append(libHtml)
                  })
              }
              break;
              case "Drama":
              $('#listaDrama').empty()
              if (querySnapshot.empty) {} else {
                  querySnapshot.forEach(lib => {
                      let libHtml = this.obtenerLista(
                          lib.data().imglink,
                          lib.data().nombre,
                          lib.data().autor,
                          lib.data().price,
                          lib.id,
                          categoria
                      )
                      $('#listaDrama').append(libHtml)
                  })
              }
              break;
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
                        lib.data().autor,
                        lib.data().price,
                        lib.id
                    )
                    $('#contenido').append(libHtml)
                })
            }


        })
    }

    deleteCarrito(email, id) {
        this.db.collection(`${email}-carrito`).doc(id).delete().then(() => {
          Swal.fire({
              icon: 'success',
              title: `Libro eliminado del carrito correctamente`,
              showConfirmButton: false,
              timer: 2000
            })
            $('#deleteModal').modal('toggle');
        }).catch((error) => {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error al eliminar libro!',
            })
        });
    }

    delete(id) {
        this.db.collection("libros").doc(id).delete().then(() => {
          Swal.fire({
              icon: 'success',
              title: `Libro eliminado correctamente`,
              showConfirmButton: false,
              timer: 2000
            })
            $('#deleteModal').modal('toggle');
        }).catch((error) => {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error al eliminar libro!',
            })
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

    obtenerCover(link,title,autor,price,id) {
        return `

        <div class="col-sm" onmouseover="revealBuyOption('${id}')" onmouseout="hideBuyOption('${id}')">
        <div style="cursor:pointer; height: 300px;background: url('${link}'), url('img/default.jpg');background-size: cover;background-position: center;width: 100%;"></div>
          <p id="titleBook" class="cov-title">${title}</p>
            <p id="autorBook" class="cov-little">${autor}</p> 
         </div>
`
    }


    obtenerLista(link,title,autor,price,id,categoria) {
        return `
        <div class="col-sm-3" onmouseover="revealBuyOption('${id}')" onmouseout="hideBuyOption('${id}')">
        <div style="cursor:pointer; height: 300px;background: url('${link}'), url('img/default.jpg');background-size: cover;background-position: center;width: 100%;"></div>
          <p id="titleBook" class="${id}-book cov-title">${title}</p>
            <p id="autorBook" style="margin-bottom:0px" class="${id}-book cov-little">${autor}</p>
            <p id="priceBook" class="${id}-book cov-little">Precio: ${price}</p>
            <div   class="${id}-button container btn btn-warning secret-btn bloc-hov" onclick="addCarrito('${link}','${title}','${autor}','${price}','${categoria}')" data-toggle="modal" data-target="#carritoModal"  >Agregar al carrito</div>
        </div>
    `
    }

    obtenerCarritoTemplate(link,title,autor,precio, id) {
        return `
    <tr>
      <td class="th-image"> <div style="cursor:pointer; height: 100px;width: 70px;margin:auto; background: url('${link}'), url('img/default.jpg');background-size: cover;background-position: center;"></div>
    </td>
      <td>${title}</td>
      <td>${autor}</td>
      <td class="precio-carrito" onload="calcularTotal()">${precio}</td>
      <td><button class="btn btn-danger" onclick="eliminarDeCarrito('${id}','${precio}')" data-toggle="modal" data-target="#deleteModal">Eliminar</button></td>
    </tr> `
    }




    obtenerListaTemplate(link,title,autor,precio, categoria, id) {
        return `
    <tr>
      <td class="th-image">        <div style="cursor:pointer; height: 100px;width: 70px;margin:auto; background: url('${link}'), url('img/default.jpg');background-size: cover;background-position: center;"></div>
</td>
      <td>${title}</td>
      <td>${autor}</td>
      <td>${precio}</td>
      <td class="th-image">${categoria}</td>
      <td><button class="btn btn-danger" onclick="eliminar('${id}')" data-toggle="modal" data-target="#deleteModal">Eliminar</button></td>
    </tr> `
    }
}
