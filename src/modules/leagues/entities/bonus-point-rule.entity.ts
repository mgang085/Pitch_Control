import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Union } from './league.entity';

export enum BonusPointType {
  TRIES_SCORED = 'TRIES_SCORED',
  LOSING_MARGIN = 'LOSING_MARGIN',
  CUSTOM = 'CUSTOM',
}

@Entity('bonus_point_rules')
export class BonusPointRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  leagueId: string; // Column name stays for compatibility

  @ManyToOne(() => Union, (union) => union.bonusPointRules)
  @JoinColumn({ name: 'leagueId' })
  union: Union;

  @Column({
    type: 'enum',
    enum: BonusPointType,
  })
  type: BonusPointType;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  points: number;

  @Column({ type: 'jsonb', nullable: true })
  criteria: {
    minTries?: number;
    maxLosingMargin?: number;
    customCondition?: string;
  };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
