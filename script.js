function miEcommerce() {
    let puntoSur = [
        { id: 1, nombre: "Conjunto Lanilla", categoría: "Invierno", stock: 3, precio: 11300, descripcion: "Conjunto de lanilla cómodo y abrigado para el invierno", imagen: "conjuntolanilla.jpg" },
        { id: 2, nombre: "Capa Azul", categoría: "Otoño", stock: 6, precio: 12000, descripcion: "Capa estampada para dormir en Invierno", imagen: "capazul.jpg" },
        { id: 3, nombre: "Pijama Zoo", categoría: "Otoño", stock: 8, precio: 9050, descripcion: "Pijama fresco y cómodo de Otoño", imagen: "pijama.jpg" },
        { id: 4, nombre: "Buzo Azul Claro", categoría: "Otoño", stock: 7, precio: 7500, descripcion: "Buzo liviano para días templados de Otoño", imagen: "buzoceleste.jpg" },
        { id: 5, nombre: "Top Flores", categoría: "Otoño", stock: 2, precio: 6000, descripcion: "Top con flores y tiras de Invierno", imagen: "topcolor.png" },
        { id: 6, nombre: "Buzo Celeste con Polar", categoría: "Invierno", stock: 5, precio: 9050, descripcion: "Buzo grueso interior polar para el Invierno", imagen: "buzogruesoceleste.jpg" },
        { id: 7, nombre: "Buzo Tricolor", categoría: "Otoño", stock: 11, precio: 7500, descripcion: "Buzo liviano para días templados de Otoño", imagen: "buzoamarillo.png" },
        { id: 8, nombre: "Conjunto Rayado", categoría: "Invierno", stock: 6, precio: 12450, descripcion: "Conjunto deportivo para Invierno", imagen: "conjuntoverde.jpg" },
        { id: 9, nombre: "Top Claro", categoría: "Otoño", stock: 12, precio: 9050, descripcion: "Top fino de Otoño", imagen: "topclaro.png" }
    ]

    renderizar(puntoSur)
    let buscador = document.getElementById("buscador")
    buscador.addEventListener("input", () => buscar(puntoSur, buscador.value))
    let botonCarrito = document.getElementById("botonCarrito")
    let botonShop = document.getElementById("botonShop")
    botonCarrito.addEventListener("click", () => mostarOcultar(botonCarrito, botonShop, buscador))
    botonShop.addEventListener("click", () => mostarOcultar(botonCarrito, botonShop, buscador))  
    sessionStorage.setItem("stockOriginal", JSON.stringify(puntoSur))       
}

miEcommerce()

function renderizar(array) {
    let contenedor = document.getElementById("contenedor")
    let carritoJSON = JSON.parse(sessionStorage.getItem("carritoFisico"))
    let carritoFisico = (carritoJSON) ? carritoJSON : []     
    renderizarCarrito(carritoFisico)   
    contenedor.innerHTML = ""
    for (const { stock, imagen, nombre, precio, id } of array) {
        let mensaje = ""        
        let tarjetaProducto = document.createElement("div")  
        if (stock < 5 && stock > 0) {
            mensaje += `- Quedan pocas unidades. Apurate!`
            tarjetaProducto.classList.add("ultimasUnidades")
        }else if (stock === 0){
            mensaje +=`- Unidades agotadas`
            tarjetaProducto.classList.add("sinStock")            
        }      
        tarjetaProducto.classList.add("tarjetaProducto")
        tarjetaProducto.innerHTML = `        
        <div class=imagen style= "background-image: url(./imagenes/${imagen}")></div>
        <div class=contenedorInfoTarjeta>
        <h2>${nombre}</h2>        
        <p>$${precio} ${mensaje}</p>
        <button class=botonAgregar id=${id}>Agregar al carrito </button>                
        </div>            `
        contenedor.appendChild(tarjetaProducto)
        let agregarACarrito = document.getElementById(id)
        agregarACarrito.addEventListener("click", (e) => agregarAlCarrito(e.target.id, carritoFisico, array))
        if (stock===0){
            agregarACarrito.remove()
        }        
    }    
}

function agregarAlCarrito(id, carritoFisico, array) {
    let productoSeleccionado = array.find(producto => producto.id === Number(id))
    let posicionBuscadaEnCarrito = carritoFisico.findIndex((prenda) => prenda.id === productoSeleccionado.id)
    let posicionProductoSeleccionado = array.findIndex((prenda) => prenda.id === productoSeleccionado.id)       
    if (carritoFisico.find((prenda) => prenda.id === productoSeleccionado.id)) {
        carritoFisico[posicionBuscadaEnCarrito].unidades++
    } else {
        carritoFisico.push({
            id: productoSeleccionado.id,
            nombre: productoSeleccionado.nombre,
            precio: productoSeleccionado.precio,
            unidades: 1,
        })
    } 
    Toastify({

        text: "Producto agregado al carrito",
        position: "right",
        gravity: "bottom",
        close: true,
        style: {
            background: "rgb(249, 132, 74)",
          },               
        duration: 3000,
        
        }).showToast();        
    array[posicionProductoSeleccionado].stock = array[posicionProductoSeleccionado].stock - 1
    renderizarCarrito(carritoFisico)
    sessionStorage.setItem("carritoFisico", JSON.stringify(carritoFisico))
    sessionStorage.setItem("stockRemanente", JSON.stringify(array))
    renderizar(array)       
}

function renderizarCarrito(array) {
    let carrito = document.getElementById("carrito")
    carrito.innerHTML = ""
    let tituloCarrito = document.createElement("div")
    tituloCarrito.classList.add("tarjetaCarrito")
    tituloCarrito.innerHTML = `Carrito:`
    carrito.appendChild(tituloCarrito)
    if (array.length > 0) {
        for (const { nombre, unidades, precio } of array) {
            let tarjetaCarrito = document.createElement("div")
            tarjetaCarrito.classList.add("tarjetaCarrito")
            tarjetaCarrito.innerHTML += `
            <p>${nombre} - cantidad= ${unidades} precio= $${precio * unidades}</p>`
            carrito.appendChild(tarjetaCarrito)
        }
        let subtotal = array.reduce((acum, prenda) => acum + (prenda.precio * prenda.unidades), 0)
        let tarjetaSubtotal = document.createElement("div")
        tarjetaSubtotal.classList.add("tarjetaSubtotal")
        tarjetaSubtotal.innerHTML = `
        <p>Subtotal= $${subtotal}</p>        
        <button id=botonVaciar class="botonAgregar">Vaciar carrito</button>`
        carrito.appendChild(tarjetaSubtotal)
        let botonVaciarCarrito = document.getElementById("botonVaciar")
        botonVaciarCarrito.addEventListener("click", () => vaciarCarrito(array))
        
    } 
    else {
        let cajaParaCarritoVacio = document.createElement("div")
        cajaParaCarritoVacio.classList.add("tarjetaCarritoVacio")
        cajaParaCarritoVacio.innerHTML = `
        <p>El carrito se encuenta vacío</p>
        <div class=imagenCarrito style= "background-image: url(./imagenes/carritotriste.jpg")></div>`
        carrito.appendChild(cajaParaCarritoVacio)
    }
    
}


function vaciarCarrito(carritoFisico){    
    sessionStorage.removeItem("carritoFisico")     
    carritoFisico=[]      
    renderizarCarrito(carritoFisico)   
    let stockOriginal = JSON.parse(sessionStorage.getItem("stockOriginal"))        
    renderizar(stockOriginal)         
}

function buscar(array, value) {
    let arrayFiltrado = array.filter(producto => producto.nombre.toLowerCase().includes(value.toLowerCase()))
    renderizar(arrayFiltrado)
}


function mostarOcultar(botonCarrito, botonShop, buscador) {
    let contenedorShop = document.getElementById("contenedorShop")
    contenedorShop.classList.toggle("oculto")
    buscador.classList.toggle("oculto")
    let carrito = document.getElementById("carrito")
    carrito.classList.toggle("oculto")
    botonCarrito.classList.toggle("oculto")
    botonShop.classList.toggle("oculto")
    botonShop.classList.toggle("botonDos")
}








