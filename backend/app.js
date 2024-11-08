const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');

const app = express();
app.use(express.json());

app.use(cors());

app.use('/users', usersRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
