import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/modules/user/user.module';
import { ProjectModule } from 'src/modules/project/project.module';
import { TaskModule } from 'src/modules/task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from 'src/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...databaseOptions as any,
      autoLoadEntities: true,
    }),
    ProjectModule,
    TaskModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
