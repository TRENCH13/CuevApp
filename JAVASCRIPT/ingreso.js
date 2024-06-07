document.addEventListener('DOMContentLoaded', function() {
    const continuarButton = document.getElementById('continuar-button');
    const tengoCuentaButton = document.getElementById('tengo-cuenta-button');
    const form = document.getElementById('registro-form');

    continuarButton.addEventListener('click', function() {
        window.location.href = 'registro.html';
    });

    tengoCuentaButton.addEventListener('click', function() {
        window.location.href = 'iniciosesion.html';
    });

    /*form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        const telefono = document.getElementById('telefono').value;
        const nombres = document.getElementById('nombre').value;
        const apellidoPaterno = document.getElementById('apellidoPaterno').value;
        const apellidoMaterno = document.getElementById('apellidoMaterno').value;
        const password = document.getElementById('password').value;
        const dob = document.getElementById('dob').value;
        const [anioNacimiento, mesNacimiento, diaNacimiento] = dob.split('-').map(Number);

        const data = {
            "User": telefono,
            "Password": password,
            "Nombres": nombres,
            "ApellidoPaterno": apellidoPaterno,
            "ApellidoMaterno": apellidoMaterno,
            "DiaNacimiento": diaNacimiento,
            "MesNacimiento": mesNacimiento,
            "AnioNacimiento": anioNacimiento,
            "Telefono": telefono
        };

        fetch('https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/auth/signin', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('MBAPPES:MBAPPES'),
                'Origin': 'MBAPPES'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error en la petición');
                }
            })
            .then(data => {
                alert('Exito en el registro');
                console.log('Registro con Éxito:', data);
            })
            .catch(error => {
                alert('Error en el registro');
                console.error('Error en el registro:', error);
            });
    });*/

});



