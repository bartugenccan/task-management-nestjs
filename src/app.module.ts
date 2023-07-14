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

@Module({
  imports: [TasksModule, AuthModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 49491,
    username: 'postgres',
    password: 'postgres',
    database: 'task-management',
    autoLoadEntities: true,
    synchronize: true,
    entities: [Task, User],
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
