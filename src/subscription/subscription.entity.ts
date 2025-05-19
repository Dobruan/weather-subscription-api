import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    city: string;

    @Column({ type: 'enum', enum: ['hourly', 'daily'] })
    frequency: 'hourly' | 'daily';

    @Column({ default: false })
    confirmed: boolean;

    @Column({ nullable: true })
    confirmationToken?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastSentAt?: Date;
}
