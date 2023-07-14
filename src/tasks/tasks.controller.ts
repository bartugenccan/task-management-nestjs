import { Controller, Post, Body, Get, Param, Patch, Delete, Query, UseGuards } from '@nestjs/common';

// Task
import { TaskStatus } from './task-status.enum';

// Task Entity
import { Task } from './task.entity';

// Tasks Service
import { TasksService } from './tasks.service';

// DTOS
import { CreateTaskDto, GetTasksFilterDto } from './dtos';
import { User } from 'src/auth/user.entity';

// Guards
import { AuthGuard } from '@nestjs/passport';

// Decorators
import { GetUser } from 'src/auth/decorators/get-user.decorator';



@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User) {
        return this.tasksService.getTasksWithFilters(filterDto, user);
    }

    @Post()
    async createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
        return await this.tasksService.createTask(createTaskDto, user);
    }

    @Get('/:id')
    async getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
        return await this.tasksService.getTaskById(id, user);
    }

    @Delete('/:id')
    async deleteTask(@Param('id') id: string, @GetUser() user: User) {
        return await this.tasksService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    async updateTaskStatus(@Param('id') id: string, @Body('status') status: TaskStatus, @GetUser() user: User) {
        return await this.tasksService.updateTaskStatus(id, status, user);
    }
}

