import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  originalname!: string

  @Column()
  filename!: string

  @Column()
  path!: string

  @Column()
  extension!: string

  @Column()
  mime_type!: string

  @Column()
  size!: string

  @UpdateDateColumn()
  uploaded_date!: string
}
