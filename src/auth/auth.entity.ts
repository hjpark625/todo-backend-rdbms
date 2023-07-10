import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AuthDto } from '@/dto/auth.dto';

@Entity()
export class Auth extends AuthDto {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  hashedPassword: string;

  @CreateDateColumn({ type: 'timestamp' })
  registeredAt: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  updatedAt: Date | null;
}
