import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/project/entities/project.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const project = await this.projectRepo.findOneBy({
        id: createTaskDto.projectId,
      });

      if (!project) {
        console.error(`Project <${createTaskDto.projectId}> not found`);
        throw new NotFoundException(
          `Project <${createTaskDto.projectId}> not found`,
        );
      }
      const task = this.taskRepo.create(createTaskDto);
      return this.taskRepo.save(task);
    } catch (error) {
      console.error('Error creating task:', error);
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<Task[]> {
    try {
      return this.taskRepo.find();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new InternalServerErrorException('Failed to fetch tasks');
    }
  }

  async findOne(id: string) {
    try {
      const task = await this.taskRepo.findOneBy({ id });
      if (!task) {
        throw new NotFoundException(`Task <${id}> not found`);
      }
      return task;
    } catch (error) {
      console.error(`Error finding task <${id}>:`, error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Failed to find task ${id}`);
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      const result = await this.taskRepo.update({ id }, updateTaskDto);
      if (result.affected === 0) {
        throw new NotFoundException(`Task <${id}> not found`);
      }
      return { message: `Task <${id}> updated successfully` };
    } catch (error) {
      console.error(`Error updating task <${id}>:`, error);
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(`Failed to update task <${id}>`);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.taskRepo.delete({ id });
      if (result.affected === 0) {
        throw new NotFoundException(`Task <${id}> not found`);
      }
      return { message: `Task <${id}> deleted successfully` };
    } catch (error) {
      console.error(`Error deleting task <${id}>:`, error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Failed to delete task <${id}>`);
    }
  }
}
