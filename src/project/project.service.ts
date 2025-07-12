import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    return this.projectRepo.save(createProjectDto);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepo.find();
  }

  async findOne(id: number) {
    return this.projectRepo.findOneBy({ id: id.toString() });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.projectRepo.update({ id: id.toString() }, updateProjectDto);
  }

  async remove(id: number) {
    return this.projectRepo.delete({ id: id.toString() });
  }
}
