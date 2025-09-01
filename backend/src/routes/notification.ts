import express, { Request, Response, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { rabbitmq } from '../rabbitmq';
import statusService from '../services/statusService';
import { getIO } from '../socket';
import { NotificationPayload, ErrorResponse } from '../types';

const router: Router = express.Router();

router.post('/notificar', async (req: Request, res: Response) => {
  try {
    const { contentMessage } = req.body;
    

    if (!contentMessage || contentMessage.trim() === '') {
      const errorResponse: ErrorResponse = { error: 'Mensagem não pode ser vazia' };
      return res.status(400).json(errorResponse);
    }

    const messageId = uuidv4();
    

    const payload: NotificationPayload = { messageId, contentMessage };
    await rabbitmq.getChannel().sendToQueue(
      'fila.notificacao.entrada.daniel-marques',
      Buffer.from(JSON.stringify(payload))
    );

    const status = statusService.setStatus(messageId, 'AGUARDANDO_PROCESSAMENTO');
    

    getIO().emit('status-atualizado', { messageId, status });
    
    res.status(202).json({ messageId, status: 'ENVIADO_PARA_PROCESSAMENTO' });
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    const errorResponse: ErrorResponse = { error: 'Erro interno do servidor' };
    res.status(500).json(errorResponse);
  }
});


router.get('/status/:messageId', (req: Request, res: Response) => {
  const status = statusService.getStatus(req.params.messageId);
  res.json({ status });
});

router.get('/status', (req: Request, res: Response) => {
  const allStatuses = statusService.getAllStatuses();
  res.json(allStatuses);
});

export default router;