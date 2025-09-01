import { NotificationStatus } from '../types';

class StatusService {
  private statusMap: Map<string, string> = new Map();

  setStatus(messageId: string, status: string): string {
    this.statusMap.set(messageId, status);
    return status;
  }

  getStatus(messageId: string): string {
    return this.statusMap.get(messageId) || 'NOT_FOUND';
  }

  getAllStatuses(): NotificationStatus[] {
    return Array.from(this.statusMap.entries()).map(([id, status]) => ({ 
      messageId: id, 
      status 
    }));
  }
}

export default new StatusService();