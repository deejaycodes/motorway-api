class HttpException extends Error {
  public code: string;
  public status: number;
  public message: string;

  constructor (status: number, code: string, message: string) {
    super(message);
    this.code = code;
    this.status = status;
    this.message = message;
  }
}

export default HttpException;
