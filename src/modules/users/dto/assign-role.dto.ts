import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../../common/enums/role.enum';

export class AssignRoleDto {
  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsOptional()
  @IsUUID()
  leagueId?: string;

  @ApiProperty({ example: 'LEAGUE_ADMIN', enum: Role })
  @IsEnum(Role)
  role: Role;
}
