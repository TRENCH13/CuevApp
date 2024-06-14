const userNombre = document.cookie
    .split("; ")
    .find((row) => row.startsWith("name="))
    ?.split("=")[1];

const userApellidoPaterno = document.cookie
    .split("; ")
    .find((row) => row.startsWith("apellidoPaterno="))
    ?.split("=")[1];

const userApellidoMaterno = document.cookie
    .split("; ")
    .find((row) => row.startsWith("apellidoMaterno="))
    ?.split("=")[1];

const userTelefono = document.cookie
    .split("; ")
    .find((row) => row.startsWith("telefono="))
    ?.split("=")[1];

document.addEventListener("DOMContentLoaded", () => {
    // Cargar los datos de perfil al cargar la página
    document.getElementById("username").value = userNombre || "";
    document.getElementById("apellidoPaterno").value =
        userApellidoPaterno || "";
    document.getElementById("apellidoMaterno").value =
        userApellidoMaterno || "";
    document.getElementById("phone").value = userTelefono || "";

    // Manejar el formulario de actualización de perfil
    const profileForm = document.getElementById("profile-form");
    const updateButton = document.getElementById("update-button");
    const regresarButton = document.getElementById("regresar-button");
    const showPasswordButton = document.getElementById("show-password-form");
    const passwordForm = document.getElementById("password-form");

    regresarButton.addEventListener("click", () => {
        window.location.href = "../main.html";
    });

    let isProfileFormDirty = false;
    let isPasswordFormVisible = false;

    profileForm.addEventListener("input", () => {
        isProfileFormDirty = true;
        toggleUpdateButtonVisibility();
    });

    showPasswordButton.addEventListener("click", () => {
        isPasswordFormVisible = !isPasswordFormVisible;
        togglePasswordFormVisibility();
        showPasswordButton.textContent = isPasswordFormVisible
            ? "Ocultar Contraseña"
            : "Mostrar Contraseña";
    });

    profileForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;

        console.log(`Actualizar perfil: ${username}, ${email}, ${phone}`);
        alert("Perfil actualizado correctamente");
        isProfileFormDirty = false;
        toggleUpdateButtonVisibility();
    });

    passwordForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const newPassword = document.getElementById("new-password").value;
        const confirmPassword =
            document.getElementById("confirm-password").value;

        if (newPassword === confirmPassword) {
            console.log(`Cambiar contraseña a: ${newPassword}`);
            alert("Contraseña cambiada correctamente");
            isPasswordFormVisible = false;
            togglePasswordFormVisibility();
        } else {
            alert("Las contraseñas no coinciden");
        }
    });

    function toggleUpdateButtonVisibility() {
        updateButton.style.display = isProfileFormDirty ? "block" : "none";
    }

    function togglePasswordFormVisibility() {
        passwordForm.style.display = isPasswordFormVisible ? "block" : "none";
    }
});
