import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { TeamContact } from './entities/team-contact.entity';
import { UserTeamRole } from './entities/user-team-role.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { UpdateTeamInfoDto } from './dto/update-team-info.dto';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(TeamContact)
    private readonly teamContactRepository: Repository<TeamContact>,
    @InjectRepository(UserTeamRole)
    private readonly userTeamRoleRepository: Repository<UserTeamRole>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const team = this.teamRepository.create(createTeamDto);
    return this.teamRepository.save(team);
  }

  async findAll(divisionId?: string): Promise<Team[]> {
    const where = divisionId ? { divisionId } : {};
    return this.teamRepository.find({
      where,
      relations: ['union', 'division', 'contacts', 'players'],
    });
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['union', 'division', 'contacts', 'players'],
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);
    Object.assign(team, updateTeamDto);
    return this.teamRepository.save(team);
  }

  async remove(id: string): Promise<void> {
    const team = await this.findOne(id);
    await this.teamRepository.remove(team);
  }

  /**
   * Update team information (excluding division/union assignment).
   * Used by team officers (President, Coach, Secretary).
   */
  async updateInfo(id: string, updateTeamInfoDto: UpdateTeamInfoDto): Promise<Team> {
    const team = await this.findOne(id);
    Object.assign(team, updateTeamInfoDto);
    return this.teamRepository.save(team);
  }

  /**
   * Assign a user to a team role (President, Coach, Match Secretary).
   * Only LEAGUE_ADMIN should call this.
   */
  async assignOfficer(teamId: string, userId: string, role: Role): Promise<UserTeamRole> {
    // Validate team exists
    await this.findOne(teamId);

    // Validate role is a team-level role
    const validRoles = [Role.PRESIDENT, Role.COACH, Role.MATCH_SECRETARY];
    if (!validRoles.includes(role)) {
      throw new BadRequestException(`Invalid team role: ${role}. Must be PRESIDENT, COACH, or MATCH_SECRETARY.`);
    }

    // Check if user already has a role for this team
    const existingRole = await this.userTeamRoleRepository.findOne({
      where: { userId, teamId },
    });

    if (existingRole) {
      // Update existing role
      existingRole.role = role;
      return this.userTeamRoleRepository.save(existingRole);
    }

    // Create new role assignment
    const userTeamRole = this.userTeamRoleRepository.create({
      userId,
      teamId,
      role,
    });

    return this.userTeamRoleRepository.save(userTeamRole);
  }

  /**
   * Remove a user's role from a team.
   */
  async removeOfficer(teamId: string, userId: string): Promise<void> {
    const userTeamRole = await this.userTeamRoleRepository.findOne({
      where: { userId, teamId },
    });

    if (!userTeamRole) {
      throw new NotFoundException(`User ${userId} has no role assigned for team ${teamId}`);
    }

    await this.userTeamRoleRepository.remove(userTeamRole);
  }

  /**
   * Get all officers for a specific team.
   */
  async getTeamOfficers(teamId: string): Promise<UserTeamRole[]> {
    return this.userTeamRoleRepository.find({
      where: { teamId },
      relations: ['user'],
    });
  }
}
