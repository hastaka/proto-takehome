import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    try {
      const project = this.projectRepo.create(createProjectDto);
      return await this.projectRepo.save(project);
    } catch (error) {
      console.error('Error creating project:', error);
      throw new BadRequestException('Failed to create project');
    }
  }

  async findAll(): Promise<Project[]> {
    try {
      return await this.projectRepo.find();
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new InternalServerErrorException('Failed to fetch projects');
    }
  }

  async findOne(id: string): Promise<Project> {
    try {
      const project = await this.projectRepo.findOneBy({ id });
      if (!project) {
        throw new NotFoundException(`Project <${id}> not found`);
      }
      return project;
    } catch (error) {
      console.error(`Error finding project <${id}>:`, error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Failed to find project <${id}>`);
    }
  }

  async findOneTasks(id: string) {
    try {
      const project = await this.projectRepo.findOne({
        where: { id },
        relations: ['tasks'],
      });

      if (!project) {
        throw new NotFoundException(`Project <${id}> not found`);
      }

      return project.tasks;
    } catch (error) {
      console.error(`Error finding tasks for project <${id}>:`, error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to fetch tasks for project <${id}>`,
      );
    }
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    try {
      const result = await this.projectRepo.update({ id }, updateProjectDto);

      if (result.affected === 0) {
        throw new NotFoundException(`Project <${id}> not found`);
      }

      return { message: `Project <${id}> updated successfully` };
    } catch (error) {
      console.error(`Error updating project <${id}>:`, error);
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(`Failed to update project <${id}>`);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.projectRepo.delete({ id: id });
      if (result.affected === 0) {
        throw new NotFoundException(`Project <${id}> not found`);
      }
      return { message: `Project <${id}> deleted successfully` };
    } catch (error) {
      console.error(`Error deleting project <${id}>:`, error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to delete project <${id}>`,
      );
    }
  }
}
