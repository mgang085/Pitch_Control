import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Team } from '../../teams/entities/team.entity';
import { Division } from '../../divisions/entities/division.entity';
import { MatchEvent } from './match-event.entity';
import { PenaltyCard } from './penalty-card.entity';
import { MatchStatus } from '../../../common/enums/match-status.enum';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  divisionId: string;

  @ManyToOne(() => Division)
  @JoinColumn({ name: 'divisionId' })
  division: Division;

  @Column('uuid')
  homeTeamId: string;

  @ManyToOne(() => Team, (team) => team.homeMatches)
  @JoinColumn({ name: 'homeTeamId' })
  homeTeam: Team;

  @Column('uuid')
  awayTeamId: string;

  @ManyToOne(() => Team, (team) => team.awayMatches)
  @JoinColumn({ name: 'awayTeamId' })
  awayTeam: Team;

  @Column({ type: 'timestamp' })
  scheduledTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualStartTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualEndTime: Date;

  @Column({ nullable: true })
  venue: string;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.SCHEDULED,
  })
  status: MatchStatus;

  @Column({ type: 'int', default: 0 })
  homeScore: number;

  @Column({ type: 'int', default: 0 })
  awayScore: number;

  @Column({ type: 'int', default: 0 })
  homeTries: number;

  @Column({ type: 'int', default: 0 })
  awayTries: number;

  @Column({ type: 'int', default: 0 })
  homeBonusPoints: number;

  @Column({ type: 'int', default: 0 })
  awayBonusPoints: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  refereeId: string;

  @OneToMany(() => MatchEvent, (event) => event.match)
  events: MatchEvent[];

  @OneToMany(() => PenaltyCard, (card) => card.match)
  penaltyCards: PenaltyCard[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
