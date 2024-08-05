import { NextFunction, Request, Response } from 'express'
import { conn } from '@/config'
import { Community } from '@/models/community'

export async function verifyPostAuthor(req: Request, res: Response, next: NextFunction) {
    try {
        const [rows] = await (await conn).query('select * from Post where authorId=?', req.user._id)
        const posts: Community[] = rows as Community[]
        req.post = posts[0]
        next()
    } catch (error) {
        throw new Error('middleware error')
    }
}
