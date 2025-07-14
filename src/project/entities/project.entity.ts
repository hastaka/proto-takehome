// project.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Task } from 'src/task/entities/task.entity';

@Entity()
export class Project {
  @ApiProperty({
    description: 'Project ID',
    example: '2f9a8a3c-4d5b-4bfa-8e52-cc81d2b6a9a3',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the project',
    example: 'Proto Takehome',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Optional description of the project',
    required: false,
    example: 'This project is for testing the Proto takehome API.',
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'Date and time the project was created',
    example: '2025-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'Date and time the project was last updated',
    example: '2025-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
