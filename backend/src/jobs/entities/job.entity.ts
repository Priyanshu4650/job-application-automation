import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ApplicationStatus {
  NOT_APPLIED = 'not_applied',
  SAVED = 'saved',
  APPLIED = 'applied',
  REJECTED = 'rejected',
  INTERVIEW = 'interview',
}

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column()
  location: string;

  @Column()
  linkedinUrl: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.NOT_APPLIED,
  })
  status: ApplicationStatus;

  @Column({ default: false })
  isEasyApply: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}