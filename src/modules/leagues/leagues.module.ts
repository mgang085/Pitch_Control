import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaguesController } from './leagues.controller';
import { LeaguesService } from './leagues.service';
import { Union } from './entities/league.entity';
import { BonusPointRule } from './entities/bonus-point-rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Union, BonusPointRule])],
  controllers: [LeaguesController],
  providers: [LeaguesService],
  exports: [LeaguesService],
})
export class LeaguesModule {}
