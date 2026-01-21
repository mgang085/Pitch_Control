import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Team } from './team.entity';
import { Role } from '../../../common/enums/role.enum';

@Entity('user_team_roles')
export class UserTeamRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.teamRoles)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid')
  teamId: string;

  @ManyToOne(() => Team, (team) => team.userRoles)
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;
}
