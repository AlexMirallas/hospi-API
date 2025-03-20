import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AttributeValue } from './attribute-value.entity';

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

  @OneToMany(() => AttributeValue, value => value.attribute)
  values: AttributeValue[];
}