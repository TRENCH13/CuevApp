let selectedPlace = null;
let direcciones = [];

const idClienteConsulta = document.cookie
    .split("; ")
    .find((row) => row.startsWith("idCliente="))
    ?.split("=")[1];

const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

const myHeaders = new Headers();
myHeaders.append("Access-Control-Allow-Origin", "MBAPPES");
myHeaders.append("Authorization", "Bearer " + token);

const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
};

async function cargarDirecciones() {
    return fetch(
        "https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/user/obtenerdirecciones?idCliente=" +
            idClienteConsulta,
        requestOptions,
    )
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
            direcciones = data.map((adress) => {
                return {
                    id: adress.IDDireccion,
                    stringGoogle: adress.stringGoogle,
                };
            });
            console.log(direcciones);
            return direcciones;
        })
        .catch((error) => {
            console.error("Error:", error);
            return [];
        });
}

// Función para obtener sugerencias de dirección
function getAddressSuggestions() {
    const input = document.getElementById("address-input");
    const service = new google.maps.places.AutocompleteService();
    input.addEventListener("input", function () {
        const displaySuggestions = function (predictions, status) {
            const suggestions = document.getElementById("address-suggestions");
            suggestions.innerHTML = "";
            if (
                status != google.maps.places.PlacesServiceStatus.OK ||
                !predictions
            ) {
                return;
            }
            predictions.forEach(function (prediction) {
                const div = document.createElement("div");
                div.textContent = prediction.description;
                div.addEventListener("click", function () {
                    input.value = prediction.description;
                    selectedPlace = prediction;
                    suggestions.innerHTML = "";
                    showAddressVerification(prediction);
                });
                suggestions.appendChild(div);
            });
        };

        if (input.value) {
            service.getPlacePredictions(
                { input: input.value },
                displaySuggestions,
            );
        }
    });
}

// Función para mostrar la verificación de dirección
function showAddressVerification(prediction) {
    const verificationSection = document.getElementById("address-verification");
    const searchSection = document.querySelector(".search-bar");
    const mapElement = document.getElementById("map");

    // Ocultar la sección de búsqueda y mostrar la sección de verificación
    searchSection.style.display = "none";
    verificationSection.style.display = "block";

    // Inicializar el mapa en la ubicación seleccionada
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
        { address: prediction.description },
        function (results, status) {
            if (status === "OK") {
                const map = new google.maps.Map(mapElement, {
                    zoom: 15,
                    center: results[0].geometry.location,
                });
                new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map,
                });
            } else {
                console.error("Geocode falló debido a: " + status);
            }
        },
    );
}

// Función para guardar una dirección
function saveAddress(address) {
    console.log("Dirección guardada:", address);
    const savedAddressesContainer = document.getElementById("saved-addresses");
    const ul =
        savedAddressesContainer.querySelector("ul") ||
        document.createElement("ul");

    // Crear el elemento de la lista
    const listItem = document.createElement("li");
    listItem.innerHTML = `
        <input type="radio" name="default-address" checked>
        <span>${address}</span>
        <img src="../PNG/lapiz.png" alt="Editar">
    `;
    ul.appendChild(listItem);

    // Remover mensaje de "No hay direcciones guardadas" si está presente
    const noAddressesMsg = document.getElementById("no-addresses-msg");
    if (noAddressesMsg) {
        noAddressesMsg.style.display = "none";
    }

    // Agregar la lista al contenedor si es la primera vez
    if (!savedAddressesContainer.contains(ul)) {
        savedAddressesContainer.appendChild(ul);
    }

    // Asegurar que solo un radio button esté marcado a la vez
    const radios = ul.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => {
        radio.addEventListener("change", function () {
            if (this.checked) {
                radios.forEach((r) => {
                    if (r !== this) r.checked = false;
                });
            }
        });
    });
}

// Función para cargar direcciones guardadas
async function loadSavedAddresses() {
    await cargarDirecciones();
    const savedAddressesContainer = document.getElementById("saved-addresses");
    const noAddressesMsg = document.getElementById("no-addresses-msg");
    const savedAddresses = direcciones;

    // Filtrar las direcciones que no sean null o cadenas vacías
    const filteredAddresses = savedAddresses.filter(
        (address) => address.stringGoogle && address.stringGoogle.trim() !== "",
    );

    if (!filteredAddresses || filteredAddresses.length === 0) {
        noAddressesMsg.style.display = "block";
    } else {
        noAddressesMsg.style.display = "none";
        const ul = document.createElement("ul");
        filteredAddresses.forEach((address) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <input type="radio" name="default-address">
                <p>${address.stringGoogle}</p>
            `;
            ul.appendChild(listItem);
        });

        savedAddressesContainer.appendChild(ul);

        // Asegurar que solo un radio button esté marcado a la vez
        const radios = ul.querySelectorAll('input[type="radio"]');
        radios.forEach((radio) => {
            radio.addEventListener("change", function () {
                if (this.checked) {
                    radios.forEach((r) => {
                        if (r !== this) r.checked = false;
                    });
                }
            });
        });
    }
}

// Función para editar una dirección
function editAddress(address) {
    console.log("Editar dirección:", address);
}

// Función para usar la ubicación actual del usuario
function useCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const geocoder = new google.maps.Geocoder();
                const latlng = { lat: latitude, lng: longitude };
                geocoder.geocode(
                    { location: latlng },
                    function (results, status) {
                        if (status === "OK") {
                            if (results[0]) {
                                const currentAddress =
                                    results[0].formatted_address;
                                saveAddress(currentAddress);
                            } else {
                                console.error("No se encontraron resultados.");
                            }
                        } else {
                            console.error("Geocoder falló debido a: " + status);
                        }
                    },
                );
            },
            function (error) {
                console.error("Error al obtener la ubicación:", error);
            },
        );
    } else {
        console.error(
            "La geolocalización no es compatible con este navegador.",
        );
    }
}

// Función para confirmar la dirección seleccionada
function confirmAddress() {
    if (selectedPlace) {

        const myHeaders = new Headers();
        myHeaders.append("Access-Control-Allow-Origin", "MBAPPES");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);

        const raw = JSON.stringify({
          "idCliente": idClienteConsulta,
          "stringGoogle": selectedPlace.description
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };

        fetch("https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/user/registrardireccion", requestOptions)
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.error(error));
        
        saveAddress(selectedPlace.description);
        // Ocultar la sección de verificación y mostrar la sección de búsqueda
        document.getElementById("address-verification").style.display = "none";
        document.querySelector(".search-bar").style.display = "flex";
        document.querySelector('.search-bar input[type="text"]').value = "";
    }
}

// Cargar direcciones guardadas al cargar la página
window.onload = function () {
    loadSavedAddresses();
};

// Iniciar sugerencias de dirección al escribir en el campo de búsqueda
getAddressSuggestions();

// Evento para editar una dirección al hacer clic en el icono de lápiz
document
    .getElementById("saved-addresses")
    .addEventListener("click", function (event) {
        if (event.target && event.target.nodeName == "IMG") {
            editAddress(event.target.parentNode.textContent);
        }
    });

// Evento para usar la ubicación actual del usuario al hacer clic en el botón correspondiente
document
    .getElementById("use-current-location")
    .addEventListener("click", function () {
        useCurrentLocation();
    });

// Evento para confirmar la dirección al hacer clic en el botón correspondiente
document
    .getElementById("confirm-address")
    .addEventListener("click", function () {
        confirmAddress();
    });

// Función para obtener sugerencias de dirección
function getAddressSuggestions() {
    const input = document.getElementById("address-input");
    const service = new google.maps.places.AutocompleteService();
    input.addEventListener("input", function () {
        const displaySuggestions = function (predictions, status) {
            const suggestions = document.getElementById("address-suggestions");
            suggestions.innerHTML = "";
            if (
                status != google.maps.places.PlacesServiceStatus.OK ||
                !predictions
            ) {
                return;
            }
            predictions.forEach(function (prediction) {
                const div = document.createElement("div");
                div.textContent = prediction.description;
                div.addEventListener("click", function () {
                    input.value = prediction.description;
                    selectedPlace = prediction;
                    suggestions.innerHTML = "";

                    // Eliminar la clase 'selected' de todos los elementos
                    const allSuggestions = suggestions.querySelectorAll("div");
                    allSuggestions.forEach((sugg) =>
                        sugg.classList.remove("selected"),
                    );

                    // Añadir la clase 'selected' al elemento actual
                    div.classList.add("selected");

                    showAddressVerification(prediction);
                });
                suggestions.appendChild(div);
            });
        };

        if (input.value) {
            service.getPlacePredictions(
                { input: input.value },
                displaySuggestions,
            );
        }
    });
}
