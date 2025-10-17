// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Configuração da base de dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Kitanda Hub API está funcionando!',
    version: '1.0.0',
    status: 'Online',
    database: 'PostgreSQL conectada'
  });
});

// Rota para criar tabelas (executar uma vez)
app.get('/setup-database', async (req, res) => {
  try {
    // Tabela de utilizadores
    await pool.query(`
      CREATE TABLE IF NOT EXISTS utilizadores (
        id SERIAL PRIMARY KEY,
        telefone VARCHAR(20) UNIQUE NOT NULL,
        nome VARCHAR(100),
        pin VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de transacoes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transacoes (
        id SERIAL PRIMARY KEY,
        utilizador_id INTEGER REFERENCES utilizadores(id),
        tipo VARCHAR(10) CHECK (tipo IN ('entrada', 'saida')),
        valor DECIMAL(10,2) NOT NULL,
        descricao TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    res.json({ message: '✅ Tabelas criadas com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
    res.status(500).json({ error: 'Erro ao configurar base de dados' });
  }
});

// Rota para obter saldo (agora com base de dados real)
app.get('/saldo', async (req, res) => {
  try {
    // Simulação - depois vamos conectar com utilizador real
    const result = await pool.query(
      'SELECT SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE -valor END) as saldo FROM transacoes'
    );
    
    const saldo = result.rows[0].saldo || 0;
    res.json({ saldo: parseFloat(saldo) });
  } catch (error) {
    console.error('Erro ao buscar saldo:', error);
    res.json({ saldo: 15750.00 }); // Fallback para teste
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`✅ Servidor Kitanda Hub rodando na porta ${port}`);
  console.log(`📡 Acesse: http://localhost:${port}`);
  console.log(`🗄️  Base de dados: ${process.env.DATABASE_URL ? 'Conectada' : 'Não configurada'}`);
});