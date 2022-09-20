import { Request, Response } from 'express'
import { sign, verify } from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import { createUser } from '../repository/user.repository'

// Just for example project. For production need to use databases like redis or others
import Session from '../session.handler'

export async function signup(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return
  }

  try {
    const { username, password } = req.body
    await createUser({ username, password })

    const accessToken = sign(
      { username },
      process.env.JWT_TOKEN_SECRET as string,
      {
        expiresIn: '600s',
      }
    )
    const refreshToken = sign(
      { username },
      process.env.JWT_TOKEN_SECRET as string
    )

    Session.set(username, accessToken, refreshToken)

    res.status(200).json({
      accessToken,
      refreshToken,
    })
  } catch (e) {
    console.log(e)
    res.sendStatus(500)
  }
}

export function signin(req: Request, res: Response): void {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return
  }

  const { username } = req.body

  const accessToken = sign(
    { username },
    process.env.JWT_TOKEN_SECRET as string,
    {
      expiresIn: '600s',
    }
  )
  const refreshToken = sign(
    { username },
    process.env.JWT_REFRESH_TOKEN as string
  )

  Session.set(username, accessToken, refreshToken)

  res.status(200).json({
    accessToken,
    refreshToken,
  })
}

export function newToken(req: Request, res: Response) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { token } = req.body

  if (!Session.tokenExists(token)) return res.sendStatus(403)

  verify(
    token,
    process.env.JWT_REFRESH_TOKEN as string,
    (err: any, user: any) => {
      if (err) {
        console.log(err)
        return res.sendStatus(403)
      }

      const accessToken = sign(
        { username: user.username },
        process.env.JWT_TOKEN_SECRET as string,
        {
          expiresIn: '600s',
        }
      )

      Session.set(user.username, accessToken, token)

      res.status(200).json({
        accessToken,
      })
    }
  )
}

export async function info(req: Request, res: Response) {
  res.status(200).json({ username: req.userId })
}

export function latency(req: Request, res: Response) {}

export function logout(req: Request, res: Response) {
  if (req.userId) Session.remove(req.userId)

  res.sendStatus(204)
}
