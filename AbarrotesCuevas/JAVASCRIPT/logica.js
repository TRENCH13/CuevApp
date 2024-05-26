// Lógica JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Aquí puedes agregar la lógica para manejar eventos, como clics en botones, etc.
    const searchBar = document.querySelector('.search-bar input');
    const searchIcon = document.querySelector('.search-icon');
    cargarContenido('../HTML/main.html', 'main-content-container');
  
    searchBar.addEventListener('focus', function() {
      this.placeholder = '';
    });
  
    searchBar.addEventListener('blur', function() {
      this.placeholder = 'Busca cualquier producto ...';
    });
  
    searchIcon.addEventListener('click', function() {
      
    });

    function cargarContenido(url, contenedorId) {
      fetch(url)
        .then(response => response.text())
        .then(html => {
          document.getElementById(contenedorId).innerHTML = html;
        })
        .catch(error => {
          console.error('Error al cargar el contenido:', error);
        });
    }
  });
  