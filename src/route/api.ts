import { Router } from 'express'
import * as Auth from '../controller/auth.controller'
import * as File from '../controller/file.controller'
import { oneOf, body, check, param } from 'express-validator'
import { AppDataSource } from '../data-source'
import { User } from '../entity/user.entity'
import { File as FileEntity } from '../entity/file.entity'
import { verifyPassword } from '../repository/user.repository'
import { authenticateToken } from '../middleware/auth.middleware'
import Multer from 'multer'

const router: Router = Router()
const FileUploader: Multer.Multer = Multer({ dest: 'files/' })

router.post(
  '/signup',
  oneOf([body('username').isEmail(), body('username').isMobilePhone('any')]),
  body('username').isLength({ max: 320 }),
  check('username').custom(async (username) => {
    const user = await AppDataSource.getRepository(User).findOneBy({ username })
    if (user) return Promise.reject(`${username} already in use`)
  }),
  body('password').isLength({ min: 6, max: 16 }),
  Auth.signup
)

router.post(
  '/signin',
  oneOf([body('username').isEmail(), body('username').isMobilePhone('any')]),
  body('password').exists(),
  check('username').custom(async (username) => {
    const user = await AppDataSource.getRepository(User).findOneBy({ username })
    if (!user) return Promise.reject(`${username} not found`)
  }),
  check('password').custom(async (password, meta) => {
    const user = await AppDataSource.getRepository(User).findOneBy({
      username: meta.req.body.username,
    })
    if (user && !(await verifyPassword(password, user.password)))
      return Promise.reject(`Password incorrect`)
  }),
  Auth.signin
)

router.post('/signin/new_token', body('token').exists(), Auth.newToken)

router.get('/info', authenticateToken, Auth.info)

router.get('/latency', authenticateToken, Auth.latency)

router.get('/logout', authenticateToken, Auth.logout)

router.post(
  '/file/upload',
  authenticateToken,
  FileUploader.single('file'),
  check('file').custom((file, { req }) => {
    if (!req.file || !req.file.mimetype)
      return Promise.reject(`File is required`)
    return true
  }),
  File.upload
)

router.get(
  '/file/list',
  authenticateToken,
  param('list_size').isNumeric().optional(),
  param('page').isNumeric().optional(),
  File.list
)

router.delete(
  '/file/delete/:id',
  authenticateToken,
  param('id').exists().isNumeric(),
  File.remove
)

router.get(
  '/file/:id',
  authenticateToken,
  param('id').exists().isNumeric(),
  File.get
)

router.get(
  '/file/download/:id',
  authenticateToken,
  param('id').exists().isNumeric(),
  File.download
)

router.put(
  '/file/update/:id',
  authenticateToken,
  param('id').exists().isNumeric(),
  check('id').custom(async (id) => {
    const file = await AppDataSource.getRepository(FileEntity).findOneBy({ id })
    if (!file) return Promise.reject(`id not found`)
  }),
  FileUploader.single('file'),
  check('file').custom((file, { req }) => {
    if (!req.file || !req.file.mimetype)
      return Promise.reject(`File is required`)
    return true
  }),
  File.update
)

export default router
