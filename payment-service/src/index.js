const express = require('express');
const dotenv = require('dotenv');
const connectAmqp = require('./amqp');
const pool = require('./db');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let channel;
connectAmqp().then((ch) => {
  channel = ch;
});

app.listen(port, () => {
    console.log(`Servidor de pagamento rodando na porta ${port}`);
  });

app.post('/process-payment', async (req, res) => {
  const { userId, amount } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO transactions (user_id, amount, status) VALUES ($1, $2, $3) RETURNING *',
      [userId, amount, 'Pendente']
    );

    const transaction = result.rows[0];

    const notificationMessage = `Solicitação de transação recebida para o usuário ${userId}. Status: Pendente.`;
    if (channel) {
      channel.sendToQueue('notification_queue', Buffer.from(notificationMessage));
    }

    res.json({ message: 'Transação recebida e notificação enviada.', transaction });
  } catch (error) {
    console.error('Erro ao processar transação', error);
    res.status(500).json({ error: 'Erro ao processar transação.' });
  }
});

app.post('/confirm-payment', async (req, res) => {
    const { transactionId } = req.body;
  
    try {
      const result = await pool.query(
        'UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *',
        ['Sucesso', transactionId]
      );
  
      const transaction = result.rows[0];
  
      const notificationMessage = `Transação confirmada para o usuário ${transaction.user_id}. Status: Sucesso.`;
      if (channel) {
        channel.sendToQueue('notification_queue', Buffer.from(notificationMessage));
      }
  
      res.json({ message: 'Transação confirmada e notificação enviada.', transaction });
    } catch (error) {
      console.error('Erro ao confirmar transação', error);
      res.status(500).json({ error: 'Erro ao confirmar transação.' });
    }
  });