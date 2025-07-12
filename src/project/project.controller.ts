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
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { Task } from 'src/task/entities/task.entity';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  private readonly logger = new Logger(ProjectController.name);

  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The project has been successfully created.',
    type: Project,
  })
  @ApiBadRequestResponse({
    description: 'Failed to create project due to invalid input.',
  })
  create(@Body() createProjectDto: CreateProjectDto) {
    this.logger.log(`POST /projects ${JSON.stringify(createProjectDto)}`);
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'The projects have been successfully fetched.',
    type: [Project],
  })
  @ApiInternalServerErrorResponse({ description: 'Failed to fetch projects.' })
  findAll() {
    this.logger.log('GET /projects');
    return this.projectService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The project has been successfully fetched.',
    type: Project,
  })
  @ApiInternalServerErrorResponse({ description: 'Failed to fetch project.' })
  @ApiNotFoundResponse({ description: 'Project ID not found.' })
  findOne(@Param('id') id: string) {
    this.logger.log(`GET /projects/${id}`);
    return this.projectService.findOne(id);
  }

  @Get(':id/tasks')
  @ApiOkResponse({
    description: 'The tasks have been successfully fetched.',
    type: [Task],
  })
  @ApiInternalServerErrorResponse({ description: 'Failed to fetch tasks.' })
  @ApiNotFoundResponse({ description: 'Project ID not found.' })
  findOneTasks(@Param('id') id: string) {
    this.logger.log(`GET /projects/${id}/tasks`);
    return this.projectService.findOneTasks(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'The project has been successfully updated.',
    type: Project,
  })
  @ApiBadRequestResponse({
    description: 'Failed to update project due to invalid input.',
  })
  @ApiNotFoundResponse({ description: 'Project ID not found.' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    this.logger.log(
      `PATCH /projects/${id} ${JSON.stringify(updateProjectDto)}`,
    );
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'The project has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Project ID not found.' })
  @ApiInternalServerErrorResponse({ description: 'Failed to delete project.' })
  remove(@Param('id') id: string) {
    this.logger.log(`DELETE /projects/${id}`);
    return this.projectService.remove(id);
  }
}
