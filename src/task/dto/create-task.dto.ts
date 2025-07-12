import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';

export class CreateTaskDTO {
  @ApiProperty({
    description: 'Project ID to which this task belongs',
    example: '2f9a8a3c-4d5b-4bfa-8e52-cc81d2b6a9a3',
  })
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    description: 'Title of the task',
    example: 'Write documentation',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Optional detailed description',
    example: 'Complete the API docs for the new module',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Status of the task',
    enum: ['todo', 'in_progress', 'done'],
    example: 'todo',
  })
  @IsEnum(['todo', 'in_progress', 'done'])
  status: string;

  @ApiProperty({
    description: 'Due date for the task (ISO 8601)',
    required: false,
    example: '2025-08-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  due_date?: Date;
}
