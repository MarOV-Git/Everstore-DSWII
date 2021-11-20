class Utilidad {
    static obtenerFecha(timeStamp) {
        const d = new Date(timeStamp)
        let month = '' + (d.getMonth() + 1)
        let day = '' + d.getDate()
        let year = d.getFullYear()

        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day

        return [day, month, year].join('/')
    }
}

function actualizar(id, link, title, autor, precio, categoria, pdflink) {
    $('#nombreLibroAct').val(title);
    $('#autorAct').val(autor);
    $('#precioLibroAct').val(precio);
    $("#cboCategoria").val(categoria);
    $('#data-id').html(id);
    $('#data-imgaux').html(link);
    $('#data-pdfaux').html(pdflink);
}


function viewPdf(link) {
    if (link != "undefined") {
        var embed = document.getElementById("pdftoview");
        embed.setAttribute('src', link);
    } else {
        var embed = document.getElementById("pdftoview");
        embed.setAttribute('src', 'https://www.cibertec.edu.pe/wp-content/uploads/2019/09/MEDIOS-DE-PAGO-CIBERTEC-2019.pdf');
    }
}

function eliminar(id) {
    var s = document.getElementById('data');
    s.textContent = id
}

function eliminarDeCarrito(id, precio) {
    var email = document.querySelector('#name-val');
    var emailSelected = email.getAttribute('data-email');
    var dataEmail = document.getElementById('data-email');
    var dataPriceTotal = document.getElementById('totalPrecio');
    var dataPrice = document.getElementById('data-precio');
    dataPrice.textContent = Math.abs(parseFloat(precio) - parseFloat(dataPriceTotal.innerText));

    var s = document.getElementById('data');
    s.textContent = id
    dataEmail.textContent = emailSelected
}


function addCarrito(idlibro, imglink, nombre, autor, price, categoria, pdflink) {
    var idbook = document.getElementById('data-idlibro');
    var email = document.querySelector('#name-val');
    var emailSelected = email.getAttribute('data-email');
    var dataEmail = document.getElementById('data-email');
    var datalink = document.getElementById('data-imglink');
    var dataNombre = document.getElementById('data-nombre');
    var dataAutor = document.getElementById('data-autor');
    var dataPrice = document.getElementById('data-price');
    var dataCategoria = document.getElementById('data-categoria');
    var dataPdflink = document.getElementById('data-pdflink');
    idbook.textContent = idlibro
    dataCategoria.textContent = categoria
    dataEmail.textContent = emailSelected
    datalink.textContent = imglink
    dataNombre.textContent = nombre
    dataAutor.textContent = autor
    dataPrice.textContent = price
    dataPdflink.textContent = pdflink
}



function revealReadOption(id) {
    document.querySelectorAll(`.${id}-book`).forEach(item => {
        item.classList.add("bloc-hov");
    });
    document.querySelectorAll(`.${id}-button`).forEach(item => {
        item.classList.remove("bloc-hov");
    });
}

function hideReadOption(id) {
    document.querySelectorAll(`.${id}-book`).forEach(item => {
        item.classList.remove("bloc-hov");
    });

    document.querySelectorAll(`.${id}-button`).forEach(item => {
        item.classList.add("bloc-hov");
    });
}




function revealBuyOption(id) {
    document.querySelectorAll(`.${id}-book`).forEach(item => {
        item.classList.add("bloc-hov");
    });
    document.querySelectorAll(`.${id}-button`).forEach(item => {
        item.classList.remove("bloc-hov");
    });
}

function hideBuyOption(id) {
    document.querySelectorAll(`.${id}-book`).forEach(item => {
        item.classList.remove("bloc-hov");
    });

    document.querySelectorAll(`.${id}-button`).forEach(item => {
        item.classList.add("bloc-hov");
    });
}