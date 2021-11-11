$(() => {

  $("#btnAdd").click(function(event) {
      event.preventDefault();
  });


    $('.tooltipped').tooltip({ delay: 50 })
    firebase.initializeApp(firebaseConfig);

    this.db = firebase.firestore();
    const settings = { timestampsInSnapshots: true }
    this.db.settings(settings)

    const crud = new Crud()

    crud.consultarTodosItems()


var tipoUsuario = "Admin";

    firebase.auth().onAuthStateChanged(user => {

      const usuario = this.db.collection("usuarios").where("email", "==", user.email).where("tipo", "==","Admin");
        usuario.get().then( (qsnapshot) => {
          if (qsnapshot.docs.length > 0) {
           console.log("Es admin");
           $('#mantSec').removeClass('d-none')
        }
        else {
          console.log("No es admin");
          $('#mantSec').addClass('d-none')
        }
        })


        if (user) {
          if(user.displayName){
            $('#unlog').addClass('d-none');
            $('#logued').removeClass('d-none');
            $('#user-name').html(`<i class="fa fa-user-o lf"></i><span id="name-val">${user.displayName}</span>`);
          }
            $('#avatar').removeClass('d-none')
            if (user.photoURL) {
                $('#avatar').attr('src', user.photoURL)
            } else {
                $('#avatar').attr('src', 'img/usuario_auth.png')
            }
        } else {
            $('#btnInicioSesion1').html('Iniciar Sesión')
            $('#btnInicioSesion2').html('Iniciar Sesión')
            $('#mantenimiento').addClass('d-none')
            $('#avatar').addClass('d-none')
            $(document).ready(function() {
                $('#loginModal').modal('show');

            });

        }
    })



    $("form").submit(function(e){
     e.preventDefault();
 });

    $('#btnInicioSesion').click(() => {

        const user = firebase.auth().currentUser
        if (user) {
            $('#btnInicioSesion1').text('Iniciar Sesión')
            return firebase.auth().signOut().then(() => {
                    alert(`SignOut correcto`)
                    window.setTimeout(function() {

                        window.location.href = "index.html";
                    }, 500);
                })
                .catch(error => {
                    alert(`Error al realizar SignOut => ${error}`)
                })
        }

        $('#emailSesion').val('')
        $('#passwordSesion').val('')
        $('#modalSesion').modal('show')
    })

    $('#btnInicioSesion2').click(() => {

        const user = firebase.auth().currentUser
        if (user) {
            $('#btnInicioSesion1').text('Iniciar Sesión')
            return firebase.auth().signOut().then(() => {
                    $('#avatar').attr('src', 'img/usuario.png')
                    alert(`SignOut correcto`)
                    window.setTimeout(function() {

                        window.location.href = "index.html";
                    }, 500);
                })
                .catch(error => {
                    alert(`Error al realizar SignOut => ${error}`)
                })

            $('#btnInicioSesion2').text('Iniciar Sesión')
            return firebase.auth().signOut().then(() => {
                    $('#avatar').attr('src', 'img/usuario.png')
                    alert(`SignOut correcto`)
                    window.setTimeout(function() {

                        window.location.href = "index.html";
                    }, 500);
                })
                .catch(error => {
                    alert(`Error al realizar SignOut => ${error}`)
                })
        }

        $('#emailSesion').val('')
        $('#passwordSesion').val('')
        $('#modalSesion').modal('show')
    })


    $('#btn-logout').click(() => {
        const usuario = $('#name-val').html();
        firebase.auth().signOut()
            .then(() => {
              Swal.fire({
                title: '¡Adios!',
                text: `Hasta la proxima ${usuario}`,
                imageUrl: 'img/bye.png',
                imageWidth: 400,
                imageAlt: 'Custom image',
                })
                window.setTimeout(function() {

                    window.location.href = "index.html";
                }, 1500);
            })
            .catch(error => {
              Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `Ocurrió un problema al realizar el SignOut ${error}`,
            })
         })

    })

})
