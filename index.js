// Importación de dependencias
const express = require("express");
const agentes = require('./data/agentes.js')
const app = express();
const jwt = require("jsonwebtoken");
const secretKey = "Shhhh";
const port = 3000;

// Conexión a servidor
app.listen(port, () => console.log('Servidor inicializado en puerto ' + port));

// Disponibiliza ruta raiz
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.send(__dirname + "index.html");
});

// Disponibiliza ruta para Inicio de sesión
app.get("/SignIn", (req, res) => {
  const { email, password } = req.query;
  const user = agentes.results.find(
    (u) => u.email == email && u.password == password
  );
  if (user) {
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 120,
        data: user,
      },
      secretKey
    );
    res.send(`
      ${email}
      <a href="/Secret?token=${token}"> <p> Ruta Restringida </p> </a>
      <script>
      localStorage.setItem('token', JSON.stringify("${token}"))
      </script>
      `);
  } else {
    res.send(`Usuario o clave incorrecta \n <a href="/"> <p> Ir a la página de Inicio </p> </a>`);
  }
});

// Disponibiliza ruta restringida a usuarios registrados
app.get("/Secret", (req, res) => {
  const { token } = req.query;
  jwt.verify(token, secretKey, (err, decoded) => {
    err
      ? res.status(401).send({
          error: "401 No Autorizado",
          message: err.message,
        })
      : res.send(`Bienvenido ${decoded.data.email}\n <a href="/"> <p> Volver al Inicio </p> </a>`);
  });
});