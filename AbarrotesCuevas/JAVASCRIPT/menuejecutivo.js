var myHeaders = new Headers();
myHeaders.append("Access-Control-Allow-Origin", "MBAPPES");
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiYWRtaW4ifSwiaWF0IjoxNzE2ODM0NzYxLCJleHAiOjE3MTY4MzgzNjF9.wNXPbiH38SjHgjCr6VkzruWh2SjRlIuDaGm-Q4Dmazk");

var raw = "";

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://973f29df-328d-4bcf-80f4-60c18a7bfd7a-00-2z1u5ktbg8j3k.riker.replit.dev/api/executive/pedidos", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));