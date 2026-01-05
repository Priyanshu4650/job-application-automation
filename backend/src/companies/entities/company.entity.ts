import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum AtsType {
  GREENHOUSE = 'greenhouse',
  LEVER = 'lever',
  WORKDAY = 'workday',
  CUSTOM = 'custom',
  UNKNOWN = 'unknown',
}

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  careerPageUrl: string;

  @Column({
    type: 'enum',
    enum: AtsType,
    default: AtsType.UNKNOWN,
  })
  atsType: AtsType;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;
}