import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { conn, SECRET_KEY } from '@/config'
import { userJWTPayload } from '@/types/user'

export async function verifyUser(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')

    if (!token.startsWith('Bearer ')) {
        throw new Error('not bearer token')
    }

    try {
        const jwt = token.split(' ')[1]
        const payload = verify(jwt, SECRET_KEY) as userJWTPayload
        const row = await (await conn).query('select * from User where oauthId=?', payload.oauthId)
        req.user = row[0]
        next()
    } catch (error) {
        throw new Error('middleware error')
    }
}
