// task.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { ObjectLiteral, Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Project } from 'src/project/entities/project.entity';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('TaskService', () => {
  let service: TaskService;
  let taskRepo: MockRepository<Task>;
  let projectRepo: MockRepository<Project>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Project),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepo = module.get<MockRepository<Task>>(getRepositoryToken(Task));
    projectRepo = module.get<MockRepository<Project>>(
      getRepositoryToken(Project),
    );
  });

  describe('create', () => {
    it('should create and save a task successfully', async () => {
      const dto = { project_id: 'proj1', title: 'Test Task', status: 'todo' };
      const project = { id: 'proj1' } as Project;
      const task = { id: 'task1', project, ...dto } as Task;

      projectRepo.findOneBy?.mockResolvedValue(project);
      taskRepo.create?.mockReturnValue(task);
      taskRepo.save?.mockResolvedValue(task);

      const result = await service.create(dto);

      expect(projectRepo.findOneBy).toHaveBeenCalledWith({
        id: dto.project_id,
      });
      expect(taskRepo.create).toHaveBeenCalledWith(dto);
      expect(taskRepo.save).toHaveBeenCalledWith(task);
      expect(result).toEqual(task);
    });

    it('should throw NotFoundException if project does not exist', async () => {
      const dto = { project_id: 'proj1', title: 'Test Task', status: 'todo' };
      projectRepo.findOneBy?.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      expect(projectRepo.findOneBy).toHaveBeenCalledWith({
        id: dto.project_id,
      });
    });

    it('should throw BadRequestException on other errors', async () => {
      const dto = { project_id: 'proj1', title: 'Test Task', status: 'todo' };
      projectRepo.findOneBy?.mockRejectedValue(new Error('DB failure'));

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const tasks = [{ id: '1' }, { id: '2' }] as Task[];
      taskRepo.find?.mockResolvedValue(tasks);

      const result = await service.findAll();

      expect(taskRepo.find).toHaveBeenCalled();
      expect(result).toEqual(tasks);
    });

    it('should throw InternalServerErrorException on failure', async () => {
      taskRepo.find?.mockRejectedValue(new Error('DB error'));

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return task when found', async () => {
      const task = { id: 'task1' } as Task;
      taskRepo.findOneBy?.mockResolvedValue(task);

      const result = await service.findOne('task1');

      expect(taskRepo.findOneBy).toHaveBeenCalledWith({ id: 'task1' });
      expect(result).toEqual(task);
    });

    it('should throw NotFoundException if task not found', async () => {
      taskRepo.findOneBy?.mockResolvedValue(null);

      await expect(service.findOne('task1')).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      taskRepo.findOneBy?.mockRejectedValue(new Error('DB failure'));

      await expect(service.findOne('task1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update task successfully', async () => {
      const updateDto = { title: 'Updated Task' };
      taskRepo.update?.mockResolvedValue({ affected: 1 });

      const result = await service.update('task1', updateDto);

      expect(taskRepo.update).toHaveBeenCalledWith({ id: 'task1' }, updateDto);
      expect(result).toEqual({ message: 'Task <task1> updated successfully' });
    });

    it('should throw NotFoundException if no task updated', async () => {
      taskRepo.update?.mockResolvedValue({ affected: 0 });

      await expect(service.update('task1', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException on other errors', async () => {
      taskRepo.update?.mockRejectedValue(new Error('DB error'));

      await expect(service.update('task1', {})).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should delete task successfully', async () => {
      taskRepo.delete?.mockResolvedValue({ affected: 1 });

      const result = await service.remove('task1');

      expect(taskRepo.delete).toHaveBeenCalledWith({ id: 'task1' });
      expect(result).toEqual({ message: 'Task <task1> deleted successfully' });
    });

    it('should throw NotFoundException if no task deleted', async () => {
      taskRepo.delete?.mockResolvedValue({ affected: 0 });

      await expect(service.remove('task1')).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      taskRepo.delete?.mockRejectedValue(new Error('DB error'));

      await expect(service.remove('task1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
