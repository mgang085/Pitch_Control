import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Match } from './match.entity';
import { Team } from '../../teams/entities/team.entity';
import { Player } from '../../players/entities/player.entity';
import { MatchEventType } from '../../../common/enums/match-event-type.enum';

@Entity('match_events')
export class MatchEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  matchId: string;

  @ManyToOne(() => Match, (match) => match.events)
  @JoinColumn({ name: 'matchId' })
  match: Match;

  @Column('uuid')
  teamId: string;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column('uuid', { nullable: true })
  playerId: string;

  @ManyToOne(() => Player, (player) => player.matchEvents)
  @JoinColumn({ name: 'playerId' })
  player: Player;

  @Column({
    type: 'enum',
    enum: MatchEventType,
  })
  eventType: MatchEventType;

  @Column({ type: 'int' })
  points: number;

  @Column({ type: 'int', nullable: true })
  minute: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  eventTime: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}
