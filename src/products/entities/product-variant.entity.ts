import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';

export enum Size {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, product => product.variants, { onDelete: 'CASCADE' })
  product: Product;

  @Column({
    type: 'enum',
    enum: Size,
  })
  size: Size;

  @Column()
  color: string;

  @Column('int')
  stockQuantity: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  variantPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
