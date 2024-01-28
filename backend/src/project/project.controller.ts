import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from './project.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProjectDto } from './dto/project.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import * as fs from 'fs';
// import { Request } from 'express';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('api')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('project')
  getProjects(
    @Query('page') page = 1,
    @Query('limit') limit = 3,
  ): Promise<Pagination<Project>> {
    return this.projectService.getProjects({
      page,
      limit,
      route: 'http://projectView',
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('project/:id')
  async getProjectById(@Param('id') id: string) {
    return this.projectService.getProjectById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('project')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'documentation', maxCount: 1 },
        { name: 'image', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, callback) => {
            // const folder = 'project';
            const destFolder = `uploads`;
            if (!fs.existsSync(destFolder)) {
              fs.mkdirSync(destFolder, { recursive: true });
            }
            callback(null, destFolder);
          },
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${uniqueSuffix}${ext}`;
            callback(null, filename);
          },
        }),
        limits: {
          fieldNameSize: 300,
          fieldSize: 1073741824,
        },
        fileFilter: (req, file, cb) => {
          if (
            !file.originalname.match(
              /\.(jpg|jpeg|png|gif|pdf|doc|docx|mp4|mkv)$/,
            )
          ) {
            return cb(null, false);
          }
          cb(null, true);
        },
      },
    ),
  )
  async createProject(
    @Body() projectDto: ProjectDto,
    @Request() req,
    @UploadedFiles()
    files: {
      documentation?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
  ) {
    // if (!req.user || !req.user.id) {
    //   // Handle the case when req.user is undefined or does not have an id property
    //   // For example, you can return an error response.
    //   return { error: 'User not authenticated' };
    // }
    console.log('Received request with data:', projectDto);
    console.log(files);
    const owner = req.user.userId;
    console.log(owner);
    const createdProject = await this.projectService.createProject(
      projectDto,
      owner,
      files,
    );
    return createdProject;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('project/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'documentation', maxCount: 1 },
        { name: 'image', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, callback) => {
            // const folder = 'project';
            const destFolder = `uploads`;
            if (!fs.existsSync(destFolder)) {
              fs.mkdirSync(destFolder, { recursive: true });
            }
            callback(null, destFolder);
          },
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${uniqueSuffix}${ext}`;
            callback(null, filename);
          },
        }),
        limits: {
          fieldNameSize: 300,
          fieldSize: 1073741824,
        },
        fileFilter: (req, file, cb) => {
          if (
            !file.originalname.match(
              /\.(jpg|jpeg|png|gif|pdf|doc|docx|mp4|mkv)$/,
            )
          ) {
            return cb(null, false);
          }
          cb(null, true);
        },
      },
    ),
  )
  async updateProject(
    @Param('id') id: string,
    @Body() projectDto: ProjectDto,
    @UploadedFiles()
    files: {
      documentation?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
  ) {
    console.log(files);
    const updatedProject = await this.projectService.updateProject(
      id,
      projectDto,
      files,
    );
    return updatedProject;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('project/:id')
  async deleteProject(@Param('id') id: string) {
    await this.projectService.deleteProject(id);
    return { message: 'Project deleted Successfully' };
  }
}
