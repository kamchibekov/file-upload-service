import { DataSource } from 'typeorm'
import { User } from './entity/user.entity'
import { File } from './entity/file.entity'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, File],
  logging: false,
  synchronize: true,
})
