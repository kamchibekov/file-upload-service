import * as dotenv from 'dotenv'
dotenv.config()
import express, { Express } from 'express'
import cors from 'cors'
import apiRoutes from './route/api'
import { AppDataSource } from './data-source'
import responseTime from 'response-time'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

const app: Express = express()

app.use(cors())
app.use(express.json())
app.use(responseTime())

app.use('/api', apiRoutes)

const port = process.env.PORT

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
    })
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err)
  })
