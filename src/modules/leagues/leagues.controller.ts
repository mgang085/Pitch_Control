import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LeaguesService } from './leagues.service';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('leagues')
@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LEAGUE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new league (Admin only)' })
  create(@Body() createLeagueDto: CreateLeagueDto) {
    return this.leaguesService.create(createLeagueDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all leagues' })
  findAll() {
    return this.leaguesService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get league by ID' })
  findOne(@Param('id') id: string) {
    return this.leaguesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LEAGUE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update league (Admin only)' })
  update(@Param('id') id: string, @Body() updateLeagueDto: UpdateLeagueDto) {
    return this.leaguesService.update(id, updateLeagueDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LEAGUE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete league (Admin only)' })
  remove(@Param('id') id: string) {
    return this.leaguesService.remove(id);
  }
}
