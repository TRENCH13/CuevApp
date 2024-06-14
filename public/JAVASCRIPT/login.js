document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("login-button");

  loginButton.addEventListener("click", function () {
    const telefono = document.getElementById("telefono").value;
    const password = document.getElementById("password").value;

    const data = {
      username: telefono,
      password: password,
    };

    fetch(
      "https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("MBAPPES:MBAPPES"),
          Origin: "MBAPPES",
        },
        body: JSON.stringify(data),
      },
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error en la petición");
        }
      })
      .then((data) => {
        document.cookie = `token=${data.token}; path=/`;
        document.cookie = `name=${data.user.Nombres}; path=/`;
        document.cookie = `apellidoPaterno=${data.user.ApellidoPaterno}; path=/`;
        document.cookie = `apellidoMaterno=${data.user.ApellidoMaterno}; path=/`;
        document.cookie = `telefono=${data.user.Telefono}; path=/`;
        document.cookie = `tipoUsuario=${data.user.TipoUsuario}; path=/`;
        document.cookie = `idCliente=${data.user.IDCliente}; path=/`;

        console.log(document.cookie);

        if (data.user.TipoUsuario === "administrador") {
          window.location.href = "../Administrador/menuadmin.html";
        } else if (data.user.TipoUsuario === "ejecutivo") {
          window.location.href = "/executive/menu";
        } else if (data.user.TipoUsuario === "NULL") {
          window.location.href = "../main.html";
        } else {
          window.location.href = "../main.html"; // Página por defecto
          window.parent.location.reload(); // Recargar la página
        }
      })
      .catch((error) => {
        console.error("Error en el inicio de sesión:", error);
        window.location.href = "../ingreso.html";
      });
  });
});
