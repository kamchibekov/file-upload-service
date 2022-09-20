import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Index({ unique: true })
  @Column()
  username!: string

  @Column()
  password!: string
}
