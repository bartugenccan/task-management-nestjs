import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modulese
import { TasksModule } from './tasks/tasks.module';

// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

// Entities
import { Task } from './tasks/task.entity';
import { User } from './auth/user.entity';

// Config
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TasksModule, AuthModule, ConfigModule.forRoot({
    envFilePath: '.env',
  }), TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      type: 'postgres',
      host: config.get('DB_HOST'),
      port: config.get('DB_PORT'),
      username: config.get('DB_USERNAME'),
      password: config.get('DB_PASSWORD'),
      database: config.get('DB_DATABASE'),
      entities: [Task, User],
      synchronize: true,
    }),
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
