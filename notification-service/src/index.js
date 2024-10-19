const amqp = require('amqplib');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const connectAmqp = async () => {
  try {
    const connection = await amqp.connect(process.env.AMQP_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue('notification_queue');

    channel.consume('notification_queue', (message) => {
      if (message !== null) {
        const notification = message.content.toString();
        console.log('Notificação recebida:', notification);

        sendNotificationToUser(notification);

        channel.ack(message);
      }
    });

    console.log('Aguardando mensagens na fila...');
  } catch (error) {
    console.error('Erro ao conectar ao RabbitMQ', error);
  }
};

const sendNotificationToUser = (notification) => {
  console.log(`Notificação enviada ao usuário: ${notification}`);
};

app.listen(port, () => {
  console.log(`Servidor de notificação rodando na porta ${port}`);
  connectAmqp();
});
