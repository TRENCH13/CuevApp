const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

document.addEventListener("DOMContentLoaded", function () {
    const fragmentContainer = document.getElementById("fragment-container");
    const buttons = document.querySelectorAll(
        ".action-admin-button-usuario, .action-admin-button-sucursal, .action-admin-button-producto",
    );

    buttons.forEach((button) => {
        button.addEventListener("click", function () {
            const fragmentId = this.id.replace("button", "fragment");
            loadFragment(fragmentId);
        });
    });

    function loadComboBoxOptions(selectId, url, textKey, valueKey) {
        const selectElement = fragmentContainer.querySelector(`#${selectId}`);

        const myHeaders = new Headers();
        myHeaders.append("Access-Control-Allow-Origin", "MBAPPES");
        myHeaders.append("Authorization", "Bearer " + token);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                result.forEach((item) => {
                    const option = document.createElement("option");
                    option.text = item[textKey];
                    option.value = item[valueKey];
                    selectElement.add(option);
                });
            })
            .catch((error) => console.error("Error:", error));
    }

    function loadFragment(fragmentId) {
        const fragment = document.getElementById(fragmentId);
        fragmentContainer.innerHTML = fragment.innerHTML;

        if (fragmentId === "fragment1") {
            loadComboBoxOptions(
                "cargo",
                "https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/admin/obtenertiposusuario",
                "TipoUsuario",
                "IDTipoUsuario",
            );
            loadComboBoxOptions(
                "sucursal",
                "https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/admin/obtenersucursales",
                "NombreComercial",
                "IDSucursal",
            );
            attachFormSubmitEvent(
                "guardar-usuario-button",
                sendUserRegistration,
            );
        } else if (fragmentId === "fragment2") {
            attachFormSubmitEvent(
                "guardar-sucursal-button",
                sendBranchRegistration,
            );
        } else if (fragmentId === "fragment3") {
            loadComboBoxOptions(
                "categoria",
                "https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/product/categoriasinicio",
                "Categoria",
                "IDCategoria",
            );
            loadComboBoxOptions(
                "sucursal",
                "https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/admin/obtenersucursales",
                "NombreComercial",
                "IDSucursal",
            );
            attachFormSubmitEvent(
                "guardar-producto-button",
                sendProductRegistration,
            );
        }
    }

    function attachFormSubmitEvent(buttonId, callback) {
        const saveButton = fragmentContainer.querySelector(`#${buttonId}`);
        saveButton.addEventListener("click", function (event) {
            event.preventDefault();
            callback();
        });
    }

    function sendUserRegistration() {
        const formData = new FormData(fragmentContainer.querySelector("form"));

        const data = {
            nombres: formData.get("nombre"),
            apellidoPaterno: formData.get("apellidoPaterno"),
            apellidoMaterno: formData.get("apellidoMaterno"),
            diaNacimiento: formData.get("dob").split("-")[2],
            mesNacimiento: formData.get("dob").split("-")[1],
            anioNacimiento: formData.get("dob").split("-")[0],
            telefono: formData.get("telefono"),
            IDTipoUsuario: formData.get("cargo"), // Obtiene el valor del select
            IDSucursal: formData.get("sucursal"), // Obtiene el valor del select
            User: formData.get("usuario"),
            Password: formData.get("password"),
        };

        console.log(data);

        const myHeaders = new Headers();
        myHeaders.append("Access-Control-Allow-Origin", "MBAPPES");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(data),
            redirect: "follow",
        };

        fetch(
            "https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/admin/registrarusuario",
            requestOptions,
        )
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                alert("Registro exitoso");
                fragmentContainer.innerHTML = "";
            })
            .catch((error) => console.error("Error:", error));
    }

    function sendBranchRegistration() {
        const formData = new FormData(fragmentContainer.querySelector("form"));

        const data = {
            nombreComercial: formData.get("nombreComercial"),
            direccion: formData.get("direccionCompletaSucursal"),
            latitud: parseFloat(formData.get("latitud")),
            longitud: parseFloat(formData.get("longitud")),
            horarioInicio: formData.get("horaApertura") + ":00",
            horarioFin: formData.get("horaCierre") + ":00",
        };

        console.log(data.horarioFin);

        const myHeaders = new Headers();
        myHeaders.append("Access-Control-Allow-Origin", "MBAPPES");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(data),
            redirect: "follow",
        };

        console.log(requestOptions);

        fetch(
            "https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/admin/registrarsucursal",
            requestOptions,
        )
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                alert("Registro de sucursal exitoso");
                fragmentContainer.innerHTML = ""; // Cerrar fragmento
            })
            .catch((error) => console.error("Error:", error));
    }

    function sendProductRegistration() {
        const form = document.querySelector("form");
        const fileInput = form.querySelector("#imagenProducto");
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = function () {
                const base64StringImage = reader.result.replace('data:', '').replace(/^.+,/, '');
                console.log(base64StringImage);

                const formData = new FormData(form);

                var idTipoBarcode = null;

                switch (formData.get("codigoBarras").length) {
                    case 8:
                        idTipoBarcode = 2;
                        break;
                    case 12:
                        idTipoBarcode = 1;
                        break;
                    default:
                        idTipoBarcode = 1;
                        break;
                }

                const data = {
                    idProducto: formData.get("codigoBarras"),
                    fotografia: base64StringImage,
                    nombre: formData.get("nombreProducto"),
                    descripcion: formData.get("descripcion"),
                    unidades: formData.get("unidades"),
                    precio: parseFloat(formData.get("precio")),
                    idCategoria: formData.get("categoria"),
                    idSucursal: formData.get("sucursal"),
                    idTipoBarCode: idTipoBarcode,
                };

                console.log(data);

                const myHeaders = new Headers();
                myHeaders.append("Access-Control-Allow-Origin", "MBAPPES");
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", "Bearer " + token);

                const requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: JSON.stringify(data),
                    redirect: "follow",
                };

                fetch(
                    "https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/admin/registrarproducto",
                    requestOptions
                )
                .then((response) => response.text())
                .then((result) => {
                    console.log(result);
                    alert("Registro de producto exitoso");
                    fragmentContainer.innerHTML = "";
                })
                .catch((error) => console.error("Error:", error));
            };

            reader.readAsDataURL(file);
        } else {
            console.log("No se seleccionó ningún archivo");
        }
    }

    function base64ToBlob(base64, mimeType) {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }
});
