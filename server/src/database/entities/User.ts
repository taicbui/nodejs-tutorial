import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity() // Decorator indicating this class is a database entity
export class User {
  @PrimaryGeneratedColumn() // Decorator for auto-incrementing primary key column
  id: number;

  @Column() // Decorator for a regular column
  firstName: string;

  @Column() // Decorator for a regular column
  lastName: string;

  @Column() // Decorator for a regular column
  age: number;

  @Column() // Decorator for a regular column
  username: string;

  @Column() // Decorator for a regular column
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
