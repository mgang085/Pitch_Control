import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { Match } from './entities/match.entity';
import { MatchEvent } from './entities/match-event.entity';
import { PenaltyCard } from './entities/penalty-card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, MatchEvent, PenaltyCard])],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
