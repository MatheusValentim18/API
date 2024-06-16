const express = require('express');
const mysql = require('mysql2');


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'db'
});


db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conectado ao banco de dados MySQL.');
});

const app = express();
const PORT = 3000;


app.use(express.json());


app.get('/produtos', (req, res) => {
  db.query('SELECT * FROM produtos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/produtos/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM produtos WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post('/produtos', (req, res) => {
  const { nome, descricao, preco, quantidade_estoque } = req.body;
  const sql = 'INSERT INTO produtos (nome, descricao, preco, quantidade_estoque) VALUES (?, ?, ?, ?)';
  db.query(sql, [nome, descricao, preco, quantidade_estoque], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, nome, descricao, preco, quantidade_estoque });
  });
});

app.put('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, quantidade_estoque } = req.body;
  const sql = 'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, quantidade_estoque = ? WHERE id = ?';
  db.query(sql, [nome, descricao, preco, quantidade_estoque, id], (err, result) => {
    if (err) throw err;
    res.send('Produto atualizado com sucesso.');
  });
});

app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM produtos WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.send('Produto excluído com sucesso.');
  });
});


app.get('/clientes', (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/clientes/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM clientes WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post('/clientes', (req, res) => {
  const { nome, email, endereco } = req.body;
  const sql = 'INSERT INTO clientes (nome, email, endereco) VALUES (?, ?, ?)';
  db.query(sql, [nome, email, endereco], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, nome, email, endereco });
  });
});

app.put('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, endereco } = req.body;
  const sql = 'UPDATE clientes SET nome = ?, email = ?, endereco = ? WHERE id = ?';
  db.query(sql, [nome, email, endereco, id], (err, result) => {
    if (err) throw err;
    res.send('Cliente atualizado com sucesso.');
  });
});

app.delete('/clientes/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM clientes WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.send('Cliente excluído com sucesso.');
  });
});


app.get('/vendas', (req, res) => {
  db.query('SELECT * FROM vendas', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/vendas/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM vendas WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post('/vendas', (req, res) => {
  const { data_venda, cliente_id, pedidos } = req.body;
  const sql = 'INSERT INTO vendas (data_venda, cliente_id) VALUES (?, ?)';
  db.query(sql, [data_venda, cliente_id], (err, result) => {
    if (err) throw err;
    const vendaId = result.insertId;
    const pedidosSql = 'INSERT INTO pedidos (venda_id, produto_id, quantidade, preco_unitario) VALUES ?';
    const pedidosData = pedidos.map(pedido => [vendaId, pedido.produto_id, pedido.quantidade, pedido.preco_unitario]);
    db.query(pedidosSql, [pedidosData], (err, result) => {
      if (err) throw err;
      res.json({ id: vendaId, data_venda, cliente_id, pedidos });
    });
  });
});


app.get('/pedidos', (req, res) => {
  db.query('SELECT * FROM pedidos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/pedidos/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM pedidos WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post('/pedidos', (req, res) => {
  const { venda_id, produto_id, quantidade, preco_unitario } = req.body;
  const sql = 'INSERT INTO pedidos (venda_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)';
  db.query(sql, [venda_id, produto_id, quantidade, preco_unitario], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, venda_id, produto_id, quantidade, preco_unitario });
  });
});


app.get('/estoque', (req, res) => {
  db.query('SELECT * FROM estoque', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.put('/estoque/:produto_id', (req, res) => {
  const { produto_id } = req.params;
  const { quantidade } = req.body;
  const sql = 'UPDATE estoque SET quantidade = ? WHERE produto_id = ?';
  db.query(sql, [quantidade, produto_id], (err, result) => {
    if (err) throw err;
    res.send('Estoque atualizado com sucesso.');
  });
});


app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
