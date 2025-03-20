import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, Index } from 'typeorm';
import { Product } from './product.entity';
import { AttributeValue } from './attribute-value.entity';

@Entity('product_combinations')
@Index(['product', 'reference'], { unique: true })
export class ProductCombination {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  reference: string;  // SKU

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  impactOnPrice: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => Product, product => product.combinations)
  product: Product;

  @ManyToMany(() => AttributeValue, value => value.combinations)
  @JoinTable({
    name: 'combination_attribute_values',
    joinColumn: { name: 'combination_id' },
    inverseJoinColumn: { name: 'attribute_value_id' }
  })
  attributeValues: AttributeValue[];
}