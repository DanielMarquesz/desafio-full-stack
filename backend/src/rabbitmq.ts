import * as amqp from 'amqplib';

export class RabbitMQ {
  private connection: any = null;
  private channel: any = null;

  async connect(): Promise<void> {
    try {

      const dockerRabbitMqUrl = process.env.RABBITMQ_URL;
      
      if (dockerRabbitMqUrl) {
        try {
          console.log('Tentando conectar ao RabbitMQ via Docker...');
          this.connection = await amqp.connect(dockerRabbitMqUrl);
          console.log('Conectado ao RabbitMQ via Docker com sucesso!');
        } catch (dockerError: any) {
          console.log('Falha na conexão com RabbitMQ via Docker:', dockerError.message || 'Unknown error');

        }
      }
      

      if (!this.connection) {
        try {
          console.log('Tentando conectar ao RabbitMQ na nuvem...');
          const cloudUrl = process.env.CLOUDAMQP_URL || '';
          this.connection = await amqp.connect(cloudUrl);
          console.log('Conectado ao RabbitMQ na nuvem com sucesso!');
        } catch (cloudError: any) {
          console.log('Falha na conexão com a nuvem:', cloudError.message || 'Unknown error');

        }
      }
      

      if (!this.connection) {
        try {
          console.log('Tentando conexão local com RabbitMQ...');
          this.connection = await amqp.connect('amqp://guest:guest@localhost:5672');
          console.log('Conectado ao RabbitMQ local com sucesso!');
        } catch (localError: any) {
          console.log('Falha na conexão local:', localError.message || 'Unknown error');
          throw new Error('Failed to connect to any RabbitMQ instance');
        }
      }


      if (this.connection) {
        this.channel = await this.connection.createChannel();
        

        if (this.channel) {
          await this.channel.assertQueue('fila.notificacao.entrada.daniel-marques');
          await this.channel.assertQueue('fila.notificacao.status.daniel-marques');
          
          console.log('Filas criadas com sucesso!');
        }
      }
    } catch (error: any) {
      console.error('Erro ao conectar com RabbitMQ:', error.message || error);

      setTimeout(() => this.connect(), 5000);
    }
  }

  getChannel(): any {
    return this.channel;
  }
}

export const rabbitmq = new RabbitMQ();