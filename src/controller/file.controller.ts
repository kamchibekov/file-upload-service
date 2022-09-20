import { Request, Response } from 'express'
import {
  createOrUpdateFile,
  deleteFile,
  getFile,
  findFiles,
} from '../repository/file.repository'
import { validationResult } from 'express-validator'
import { File } from '../entity/file.entity'

export async function upload(req: Request, res: Response) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return
  }
  try {
    const file = req.file

    await createOrUpdateFile(null, file)

    res.sendStatus(200)
  } catch (e) {
    console.log(e)
    res.sendStatus(500)
  }
}

export async function list(req: Request, res: Response) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return
  }

  const list_size = (req.params.list_size as unknown as number) || 10
  const page = (req.params.page as unknown as number) || 1

  res.json(await findFiles(page, list_size))
}

export async function remove(req: Request, res: Response) {
  const isDeleted = await deleteFile(req.params.id as unknown as number)

  res.sendStatus(isDeleted ? 200 : 400)
}

export async function get(req: Request, res: Response) {
  res.json(await getFile(req.params.id as unknown as number))
}

export async function download(req: Request, res: Response) {
  const file: File | null = await getFile(req.params.id as unknown as number)

  if (!file) return res.sendStatus(400)

  res.download(file.path, file.originalname)
}

export async function update(req: Request, res: Response) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return
  }

  try {
    const file = req.file
    const id: number = req.params.id as unknown as number

    await createOrUpdateFile(id, file)

    res.sendStatus(200)
  } catch (e) {
    console.log(e)
    res.sendStatus(500)
  }
}
