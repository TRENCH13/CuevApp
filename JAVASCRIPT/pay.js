function obtenerTotalCarrito() {
    const totalElement = document.getElementById('payment-amount');
    if (totalElement) {
        // Extracción del valor numérico usando una expresión regular
        const texto = totalElement.innerText;
        const match = texto.match(/[\d,.]+/); // Busca la primera secuencia de dígitos y puntos/comas
        if (match) {
            return parseFloat(match[0].replace(',', '')); // Convierte la cadena numérica a un número flotante
        } else {
            console.error('No se encontró un valor numérico en el texto');
            return 0;
        }
    } else {
        console.error('No se encontró el elemento payment-amount');
        return 0;
    }
}

function initiateCheckout() {
    var totalAmount = obtenerTotalCarrito();
    const options = {
        method: 'POST',
        headers: {
          accept: 'application/vnd.com.payclip.v2+json',
          'content-type': 'application/json',
          'x-api-key': 'BASIC OTBlYWMwMDMtNDFlOS00MWZhLTkzMzQtMjhlM2VhNDA1YjViOjY1OGY0NmVjLTBkNGItNDkyMi05NTJjLWMyZGExZDc4NDhhYQ=='
        },
        body: JSON.stringify({
          amount: 0.1,
          currency: 'MXN',
          purchase_description: 'Compra en CuevApp',
          redirection_url: {
            success: '../../HTML/thanks.html',
            error: '../../HTML/cart.html',
            default: '../../HTML/thanks.html'
          },
          webhook_url: 'https://hook.us1.make.com/k5f98kqxuuxgn4td6hgejrnu6lsi362p'
        })
      };
      
      fetch('https://api-gw.payclip.com/checkout', options)
      .then(response => response.json())
      .then(response => {
        console.log(response); // Esta línea es opcional, puedes quitarla si no necesitas imprimir la respuesta en la consola
        window.location.href = response.payment_request_url;
      })
      .catch(err => console.error(err));
    
}

document.getElementById('pay-now').addEventListener('click', () => {
    var totalAmount = obtenerTotalCarrito();
    mostrarModalPago(totalAmount);
});

document.getElementById('pay-card').addEventListener('click', () => {
    document.getElementById('payment-modal').style.display = 'none';
    initiateCheckout();
});

document.getElementById('pay-cash').addEventListener('click', () => {
    alert('Pago en efectivo seleccionado');
    document.getElementById('payment-modal').style.display = 'none';
});

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('payment-modal').style.display = 'none';
});
