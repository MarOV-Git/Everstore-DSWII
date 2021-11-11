$(() => {

    const crud = new Crud()

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
            const imagelink = sessionStorage.getItem('imgNewCover') == 'null'? null : sessionStorage.getItem('imgNewCover')
            const uploadedOrNot = $('#pbLibro').width()==360?true:false;
            if(nombre ==""|| price==""||autor==""){
              Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'No deje espacios en blanco!',
                })
            }
            else if (categoria =="Categoria"){
              Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Tiene que seleccionar una categoría!',
                })
            }
            else if (uploadedOrNot == false){
              Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'No ha subido ninguna imagen!',
                })
            }
            else{
              crud.insertarLibro(nombre,price,autor,categoria,imagelink).then(resp =>{
                Swal.fire({
                    icon: 'success',
                    title: `Libro agregado correctamente`,
                    showConfirmButton: false,
                    timer: 2000
                  })
                  window.setTimeout(function() {

                      window.location.href = "addLibro.html";
                  }, 1000);
              });
            }
          }

    })

    $('#btnDelete').click(() => {
        const id = $('#data').text();
        crud.delete(id)

    })

    $('#btnUploadFile').on('change', e=>{
        const file = e.target.files[0]

        const user = firebase.auth().currentUser

        const crud = new Crud();

        crud.subirPortadaLibro(file, user.uid)
    });
});
