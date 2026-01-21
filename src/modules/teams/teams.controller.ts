import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiBody } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { UpdateTeamInfoDto } from './dto/update-team-info.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TeamRolesGuard } from '../../common/guards/team-roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LEAGUE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new team' })
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  @Public()
  @ApiQuery({ name: 'divisionId', required: false })
  @ApiOperation({ summary: 'Get all teams' })
  findAll(@Query('divisionId') divisionId?: string) {
    return this.teamsService.findAll(divisionId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get team by ID' })
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Put(':id/info')
  @UseGuards(JwtAuthGuard, TeamRolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update team information (by team officers or admin)' })
  updateInfo(@Param('id') id: string, @Body() updateTeamInfoDto: UpdateTeamInfoDto) {
    return this.teamsService.updateInfo(id, updateTeamInfoDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LEAGUE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update team (admin only - includes division/union)' })
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Post(':id/officers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LEAGUE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign a user to a team role (admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', format: 'uuid' },
        role: { type: 'string', enum: ['PRESIDENT', 'COACH', 'MATCH_SECRETARY'] },
      },
      required: ['userId', 'role'],
    },
  })
  assignOfficer(
    @Param('id') teamId: string,
    @Body('userId') userId: string,
    @Body('role') role: Role,
  ) {
    return this.teamsService.assignOfficer(teamId, userId, role);
  }

  @Delete(':id/officers/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LEAGUE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a user from a team role (admin only)' })
  removeOfficer(@Param('id') teamId: string, @Param('userId') userId: string) {
    return this.teamsService.removeOfficer(teamId, userId);
  }

  @Get(':id/officers')
  @Public()
  @ApiOperation({ summary: 'Get all officers for a team' })
  getTeamOfficers(@Param('id') teamId: string) {
    return this.teamsService.getTeamOfficers(teamId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LEAGUE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete team' })
  remove(@Param('id') id: string) {
    return this.teamsService.remove(id);
  }
}
