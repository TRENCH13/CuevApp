// Datos de ejemplo para los productos
var ruta = 'PNG/noimage.png';
var totalCart = 0;

const productos = [
    { id: 1, nombre: 'Coca cola original 600ml', precio: 1.50, imagen: ruta },
    { id: 2, nombre: 'Coca cola original 600ml', precio: 1.00, imagen: ruta },
    { id: 3, nombre: 'Coca cola original 600ml', precio: 1.34, imagen: ruta },
    { id: 4, nombre: 'Coca cola original 600ml', precio: 1.50, imagen: ruta },
    { id: 5, nombre: 'Coca cola original 600ml', precio: 1.50, imagen: ruta },
    { id: 6, nombre: 'Coca cola original 600ml', precio: 1.50, imagen: ruta },
    { id: 7, nombre: 'Coca cola original 600ml', precio: 1.50, imagen: ruta },
    { id: 8, nombre: 'Coca cola original 600ml', precio: 1.50, imagen: ruta },
    { id: 9, nombre: 'Coca cola original 600ml', precio: 1.50, imagen: ruta },

    // Otros productos...
];

// Función para inicializar y mostrar los productos
function mostrarProductos() {
    const contenedorProductos = document.getElementById('productos');
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

// Obtener y mostrar la ubicación del usuario
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
} else {
    document.getElementById('user-location').textContent = "La geolocalización no es soportada por este navegador.";
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Llamada a la API de OpenWeatherMap para obtener el nombre de la ciudad
    const apiKey = 'b9b86a55f18721d938d2256593a8ade0';
    const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return response.json();
        })
        .then(data => {
            const city = data.city.name;
            const locationElement = document.getElementById('user-location');
            locationElement.textContent = city;
        })
        .catch(error => {
            console.error('Error al obtener la ciudad:', error);
            document.getElementById('user-location').textContent = "No se pudo obtener la ubicación.";
        });
}

function showError(error) {
    const locationElement = document.getElementById('user-location');
    switch (error.code) {
        case error.PERMISSION_DENIED:
            locationElement.textContent = "Usuario denegó la solicitud de geolocalización.";
            break;
        case error.POSITION_UNAVAILABLE:
            locationElement.textContent = "La información de ubicación no está disponible.";
            break;
        case error.TIMEOUT:
            locationElement.textContent = "La solicitud para obtener la ubicación ha caducado.";
            break;
        case error.UNKNOWN_ERROR:
            locationElement.textContent = "Ha ocurrido un error desconocido.";
            break;
    }
}

// Función para manejar la acción de agregar al carrito y redirigir
function agregarAlCarrito(idProducto) {
    const producto = obtenerDetallesProducto(idProducto);

    // Guarda los detalles del producto en localStorage
    localStorage.setItem('productoSeleccionado', JSON.stringify(producto));

    // Redirige a detailproducts.html
    window.location.href = '../detailsProduct.html';
}

// Inicializar la lista de productos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('productos')) {
        mostrarProductos();
    }
    if (document.getElementById('product-name')) {
        mostrarDetallesProducto();
    }
    if (document.getElementById('cart-items')) {
        renderCart();
    }
});

// Función para obtener los detalles del producto por su ID
function obtenerDetallesProducto(idProducto) {
    return productos.find(producto => producto.id === idProducto);
}

// Función para mostrar los detalles del producto en detailproducts.html
function mostrarDetallesProducto() {
    const productoSeleccionado = JSON.parse(localStorage.getItem('productoSeleccionado'));

    if (productoSeleccionado) {
        document.getElementById('product-name').textContent = productoSeleccionado.nombre;
        document.getElementById('product-image').src = productoSeleccionado.imagen;
        document.getElementById('product-price').textContent = `$${productoSeleccionado.precio}`;
    }
}

// Carrito de compras
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.getElementById('add-to-cart').addEventListener('click', function() {
    const producto = JSON.parse(localStorage.getItem('productoSeleccionado'));

    const existingProductIndex = cart.findIndex(item => item.id === producto.id);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity++;
    } else {
        producto.quantity = 1;
        cart.push(producto);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Producto agregado al carrito');
    window.location.href = '../productos.html';
});

// Función para mostrar u ocultar los botones según el contenido del carrito
function mostrarBotones() {
    const goShoppingButton = document.getElementById('go-shopping');
    const payNowButton = document.getElementById('pay-now');

    if (cart.length === 0) {
        goShoppingButton.style.display = 'block';
        payNowButton.style.display = 'none';
    } else {
        goShoppingButton.style.display = 'none';
        payNowButton.style.display = 'block';
    }
}

// Función para renderizar el carrito en cart.html
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    const cartTotalContainer = document.getElementById('cart-total');
    const totalAmountElement = document.getElementById('total-amount');
    const payNowButton = document.getElementById('pay-now');

    cartItemsContainer.innerHTML = '';
    cartTotalContainer.innerHTML = '';

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
    } else {
        emptyCartMessage.style.display = 'none';

        let total = 0;

        cart.forEach(item => {
            total += item.precio * item.quantity;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            cartItem.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="cart-item-details">
                    <h4>${item.nombre}</h4>
                    <p>$${item.precio}</p>
                    <p>Cantidad: ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="changeQuantity(${item.id}, -1)">-</button>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    <button onclick="removeFromCart(${item.id})">Eliminar</button>
                </div>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        totalAmountElement.textContent = `${total.toFixed(2)}`;
        cartTotalContainer.textContent = `Total: $${total.toFixed(2)}`;
        totalCart = total.toFixed(2);
        payNowButton.setAttribute('data-total', total.toFixed(2)); // Actualiza el data-attribute
    }

    mostrarBotones();
}


function changeQuantity(productId, change) {
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex !== -1) {
        cart[productIndex].quantity += change;

        if (cart[productIndex].quantity <= 0) {
            cart.splice(productIndex, 1);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function mostrarModalPago(total) {
    var modal = document.getElementById('payment-modal');
    var paymentAmountElement = document.getElementById('payment-amount');

    // Actualizar el texto del total a pagar en el modal
    paymentAmountElement.innerText = 'Para pagar: $' + totalCart;

    modal.style.display = 'block';
}