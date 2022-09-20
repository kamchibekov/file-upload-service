import { User } from '../entity/user.entity'
import crypto from 'crypto'
import { AppDataSource } from '../data-source'

interface IUser {
  username: string
  password: string
}

export async function createUser(user: IUser) {
  const newUser = new User()
  newUser.username = user.username
  newUser.password = await hashPassword(user.password)
  await AppDataSource.getRepository(User).save(newUser)
}

async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(8).toString('hex')

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err.message)
      resolve(salt + ':' + derivedKey.toString('hex'))
    })
  })
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean | string> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':')
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err.message)
      resolve(key == derivedKey.toString('hex'))
    })
  })
}
