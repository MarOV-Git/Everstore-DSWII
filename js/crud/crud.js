class Crud{constructor(){this.db=firebase.firestore(),this.db.settings({timestampsInSnapshots:!0})}insertarLibro(t,e,o,a,r,i){return this.db.collection("libros").orderBy("idlibro","desc").limit(1).get().then(n=>{n.forEach(n=>{this.db.collection("libros").add({idlibro:(parseInt(n.data().idlibro)+1).toString(),nombre:t,price:e,categoria:a,autor:o,imglink:r,pdflink:i,fecha:firebase.firestore.FieldValue.serverTimestamp()}).then(t=>{$("#nombreLibroReg").val(""),$("#precioLibroReg").val(""),$("#autorReg").val(""),$("#cboCategoria option:selected").text("Categoria"),$("#pbLibro").width("0px"),$("#pbPDF").width("0px"),Swal.fire({icon:"success",title:"Libro agregado correctamente",showConfirmButton:!1,timer:1e3})}).catch(t=>{console.log(`Error creando el libro => ${t}`)})})})}actualizarLibro(t,e,o,a,r,i,n){return this.db.collection("libros").doc(t).update({nombre:e,autor:a,price:o,categoria:r,imglink:i,pdflink:n}).then(t=>{console.log(`Id del libro => ${t.id}`)}).catch(t=>{console.log(`Error creando el libro => ${t}`)})}consultarTodosItems(){this.db.collection("libros").onSnapshot(t=>{$("#contenidoCompleto").empty(),t.empty||t.forEach(t=>{let e=this.obtenerListaTemplate(t.data().imglink,t.data().nombre,t.data().autor,t.data().price,t.data().categoria,t.id,t.data().pdflink);$("#contenidoCompleto").append(e)})})}consultarCarrito(t){this.db.collection(`${t}-carrito`).onSnapshot(t=>{$("#carritoCompleto").empty(),t.empty||t.forEach(t=>{var e=parseFloat($("#totalPrecio").html()),o=parseFloat(t.data().precio);let a=this.obtenerCarritoTemplate(t.data().imglink,t.data().nombre,t.data().autor,t.data().precio,t.id);$("#totalPrecio").html((e+o).toFixed(2)),$("#carritoCompleto").append(a)}),$("#auxPrecio").html($("#totalPrecio").html())})}confirmarCarrito(t){this.db.collection(`${t}-carrito`).onSnapshot(e=>{e.empty||e.forEach(e=>{this.db.collection(`${t}-libros`).where("idlibro","==",e.data().idlibro).get().then(o=>{o.docs.length>0||this.db.collection(`${t}-libros`).add({idlibro:e.data().idlibro,imglink:e.data().imglink,nombre:e.data().nombre,autor:e.data().autor,categoria:e.data().categoria,pdflink:e.data().pdflink}).then(()=>{$("#auxPrecio").html("00.00"),$("#totalPrecio").html("00.00"),$("#auxPrecio").html("00.00"),this.db.collection(`${t}-carrito`).doc(`${e.id}`).delete().then(()=>{$("#auxPrecio").html("00.00"),$("#totalPrecio").html("00.00"),$("#auxPrecio").html("00.00")}).catch(t=>{})}).catch(t=>{})})})}),Swal.fire({icon:"success",title:" Comprado correctamente",showConfirmButton:!1,timer:2e3}),$("#deleteModal").modal("toggle")}registrarCarrito(t,e,o,a,r,i,n,l){this.db.collection(`${t}-libros`).where("nombre","==",o).get().then(d=>{d.docs.length>0?Swal.fire({icon:"error",title:"Oops...",text:"Ya has comprado este libro"}):this.db.collection(`${t}-carrito`).where("nombre","==",o).get().then(d=>{if(!(d.docs.length>0))return this.db.collection(`${t}-carrito`).add({email:t,imglink:e,nombre:o,autor:a,precio:r,categoria:i,pdflink:n,idlibro:l}).then(t=>{Swal.fire({icon:"success",title:"Libro añadido al carrito",showConfirmButton:!1,timer:2e3})}).catch(t=>{Swal.fire({icon:"error",title:"Oops...",text:`Ha ocurrido un error al añadir el libro: ${t}`})});Swal.fire({icon:"error",title:"Oops...",text:"Este libro ya ha sido añadido al carrito"})})})}consultarXcategoria(t){this.db.collection("libros").where("categoria","==",t).onSnapshot(e=>{switch(t){case"Terror":$("#listaTerror").empty(),e.empty||e.forEach(e=>{let o=this.obtenerLista(e.data().imglink,e.data().nombre,e.data().autor,e.data().price,e.id,t,btoa(e.data().pdflink),e.data().idlibro);$("#listaTerror").append(o)});break;case"Acción":$("#listaAccion").empty(),e.empty||e.forEach(e=>{let o=this.obtenerLista(e.data().imglink,e.data().nombre,e.data().autor,e.data().price,e.id,t,btoa(e.data().pdflink),e.data().idlibro);$("#listaAccion").append(o)});break;case"Fantasía":$("#listaFantasia").empty(),e.empty||e.forEach(e=>{let o=this.obtenerLista(e.data().imglink,e.data().nombre,e.data().autor,e.data().price,e.id,t,btoa(e.data().pdflink),e.data().idlibro);$("#listaFantasia").append(o)});break;case"Drama":$("#listaDrama").empty(),e.empty||e.forEach(e=>{let o=this.obtenerLista(e.data().imglink,e.data().nombre,e.data().autor,e.data().price,e.id,t,btoa(e.data().pdflink),e.data().idlibro);$("#listaDrama").append(o)})}})}consultarMisLibros(t,e){switch(e){case"Todos":this.db.collection(`${t}-libros`).onSnapshot(t=>{if($("#miLibreria").empty(),t.empty){let t=this.emptyListBook();$("#miLibreria").append(t)}else t.forEach(t=>{this.db.collection("libros").where("idlibro","==",t.data().idlibro).onSnapshot(t=>{t.empty||t.forEach(t=>{let e=this.miLibreria(t.data().imglink,t.data().nombre,t.data().autor,t.id,t.data().categoria,t.data().pdflink);$("#miLibreria").append(e),$(".emptyTotal").css("display","none")})})})});break;default:this.db.collection(`${t}-libros`).where("categoria","==",e).onSnapshot(t=>{if($("#miLibreria").empty(),t.empty){let t=this.emptyListCat();$("#miLibreria").append(t)}else t.forEach(t=>{this.db.collection("libros").where("idlibro","==",t.data().idlibro).onSnapshot(t=>{if(t.empty){let t=this.emptyListCat();$("#miLibreria").append(t)}else t.forEach(t=>{let e=this.miLibreria(t.data().imglink,t.data().nombre,t.data().autor,t.id,t.data().categoria,t.data().pdflink);$(".alertEmpty").css("display","none"),$("#miLibreria").append(e)})})})})}}consultarRecientes(){this.db.collection("libros").orderBy("fecha","desc").limit(5).onSnapshot(t=>{$("#contenido").empty(),t.empty||t.forEach(t=>{let e=this.obtenerCover(t.data().imglink,t.data().nombre,t.data().autor,t.data().price,t.id);$("#contenido").append(e)})})}deleteCarrito(t,e){this.db.collection(`${t}-carrito`).doc(e).delete().then(()=>{Swal.fire({icon:"success",title:"Libro eliminado del carrito correctamente",showConfirmButton:!1,timer:2e3}),$("#deleteModal").modal("toggle")}).catch(t=>{Swal.fire({icon:"error",title:"Oops...",text:"Error al eliminar libro!"})})}delete(t){this.db.collection("libros").doc(t).delete().then(()=>{Swal.fire({icon:"success",title:"Libro eliminado correctamente",showConfirmButton:!1,timer:2e3}),$("#deleteModal").modal("toggle")}).catch(t=>{Swal.fire({icon:"error",title:"Oops...",text:"Error al eliminar libro!"})})}subirPdf(t,e){const o=firebase.storage().ref(`pdfBooks/${e}/${t.name}`).put(t);o.on("state_changed",t=>{const e=(t.bytesTransferred/t.totalBytes*100).toFixed(2);$("#pbPDF").attr("style",`width:${e}%`),$("#pbPDF").text(`${e}%`),console.log("cargando")},t=>{alert(`Error subiendo el archivo ${error.message}!!`)},()=>{o.snapshot.ref.getDownloadURL().then(t=>{console.log(t),sessionStorage.setItem("imgNewPdf",t)}).catch(t=>{alert(`Error obteniendo downloadURL ${error.message} !!`)})})}subirPortadaLibro(t,e){const o=firebase.storage().ref(`coverBooks/${e}/${t.name}`).put(t);o.on("state_changed",t=>{const e=(t.bytesTransferred/t.totalBytes*100).toFixed(2);$("#pbLibro").attr("style",`width:${e}%`),$("#pbLibro").text(`${e}%`),console.log("cargando")},t=>{alert(`Error subiendo el archivo ${error.message}!!`)},()=>{o.snapshot.ref.getDownloadURL().then(t=>{console.log(t),sessionStorage.setItem("imgNewCover",t)}).catch(t=>{alert(`Error obteniendo downloadURL ${error.message} !!`)})})}precioTag(t){return`\n      <span style="display:none" id="totalTag">${t}</span>\n      `}emptyListBook(){return'\n      <div class="alert alert-danger emptyTotal" role="alert" style="margin:auto">\n        No tienes ningún libro comprado.\n        </div>\n         '}emptyListCat(){return'\n      <div class="alert alert-danger alertEmpty" role="alert" style="margin:auto">\n        No tienes libros que pertenezcan a esta categoría.\n        </div>\n         '}obtenerCover(t,e,o,a,r){return`\n        <div class="col-sm" onmouseover="revealBuyOption('${r}')" onmouseout="hideBuyOption('${r}')">\n        <div style="cursor:pointer; height: 300px;background: url('${t}'), url('img/default.jpg');background-size: cover;background-position: center;width: 100%;"></div>\n          <p id="titleBook" class="cov-title">${e}</p>\n            <p id="autorBook" class="cov-little">${o}</p>\n         </div>\n`}obtenerLista(t,e,o,a,r,i,n,l){return`\n        <div class="col-sm-3" onmouseover="revealBuyOption('A${r}')" onmouseout="hideBuyOption('A${r}')">\n        <div style="cursor:pointer; height: 300px;background: url('${t}'), url('img/default.jpg');background-size: cover;background-position: center;width: 100%;"></div>\n          <p id="titleBook" class="A${r}-book cov-title">${e}</p>\n            <p id="autorBook" style="margin-bottom:0px" class="A${r}-book cov-little">${o}</p>\n            <p id="priceBook" class="A${r}-book cov-little">Precio: ${a}</p>\n            <div   class="A${r}-button container btn btn-warning secret-btn bloc-hov" onclick="addCarrito('${l}','${t}','${e}','${o}','${a}','${i}','${n}')" data-toggle="modal" data-target="#carritoModal"  >Agregar al carrito</div>\n        </div>\n    `}miLibreria(t,e,o,a,r,i){return`\n        <div class="col-sm-3 librosItem " onmouseover="revealReadOption('A${a}')" onmouseout="hideReadOption('A${a}')" >\n        <div style="cursor:pointer; height: 300px;background: url('${t}'), url('img/default.jpg');background-size: cover;background-position: center;width: 100%;"></div>\n          <p id="titleBook" class="A${a}-book cov-title ">${e}</p>\n            <p id="autorBook" style="margin-bottom:0px" class="A${a}-book cov-little">${o}</p>\n            <div   class="A${a}-button container btn btn-warning secret-btn bloc-hov bg-main" onclick="viewPdf('${i}')" style="color:rgba(255,255,255,.5)  " data-toggle="modal" data-target="#PedigreesSireRacing"  >Leer</div>\n         </div>\n    `}obtenerCarritoTemplate(t,e,o,a,r){return`\n    <tr>\n      <td class="th-image"> <div style="cursor:pointer; height: 100px;width: 70px;margin:auto; background: url('${t}'), url('img/default.jpg');background-size: cover;background-position: center;"></div>\n    </td>\n      <td>${e}</td>\n      <td>${o}</td>\n      <td class="precio-carrito" onload="calcularTotal()">${a}</td>\n      <td><button class="btn btn-danger" onclick="eliminarDeCarrito('${r}','${a}')" data-toggle="modal" data-target="#deleteModal">Eliminar</button></td>\n     </tr> `}obtenerListaTemplate(t,e,o,a,r,i,n){return`\n    <tr>\n      <td class="th-image">        <div style="cursor:pointer; height: 100px;width: 70px;margin:auto; background: url('${t}'), url('img/default.jpg');background-size: cover;background-position: center;"></div>\n</td>\n      <td>${e}</td>\n      <td>${o}</td>\n      <td>${a}</td>\n      <td class="th-image">${r}</td>\n      <td><button class="btn btn-danger" onclick="eliminar('${i}')" data-toggle="modal" data-target="#deleteModal">Eliminar</button></td>\n        <td><button class="btn btn-warning" onclick="actualizar('${i}','${t}','${e}','${o}','${a}','${r}','${n}')" data-toggle="modal" data-target="#updateModal">Actualizar</button></td>\n    </tr> `}}
