const amqp = require('amqplib');
const dotenv = require('dotenv');

dotenv.config();

const connectAmqp = async () => {
  try {
    const connection = await amqp.connect(process.env.AMQP_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue('payment_notifications');

    return channel;
  } catch (error) {
    console.error('Erro ao conectar ao AMQP', error);
  }
};

module.exports = connectAmqp;
