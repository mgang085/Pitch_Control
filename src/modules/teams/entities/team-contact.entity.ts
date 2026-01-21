import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Team } from './team.entity';
import { ContactType } from '../../../common/enums/contact-type.enum';

@Entity('team_contacts')
export class TeamContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  teamId: string;

  @ManyToOne(() => Team, (team) => team.contacts)
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column({
    type: 'enum',
    enum: ContactType,
  })
  type: ContactType;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  alternatePhone: string;

  @Column({ nullable: true })
  emergencyContactName: string;

  @Column({ nullable: true })
  emergencyContactPhone: string;

  @Column({ default: true })
  isPrimary: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
