import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Value } from './value.entity';

@Entity('attributes')
export class Attribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;  // e.g., "Size", "Color"

  @Column()
  position: number;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Value, value => value.attribute, { cascade: true, eager: true })
  values: Value[];
}