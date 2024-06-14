var totalCart = 0;
let productos = [];
var idProductoSelecciondo = -1;

const catalogoCategorias = [
    { idCategoria: 1, Categoria: "Frutas" },
    { idCategoria: 2, Categoria: "Verduras" },
    { idCategoria: 3, Categoria: "Lácteos" },
    { idCategoria: 4, Categoria: "Carnes" },
    { idCategoria: 5, Categoria: "Aves" },
    { idCategoria: 6, Categoria: "Panadería" },
    { idCategoria: 7, Categoria: "Tortillería" },
    { idCategoria: 8, Categoria: "Bebidas" },
    { idCategoria: 9, Categoria: "Enlatados" },
    { idCategoria: 10, Categoria: "Conservas" },
];

const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

const idClienteSesion = document.cookie
    .split("; ")
    .find((row) => row.startsWith("idCliente="))
    ?.split("=")[1];

function loadProducts({ busqueda = "", idCategoria = "" }) {
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
async function mostrarProductos({ busqueda = "", idCategoria = "" }) {
    await loadProducts({ busqueda, idCategoria }); // Espera a que los productos se carguen
    const contenedorProductos = document.getElementById("productos");
    if (!contenedorProductos) {
        console.error("Contenedor de productos no encontrado");
        return;
    }
    contenedorProductos.innerHTML = ""; // Limpia el contenedor antes de añadir nuevos productos
    let fragment = document.createDocumentFragment();

    console.log(productos);

    productos.forEach((producto) => {
        let div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img src="data:image/jpeg;base64,${producto.fotografia}" alt="Imagen del producto">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio}</p>
            <button onclick="verProducto(\'id:${producto.id.toString()}\')">Ver Producto</button>
        `;
        fragment.appendChild(div);
    });

    contenedorProductos.appendChild(fragment);
    let buscar = "";
    document.cookie = `isSearch=${false}; path=/`;
    document.cookie = `search=${buscar}; path=/`;
    document.coolie = document.cookie = `categoriaBusqueda=${buscar}; path=/`;
}

// Función para manejar la acción de ver detalles y redirigir
function verProducto(idProducto) {
    const producto = obtenerDetallesProducto(idProducto);

    console.log("Ver producto ", idProducto);

    // Guarda los detalles del producto en localStorage
    localStorage.setItem("productoSeleccionado", JSON.stringify(producto));

    console.log("verProducto", localStorage.getItem("productoSeleccionado"));
    // Redirige a detailproducts.html
    window.location.href = "../productDetails.html";
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
function agregarAlCarrito() {
    console.log("Entra a Agregar Carrito");
    const myHeaders = new Headers();
    myHeaders.append("Access-Control-Allow-Origin", "MBAPPES");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token);

    console.log(JSON.parse(localStorage.getItem("productoSeleccionado")));
    const productoSeleccionado = JSON.parse(
        localStorage.getItem("productoSeleccionado"),
    );
    console.log("Producto Seleccionado", productoSeleccionado);

    const productoParaCarrito = {
        idProducto: productoSeleccionado.id,
        cantidad: 1,
        precioUnitario: productoSeleccionado.precio,
    };

    const idCliente = document.cookie
        .split("; ")
        .find((row) => row.startsWith("idCliente="))
        ?.split("=")[1];
    console.log(idCliente);

    const raw = JSON.stringify({
        idCliente: idCliente,
        productos: [productoParaCarrito],
    });

    console.log(raw);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    console.log("requestOptions", requestOptions);

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

function eliminarDeCarrito(idProducto, precio) {
    console.log("idProducto Recibido: ", idProducto.toString().split("582")[1]);
    console.log("precio recibido", precio);
    const myHeaders = new Headers();
    myHeaders.append("Access-Control-Allow-Origin", "MBAPPES");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token);

    const raw = JSON.stringify({
        idCliente: idClienteSesion,
        productos: [
            {
                idProducto: idProducto.toString().split("582")[1],
                cantidad: 1,
                precioUnitario: precio,
            },
        ],
    });

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    fetch(
        "https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/user/carrito/eliminarproducto",
        requestOptions,
    )
        .then((response) => (window.location.href = "../carrito.html"))
        .then((result) => (window.location.href = "../carrito.html"))
        .catch((error) => console.error("Error el eliminar el carrito", error));
}

// Inicializar la lista de productos al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    const isSearch = document.cookie
        .split("; ")
        .find((row) => row.startsWith("isSearch="))
        ?.split("=")[1];

    if (document.getElementsByClassName("secciones-lateral")) {
        console.log("Existe la clase secciones-lateral");
        const categoriaBusqueda = document.cookie
            .split("; ")
            .find((row) => row.startsWith("categoriaBusqueda="))
            ?.split("=")[1];
        console.log(categoriaBusqueda);
        if (categoriaBusqueda != "Todos") {
            catalogoCategorias.forEach(function (categoria) {
                if (categoria.Categoria === categoriaBusqueda) {
                    console.log(
                        "La categoría seleccionada es: ",
                        categoriaBusqueda,
                        "y su ID es: ",
                        categoria.idCategoria,
                    );
                    mostrarProductos({ idCategoria: categoria.idCategoria });
                }
            });
        } else {
            console.log(categoriaBusqueda);
            mostrarProductos({ idCategoria: "" });
        }
    }
    if (document.getElementById("productos")) {
        console.log("prod:", isSearch);
        const search = document.cookie
            .split("; ")
            .find((row) => row.startsWith("search="))
            ?.split("=")[1];
        if (isSearch === "true") {
            console.log("prodIs:", isSearch);
            if (search !== "") {
                console.log("Busqueda productos:", document.cookie, search);
                mostrarProductos({ busqueda: search });
            } else {
                mostrarProductos({ busqueda: "" });
            }
        }
    }
    if (document.getElementById("product-name")) {
        mostrarDetallesProducto();
    }
    if (document.getElementById("cart-items")) {
        console.log("Existe cart-items");
        renderCart();
    }

    const addToCartButton = document.getElementById("add-to-cart");
    if (addToCartButton) {
        addToCartButton.addEventListener("click", function () {
            console.log("Botón Carrito Clicado");
            agregarAlCarrito();
            alert("Producto agregado al carrito");
            document.cookie = `isSearch=${true}; path=/`;
            window.location.href = "../productos.html";
        });
    }
});

// Función para obtener los detalles del producto por su ID
function obtenerDetallesProducto(idProducto) {
    idProducto = idProducto.split(":")[1];
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
    const productDescription = document.getElementById("product-description");

    if (productNameElement) {
        productNameElement.textContent = productoSeleccionado.nombre;
    }
    if (productImageElement) {
        productImageElement.src =
            "data:image/jpeg;base64," + productoSeleccionado.fotografia;
    }
    if (productPriceElement) {
        productPriceElement.textContent = `$${productoSeleccionado.precio}`;
    }
    if (productDescription) {
        productDescription.textContent = productoSeleccionado.descripcion;
    }

    idProductoSelecciondo = productoSeleccionado.id;
}

// Carrito de compras
var cart = [];
var cartAll;

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
async function renderCart() {
    console.log("Entra a renderCart");
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

    // Comienza la consulta de carrito a la BD
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const requestUrl = new URL(
        "https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/user/carrito/consultar",
    );
    requestUrl.searchParams.append(
        "idCliente",
        document.cookie
            .split("; ")
            .find((row) => row.startsWith("idCliente="))
            ?.split("=")[1],
    );

    try {
        const response = await fetch(requestUrl.toString(), requestOptions);
        const result = await response.text();
        const carritoRecuperado = JSON.parse(result);
        const productosCarrito = carritoRecuperado.productos;
        console.log("Productos del carrito:", productosCarrito);
        const totalCarrito = carritoRecuperado.total;
        console.log("Total del carrito:", totalCarrito);

        document.cookie = `idCarrito=${carritoRecuperado.idCarrito}; path=/`;
        cart = productosCarrito;
        await loadProducts({ busqueda: "" });

        if (productosCarrito.length === 0) {
            emptyCartMessage.style.display = "block";
        } else {
            emptyCartMessage.style.display = "none";

            // Agregar Productos a Ventana
            productosCarrito.forEach((producto) => {
                console.log("IDProductoEnviar: ", producto.idProducto);
                productos.forEach((item) => {
                    if (item.id === producto.idProducto) {
                        console.log(
                            "IDProducto recuperado ",
                            producto.idProducto,
                            " es igual al idProducto ",
                            item.id,
                        );
                        const cartItem = document.createElement("div");
                        cartItem.className = "cart-item";

                        cartItem.innerHTML = `
                            <img src="data:image/jpeg;base64,${item.fotografia}" alt="${item.nombre}">
                            <div class="cart-item-details">
                                <h4>${item.nombre}</h4>
                                <p>$${item.precio}</p>
                                <p>Cantidad: ${producto.cantidad}</p>
                            </div>
                            <div class="cart-item-actions">
                                <button onclick="eliminarDeCarrito(${"582" + producto.idProducto},${item.precio})">Eliminar</button>
                            </div>
                        `;

                        cartItemsContainer.appendChild(cartItem);
                    }
                });
            });

            totalAmountElement.textContent = `$${totalCarrito.toFixed(2)}`;
            cartTotalContainer.textContent = `Total: $${totalCarrito.toFixed(2)}`;
            totalCart = totalCarrito.toFixed(2);
            payNowButton.setAttribute("data-total", totalCarrito.toFixed(2)); // Actualiza el data-attribute
        }
        mostrarBotones();
    } catch (error) {
        console.error(error);
    }
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

function removeFromCart(productId, cantidadProducto) {
    if (cantidadProducto > 1) {
        eliminarDeCarrito(productId, cantidadProducto);
    } else {
        eliminarDeCarrito(productId, 1);
    }
}

function mostrarModalPago(total) {
    var modal = document.getElementById("payment-modal");
    var paymentAmountElement = document.getElementById("payment-amount");

    // Actualizar el texto del total a pagar en el modal
    paymentAmountElement.innerText = "Para pagar: $" + total;

    modal.style.display = "block";
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
// Es la que está en lógica, tiene una variación
