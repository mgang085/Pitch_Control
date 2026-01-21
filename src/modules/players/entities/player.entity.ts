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
import { MatchEvent } from '../../matches/entities/match-event.entity';
import { PenaltyCard } from '../../matches/entities/penalty-card.entity';
import { PlayerSuspension } from './player-suspension.entity';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  teamId: string;

  @ManyToOne(() => Team, (team) => team.players)
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  jerseyNumber: number;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  emergencyContactName: string;

  @Column({ nullable: true })
  emergencyContactPhone: string;

  @Column({ nullable: true })
  emergencyContactRelation: string;

  @Column({ nullable: true })
  position: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => MatchEvent, (event) => event.player)
  matchEvents: MatchEvent[];

  @OneToMany(() => PenaltyCard, (card) => card.player)
  penaltyCards: PenaltyCard[];

  @OneToMany(() => PlayerSuspension, (suspension) => suspension.player)
  suspensions: PlayerSuspension[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
