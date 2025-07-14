// project.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ProjectService', () => {
  let service: ProjectService;
  let projectRepo: MockRepository<Project>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: getRepositoryToken(Project),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    projectRepo = module.get<MockRepository<Project>>(
      getRepositoryToken(Project),
    );
  });

  describe('create', () => {
    it('should create and save a project successfully', async () => {
      const dto = { name: 'New Project' };
      const project = { id: 'proj1', ...dto } as Project;

      projectRepo.create?.mockReturnValue(project);
      projectRepo.save?.mockResolvedValue(project);

      const result = await service.create(dto);

      expect(projectRepo.create).toHaveBeenCalledWith(dto);
      expect(projectRepo.save).toHaveBeenCalledWith(project);
      expect(result).toEqual(project);
    });

    it('should throw BadRequestException if save fails', async () => {
      projectRepo.create?.mockReturnValue({});
      projectRepo.save?.mockRejectedValue(new Error('DB error'));

      await expect(service.create({ name: 'Fail Project' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all projects', async () => {
      const projects = [{ id: '1' }, { id: '2' }] as Project[];
      projectRepo.find?.mockResolvedValue(projects);

      const result = await service.findAll();

      expect(projectRepo.find).toHaveBeenCalled();
      expect(result).toEqual(projects);
    });

    it('should throw InternalServerErrorException if find fails', async () => {
      projectRepo.find?.mockRejectedValue(new Error('DB error'));

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return project when found', async () => {
      const project = { id: 'proj1' } as Project;
      projectRepo.findOneBy?.mockResolvedValue(project);

      const result = await service.findOne('proj1');

      expect(projectRepo.findOneBy).toHaveBeenCalledWith({ id: 'proj1' });
      expect(result).toEqual(project);
    });

    it('should throw NotFoundException if project not found', async () => {
      projectRepo.findOneBy?.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      projectRepo.findOneBy?.mockRejectedValue(new Error('DB failure'));

      await expect(service.findOne('proj1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOneTasks', () => {
    it('should return tasks of a project', async () => {
      const tasks = [{ id: 'task1' }, { id: 'task2' }];
      const project = { id: 'proj1', tasks } as Project;

      projectRepo.findOne?.mockResolvedValue(project);

      const result = await service.findOneTasks('proj1');

      expect(projectRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'proj1' },
        relations: ['tasks'],
      });
      expect(result).toEqual(tasks);
    });

    it('should throw NotFoundException if project not found', async () => {
      projectRepo.findOne?.mockResolvedValue(null);

      await expect(service.findOneTasks('missing')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      projectRepo.findOne?.mockRejectedValue(new Error('DB failure'));

      await expect(service.findOneTasks('proj1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update project successfully', async () => {
      projectRepo.update?.mockResolvedValue({ affected: 1 });

      const result = await service.update('proj1', { name: 'Updated' });

      expect(projectRepo.update).toHaveBeenCalledWith(
        { id: 'proj1' },
        { name: 'Updated' },
      );
      expect(result).toEqual({
        message: 'Project <proj1> updated successfully',
      });
    });

    it('should throw NotFoundException if project to update not found', async () => {
      projectRepo.update?.mockResolvedValue({ affected: 0 });

      await expect(service.update('missing', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException on other errors', async () => {
      projectRepo.update?.mockRejectedValue(new Error('DB failure'));

      await expect(service.update('proj1', {})).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should delete project successfully', async () => {
      projectRepo.delete?.mockResolvedValue({ affected: 1 });

      const result = await service.remove('proj1');

      expect(projectRepo.delete).toHaveBeenCalledWith({ id: 'proj1' });
      expect(result).toEqual({
        message: 'Project <proj1> deleted successfully',
      });
    });

    it('should throw NotFoundException if project to delete not found', async () => {
      projectRepo.delete?.mockResolvedValue({ affected: 0 });

      await expect(service.remove('missing')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      projectRepo.delete?.mockRejectedValue(new Error('DB failure'));

      await expect(service.remove('proj1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
