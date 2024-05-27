// Datos de ejemplo para los productos
var ruta = '../PNG/noimage.png';

const productos = [
    { id: 1, nombre: 'Producto 1', precio: 100, imagen: '../PNG/noimage.png' },
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
    // ... Agrega más productos según sea necesario
];

// Función para inicializar y mostrar los productos
function mostrarProductos() {
    const contenedorProductos = document.getElementById('productos');
    contenedorProductos.innerHTML = '';

    productos.forEach((producto) => {
        contenedorProductos.innerHTML += `
            <div class="producto">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio}</p>
                <button onclick="agregarAlCarrito(${producto.id})">Agregar</button>
            </div>
        `;
    });
}

// Función para manejar la acción de agregar al carrito
function agregarAlCarrito(idProducto) {
    // Aquí puedes agregar la lógica para añadir el producto al carrito
    console.log('Producto agregado con ID:', idProducto);
}

// Inicializar la lista de productos al cargar la página
document.addEventListener('DOMContentLoaded', mostrarProductos);

// Suponiendo que tienes una función que obtiene los detalles del producto por su ID
function obtenerDetallesProducto(idProducto) {
    // Esta es una función simulada, reemplázala con tu lógica para obtener los detalles del producto
    return productos.find(producto => producto.id === idProducto);
}

// Función para mostrar los detalles del producto
function mostrarDetallesProducto(idProducto) {
    const producto = obtenerDetallesProducto(idProducto);
    const contenedorDetalle = document.getElementById('detalleProducto');
    contenedorDetalle.innerHTML = `
        <h2>${producto.nombre}</h2>
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <p>Precio: $${producto.precio}</p>
        <button onclick="agregarAlCarrito(${producto.id})">Agregar</button>
    `;
}

// Función para manejar la acción de agregar al carrito
function agregarAlCarrito(idProducto) {
    // Aquí puedes agregar la lógica para añadir el producto al carrito
    mostrarDetallesProducto(idProducto);
}

// Inicializar la lista de productos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Aquí puedes llamar a mostrarDetallesProducto con un ID de producto específico
    mostrarDetallesProducto(1);
});
