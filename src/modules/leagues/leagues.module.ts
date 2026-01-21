import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaguesController } from './leagues.controller';
import { LeaguesService } from './leagues.service';
import { League } from './entities/league.entity';
import { BonusPointRule } from './entities/bonus-point-rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([League, BonusPointRule])],
  controllers: [LeaguesController],
  providers: [LeaguesService],
  exports: [LeaguesService],
})
export class LeaguesModule {}
