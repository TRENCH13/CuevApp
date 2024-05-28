// Datos de ejemplo para los productos
var ruta = '../PNG/noimage.png';

const productos = [
    { id: 1, nombre: 'Producto 1', precio: 100, imagen: ruta },
    { id: 2, nombre: 'Producto 2', precio: 200, imagen: ruta },
    { id: 3, nombre: 'Producto 1', precio: 100, imagen: ruta },
    { id: 4, nombre: 'Producto 2', precio: 200, imagen: ruta },
    { id: 5, nombre: 'Producto 1', precio: 100, imagen: ruta },
    { id: 6, nombre: 'Producto 2', precio: 200, imagen: ruta },
    { id: 7, nombre: 'Producto 1', precio: 100, imagen: ruta },
    { id: 8, nombre: 'Producto 2', precio: 200, imagen: ruta },
    { id: 9, nombre: 'Producto 1', precio: 100, imagen: ruta },
    { id: 10, nombre: 'Producto 2', precio: 200, imagen: ruta },
    { id: 11, nombre: 'Producto 1', precio: 100, imagen: ruta },
    { id: 12, nombre: 'Producto 2', precio: 200, imagen: ruta },
];

// Función para inicializar y mostrar los productos
function mostrarProductos() {
    const contenedorProductos = document.getElementById('productos');
    // Utiliza un fragmento de documento para mejorar el rendimiento
    let fragment = document.createDocumentFragment();

    productos.forEach((producto) => {
        let div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Agregar</button>
        `;
        fragment.appendChild(div);
    });

    contenedorProductos.appendChild(fragment);
}

// Función para manejar la acción de agregar al carrito y redirigir
function agregarAlCarrito(idProducto) {
    const producto = obtenerDetallesProducto(idProducto);

    // Guarda los detalles del producto en localStorage
    localStorage.setItem('productoSeleccionado', JSON.stringify(producto));

    // Redirige a detailproducts.html
    window.location.href = '../HTML/detailsProduct.html';
}

// Inicializar la lista de productos al cargar la página
document.addEventListener('DOMContentLoaded', mostrarProductos);

// Función para obtener los detalles del producto por su ID
function obtenerDetallesProducto(idProducto) {
    return productos.find(producto => producto.id === idProducto);
}

// Función para mostrar los detalles del producto en detailproducts.html
document.addEventListener('DOMContentLoaded', () => {
    // Recupera los detalles del producto de localStorage
    const productoSeleccionado = JSON.parse(localStorage.getItem('productoSeleccionado'));

    // Si hay un producto seleccionado, actualiza la información en la página
    if (productoSeleccionado) {
        document.getElementById('product-name').textContent = productoSeleccionado.nombre;
        document.getElementById('product-image').src = productoSeleccionado.imagen;
        document.getElementById('product-price').textContent = `$${productoSeleccionado.precio}`;
    }
});

// ... (El resto de tu código)