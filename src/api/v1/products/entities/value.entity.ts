import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { Attribute } from './attribute.entity';
import { ProductCombination } from './product-combination.entity';

@Entity('values')
export class Value {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: string;  // e.g., "S", "Red"

  @Column({ nullable: true })
  color: string;  // For color attributes

  @Column()
  position: number;

  @ManyToOne(() => Attribute, attribute => attribute.values)
  attribute: Attribute;

  @ManyToMany(() => ProductCombination, combination => combination.attributeValues)
  combinations: ProductCombination[];
}