export default class HttpErrors extends Error {
  status?: number;
  message: string;
  reason?: string;

  constructor(status: number, message: string, reason?: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.reason = reason;
  }
}
