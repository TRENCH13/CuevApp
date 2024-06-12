// Lógica JavaScript
document.addEventListener("DOMContentLoaded", function () {
    // Aquí puedes agregar la lógica para manejar eventos, como clics en botones, etc.
    const searchBar = document.querySelector(".search-bar input");
    const searchIcon = document.querySelector(".search-icon");

    searchBar.addEventListener("focus", function () {
        this.placeholder = "";
    });

    searchBar.addEventListener("blur", function () {
        this.placeholder = "Busca cualquier producto ...";
    });

    searchIcon.addEventListener("click", function () {});
});

document.addEventListener("DOMContentLoaded", function () {
    // Simulación de obtener el nombre de usuario desde la base de datos
    const username = "Username"; // Reemplazar con la lógica real de obtención de usuario

    // Actualizar el texto del menú desplegable
    const usernameDisplay = document.getElementById("username-display");
    usernameDisplay.innerHTML = `Hola, ${username}`;

    // Lógica para mostrar el menú desplegable al hacer clic en "Ingresa"
    const dropdown = document.querySelector(".dropdown");
    const loginText = document.querySelector(".login-text");
    const dropdownContent = document.querySelector(".dropdown-content");

    loginText.addEventListener("click", function () {
        dropdownContent.classList.toggle("show");
    });

    // Cerrar el menú si el usuario hace clic fuera de él
    window.addEventListener("click", function (event) {
        if (!event.target.matches(".login-text")) {
            if (dropdownContent.classList.contains("show")) {
                dropdownContent.classList.remove("show");
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Selección del iframe
    var iframe = document.querySelector('iframe[name="paginas"]');

    // Selección de los elementos
    var locationButton = document.getElementById("location-button");
    var cuevappTitle = document.getElementById("cuevapp-title");
    var cuevappTitleHeader = document.getElementById("cuevapp-title-header");
    var btnIngresar = document.getElementById("btn-ingresar");
    var btnRegistrar = document.getElementById("btn-registrar");
    var verPerfil = document.getElementById("ver-perfil");
    var verPedidos = document.getElementById("ver-pedidos");
    var cartIcon = document.getElementById("cart-icon");
    var secciones = document
        .getElementById("secciones")
        .getElementsByTagName("li");

    // Función para cambiar el src del iframe
    function cambiarIframe(src) {
        iframe.src = src;
    }

    // Evento de clic para la ubicación
    locationButton.addEventListener("click", function () {
        cambiarIframe("/adress");
    });

    // Evento de clic para el título CuevApp (en dos lugares)
    cuevappTitle.addEventListener("click", function () {
        cambiarIframe("/main");
    });

    cuevappTitleHeader.addEventListener("click", function () {
        cambiarIframe("/main");
    });

    // Evento de clic para el botón Ingresar
    btnIngresar.addEventListener("click", function () {
        cambiarIframe("/iniciosesion");
    });

    // Evento de clic para el botón Registrar
    btnRegistrar.addEventListener("click", function () {
        cambiarIframe("/ingreso");
    });

    // Evento de clic para Ver Perfil
    verPerfil.addEventListener("click", function () {
        cambiarIframe("/profile");
    });

    // Evento de clic para Ver Pedidos
    verPedidos.addEventListener("click", function () {
        cambiarIframe("/pedidos");
    });

    // Evento de clic para el Carrito de Compras
    cartIcon.addEventListener("click", function () {
        cambiarIframe("/carrito");
    });

    // Evento de clic para los elementos de la lista de secciones
    Array.from(secciones).forEach(function (seccion) {
        seccion.addEventListener("click", function () {
            cambiarIframe("/productos");
        });
    });
});
