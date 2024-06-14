document.addEventListener("DOMContentLoaded", function () {
    const continuarButton = document.getElementById("continuar-button");
    const tengoCuentaButton = document.getElementById("tengo-cuenta-button");
    const form = document.getElementById("registro-form");

    if (continuarButton) {
        continuarButton.addEventListener("click", function () {
            window.location.href = "../registro.html";
        });
    }

    if (tengoCuentaButton) {
        tengoCuentaButton.addEventListener("click", function () {
            window.location.href = "../iniciosesion.html";
        });
    }

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Evitar el envío del formulario por defecto

            const telefono = document.getElementById("telefono").value;
            const nombres = document.getElementById("nombre").value;
            const apellidoPaterno =
                document.getElementById("apellidoPaterno").value;
            const apellidoMaterno =
                document.getElementById("apellidoMaterno").value;
            const password = document.getElementById("password").value;
            const dob = document.getElementById("dob").value;
            const terms = document.getElementById("terms").checked; //Aquí se evalúa si la casilla de los términos está llena
            //Validación de campos vacíos
            if (
                !telefono ||
                !nombres ||
                !apellidoPaterno ||
                !apellidoMaterno ||
                !password ||
                !dob ||
                !terms
            ) {
                alert(
                    "Por favor, complete todos los campos y acepte los términos y condiciones.",
                );
                return;
            }

            // Validar que el usuario sea mayor de 18 años
            const [anioNacimiento, mesNacimiento, diaNacimiento] = dob
                .split("-")
                .map(Number);
            const fechaNacimiento = new Date(
                anioNacimiento,
                mesNacimiento - 1,
                diaNacimiento,
            );
            const hoy = new Date();
            const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
            const mes = hoy.getMonth() - fechaNacimiento.getMonth();

            if (
                mes < 0 ||
                (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())
            ) {
                edad--;
            }

            if (edad < 18) {
                alert("Debes tener al menos 18 años para registrarte.");
                return;
            }

            const myHeaders = new Headers();
            myHeaders.append("Access-Control-Allow-Origin", "MBAPPES");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Basic TUJBUFBFUzpNQkFQUEVT");

            const raw = JSON.stringify({
                User: telefono,
                Password: password,
                Nombres: nombres,
                ApellidoPaterno: apellidoPaterno,
                ApellidoMaterno: apellidoMaterno,
                DiaNacimiento: diaNacimiento,
                MesNacimiento: mesNacimiento,
                AnioNacimiento: anioNacimiento,
                Telefono: telefono,
            });

            const requestOptions = {
                method: "PUT",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };

            fetch(
                "https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/auth/signin",
                requestOptions,
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            "Network response was not ok " +
                                response.statusText,
                        );
                    }
                    return response.text();
                })
                .then((result) => {
                    console.log("Exito en la operación:", result);
                    window.location.href = "../main.html";
                })
                .catch((error) => {
                    console.error("Hubo un problema con el fetchva:", error);
                });
        });
    }
});
