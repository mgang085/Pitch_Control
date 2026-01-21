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

@Entity('leagues') // Table name stays 'leagues' for compatibility
export class Union {
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

  @Column({ type: 'int', default: 4 })
  winPoints: number;

  @Column({ type: 'int', default: 2 })
  drawPoints: number;

  @Column({ type: 'int', default: 0 })
  lossPoints: number;

  // Bonus Point Settings
  @Column({ type: 'int', default: 1 })
  bonusPointsForTries: number;

  @Column({ type: 'int', default: 4 })
  minimumTriesForBonus: number;

  @Column({ type: 'int', default: 1 })
  bonusPointsForLosingMargin: number;

  @Column({ type: 'int', default: 7 })
  maximumLosingMarginForBonus: number;

  @OneToMany(() => Division, (division) => division.union)
  divisions: Division[];

  @OneToMany(() => UserLeagueRole, (ulr) => ulr.union)
  userRoles: UserLeagueRole[];

  @OneToMany(() => BonusPointRule, (rule) => rule.union)
  bonusPointRules: BonusPointRule[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
