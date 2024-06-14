document.addEventListener("DOMContentLoaded", function () {
    const listaPendientes = document.getElementById("lista-pendientes");
    const listaEntrega = document.getElementById("lista-entrega");
    const listaEnviados = document.getElementById("lista-enviados");
    const listaCancelados = document.getElementById("lista-cancelados");
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
    const idClienteCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("idCliente="))
        ?.split("=")[1];

    // Simulación de lista de pedidos
    let pedidos = [];

    function getPedidos(idCliente) {
        const myHeaders = new Headers();
        myHeaders.append("Access-Control-Allow-Origin", "MBAPPES");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        const requestUrl = new URL(
            "https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/user/listarpedidos",
        );
        requestUrl.searchParams.append("idCliente", idCliente);

        return fetch(requestUrl.toString(), requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (!Array.isArray(data.resultados)) {
                    throw new Error("Invalid response format");
                }
                pedidos = data.resultados.map((pedido) => {
                    return {
                        id: pedido.idPedido,
                        fechaPedido: pedido.fechaPedido,
                        total: pedido.montoTotal,
                        idCliente: pedido.cliente,
                        idCarrito: pedido.carrito,
                        productos: pedido.productos,
                        estado: pedido.status,
                    };
                });
                console.log(pedidos);
                return pedidos;
            })
            .catch((error) => {
                console.error("Error:", error);
                return [];
            });
    }
    // Función para renderizar los pedidos
    async function renderizarPedidos() {
        await getPedidos(idClienteCookie);
        listaPendientes.innerHTML = "";
        listaEntrega.innerHTML = "";
        listaEnviados.innerHTML = "";
        listaCancelados.innerHTML = "";

        console.log("render", pedidos);
        pedidos.forEach((pedido) => {
            const itemPedido = document.createElement("div");
            itemPedido.classList.add("pedido");
            itemPedido.innerHTML = `
                <div>ID: ${pedido.id}</div>
                <div>Número de productos: ${pedido.productos?.length}</div>
                <div>Total: ${pedido.total}</div>
            `;

            const botonCancelar = document.createElement("button");
            botonCancelar.textContent = "Cancelar";
            botonCancelar.classList.add("cancelar");
            botonCancelar.addEventListener("click", () => {
                cancelarPedido(pedido);
            });
            itemPedido.appendChild(botonCancelar);

            if (pedido.estado === "pendiente") {
                const botonModificar = document.createElement("button");
                botonModificar.textContent = "Modificar";
                botonModificar.addEventListener("click", () => {
                    window.location.href = `../carrito.html?id=${pedido.id}&productos=${encodeURIComponent(JSON.stringify(pedido.productos))}`;
                });
                itemPedido.appendChild(botonModificar);
                listaPendientes.appendChild(itemPedido);
            } else if (pedido.estado === "entrega") {
                const botonModificarDireccion =
                    document.createElement("button");
                botonModificarDireccion.textContent = "Modificar dirección";
                botonModificarDireccion.addEventListener("click", () => {
                    window.location.href = `../adress.html?id=${pedido.id}&direccion=${encodeURIComponent(pedido.direccion)}`;
                });
                itemPedido.appendChild(botonModificarDireccion);
                listaEntrega.appendChild(itemPedido);
            } else if (pedido.estado === "enviado") {
                const botonComprarDeNuevo = document.createElement("button");
                botonComprarDeNuevo.textContent = "Reportar problema";
                botonCancelar.style.display = "none";
                botonComprarDeNuevo.addEventListener("click", () => {
                    reportarProblema(pedido);
                });
                itemPedido.appendChild(botonComprarDeNuevo);
                listaEnviados.appendChild(itemPedido);
            } else if (pedido.estado === "cancelado") {
                listaCancelados.appendChild(itemPedido);
                botonCancelar.style.display = "none";
            }
        });

        // Mostrar mensaje si no hay pedidos en una sección
        if (listaPendientes.childElementCount === 0) {
            listaPendientes.textContent =
                "No hay información que mostrar en esta sección.";
        }
        if (listaEntrega.childElementCount === 0) {
            listaEntrega.textContent =
                "No hay información que mostrar en esta sección.";
        }
        if (listaEnviados.childElementCount === 0) {
            listaEnviados.textContent =
                "No hay información que mostrar en esta sección.";
        }
        if (listaCancelados.childElementCount === 0) {
            listaCancelados.textContent =
                "No hay información que mostrar en esta sección.";
        }
    }

    // Funciones simuladas de acciones con pedidos
    async function cancelarPedido(pedido) {
        console.log(`Pedido ${pedido.id} cancelado.`);
        pedido.estado = "cancelado";
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);

        const raw = JSON.stringify({
            idPedido: pedido.id,
        });

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        await fetch(
            "https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/user/cancelarpedido",
            requestOptions,
        )
            .then((response) => response.json())
            .then((result) => {
                if (result.error == false) {
                    renderizarPedidos();
                } else {
                    alert("Error al cancelar pedido");
                }
                console.log(result);
            })
            .catch((error) => console.error(error));
    }

    function comprarDeNuevo(pedido) {
        console.log(`Comprando de nuevo el pedido ${pedido.id}.`);
        const nuevoPedido = {
            id: pedidos.length + 1,
            estado: "pendiente",
            productos: pedido.productos,
            total: pedido.total,
        };
        pedidos.push(nuevoPedido);
        renderizarPedidos();
    }

    function reportarProblema(pedido) {
        localStorage.setItem("pedidoAReportarID", pedido.id);
        console.log(localStorage.getItem("pedidoAReportarID"));
        window.location.href = "../reporteCliente.html";
    }

    // Renderizar los pedidos al cargar la página
    renderizarPedidos();
});
