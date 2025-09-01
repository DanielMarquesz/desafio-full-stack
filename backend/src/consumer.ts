import * as amqp from 'amqplib';
import { rabbitmq } from './rabbitmq';
import statusService from './services/statusService';
import { getIO } from './socket';
import { NotificationPayload } from './types';

const processMessage = async (): Promise<void> => {
  try {
    console.log('Iniciando consumidor RabbitMQ...');
    
    rabbitmq.getChannel().consume('fila.notificacao.entrada.daniel-marques', async (msg: amqp.ConsumeMessage | null) => {
      if (msg !== null) {
        const payload: NotificationPayload = JSON.parse(msg.content.toString());
        const { messageId } = payload;
        
        console.log(`Processando mensagem: ${messageId}`);
        

        await new Promise(resolve => 
          setTimeout(resolve, 1000 + Math.random() * 1000)
        );


        const randomNum = Math.floor(Math.random() * 10) + 1;
        const status = randomNum <= 2 ? 'FALHA_PROCESSAMENTO' : 'PROCESSADO_SUCESSO';
        
        statusService.setStatus(messageId, status);
        

        getIO().emit('status-atualizado', { messageId, status });
        
        console.log(`Mensagem ${messageId} processada com status: ${status}`);
        
        rabbitmq.getChannel().ack(msg);
      }
    });
  } catch (error) {
    console.error('Erro no consumidor:', error);
  }
};


setTimeout(processMessage, 5000);

export default processMessage;