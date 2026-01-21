import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Division } from '../../divisions/entities/division.entity';
import { Team } from '../../teams/entities/team.entity';

@Entity('standings')
export class Standing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  divisionId: string;

  @ManyToOne(() => Division)
  @JoinColumn({ name: 'divisionId' })
  division: Division;

  @Column('uuid')
  teamId: string;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column({ type: 'int', default: 0 })
  played: number;

  @Column({ type: 'int', default: 0 })
  won: number;

  @Column({ type: 'int', default: 0 })
  drawn: number;

  @Column({ type: 'int', default: 0 })
  lost: number;

  @Column({ type: 'int', default: 0 })
  pointsFor: number;

  @Column({ type: 'int', default: 0 })
  pointsAgainst: number;

  @Column({ type: 'int', default: 0 })
  pointsDifference: number;

  @Column({ type: 'int', default: 0 })
  triesScored: number;

  @Column({ type: 'int', default: 0 })
  triesConceded: number;

  @Column({ type: 'int', default: 0 })
  bonusPoints: number;

  @Column({ type: 'int', default: 0 })
  penaltyPoints: number;

  @Column({ type: 'int', default: 0 })
  totalPoints: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
