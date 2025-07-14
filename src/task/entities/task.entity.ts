// task.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from 'src/project/entities/project.entity';

@Entity()
export class Task {
  @ApiProperty({
    description: 'ID of the task',
    example: '2f9a8a3c-4d5b-4bfa-8e52-cc81d2b6a9a3',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Reference to the parent project (based on `project_id`)',
    example: '2f9a8a3c-4d5b-4bfa-8e52-cc81d2b6a9a3',
  })
  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ApiProperty({
    description: 'ID of the parent project',
    example: '2f9a8a3c-4d5b-4bfa-8e52-cc81d2b6a9a3',
  })
  @Column()
  project_id: string;


  @ApiProperty({
    description: 'Title of the task',
    example: 'Write documentation',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Optional detailed description',
    example: 'Complete the API docs for the new module',
    required: false,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'Status of the task',
    enum: ['todo', 'in_progress', 'done'],
    example: 'todo',
  })
  @Column({
    type: 'enum',
    enum: ['todo', 'in_progress', 'done'],
  })
  status: string;

  @ApiProperty({
    description: 'Optional due date for the task',
    example: '2025-01-01',
    required: false,
  })
  @Column({ nullable: true })
  due_date: Date;

  @ApiProperty({
    description: 'Date the task was created',
    example: '2025-01-01',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'Date the task was last updated',
    example: '2025-01-01',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
