import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DivisionsController } from './divisions.controller';
import { DivisionsService } from './divisions.service';
import { Division } from './entities/division.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Division])],
  controllers: [DivisionsController],
  providers: [DivisionsService],
  exports: [DivisionsService],
})
export class DivisionsModule {}
