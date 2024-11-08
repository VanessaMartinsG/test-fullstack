const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/db.db'); 

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    cpf TEXT UNIQUE,
    email TEXT UNIQUE,
    telefone TEXT,
    status TEXT CHECK (status IN ('ativo', 'inativo', 'aguardando ativacao', 'desativado'))
  )`);
});

module.exports = db;
