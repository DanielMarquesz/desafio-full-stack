export interface NotificationPayload {
  messageId: string;
  contentMessage: string;
}

export interface NotificationStatus {
  messageId: string;
  status: string;
}

export interface StatusResponse {
  status: string;
}

export interface ErrorResponse {
  error: string;
}