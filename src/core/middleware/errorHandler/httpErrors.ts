export default class HttpErrors extends Error {
  status?: number;
  message: string;
  reason?: string;
  error?: string | null;

  constructor(status: number, message: string, reason?: string, error?: string | null) {
    super(message);
    this.status = status;
    this.message = message;
    this.reason = reason;
    this.error = error || null;
  }
}
