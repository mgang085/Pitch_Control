import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Division } from '../../divisions/entities/division.entity';
import { UserLeagueRole } from '../../users/entities/user-league-role.entity';
import { BonusPointRule } from './bonus-point-rule.entity';

@Entity('leagues')
export class League {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'date', nullable: true })
  seasonStart: Date;

  @Column({ type: 'date', nullable: true })
  seasonEnd: Date;

  @OneToMany(() => Division, (division) => division.league)
  divisions: Division[];

  @OneToMany(() => UserLeagueRole, (ulr) => ulr.league)
  userRoles: UserLeagueRole[];

  @OneToMany(() => BonusPointRule, (rule) => rule.league)
  bonusPointRules: BonusPointRule[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
