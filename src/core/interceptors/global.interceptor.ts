import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

@Injectable({ scope: Scope.REQUEST })
export class GlobalInterceptor implements NestInterceptor {
  constructor() {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();

    const res = ctx.getResponse<Response>();
    const { statusCode } = res;

    return next.handle().pipe(
      map((data: any) => {
        if (isNil(data)) {
          return {
            statusCode,
            data: null,
            currentTime: new Date().getTime(),
          };
        }
        return {
          statusCode,
          data,
          currentTime: new Date().getTime(),
        };
      }),
    );
  }
}
