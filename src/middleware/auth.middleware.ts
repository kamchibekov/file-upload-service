import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import Session from '../session.handler'

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization']
  const bearerToken = authHeader && authHeader.split(' ')[1]

  if (!bearerToken) return res.sendStatus(401)

  verify(
    bearerToken,
    process.env.JWT_TOKEN_SECRET as string,
    (err: any, user: any) => {
      // This Session logic is just for testing project.
      // For production we need to create database with black listed tokens to check against
      if (err || Session.isBlackListed(user.username, bearerToken)) {
        console.log(err || 'session expired')
        return res.sendStatus(403)
      }

      req.userId = user.username
      next()
    }
  )
}
