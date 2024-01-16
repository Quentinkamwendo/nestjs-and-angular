import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { CommentModule } from './comment/comment.module';
import { MulterModule } from '@nestjs/platform-express';
// import { ProjectsModule } from './projects/projects.module';
import { VideoChatModule } from './video-chat/video-chat.module';

@Module({
  imports: [
    // ProjectsModule,

    // CommentModule,
    // ProjectModule,

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1999NO1q',
      database: 'antoine',
      autoLoadEntities: true,
      synchronize: false,
    }),
    MulterModule.register({ dest: './uploads' }),
    AuthModule,
    UsersModule,
    ProjectModule,
    CommentModule,
    VideoChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
