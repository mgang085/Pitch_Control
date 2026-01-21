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
import { League } from '../../leagues/entities/league.entity';
import { Team } from '../../teams/entities/team.entity';

@Entity('divisions')
export class Division {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  leagueId: string;

  @ManyToOne(() => League, (league) => league.divisions)
  @JoinColumn({ name: 'leagueId' })
  league: League;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 1 })
  level: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Team, (team) => team.division)
  teams: Team[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
