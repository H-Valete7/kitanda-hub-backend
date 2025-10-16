// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Kitanda Hub API está funcionando!',
    version: '1.0.0',
    status: 'Online'
  });
});

// Rota para obter saldo (simulado)
app.get('/saldo', (req, res) => {
  res.json({ saldo: 15750.00 });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`✅ Servidor Kitanda Hub rodando na porta ${port}`);
  console.log(`📡 Acesse: http://localhost:${port}`);
});