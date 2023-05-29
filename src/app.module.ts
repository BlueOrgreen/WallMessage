import { Module } from '@nestjs/common';
import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';

import { database } from './config/database.config';
import { ContentModule } from './modules/content/content.module';
import { DatabaseModule } from './modules/database/database.module';
import { AppPipe, AppIntercepter, AppFilter } from './modules/core/providers';


@Module({
  imports: [DatabaseModule.forRoot(database), ContentModule],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new AppPipe({
        transform: true,
        forbidUnknownValues: true,
        validationError: { target: false },
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AppIntercepter,
    },
    {
      provide: APP_FILTER,
      useClass: AppFilter,
  }
  ],
  exports: []
})
export class AppModule {}
