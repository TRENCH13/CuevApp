// Lógica JavaScript
document.addEventListener("DOMContentLoaded", function () {
    // Aquí puedes agregar la lógica para manejar eventos, como clics en botones, etc.
    const searchBar = document.querySelector(".search-bar input");
    const searchIcon = document.querySelector(".search-icon");
    var iframe = document.querySelector('iframe[name="paginas"]');

    getCategorias();

    searchBar.addEventListener("focus", function () {
        this.placeholder = "";
    });

    searchBar.addEventListener("blur", function () {
        this.placeholder = "Busca cualquier producto ...";
    });
    searchIcon.addEventListener("click", function () {
        console.log("Barra:", searchBar.value);
        document.cookie = `search=${searchBar.value}; path=/`;
        document.cookie = `isSearch=${true}; path=/`;
        const search = document.cookie
            .split(";")
            .find((row) => row.startsWith("search="))
            ?.split("=")[1];
        console.log("Hola Cookie", document.cookie);
        searchBar.value = "";
        iframe.src = "../productos.html";
    });
});

function getCategorias() {
    var iframe = document.querySelector('iframe[name="paginas"]');

    const myHeaders = new Headers();
    myHeaders.append("Access-Control-Allow-Origin", "MBAPPES");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    fetch(
        "https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/product/categoriasinicio",
        requestOptions,
    )
        .then((response) => response.text())
        .then((result) => {
            var categorias = JSON.parse(result);

            const seccionesLateral = document.createElement("ul");
            seccionesLateral.classList.add("secciones-lateral");

            seccionesLateral.innerHTML = "";

            const todosLi = document.createElement("li");
            todosLi.setAttribute("data-category", "Todos los Productos");
            todosLi.classList.add("li-categorias");
            const todosA = document.createElement("a");
            todosA.setAttribute("href", "#");
            todosA.textContent = "Todos los Productos";
            todosLi.appendChild(todosA);
            seccionesLateral.appendChild(todosLi);

            categorias.forEach((categoria) => {
                const li = document.createElement("li");
                li.setAttribute("data-category", categoria.Categoria);
                li.classList.add("li-categorias");
                const a = document.createElement("a");
                a.setAttribute("href", "#");
                a.textContent = categoria.Categoria;
                li.appendChild(a);
                seccionesLateral.appendChild(li);
            });

            const barra = document.querySelector(".barra");

            const elementoAnterior = barra.querySelector(".secciones-lateral");

            if (elementoAnterior) {
                barra.removeChild(elementoAnterior);
            }

            barra.insertBefore(seccionesLateral, barra.childNodes[5]);

            seccionesLateral.addEventListener("click", function (event) {
                const target = event.target;
                if (target.tagName === "A") {
                    event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
                    const categoria =
                        target.parentNode.getAttribute("data-category");
                    if (categoria === "Todos los Productos") {
                        document.cookie = `categoriaBusqueda=Todos; path=/`;
                        //console.log("Click en Todos los Productos");
                        iframe.src = "../productos.html";
                        //mostrarProductos();
                    } else {
                        document.cookie = `categoriaBusqueda=${categoria}; path=/`;
                        //console.log("Click en", categoria);
                        iframe.src = "../productos.html";
                    }
                }
            });
        })
        .catch((error) => console.error("Error:", error));
}

document.addEventListener("DOMContentLoaded", function () {
    // Simulación de obtener el nombre de usuario desde la base de datos

    // Actualizar el texto del menú desplegable
    const usernameDisplay = document.getElementById("username-display");
    usernameDisplay.innerHTML = `Ingresa`;

    const userCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("name="))
        ?.split("=")[1];

    console.log(userCookie);

    if (userCookie) {
        usernameDisplay.innerHTML = `Hola, ${userCookie}`;
    }

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
        cambiarIframe("../adress.html");
    });

    // Evento de clic para el título CuevApp (en dos lugares)
    cuevappTitle.addEventListener("click", function () {
        cambiarIframe("../main.html");
    });

    cuevappTitleHeader.addEventListener("click", function () {
        cambiarIframe("../main.html");
    });

    // Evento de clic para el botón Ingresar
    btnIngresar.addEventListener("click", function () {
        cambiarIframe("../iniciosesion.html");
    });

    // Evento de clic para el botón Registrar
    btnRegistrar.addEventListener("click", function () {
        cambiarIframe("../ingreso.html");
    });

    // Evento de clic para Ver Perfil
    verPerfil.addEventListener("click", function () {
        cambiarIframe("/profile");
    });

    // Evento de clic para Ver Pedidos
    verPedidos.addEventListener("click", function () {
        cambiarIframe("../pedidos.html");
    });

    // Evento de clic para el Carrito de Compras
    cartIcon.addEventListener("click", function () {
        cambiarIframe("../carrito.html");
    });

    // Evento de clic para los elementos de la lista de secciones
    Array.from(secciones).forEach(function (seccion) {
        seccion.addEventListener("click", function () {
            cambiarIframe("../productos.html");
        });
    });
});
