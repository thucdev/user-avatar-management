import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { ConfigService } from './config.service';
type Method = 'get' | 'delete' | 'post' | 'put' | 'patch';

@Injectable()
export class MockDataService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async request(method: Method, path: string, payload?: any): Promise<any> {
    return await firstValueFrom(
      this.httpService[method](
        `${this.configService.get('MOCK_DATA_API')}${path}`,
        payload,
      ).pipe(map((res: AxiosResponse<any>) => res?.data)),
    );
  }

  async streamImg(path: string): Promise<any> {
    return await firstValueFrom(
      this.httpService
        .get(path, {
          responseType: 'stream',
        })
        .pipe(map((res: AxiosResponse<any>) => res)),
    );
  }
}
