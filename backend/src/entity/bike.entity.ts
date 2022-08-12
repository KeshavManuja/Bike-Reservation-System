import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity()
export class Bike extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column({ default: 0 })
  rating: number;

  @Column()
  location: string;

  @Column()
  isAvailable: boolean;

  @OneToMany((type) => Reservation, (reservation) => reservation.bike)
  reservations: Reservation[];
}
