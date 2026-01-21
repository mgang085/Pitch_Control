import { IsString, IsOptional, IsUUID, IsInt, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DivisionType } from '../../../common/enums/division-type.enum';

export class CreateDivisionDto {
  @ApiProperty()
  @IsUUID()
  leagueId: string;

  @ApiProperty({ example: 'Premier Division' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ enum: DivisionType, example: DivisionType.MENS })
  @IsOptional()
  @IsEnum(DivisionType)
  type?: DivisionType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  level?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
