import { GlobalInterceptor } from '@core/interceptors/global.interceptor';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AvatarsService } from './avatar.service';

@UseInterceptors(GlobalInterceptor)
@Controller()
@ApiTags('Avatar')
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/api/user/:userId/avatar')
  getAvatar(@Param('userId') userId: string): Promise<string> {
    return this.avatarsService.getUserAvatar(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/api/user/:userId/avatar')
  deleteAvatar(@Param('userId') userId: string): Promise<boolean> {
    return this.avatarsService.deleteAvatar(userId);
  }
}
