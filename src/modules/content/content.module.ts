import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from './entities';
import * as repositories from './respositories';
import * as services from './services';
import * as controllers from './controllers';
import { DatabaseModule } from '../database/database.module';

console.log("entity all", entities);

@Module({
  imports: [
    TypeOrmModule.forFeature(Object.values(entities)),
    DatabaseModule.forRepository(Object.values(repositories)),
  ],
  controllers: Object.values(controllers),
  providers: [...Object.values(services)],
  exports: [
    ...Object.values(services),
    DatabaseModule.forRepository(Object.values(repositories)),
  ],
})
export class ContentModule {}