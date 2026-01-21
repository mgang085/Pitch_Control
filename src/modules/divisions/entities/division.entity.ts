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
import { Union } from '../../leagues/entities/league.entity';
import { Team } from '../../teams/entities/team.entity';
import { DivisionType } from '../../../common/enums/division-type.enum';

@Entity('divisions')
export class Division {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  leagueId: string; // Column name stays for compatibility

  @ManyToOne(() => Union, (union) => union.divisions)
  @JoinColumn({ name: 'leagueId' })
  union: Union;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: DivisionType,
    nullable: true,
  })
  type: DivisionType;

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
