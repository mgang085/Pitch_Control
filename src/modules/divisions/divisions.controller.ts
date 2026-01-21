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
import { DivisionsService } from './divisions.service';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('divisions')
@Controller('divisions')
export class DivisionsController {
  constructor(private readonly divisionsService: DivisionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LEAGUE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new division' })
  create(@Body() createDivisionDto: CreateDivisionDto) {
    return this.divisionsService.create(createDivisionDto);
  }

  @Get()
  @Public()
  @ApiQuery({ name: 'leagueId', required: false })
  @ApiOperation({ summary: 'Get all divisions, optionally filtered by league' })
  findAll(@Query('leagueId') leagueId?: string) {
    return this.divisionsService.findAll(leagueId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get division by ID' })
  findOne(@Param('id') id: string) {
    return this.divisionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LEAGUE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update division' })
  update(@Param('id') id: string, @Body() updateDivisionDto: UpdateDivisionDto) {
    return this.divisionsService.update(id, updateDivisionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LEAGUE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete division' })
  remove(@Param('id') id: string) {
    return this.divisionsService.remove(id);
  }
}
