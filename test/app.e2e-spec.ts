// app.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 10000);

  afterAll(async () => {
    await app.close();
  });

  it('GET / should return HTML with welcome text and link to /docs', async () => {
    const res = await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/);

    expect(res.text).toContain('<h1>Welcome to the Proto Takehome API</h1>');
    expect(res.text).toContain('<a href="/docs">View API Documentation</a>');
  });
});
