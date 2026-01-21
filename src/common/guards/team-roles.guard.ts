import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../enums/role.enum';
import { UserTeamRole } from '../../modules/teams/entities/user-team-role.entity';

/**
 * Guard that checks if a user has permission to access/edit a specific team.
 * Allows:
 * - LEAGUE_ADMIN (can access any team)
 * - Users with team-specific roles (PRESIDENT, COACH, MATCH_SECRETARY) for the specific team
 */
@Injectable()
export class TeamRolesGuard implements CanActivate {
  constructor(
    @InjectRepository(UserTeamRole)
    private readonly userTeamRoleRepository: Repository<UserTeamRole>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const teamId = request.params.id; // Team ID from route parameter

    if (!user || !teamId) {
      return false;
    }

    // League admins can edit any team
    if (user.roles?.includes(Role.LEAGUE_ADMIN)) {
      return true;
    }

    // Check if user has a team-specific role for this team
    const userTeamRole = await this.userTeamRoleRepository.findOne({
      where: {
        userId: user.id,
        teamId: teamId,
      },
    });

    if (!userTeamRole) {
      return false;
    }

    // Allow PRESIDENT, COACH, or MATCH_SECRETARY
    const allowedRoles = [Role.PRESIDENT, Role.COACH, Role.MATCH_SECRETARY];
    return allowedRoles.includes(userTeamRole.role);
  }
}
