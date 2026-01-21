import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StandingsService } from './standings.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('standings')
@Controller('standings')
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) {}

  @Get('division/:divisionId')
  @Public()
  @ApiOperation({ summary: 'Get standings for a division' })
  getStandings(@Param('divisionId') divisionId: string) {
    return this.standingsService.getStandings(divisionId);
  }

  @Post('division/:divisionId/calculate')
  @Public()
  @ApiOperation({ summary: 'Recalculate standings for a division' })
  calculateStandings(@Param('divisionId') divisionId: string) {
    return this.standingsService.calculateStandings(divisionId);
  }
}
