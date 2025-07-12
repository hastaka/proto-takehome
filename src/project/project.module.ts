import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectController } from './project.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [ProjectController],
})
export class ProjectModule {}
