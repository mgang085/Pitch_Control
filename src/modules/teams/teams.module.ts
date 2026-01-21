import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { Team } from './entities/team.entity';
import { TeamContact } from './entities/team-contact.entity';
import { UserTeamRole } from './entities/user-team-role.entity';
import { Division } from '../divisions/entities/division.entity';
import { TeamRolesGuard } from '../../common/guards/team-roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Team, TeamContact, UserTeamRole, Division])],
  controllers: [TeamsController],
  providers: [TeamsService, TeamRolesGuard],
  exports: [TeamsService],
})
export class TeamsModule {}
