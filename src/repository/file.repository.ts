import { File } from '../entity/file.entity'
import { AppDataSource } from '../data-source'
import { unlink } from 'node:fs/promises'

export async function createOrUpdateFile(id: number | null, fileData: any) {
  let file: File = new File()

  if (id) {
    file = (await AppDataSource.getRepository(File).findOneBy({
      id,
    })) as File

    await unlink(file.path)
  }

  file.originalname = fileData.originalname
  file.filename = fileData.filename
  file.path = fileData.path
  file.extension = fileData.mimetype.split('/')[1]
  file.mime_type = fileData.mimetype
  file.size = fileData.size
  await AppDataSource.getRepository(File).save(file)
}

export async function deleteFile(id: number): Promise<boolean> {
  const file: File | null = await AppDataSource.getRepository(File).findOneBy({
    id,
  })

  if (!file) return false
  await unlink(file.path)

  await AppDataSource.getRepository(File).remove(file)

  return true
}

export async function getFile(id: number): Promise<File | null> {
  return await AppDataSource.getRepository(File).findOneBy({
    id,
  })
}

export async function findFiles(
  page: number,
  offset: number
): Promise<[File[], number]> {
  return await AppDataSource.getRepository(File).findAndCount({
    take: offset,
    skip: offset * (page - 1),
  })
}
