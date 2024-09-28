const { Client } = require('pg');

// Configuração da conexão
const client = new Client({
  host: 'localhost',     // Endereço do servidor do PostgreSQL
  port: 5432,            // Porta padrão do PostgreSQL
  user: 'jvt',   // Nome de usuário do PostgreSQL
  password: '4053', // Senha do usuário
  database: 'postgres'  // Nome do banco de dados
});

// Função de consulta
const consulta = async (query) => {
  try {
    const res = await client.query(query);
    return res.rows;
  } catch (err) {
    console.error('Erro na consulta', err.stack);
  }
};

// Função para conectar
const conectar = async () => {
  try {
    await client.connect();
    console.log("Conexão estabelecida.");
  } catch (err) {
    console.error("Erro na conexão", err.stack);
  }
};

// Exportar o cliente para ser usado em outros arquivos
module.exports = { conectar, consulta};