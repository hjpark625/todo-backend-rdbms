export class AuthDto {
  userId!: number;
  email!: string;
  username!: string;
  password!: string;
  hashedPassword!: string;
  registeredAt!: Date;
  updatedAt!: Date | null;
}
