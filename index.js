const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');


const app = express();
var porta = process.env.PORT || 5000;

/* Definição de limite de dados de upload.*/
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(bodyParser.json());  // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));

const { conectar, consulta } = require('./conexao'); // Importa a conexão já estabelecida

app.get('/', async (req, res) => {
  await conectar();

  //const result = await consulta("Select*from users")

  //res.send("conectado com sucesso! " + "User: " +result[0].nome + " Pass: "+ result[0].pass)
  res.send("conectado com sucesso!")
})

function startServer() {
  const server = http.createServer(app);

  server.listen(porta)
    .on('listening', () => {
      console.log(`Servidor iniciado na porta ${porta}`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`A porta ${porta} está ocupada, tentando a próxima porta.`);
        porta++;
        startServer();
      } else {
        console.error(`Erro ao tentar verificar a porta: ${err.message}`);
      }
    });
}

startServer();