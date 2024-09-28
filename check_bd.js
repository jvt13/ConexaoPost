const { Client } = require('pg');
const {bd, user, pass, host} = require('./dados_conexao')

// Função para verificar se o banco de dados já existe
async function databaseExists(dbName) {
  const client = new Client({
    user: user,   // Altere para seu usuário do PostgreSQL
    host: host,
    password: pass,  // Altere para sua senha
    port: 5432,
    database: 'postgres',  // Conecta-se ao banco padrão para verificação
  });

  try {
    await client.connect();
    const result = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    return result.rows.length > 0;
  } catch (err) {
    console.error(`Erro ao verificar banco de dados: ${err}`);
    return false;
  } finally {
    await client.end();  // Fechar a conexão
  }
}

// Função para criar o banco de dados, se não existir
async function createDatabaseIfNotExists(dbName) {
  const exists = await databaseExists(dbName);
  if (exists) {
    console.log(`Banco de dados ${dbName} já existe.`);
  } else {
    const client = new Client({
      user: user,
      host: host,
      password: pass,
      port: 5432,
      database: 'postgres', // Conectar ao banco de dados padrão
    });

    try {
      await client.connect();
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Banco de dados ${dbName} criado com sucesso!`);
    } catch (err) {
      console.error(`Erro ao criar banco de dados: ${err}`);
    } finally {
      await client.end();  // Fechar a conexão
    }
  }
}

// Função para verificar se a tabela existe
async function tableExists(client, tableName) {
  try {
    const result = await client.query(`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = $1
      )
    `, [tableName]);
    return result.rows[0].exists;
  } catch (err) {
    console.error(`Erro ao verificar tabela: ${err}`);
    return false;
  }
}

// Função para criar tabelas, se não existirem
async function createTablesIfNotExists(dbName) {
  const client = new Client({
    user: user,  // Altere para seu usuário do PostgreSQL
    host: host,
    database: dbName,   // Conectar ao banco de dados especificado
    password: pass,  // Altere para sua senha
    port: 5432,
  });

  try {
    await client.connect();

    const usersTableExists = await tableExists(client, 'users');
    if (!usersTableExists) {
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100),
          email VARCHAR(100) UNIQUE NOT NULL
        );
      `);
      console.log('Tabela "users" criada com sucesso!');
    } else {
      console.log('Tabela "users" já existe.');
    }

    const productsTableExists = await tableExists(client, 'products');
    if (!productsTableExists) {
      await client.query(`
        CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100),
          price NUMERIC NOT NULL
        );
      `);
      console.log('Tabela "products" criada com sucesso!');
    } else {
      console.log('Tabela "products" já existe.');
    }
  } catch (err) {
    console.error(`Erro ao criar tabelas: ${err}`);
  } finally {
    await client.end();  // Fechar a conexão
  }
}

module.exports = {
  createDatabaseIfNotExists,
  createTablesIfNotExists,
};
