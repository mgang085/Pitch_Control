import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Union } from '../../leagues/entities/league.entity';
import { Role } from '../../../common/enums/role.enum';

@Entity('user_league_roles') // Table name stays for compatibility
export class UserLeagueRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.leagueRoles)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid', { nullable: true })
  leagueId?: string; // Column name stays for compatibility

  @ManyToOne(() => Union, (union) => union.userRoles, { nullable: true })
  @JoinColumn({ name: 'leagueId' })
  union?: Union;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.SPECTATOR,
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;
}
