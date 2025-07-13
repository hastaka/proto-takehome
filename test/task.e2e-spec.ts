// task.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Task } from 'src/task/entities/task.entity';
import { CreateTaskDTO } from 'src/task/dto/create-task.dto';
import { UpdateTaskDTO } from 'src/task/dto/update-task.dto';

describe('TaskController (e2e)', () => {
  let app: INestApplication<App>;
  let server: any;
  let createdProjectId: string;
  let createdTaskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Load entire real AppModule (or partial if you want)
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();

    const projectPayload = { name: `E2E Project (Task)` };
    const res = await request(server).post('/projects').send(projectPayload);
    expect(res.status).toBe(201);
    createdProjectId = res.body.id;
    expect(createdProjectId).toBeDefined();
  }, 10000);

  afterAll(async () => {
    const res = await request(server).delete(`/projects/${createdProjectId}`);
    expect(res.status).toBe(200);
    await app.close();
  });

  it('/POST tasks — should create a task', async () => {
    const payload: CreateTaskDTO = {
      title: `E2E Task`,
      status: 'todo',
      project_id: createdProjectId,
    };

    const res = await request(server).post('/tasks').send(payload).expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(payload.title);
    expect(res.body.project_id).toBe(payload.project_id);

    createdTaskId = res.body.id;
  });

  it('/GET tasks — should get all tasks', async () => {
    const res = await request(server).get('/tasks').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find((t: Task) => t.id === createdTaskId)).toBeDefined();
  });

  it('/GET tasks/:id — should get task by id', async () => {
    const res = await request(server)
      .get(`/tasks/${createdTaskId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdTaskId);
    expect(res.body.project_id).toBe(createdProjectId);
  });

  it('/PATCH tasks/:id — should update task', async () => {
    const updatePayload: UpdateTaskDTO = { title: `Updated E2E Task` };

    const res = await request(server)
      .patch(`/tasks/${createdTaskId}`)
      .send(updatePayload)
      .expect(200);

    expect(res.body).toHaveProperty('message');
  });

  it('/DELETE tasks/:id — should delete task', async () => {
    const res = await request(server)
      .delete(`/tasks/${createdTaskId}`)
      .expect(200);

    expect(res.body).toHaveProperty('message');
  });

  it('/GET tasks/:id — should 404 after delete', async () => {
    await request(server).get(`/tasks/${createdTaskId}`).expect(404);
  });
});
