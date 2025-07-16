import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD

  @Column({ type: 'time' })
  time: string; // HH:mm

  @ManyToOne(() => User, user => user.appointments, { eager: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
