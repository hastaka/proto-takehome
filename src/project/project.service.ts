// project.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateProjectDTO } from './dto/create-project.dto';
import { UpdateProjectDTO } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDTO): Promise<Project> {
    try {
      const project = this.projectRepo.create(createProjectDto);
      const saved = await this.projectRepo.save(project);
      this.logger.log(`Created project <${saved.id}>`);
      return saved;
    } catch (error) {
      this.logger.error('Error creating project', error.stack);
      throw new BadRequestException('Failed to create project');
    }
  }

  async findAll(): Promise<Project[]> {
    try {
      const projects = await this.projectRepo.find();
      this.logger.log(`Fetched ${projects.length} projects`);
      return projects;
    } catch (error) {
      this.logger.error('Error fetching projects', error.stack);
      throw new InternalServerErrorException('Failed to fetch projects');
    }
  }

  async findOne(id: string): Promise<Project> {
    try {
      const project = await this.projectRepo.findOneBy({ id });
      if (!project) {
        this.logger.warn(`Project <${id}> not found`);
        throw new NotFoundException(`Project <${id}> not found`);
      }
      this.logger.log(`Found project <${id}>`);
      return project;
    } catch (error) {
      this.logger.error(`Error finding project <${id}>`, error.stack);
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
        this.logger.warn(`Project <${id}> not found when fetching tasks`);
        throw new NotFoundException(`Project <${id}> not found`);
      }

      this.logger.log(
        `Fetched ${project.tasks?.length ?? 0} tasks for project <${id}>`,
      );
      return project.tasks;
    } catch (error) {
      this.logger.error(
        `Error fetching tasks for project <${id}>`,
        error.stack,
      );
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to fetch tasks for project <${id}>`,
      );
    }
  }

  async update(id: string, updateProjectDto: UpdateProjectDTO) {
    try {
      const result = await this.projectRepo.update({ id }, updateProjectDto);

      if (result.affected === 0) {
        this.logger.warn(`Project <${id}> not found for update`);
        throw new NotFoundException(`Project <${id}> not found`);
      }

      this.logger.log(`Updated project <${id}>`);
      return { message: `Project <${id}> updated successfully` };
    } catch (error) {
      this.logger.error(`Error updating project <${id}>`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(`Failed to update project <${id}>`);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.projectRepo.delete({ id });

      if (result.affected === 0) {
        this.logger.warn(`Project <${id}> not found for deletion`);
        throw new NotFoundException(`Project <${id}> not found`);
      }

      this.logger.log(`Deleted project <${id}>`);
      return { message: `Project <${id}> deleted successfully` };
    } catch (error) {
      this.logger.error(`Error deleting project <${id}>`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to delete project <${id}>`,
      );
    }
  }
}
