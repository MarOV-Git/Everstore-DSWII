class Utilidad {
  static obtenerFecha (timeStamp) {
    const d = new Date(timeStamp)
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    let year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [day, month, year].join('/')
  }
}


function eliminar(id) {
    var s = document.getElementById('data');
    s.textContent = id
}

function eliminarDeCarrito(id,precio) {
  var email = document.querySelector('#name-val');
  var emailSelected = email.getAttribute('data-email');
  var dataEmail = document.getElementById('data-email');
  var dataPriceTotal = document.getElementById('totalPrecio');
  var dataPrice = document.getElementById('data-precio');
  dataPrice.textContent = Math.abs(parseFloat(precio)-parseFloat(dataPriceTotal.innerText)) ;

    var s = document.getElementById('data');
    s.textContent = id
    dataEmail.textContent = emailSelected
}


function addCarrito(imglink, nombre, autor, price, categoria) {
    var email = document.querySelector('#name-val');
    var emailSelected = email.getAttribute('data-email');
    var dataEmail = document.getElementById('data-email');
    var datalink = document.getElementById('data-imglink');
    var dataNombre = document.getElementById('data-nombre');
    var dataAutor = document.getElementById('data-autor');
    var dataPrice = document.getElementById('data-price');
    var dataCategoria = document.getElementById('data-categoria');
    dataCategoria.textContent = categoria
    dataEmail.textContent = emailSelected
    datalink.textContent = imglink
    dataNombre.textContent = nombre
    dataAutor.textContent = autor
    dataPrice.textContent = price
}




function revealBuyOption(id) {
	document.querySelectorAll(`.${id}-book`).forEach(item => {
    item.classList.add("bloc-hov");
	});
	document.querySelectorAll(`.${id}-button`).forEach(item => {
		item.classList.remove("bloc-hov");
	});
 console.log(this);
}

function hideBuyOption(id) {
	document.querySelectorAll(`.${id}-book`).forEach(item => {
    item.classList.remove("bloc-hov");
	});

	document.querySelectorAll(`.${id}-button`).forEach(item => {
		item.classList.add("bloc-hov");
	});
}
