import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bike } from './bike.entity';
import { User } from './user.entity';

@Entity()
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fromDate: Date;

  @Column()
  toDate: Date;

  @Column({ default: 'Active' })
  status: string;

  @Column({ default: false })
  hasRated: boolean;

  @Column({ default: 0 })
  rating: number;

  @ManyToOne((type) => User, (user) => user.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @ManyToOne((type) => Bike, (bike) => bike.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  bike: Bike;
}
