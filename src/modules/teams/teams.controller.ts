import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PRESIDENT, Role.LEAGUE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update team' })
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(id, updateTeamDto);
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
