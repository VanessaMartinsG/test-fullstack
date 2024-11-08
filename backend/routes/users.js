const express = require('express');
const db = require('../database/db');

const router = express.Router();
const validStatus = ["ativo", "inativo", "aguardando ativacao", "desativado"];

function validateStatus(status) {
  return validStatus.includes(status);
}

function validateCPF(cpf) {
  const cpfRegex = /^\d{11}$/;
  return cpfRegex.test(cpf);
}

function validatePhone(telefone) {
  const phoneRegex = /^\d{10,11}$/;
  return phoneRegex.test(telefone);
}

router.post('/', (req, res) => {
  const { nome, cpf, email, telefone, status } = req.body;

  if (!nome || !cpf || !email || !telefone || !status) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  if (!validateCPF(cpf)) {
    return res.status(400).json({ error: 'CPF inválido. Deve ter 11 dígitos numéricos' });
  }

  if (!validatePhone(telefone)) {
    return res.status(400).json({ error: 'Telefone inválido. Deve ter 10 ou 11 dígitos numéricos' });
  }

  if (!validateStatus(status)) {
    return res.status(400).json({ error: 'Status inválido' });
  }

  db.get('SELECT * FROM users WHERE cpf = ? OR email = ?', [cpf, email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (row) {
      return res.status(400).json({
        error: row.cpf === cpf ? 'CPF já cadastrado' : 'Email já cadastrado'
      });
    }

    db.run(
      'INSERT INTO users (nome, cpf, email, telefone, status) VALUES (?, ?, ?, ?, ?)',
      [nome, cpf, email, telefone, status],
      function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
      }
    );
  });
});

router.get('/', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!row) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(row);
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nome, cpf, email, telefone, status } = req.body;

  if (!nome || !cpf || !email || !telefone || !status) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  if (!validateCPF(cpf)) {
    return res.status(400).json({ error: 'CPF inválido. Deve ter 11 dígitos numéricos' });
  }

  if (!validatePhone(telefone)) {
    return res.status(400).json({ error: 'Telefone inválido. Deve ter 10 ou 11 dígitos numéricos' });
  }

  if (!validateStatus(status)) {
    return res.status(400).json({ error: 'Status inválido' });
  }

  db.get('SELECT * FROM users WHERE (cpf = ? OR email = ?) AND id != ?', [cpf, email, id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (row) {
      return res.status(400).json({
        error: row.cpf === cpf ? 'CPF já cadastrado' : 'Email já cadastrado'
      });
    }

    db.run(
      'UPDATE users SET nome = ?, cpf = ?, email = ?, telefone = ?, status = ? WHERE id = ?',
      [nome, cpf, email, telefone, status, id],
      function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Usuário editado com sucesso!' });
      }
    );
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Usuário deletado com sucesso!' });
  });
});

module.exports = router;