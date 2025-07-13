// create-project.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDTO {
  @ApiProperty({
    description: 'Name of the project',
    example: 'Proto Takehome',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Optional description of the project',
    required: false,
    example: 'This project is for testing the Proto takehome API.',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
