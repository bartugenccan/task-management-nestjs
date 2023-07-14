import { Injectable, NotFoundException } from '@nestjs/common';

// Task
import { TaskStatus } from './task-status.enum';

// Task Entity
import { Task } from './task.entity';


// DTOS
import { CreateTaskDto, GetTasksFilterDto } from './dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {

    constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) { }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = this.taskRepo.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        });

        await this.taskRepo.save(task);

        return task;
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const foundTask = await this.taskRepo.findOne({ where: { id, user } });

        if (!foundTask) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return foundTask;
    }

    async deleteTask(id: string, user: User) {
        const result = await this.taskRepo.delete({ id, user });

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return result;
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);

        task.status = status;

        await this.taskRepo.save(task);

        return task;
    }

    async getTasksWithFilters(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;

        const query = this.taskRepo.createQueryBuilder('task');
        query.where({ user })

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }

        const tasks = await query.getMany();

        return tasks;
    }

}
