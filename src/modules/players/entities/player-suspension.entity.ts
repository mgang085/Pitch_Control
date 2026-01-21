import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Player } from './player.entity';
import { PenaltyCard } from '../../matches/entities/penalty-card.entity';

@Entity('player_suspensions')
export class PlayerSuspension {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  playerId: string;

  @ManyToOne(() => Player, (player) => player.suspensions)
  @JoinColumn({ name: 'playerId' })
  player: Player;

  @Column('uuid', { nullable: true })
  penaltyCardId: string;

  @ManyToOne(() => PenaltyCard)
  @JoinColumn({ name: 'penaltyCardId' })
  penaltyCard: PenaltyCard;

  @Column({ type: 'int' })
  matchesSuspended: number;

  @Column({ type: 'int', default: 0 })
  matchesServed: number;

  @Column({ type: 'date' })
  suspensionStart: Date;

  @Column({ type: 'date', nullable: true })
  suspensionEnd: Date;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ default: false })
  isServed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
