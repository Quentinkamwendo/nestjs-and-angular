import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { Repository } from 'typeorm';
import { ProjectDto } from './dto/project.dto';
import { differenceInDays, format, parse } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';
// import { User } from 'src/users/users.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async getProjects(): Promise<Project[]> {
    return await this.projectRepository.find();
  }

  async getProjectById(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async createProject(
    projectDto: ProjectDto,
    owner,
    files: {
      documentation?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
  ) {
    const parsedStartDate = parse(
      projectDto.start_date,
      'EEE MMM dd yyyy',
      new Date(),
    );
    const parsedEndDate = parse(
      projectDto.end_date,
      'EEE MMM dd yyyy',
      new Date(),
    );
    const startDate = format(parsedStartDate, 'yyyy-MM-dd');
    const endDate = format(parsedEndDate, 'yyyy-MM-dd');
    const duration = differenceInDays(
      projectDto.end_date,
      projectDto.start_date,
    );
    return this.projectRepository.save({
      project_name: projectDto.project_name,
      description: projectDto.description,
      start_date: startDate,
      end_date: endDate,
      duration: duration,
      documentation: files.documentation[0].path,
      image: files.image[0].path,
      user: owner,
    });
  }

  async updateProject(
    id: string,
    projectDto: ProjectDto,
    files: {
      documentation?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
  ) {
    const project = await this.projectRepository.findOne({ where: { id: id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const duration = differenceInDays(
      projectDto.end_date,
      projectDto.start_date,
    );

    this.deleteFile(project.documentation);
    this.deleteFile(project.image);

    return await this.projectRepository.update(id, {
      project_name: projectDto.project_name,
      description: projectDto.description,
      start_date: projectDto.start_date,
      end_date: projectDto.end_date,
      duration: duration,
      documentation: files.documentation[0].path,
      image: files.image[0].path,
    });
    // Retrieve and return the updated project
  }

  async deleteProject(id: string) {
    const project = await this.projectRepository.findOne({ where: { id: id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    this.deleteFile(project.documentation);
    this.deleteFile(project.image);

    await this.projectRepository.remove(project);
  }

  private deleteFile(filename: string) {
    if (filename) {
      const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
      fs.promises.unlink(filePath);
    }
  }

  private async deleteProjectFiles(id: string): Promise<void> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (project) {
      const imagePath = path.join(__dirname, '..', 'uploads', project.image);
      const docPath = path.join(
        __dirname,
        '..',
        'uploads',
        project.documentation,
      );
      this.deleteFileIfExists(imagePath);
      this.deleteFileIfExists(docPath);
    }
  }

  private deleteFileIfExists(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
