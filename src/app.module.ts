// app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dns from 'dns';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';

dns.setDefaultResultOrder('ipv4first'); // Ensure IPv4 addresses are preferred

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-long-cloud-ae69x1nb-pooler.c-2.us-east-2.aws.neon.tech',
      port: 5432,
      username: 'neondb_owner',
      password: process.env.NEON_DB_PASSWORD,
      database: 'neondb',
      ssl: { rejectUnauthorized: false }, // Required for SSL
      synchronize: true, // Set to false in production
      autoLoadEntities: true,
      extra: {
        connectionTimeoutMillis: 5000,
        keepAlive: true,
      },
    }),
    // ORM Modules
    ProjectModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
