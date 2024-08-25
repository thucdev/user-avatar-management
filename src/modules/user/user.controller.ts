import { GlobalInterceptor } from '@core/interceptors/global.interceptor';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IUserDetailResponse } from './interface/IUserDetailResponse';
import { UsersService } from './user.service';

@UseInterceptors(GlobalInterceptor)
@Controller()
@ApiTags('Users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/api/users')
  create(): Promise<string[]> {
    return this.userService.create();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/api/user/:userId')
  detail(@Param('userId') userId: string): Promise<IUserDetailResponse> {
    return this.userService.detail(userId);
  }
}
