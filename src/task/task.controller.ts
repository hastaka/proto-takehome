import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  private readonly logger = new Logger(TaskController.name);

  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The task has been successfully created.',
    type: Task,
  })
  @ApiNotFoundResponse({
    description:
      'Project not found — cannot create task without a valid project.',
  })
  @ApiBadRequestResponse({
    description: 'Failed to create task due to invalid input.',
  })
  create(@Body() createTaskDto: CreateTaskDto) {
    this.logger.log(`POST /tasks ${JSON.stringify(createTaskDto)}`);
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'The tasks have been successfully fetched.',
    type: [Task],
  })
  @ApiInternalServerErrorResponse({ description: 'Failed to fetch tasks.' })
  findAll() {
    this.logger.log(`GET /tasks`);
    return this.taskService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The task has been successfully fetched.',
    type: Task,
  })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiInternalServerErrorResponse({ description: 'Failed to fetch task.' })
  findOne(@Param('id') id: string) {
    this.logger.log(`GET /tasks/${id}`);
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'The task has been successfully updated.',
    type: Task,
  })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiBadRequestResponse({
    description: 'Failed to update task due to invalid input.',
  })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    this.logger.log(`PATCH /tasks/${id} ${JSON.stringify(updateTaskDto)}`);
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'The task has been successfully deleted.',
  })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiInternalServerErrorResponse({ description: 'Failed to delete task.' })
  remove(@Param('id') id: string) {
    this.logger.log(`DELETE /tasks/${id}`);
    return this.taskService.remove(id);
  }
}
