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
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }, // Required for SSL
      synchronize: false, // Set to false in production
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
