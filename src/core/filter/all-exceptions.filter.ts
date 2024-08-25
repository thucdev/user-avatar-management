import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { STATUS_CODES } from 'http';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.UNPROCESSABLE_ENTITY;

    let exceptionMessage = '';

    if (exception?.error?.name === QueryFailedError.name) {
      exceptionMessage = exception.error.message;
    } else if ('getResponse' in exception) {
      exceptionMessage = exception.getResponse().message;
    } else {
      exceptionMessage = exception.message;
    }
    const messageCode = (
      exception.message
        ? typeof exceptionMessage === 'string'
          ? exceptionMessage
          : [exceptionMessage]
        : STATUS_CODES[status]
    )
      ?.toString()
      ?.toUpperCase()
      .replace(/ /g, '_');

    response.status(status).json({
      messageCode,
      statusCode: status,
      currentTime: new Date().getTime(),
    });
  }
}
