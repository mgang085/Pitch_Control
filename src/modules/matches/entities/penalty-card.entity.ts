import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Match } from './match.entity';
import { Player } from '../../players/entities/player.entity';
import { PenaltyCardType } from '../../../common/enums/penalty-card.enum';

@Entity('penalty_cards')
export class PenaltyCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  matchId: string;

  @ManyToOne(() => Match, (match) => match.penaltyCards)
  @JoinColumn({ name: 'matchId' })
  match: Match;

  @Column('uuid')
  playerId: string;

  @ManyToOne(() => Player, (player) => player.penaltyCards)
  @JoinColumn({ name: 'playerId' })
  player: Player;

  @Column({
    type: 'enum',
    enum: PenaltyCardType,
  })
  cardType: PenaltyCardType;

  @Column({ type: 'int', nullable: true })
  minute: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  issuedAt: Date;

  @Column({ nullable: true })
  issuedBy: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;
}
