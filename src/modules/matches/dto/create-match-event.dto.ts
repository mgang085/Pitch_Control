import { IsUUID, IsEnum, IsOptional, IsInt, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MatchEventType } from '../../../common/enums/match-event-type.enum';

export class CreateMatchEventDto {
  @ApiProperty()
  @IsUUID()
  teamId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  playerId?: string;

  @ApiProperty({ enum: MatchEventType })
  @IsEnum(MatchEventType)
  eventType: MatchEventType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  minute?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
