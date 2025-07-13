// project.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Project } from 'src/project/entities/project.entity';
import { CreateProjectDTO } from 'src/project/dto/create-project.dto';

describe('ProjectController (e2e)', () => {
  let app: INestApplication<App>;
  let server: any;
  let createdProjectId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Load entire real AppModule (or partial if you want)
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  }, 10000);

  afterAll(async () => {
    await app.close();
  });

  it('/POST projects — should create a project', async () => {
    const payload: CreateProjectDTO = { name: 'E2E Project' };

    const res = await request(server)
      .post('/projects')
      .send(payload)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toEqual(payload.name);

    createdProjectId = res.body.id;
  });

  it('/GET projects — should get all projects', async () => {
    const res = await request(server).get('/projects').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(
      res.body.find((p: Project) => p.id === createdProjectId),
    ).toBeDefined();
  });

  it('/GET projects/:id — should get one project', async () => {
    const res = await request(server)
      .get(`/projects/${createdProjectId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdProjectId);
  });

  it('/PATCH projects/:id — should update project', async () => {
    const res = await request(server)
      .patch(`/projects/${createdProjectId}`)
      .send({ name: 'Updated by E2E' })
      .expect(200);

    expect(res.body).toHaveProperty('message');
  });

  it('/GET projects/:id/tasks — should get tasks for project', async () => {
    const res = await request(server)
      .get(`/projects/${createdProjectId}/tasks`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/DELETE projects/:id — should delete project', async () => {
    const res = await request(server)
      .delete(`/projects/${createdProjectId}`)
      .expect(200);

    expect(res.body).toHaveProperty('message');
  });

  it('/GET projects/:id — should 404 after deletion', async () => {
    await request(server).get(`/projects/${createdProjectId}`).expect(404);
  });
});
