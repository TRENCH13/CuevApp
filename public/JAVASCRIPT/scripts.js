var ruta = "PNG/noimage.png";
var totalCart = 0;
let productos = [];
var idProductoSelecciondo = -1;
const token = document.cookie
    .split(";")
    .find((item) => item.trim().startsWith("token="));

function loadProducts(busqueda = "", idCategoria = "") {
    const myHeaders = new Headers();
    myHeaders.append("Access-Control-Allow-Origin", "MBAPPES");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiam9obl9kb2UifSwiaWF0IjoxNzE4MTE3NzE5LCJleHAiOjE3MTgyMDQxMTl9.v2M0MiaSDaRCyr7mkfcXWsfAzw2OCf69G47lmJgGUKo",
    );

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const requestUrl = new URL(
        "https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/product/obtenerproductos",
    );
    requestUrl.searchParams.append("busqueda", busqueda);
    requestUrl.searchParams.append("IDCategoria", idCategoria);

    return fetch(requestUrl.toString(), requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (!Array.isArray(data)) {
                throw new Error("Invalid response format");
            }
            productos = data.map((product) => {
                return {
                    id: product.IDProducto,
                    fotografia: product.Fotografia || ruta,
                    nombre: product.Nombre,
                    descripcion: product.Descripcion,
                    precio: product.Precio,
                    unidades: product.Unidades,
                    idCategoria: product.IDCategoria,
                    idTipoBarcode: product.IDTipoBarcode,
                    idSucursal: product.IDSucursal,
                };
            });
            console.log(productos);
            return productos;
        })
        .catch((error) => {
            console.error("Error:", error);
            return [];
        });
}

// Función para inicializar y mostrar los productos
async function mostrarProductos() {
    await loadProducts(); // Espera a que los productos se carguen
    const contenedorProductos = document.getElementById("productos");
    if (!contenedorProductos) {
        console.error("Contenedor de productos no encontrado");
        return;
    }
    contenedorProductos.innerHTML = ""; // Limpia el contenedor antes de añadir nuevos productos
    let fragment = document.createDocumentFragment();

    console.log(productos)

    productos.forEach((producto) => {
        let div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img src="${producto.fotografia}" alt="Imagen del producto">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio}</p>
            <button onclick="verProducto(\"${producto.id}\")">Ver Producto</button>
        `;
        fragment.appendChild(div);
    });

    contenedorProductos.appendChild(fragment);
}

// Función para manejar la acción de ver detalles y redirigir
function verProducto(idProducto) {
    const producto = obtenerDetallesProducto(idProducto);

    console.log("Ver producto ", idProducto);

    // Guarda los detalles del producto en localStorage
    localStorage.setItem("productoSeleccionado", JSON.stringify(producto));

    // Redirige a detailproducts.html
    window.location.href = "/mostrarDetalles";
}

// Obtener y mostrar la ubicación del usuario
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
} else {
    document.getElementById("user-location").textContent =
        "La geolocalización no es soportada por este navegador.";
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Llamada a la API de OpenWeatherMap para obtener el nombre de la ciudad
    const apiKey = "b9b86a55f18721d938d2256593a8ade0";
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error en la respuesta de la API");
            }
            return response.json();
        })
        .then((data) => {
            const city = data.city.name;
            const locationElement = document.getElementById("user-location");
            if (locationElement) {
                locationElement.textContent = city;
            } else {
                console.error("Elemento user-location no encontrado");
            }
        })
        .catch((error) => {
            console.error("Error al obtener la ciudad:", error);
            const locationElement = document.getElementById("user-location");
            if (locationElement) {
                locationElement.textContent =
                    "No se pudo obtener la ubicación.";
            }
        });
}

function showError(error) {
    const locationElement = document.getElementById("user-location");
    if (!locationElement) {
        console.error("Elemento user-location no encontrado");
        return;
    }
    switch (error.code) {
        case error.PERMISSION_DENIED:
            locationElement.textContent =
                "Usuario denegó la solicitud de geolocalización.";
            break;
        case error.POSITION_UNAVAILABLE:
            locationElement.textContent =
                "La información de ubicación no está disponible.";
            break;
        case error.TIMEOUT:
            locationElement.textContent =
                "La solicitud para obtener la ubicación ha caducado.";
            break;
        case error.UNKNOWN_ERROR:
            locationElement.textContent = "Ha ocurrido un error desconocido.";
            break;
    }
}

// Función para agregar productos al carrito
function agregarAlCarrito(idProducto) {
    const myHeaders = new Headers();
    myHeaders.append("Access-Control-Allow-Origin", "MBAPPES");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer tu_token");

    const productoParaCarrito = productos.find((p) => p.id === idProducto);
    if (!productoParaCarrito) {
        console.error("Producto no encontrado");
        return;
    }
    productoParaCarrito.cantidad = 1;

    const raw = JSON.stringify({
        idCliente: "tu_id_cliente",
        productos: [productoParaCarrito],
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    fetch(
        "https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/user/carrito/agregarproducto",
        requestOptions,
    )
        .then((response) => response.json())
        .then((carrito) => {
            console.log("Producto agregado al carrito:", carrito);
        })
        .catch((error) =>
            console.error("Error al agregar producto al carrito:", error),
        );
}

// Inicializar la lista de productos al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("productos")) {
        mostrarProductos();
    }
    if (document.getElementById("product-name")) {
        mostrarDetallesProducto();
    }
    if (document.getElementById("cart-items")) {
        renderCart();
    }

    const addToCartButton = document.getElementById("add-to-cart");
    if (addToCartButton) {
        addToCartButton.addEventListener("click", function () {
            const producto = JSON.parse(
                localStorage.getItem("productoSeleccionado"),
            );
            if (!producto) {
                console.error(
                    "Producto seleccionado no encontrado en localStorage",
                );
                return;
            }
            agregarAlCarrito(producto.id);
            alert("Producto agregado al carrito");
            window.location.href = "/products";
        });
    }
});

// Función para obtener los detalles del producto por su ID
function obtenerDetallesProducto(idProducto) {
    console.log(
        "obtenerDetallesProducto",
        productos.find((producto) => producto.id === idProducto),
        idProducto,
        productos,
    );
    return productos.find((producto) => producto.id === idProducto);
}

// Función para mostrar los detalles del producto en detailproducts.html
function mostrarDetallesProducto() {
    console.log(
        "mostrarDetallesProducto",
        localStorage.getItem("productoSeleccionado"),
    );
    const productoSeleccionado = JSON.parse(
        localStorage.getItem("productoSeleccionado"),
    );
    if (!productoSeleccionado) {
        console.error("Producto seleccionado no encontrado en localStorage");
        return;
    }

    const productNameElement = document.getElementById("product-name");
    const productImageElement = document.getElementById("product-image");
    const productPriceElement = document.getElementById("product-price");

    if (productNameElement) {
        productNameElement.textContent = productoSeleccionado.nombre;
    }
    if (productImageElement) {
        productImageElement.src = productoSeleccionado.fotografia;
    }
    if (productPriceElement) {
        productPriceElement.textContent = `$${productoSeleccionado.precio}`;
    }

    idProductoSelecciondo = productoSeleccionado.id;
}

// Carrito de compras
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function mostrarBotones() {
    const goShoppingButton = document.getElementById("go-shopping");
    const payNowButton = document.getElementById("pay-now");

    if (!goShoppingButton || !payNowButton) {
        console.error("Botones de carrito no encontrados");
        return;
    }

    if (cart.length === 0) {
        goShoppingButton.style.display = "block";
        payNowButton.style.display = "none";
    } else {
        goShoppingButton.style.display = "none";
        payNowButton.style.display = "block";
    }
}

// Función para renderizar el carrito en cart.html
function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const emptyCartMessage = document.getElementById("empty-cart");
    const cartTotalContainer = document.getElementById("cart-total");
    const totalAmountElement = document.getElementById("total-amount");
    const payNowButton = document.getElementById("pay-now");

    if (
        !cartItemsContainer ||
        !emptyCartMessage ||
        !cartTotalContainer ||
        !totalAmountElement ||
        !payNowButton
    ) {
        console.error("Elementos del carrito no encontrados");
        return;
    }

    cartItemsContainer.innerHTML = "";
    cartTotalContainer.innerHTML = "";

    if (cart.length === 0) {
        emptyCartMessage.style.display = "block";
    } else {
        emptyCartMessage.style.display = "none";

        let total = 0;

        cart.forEach((item) => {
            total += item.precio * item.quantity;

            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";

            cartItem.innerHTML = `
                <img src="${item.fotografia}" alt="${item.nombre}">
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

        totalAmountElement.textContent = `$${total.toFixed(2)}`;
        cartTotalContainer.textContent = `Total: $${total.toFixed(2)}`;
        totalCart = total.toFixed(2);
        payNowButton.setAttribute("data-total", total.toFixed(2)); // Actualiza el data-attribute
    }

    mostrarBotones();
}

function changeQuantity(productId, change) {
    const productIndex = cart.findIndex((item) => item.id === productId);

    if (productIndex !== -1) {
        cart[productIndex].quantity += change;

        if (cart[productIndex].quantity <= 0) {
            cart.splice(productIndex, 1);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function mostrarModalPago(total) {
    var modal = new bootstrap.Modal(document.getElementById("modalPago"));
    var modalTitle = document.getElementById("modalTitle");
    var modalBody = document.getElementById("modalBody");

    if (!modalTitle || !modalBody) {
        console.error("Elementos del modal no encontrados");
        return;
    }

    modalTitle.textContent = "Confirmación de Pago";
    modalBody.textContent =
        "El total de su compra es: $" +
        total +
        ". ¿Desea proceder con el pago?";

    modal.show();
}

document.addEventListener("DOMContentLoaded", function () {
    const payNowButton = document.getElementById("pay-now");

    if (payNowButton) {
        payNowButton.addEventListener("click", function () {
            const total = payNowButton.getAttribute("data-total");
            mostrarModalPago(total);
        });
    }
});
