export default class HttpErrors extends Error {
  status?: number;
  message: string;
  reason?: string;
  stack?: string | undefined;

  constructor(status: number, message: string, reason?: string, stack?: string | undefined) {
    super(message);
    this.status = status;
    this.message = message;
    this.reason = reason;
    this.stack = stack || undefined;
  }
}
