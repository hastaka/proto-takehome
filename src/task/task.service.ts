import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    return this.taskRepo.save(createTaskDto);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepo.find();
  }

  async findOne(id: number) {
    return this.taskRepo.findOneBy({ id: id.toString() });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.taskRepo.update({ id: id.toString() }, updateTaskDto);
  }

  async remove(id: number) {
    return this.taskRepo.delete({ id: id.toString() });
  }
}
