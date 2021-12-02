class Crud {
    constructor() {
        this.db = firebase.firestore();
        const settings = {
            timestampsInSnapshots: true
        }
        this.db.settings(settings)
    }

    insertarLibro(nombre, price, autor, categoria, imglink, pdflink) {
        return this.db.collection(`libros`).orderBy("idlibro", "desc").limit(1).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

                this.db.collection('libros').add({
                        idlibro: (parseInt(doc.data().idlibro) + 1),
                        nombre: nombre,
                        price: price,
                        categoria: categoria,
                        autor: autor,
                        imglink: imglink,
                        pdflink: pdflink,
                        fecha: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    .then(refDoc => {
                        $('#nombreLibroReg').val('')
                       $('#precioLibroReg').val('')
                         $('#autorReg').val('')
                       $('#cboCategoria option:selected').text('Categoria')
                       $('#pbLibro').width('0px');
                       $('#pbPDF').width('0px');
                        $('#pbLibro').text('')
                        $('#pbPDF').text('')
                        $("#btnUploadPDF").val(''),
                        $("#btnUploadFile").val(''),
                        Swal.fire({
                            icon: 'success',
                            title: `Libro agregado correctamente`,
                            showConfirmButton: false,
                            timer: 1000
                        })
                    })
                    .catch(error => {
                        console.log(`Error creando el libro => ${error}`);
                    })
            })
        });
    }


    actualizarLibro(id, nombre, price, autor, categoria, imglink, pdflink) {
        return this.db.collection('libros').doc(id).update({
                nombre: nombre,
                autor: autor,
                price: price,
                categoria: categoria,
                imglink: imglink,
                pdflink: pdflink
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
                        lib.id,
                        lib.data().pdflink
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
                    $('#totalPrecio').html((actual + auxiliar).toFixed(2))
                    $('#carritoCompleto').append(libHtml)
                })

            }
            $('#auxPrecio').html($('#totalPrecio').html())
        })
    }



    confirmarCarrito(email) {
        this.db.collection(`${email}-carrito`).onSnapshot(querySnapshot => {
            if (querySnapshot.empty) {

            } else {
                querySnapshot.forEach(lib => {
                    const libros = this.db.collection(`${email}-libros`).where("idlibro", "==", lib.data().idlibro);
                    libros.get().then((qsnapshot) => {
                        if (qsnapshot.docs.length > 0) {} else {
                            this.db.collection(`${email}-libros`).add({
                                idlibro: parseInt(lib.data().idlibro),
                                imglink: lib.data().imglink,
                                nombre: lib.data().nombre,
                                autor: lib.data().autor,
                                categoria: lib.data().categoria,
                                pdflink: lib.data().pdflink
                            }).then(() => {
                                $('#auxPrecio').html('00.00');
                                $('#totalPrecio').html('00.00');
                                $('#auxPrecio').html('00.00');
                                this.db.collection(`${email}-carrito`).doc(`${lib.id}`).delete().then(() => {
                                    $('#auxPrecio').html('00.00');
                                    $('#totalPrecio').html('00.00');
                                    $('#auxPrecio').html('00.00');
                                }).catch((error) => {});
                            }).catch((error) => {});


                        }

                    })
                })
            }
        })

        Swal.fire({
            icon: 'success',
            title: ` Comprado correctamente`,
            showConfirmButton: false,
            timer: 2000
        })
        $('#deleteModal').modal('toggle');
    }




    registrarCarrito(email, imglink, nombre, autor, precio, categoria, pdflink, idlibro) {
      firebase.auth().onAuthStateChanged(user => {

          if (user) {
        const libros = this.db.collection(`${email}-libros`).where("idlibro", "==", parseInt(idlibro));
        libros.get().then((qsnapshot) => {
            if (qsnapshot.docs.length > 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ya has comprado este libro',
                })

            } else {
                const usuario = this.db.collection(`${email}-carrito`).where("idlibro", "==", parseInt(idlibro));
                usuario.get().then((qsnapshot) => {
                    if (qsnapshot.docs.length > 0) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Este libro ya ha sido añadido al carrito',
                        })
                    } else {
                        return this.db.collection(`${email}-carrito`).add({
                                email: email,
                                imglink: imglink,
                                nombre: nombre,
                                autor: autor,
                                precio: precio,
                                categoria: categoria,
                                pdflink: pdflink,
                                idlibro: parseInt(idlibro)
                            })
                            .then(refDoc => {
                                Swal.fire({
                                    icon: 'success',
                                    title: `Libro añadido al carrito`,
                                    showConfirmButton: false,
                                    timer: 2000
                                })

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
      else{
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `Necesitas iniciar sesión para realizar este proceso`,
          })
      }
    })
    }


    consultarXcategoria(categoria) {
        this.db.collection(`libros`).where('categoria', '==', categoria).onSnapshot(querySnapshot => {

            switch (categoria) {
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
                                categoria,
                                btoa(lib.data().pdflink),
                              parseInt(lib.data().idlibro)
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
                                categoria,
                                btoa(lib.data().pdflink),
                                parseInt(lib.data().idlibro)
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
                                categoria,
                                btoa(lib.data().pdflink),
                                parseInt(lib.data().idlibro)
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
                                categoria,
                                btoa(lib.data().pdflink),
                                parseInt(lib.data().idlibro)
                            )
                            $('#listaDrama').append(libHtml)
                        })
                    }
                    break;
            }
        })
    }



    consultarMisLibros(email, categoria) {
        switch (categoria) {
            case "Todos":
                this.db.collection(`${email}-libros`).onSnapshot(querySnapshot => {
                    $('#miLibreria').empty()
                    if (querySnapshot.empty) {

                        let libHtml = this.emptyListBook()
                        $('#miLibreria').append(libHtml);
                    } else {
                        querySnapshot.forEach(leb => {

                            this.db.collection(`libros`).where('idlibro', '==', parseInt(leb.data().idlibro)).onSnapshot(querySnapshot => {
                                if (querySnapshot.empty) {} else {
                                    querySnapshot.forEach(lib => {
                                        let libHtml = this.miLibreria(
                                            lib.data().imglink,
                                            lib.data().nombre,
                                            lib.data().autor,
                                            lib.id,
                                            lib.data().categoria,
                                            lib.data().pdflink
                                        )
                                        $('#miLibreria').append(libHtml)
                                        $('.emptyTotal').css('display', 'none');
                                    })
                                }
                            })



                        })




                    }


                })
                break;
            default:
                this.db.collection(`libros`).where('categoria', '==', categoria).onSnapshot(querySnapshot => {
                    $('#miLibreria').empty()
                    if (querySnapshot.empty) {
                    } else {
                        querySnapshot.forEach(leb => {

                            this.db.collection(`${email}-libros`).where('idlibro', '==', parseInt(leb.data().idlibro)).onSnapshot(querySnapshot => {
                                if (querySnapshot.empty) {
                                } else {
                                    querySnapshot.forEach(lib => {
                                        this.db.collection(`libros`).where('idlibro', '==', parseInt(lib.data().idlibro)).onSnapshot(querySnapshot => {
                                            if (querySnapshot.empty) {
                                                let libHtml = this.emptyListCat()
                                                $('#miLibreria').append(libHtml);
                                            } else {
                                                querySnapshot.forEach(reb => {
                                                    let libHtml = this.miLibreria(
                                                        reb.data().imglink,
                                                        reb.data().nombre,
                                                        reb.data().autor,
                                                        reb.id,
                                                        reb.data().categoria,
                                                        reb.data().pdflink
                                                    )
                                                    $('.alertEmpty').css('display', 'none');
                                                    $('#miLibreria').append(libHtml)
                                                })
                                            }
                                        })

                                    })
                                }
                            })



                        })




                    }


                })




        }

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


    subirPdf(file, uid) {
          $("#btnUploadPDF").val('')
      const random =  Math.floor(Math.random() * (45451561687894156132 + 1) + 10000000200000);
        const refStorage = firebase.storage()
            .ref(`pdfBooks/${uid}/${random}_${file.name}`)
        const task = refStorage.put(file)
        task.on('state_changed', snapshot => {
                var porcentaje = (snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(2);
                if(porcentaje < 1){
                  porcentaje = 30.00
                }
                console.log(porcentaje)
                $('#pbPDF').attr('style', `width:${porcentaje-30}%`);
                $('#pbPDF').text(`${(porcentaje-30).toFixed(2)}%`);
                console.log('cargando');
            },
            err => {
                alert(`Error subiendo el archivo ${error.message}!!`);
            },
            () => {
                task.snapshot.ref.getDownloadURL()
                    .then(url => {

                        console.log(url)
                        sessionStorage.setItem('imgNewPdf', url)
                        $('#pbPDF').attr('style', `width:100%`);
                        $('#pbPDF').text(`100.00%`);
                     })
                    .catch(err => {
                        alert(`Error obteniendo downloadURL ${err.message} !!`);
                    })
            }
        )
    }



    subirPortadaLibro(file, uid) {
      $("#btnUploadFile").val('')
      const random =  Math.floor(Math.random() * (45451561687894156132 + 1) + 10000000200000);

        const refStorage = firebase.storage()
            .ref(`coverBooks/${uid}/${random}_${file.name}`)


        const task = refStorage.put(file)
        task.on('state_changed', snapshot => {
                var porcentaje = (snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(2);
                if(porcentaje < 1){
                  porcentaje = 30.00
                }
                $('#pbLibro').attr('style', `width:${porcentaje-30}%`);
                $('#pbLibro').text(`${(porcentaje-30).toFixed(2)}%`);
                console.log('cargando');
            },
            err => {
                alert(`Error subiendo el archivo ${error.message}!!`);
            },
            () => {
                task.snapshot.ref.getDownloadURL()
                    .then(url => {
                        console.log(url)
                        sessionStorage.setItem('imgNewCover', url)
                        $('#pbLibro').attr('style', `width:100%`);
                        $('#pbLibro').text(`100.00%`);
                    })
                    .catch(err => {
                        alert(`Error obteniendo downloadURL ${err.message} !!`);
                    })
            }
        )
    }




    precioTag(precio) {
        return `
      <span style="display:none" id="totalTag">${precio}</span>
      `
    }

    emptyListBook() {
        return `
      <div class="alert alert-danger emptyTotal" role="alert" style="margin:auto">
        No tienes ningún libro comprado.
        </div>
         `
    }

    emptyListCat() {
        return `
      <div class="alert alert-danger alertEmpty" role="alert" style="margin:auto">
        No tienes libros que pertenezcan a esta categoría.
        </div>
         `
    }

    obtenerCover(link, title, autor, price, id) {
        return `
        <div class="col-sm" onmouseover="revealBuyOption('${id}')" onmouseout="hideBuyOption('${id}')">
        <div style="cursor:pointer; height: 300px;background: url('${link}'), url('img/default.jpg');background-size: cover;background-position: center;width: 100%;"></div>
          <p id="titleBook" class="cov-title">${title}</p>
            <p id="autorBook" class="cov-little">${autor}</p>
         </div>
`
    }


    obtenerLista(link, title, autor, price, id, categoria, pdflink, idlibro) {
        return `
        <div class="col-sm-3" onmouseover="revealBuyOption('A${id}')" onmouseout="hideBuyOption('A${id}')">
        <div style="cursor:pointer; height: 300px;background: url('${link}'), url('img/default.jpg');background-size: cover;background-position: center;width: 100%;"></div>
          <p id="titleBook" class="A${id}-book cov-title">${title}</p>
            <p id="autorBook" style="margin-bottom:0px" class="A${id}-book cov-little">${autor}</p>
            <p id="priceBook" class="A${id}-book cov-little">Precio: ${price}</p>
            <div   class="A${id}-button container btn btn-warning secret-btn bloc-hov" onclick="addCarrito('${idlibro}','${link}','${title}','${autor}','${price}','${categoria}','${pdflink}')" data-toggle="modal" data-target="#carritoModal"  >Agregar al carrito</div>
        </div>
    `
    }


    miLibreria(link, title, autor, id, categoria, pdflink) {
        return `
        <div class="col-sm-3 librosItem " onmouseover="revealReadOption('A${id}')" onmouseout="hideReadOption('A${id}')" >
        <div style="cursor:pointer; height: 300px;background: url('${link}'), url('img/default.jpg');background-size: cover;background-position: center;width: 100%;"></div>
          <p id="titleBook" class="A${id}-book cov-title ">${title}</p>
            <p id="autorBook" style="margin-bottom:0px" class="A${id}-book cov-little">${autor}</p>
            <div   class="A${id}-button container btn btn-warning secret-btn bloc-hov bg-main" onclick="viewPdf('${pdflink}')" style="color:rgba(255,255,255,.5)  " data-toggle="modal" data-target="#PedigreesSireRacing"  >Leer</div>
         </div>
    `
    }




    obtenerCarritoTemplate(link, title, autor, precio, id) {
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




    obtenerListaTemplate(link, title, autor, precio, categoria, id, pdflink) {
        return `
    <tr>
      <td class="th-image">        <div style="cursor:pointer; height: 100px;width: 70px;margin:auto; background: url('${link}'), url('img/default.jpg');background-size: cover;background-position: center;"></div>
</td>
      <td>${title}</td>
      <td>${autor}</td>
      <td>${precio}</td>
      <td class="th-image">${categoria}</td>
      <td><button class="btn btn-danger" onclick="eliminar('${id}')" data-toggle="modal" data-target="#deleteModal">Eliminar</button></td>
        <td><button class="btn btn-warning" onclick="actualizar('${id}','${link}','${title}','${autor}','${precio}','${categoria}','${pdflink}')" data-toggle="modal" data-target="#updateModal">Actualizar</button></td>
    </tr> `
    }
}
