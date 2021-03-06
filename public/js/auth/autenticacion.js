class Autenticacion {
    constructor() {
        this.db = firebase.firestore();
        const settings = { timestampsInSnapshots: true }
        this.db.settings(settings)
    }

    autEmailPass(email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(result => {
                if (result.user.emailVerified) {
                    Swal.fire({
                        title: '¡Hola!',
                        text: `¡Bienvenido otra vez!`,
                        imageUrl: 'img/wait.png',
                        imageWidth: 400,
                        imageAlt: 'Custom image',
                    })

                        $('#unlog').addClass('d-none');
                        $('#logued').removeClass('d-none');
                } else {
                    firebase.auth().signOut()
                    Swal.fire({
                        title: '¡Hola!',
                        text: `Tu cuenta no esta verificada, realiza el proceso antes de ingresar.`,
                        imageUrl: 'img/wait.png',
                        imageWidth: 400,
                        imageAlt: 'Custom image',
                    })
                    $('#loginModal').modal('toggle');
                    window.setTimeout(function() {
                      window.location.href = "index.html";
                    }, 1500);
                }
            }).catch(error => {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.message,
                    footer: ''
                })
            })


    }

    crearCuentaEmailPass(email, password, nombres) {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((result) => {
                const configuracion = {
                    url: 'https://everstore-fba41.web.app/index.html'
                }

                result.user.sendEmailVerification(configuracion).catch(error => {
                    console.error(error)
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.message,
                        footer: ''
                    })

                })
                firebase.auth().signOut()
                Swal.fire({
                    title: '¡Hola!',
                    text: `Bienvenido ${nombres}, debes realizar el proceso de verificación`,
                    imageUrl: 'img/wait.png',
                    imageWidth: 400,
                    imageAlt: 'Custom image',
                })


                const usuario = this.db.collection("usuarios").where("email", "==", email);
                          usuario.get().then((qsnapshot) => {
                              if (qsnapshot.docs.length > 0) {
                                  console.log('Usuario ya almacenado');
                              } else {
                                  return this.db.collection('usuarios').doc(`${email}`).set({
                                          nombre: nombres,
                                          email: email,
                                          tipo: "Usuario"
                                      })
                                      .then(refDoc => {
                                          console.log(`Id del usuario => ${refDoc.id}`);
                                      })
                                      .catch(error => {
                                          console.log(`Error creando el usuario => ${error}`);

                                      })
                              }
                          })

            })
            .catch(error => {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: (error.message),
                    footer: ''
                })
            })
    }



    authCuentaGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(result => {

                const usuario = this.db.collection("usuarios").where("email", "==", result.user.email);
                usuario.get().then((qsnapshot) => {
                    if (qsnapshot.docs.length > 0) {
                        console.log('Usuario ya almacenado');
                    } else {
                        return this.db.collection('usuarios').doc(`${result.user.email}`).set({
                                nombre: result.user.displayName,
                                email: result.user.email,
                                tipo: "Usuario"
                            })
                            .then(refDoc => {
                                console.log(`Id del usuario => ${refDoc.id}`);
                            })
                            .catch(error => {
                                console.log(`Error creando el usuario => ${error}`);
                            })
                    }
                })


                Swal.fire({
                    title: '¡Hola!',
                    text: `Bienvenido ${result.user.displayName}`,
                    imageUrl: 'img/hi.png',
                    imageWidth: 400,
                    imageAlt: 'Custom image',
                })
                window.setTimeout(function() {}, 1500);
            })
            .catch(error => {
                console.error(error)
                Swal.fire(`Error al autenticarse ${error} !! `)
            })

    }


    authCuentaFacebook() {

        const provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider).then(result => {
                const usuario = this.db.collection("usuarios").where("email", "==", result.user.email);
                usuario.get().then((qsnapshot) => {
                    if (qsnapshot.docs.length > 0) {
                        console.log('Usuario ya almacenado');
                    } else {
                        return this.db.collection('usuarios').doc(`${result.user.email}`).set({
                                nombre: result.user.displayName,
                                email: result.user.email,
                                tipo: "Usuario"
                            })
                            .then(refDoc => {
                                console.log(`Id del usuario => ${refDoc.id}`);
                            })
                            .catch(error => {
                                console.log(`Error creando el usuario => ${error}`);
                            })
                    }
                })


                Swal.fire({
                    title: '¡Hola!',
                    text: `Bienvenido ${result.user.displayName}`,
                    imageUrl: 'img/hi.png',
                    imageWidth: 400,
                    imageAlt: 'Custom image',
                })
            })
            .catch(error => {
                console.error(error)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Error al autenticarse ${error}`,
                    footer: ''
                })
            })

    }





    authTwitter() {
        const provider = new firebase.auth.TwitterAuthProvider();
        firebase.auth().signInWithPopup(provider).then(result => {
                const usuario = this.db.collection("usuarios").where("email", "==", result.user.email);
                usuario.get().then((qsnapshot) => {
                    if (qsnapshot.docs.length > 0) {
                        console.log('Usuario ya almacenado');
                    } else {
                        return this.db.collection('usuarios').doc(`${result.user.email}`).set({
                                nombre: result.user.displayName,
                                email: result.user.email,
                                tipo: "Usuario"
                            })
                            .then(refDoc => {
                                console.log(`Id del usuario => ${refDoc.id}`);
                            })
                            .catch(error => {
                                console.log(`Error creando el usuario => ${error}`);
                            })
                    }
                })


                Swal.fire({
                    title: '¡Hola!',
                    text: `Bienvenido ${result.user.displayName}`,
                    imageUrl: 'img/hi.png',
                    imageWidth: 400,
                    imageAlt: 'Custom image',
                })
            })
            .catch(error => {
                console.error(error)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Error al autenticarse ${error}`,
                    footer: ''
                })
            })
    }
}
