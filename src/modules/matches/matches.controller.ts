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
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { CreateMatchEventDto } from './dto/create-match-event.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LEAGUE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new match' })
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

  @Get()
  @Public()
  @ApiQuery({ name: 'divisionId', required: false })
  @ApiOperation({ summary: 'Get all matches' })
  findAll(@Query('divisionId') divisionId?: string) {
    return this.matchesService.findAll(divisionId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get match by ID with events and cards' })
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LEAGUE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update match' })
  update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchesService.update(id, updateMatchDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LEAGUE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete match' })
  remove(@Param('id') id: string) {
    return this.matchesService.remove(id);
  }

  @Post(':id/start')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.REFEREE, Role.HEAD_OFFICIAL, Role.LEAGUE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start match (Referee only)' })
  startMatch(@Param('id') id: string) {
    return this.matchesService.startMatch(id);
  }

  @Post(':id/end')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.REFEREE, Role.HEAD_OFFICIAL, Role.LEAGUE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'End match (Referee only)' })
  endMatch(@Param('id') id: string) {
    return this.matchesService.endMatch(id);
  }

  @Post(':id/events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.REFEREE, Role.HEAD_OFFICIAL, Role.LEAGUE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Record a scoring event (Referee only)' })
  recordEvent(@Param('id') id: string, @Body() createEventDto: CreateMatchEventDto) {
    return this.matchesService.recordEvent(id, createEventDto);
  }
}
