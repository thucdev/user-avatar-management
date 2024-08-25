import { Global, Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { ConfigService } from './services/config.service';
import { MailService } from './services/email.service';
import { MockDataService } from './services/mock-data.service';

const providers = [ConfigService, MailService, MockDataService];

@Global()
@Module({
  providers: [...providers],
  imports: [HttpModule],
  exports: [...providers],
})
export class SharedModule {}
