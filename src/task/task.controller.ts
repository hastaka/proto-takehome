import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  @Get()
  async findAll(): Promise<Task[]> {
    return this.taskRepo.find();
  }
}
