// task.service.ts

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/project/entities/project.entity';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async create(createTaskDto: CreateTaskDTO) {
    try {
      const project = await this.projectRepo.findOneBy({
        id: createTaskDto.projectId,
      });

      if (!project) {
        this.logger.warn(`Project <${createTaskDto.projectId}> not found`);
        throw new NotFoundException(
          `Project <${createTaskDto.projectId}> not found`,
        );
      }

      const task = this.taskRepo.create(createTaskDto);
      const saved = await this.taskRepo.save(task);
      this.logger.log(`Created task <${saved.id}> in project <${project.id}>`);
      return saved;
    } catch (error) {
      this.logger.error('Error creating task', error.stack);
      throw new BadRequestException('Failed to create task');
    }
  }

  async findAll(): Promise<Task[]> {
    try {
      const tasks = await this.taskRepo.find();
      this.logger.log(`Fetched ${tasks.length} tasks`);
      return tasks;
    } catch (error) {
      this.logger.error('Error fetching tasks', error.stack);
      throw new InternalServerErrorException('Failed to fetch tasks');
    }
  }

  async findOne(id: string) {
    try {
      const task = await this.taskRepo.findOneBy({ id });
      if (!task) {
        this.logger.warn(`Task <${id}> not found`);
        throw new NotFoundException(`Task <${id}> not found`);
      }
      this.logger.log(`Found task <${id}>`);
      return task;
    } catch (error) {
      this.logger.error(`Error finding task <${id}>`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Failed to find task <${id}>`);
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDTO) {
    try {
      const result = await this.taskRepo.update({ id }, updateTaskDto);
      if (result.affected === 0) {
        this.logger.warn(`Task <${id}> not found for update`);
        throw new NotFoundException(`Task <${id}> not found`);
      }

      this.logger.log(`Updated task <${id}>`);
      return { message: `Task <${id}> updated successfully` };
    } catch (error) {
      this.logger.error(`Error updating task <${id}>`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(`Failed to update task <${id}>`);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.taskRepo.delete({ id });
      if (result.affected === 0) {
        this.logger.warn(`Task <${id}> not found for deletion`);
        throw new NotFoundException(`Task <${id}> not found`);
      }

      this.logger.log(`Deleted task <${id}>`);
      return { message: `Task <${id}> deleted successfully` };
    } catch (error) {
      this.logger.error(`Error deleting task <${id}>`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Failed to delete task <${id}>`);
    }
  }
}
