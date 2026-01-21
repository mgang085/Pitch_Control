import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { League } from '../../leagues/entities/league.entity';
import { Role } from '../../../common/enums/role.enum';

@Entity('user_league_roles')
export class UserLeagueRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.leagueRoles)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid', { nullable: true })
  leagueId: string;

  @ManyToOne(() => League, (league) => league.userRoles)
  @JoinColumn({ name: 'leagueId' })
  league: League;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.SPECTATOR,
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;
}
