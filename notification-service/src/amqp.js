const amqp = require('amqplib');
const dotenv = require('dotenv');

dotenv.config();

const connectAmqp = async () => {
  try {
    const connection = await amqp.connect(process.env.AMQP_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue('notification_queue');

    channel.consume('notification_queue', (message) => {
      if (message !== null) {
        console.log('Notificação recebida:', message.content.toString());
        channel.ack(message); 
      }
    });

    return channel;
  } catch (error) {
    console.error('Erro ao conectar ao RabbitMQ', error);
  }
};

module.exports = connectAmqp;
