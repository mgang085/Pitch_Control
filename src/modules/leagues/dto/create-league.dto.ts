import { IsString, IsOptional, IsDateString, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLeagueDto {
  @ApiProperty({ example: 'National Rugby League' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Premier rugby league competition' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  seasonStart?: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  seasonEnd?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 4, default: 4 })
  @IsOptional()
  @IsInt()
  @Min(0)
  winPoints?: number;

  @ApiPropertyOptional({ example: 2, default: 2 })
  @IsOptional()
  @IsInt()
  @Min(0)
  drawPoints?: number;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  lossPoints?: number;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  bonusPointsForTries?: number;

  @ApiPropertyOptional({ example: 4, default: 4 })
  @IsOptional()
  @IsInt()
  @Min(1)
  minimumTriesForBonus?: number;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  bonusPointsForLosingMargin?: number;

  @ApiPropertyOptional({ example: 7, default: 7 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maximumLosingMarginForBonus?: number;
}
