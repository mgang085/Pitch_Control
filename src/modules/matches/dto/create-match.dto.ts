import { IsUUID, IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty()
  @IsUUID()
  divisionId: string;

  @ApiProperty()
  @IsUUID()
  homeTeamId: string;

  @ApiProperty()
  @IsUUID()
  awayTeamId: string;

  @ApiProperty()
  @IsDateString()
  scheduledTime: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  venue?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
