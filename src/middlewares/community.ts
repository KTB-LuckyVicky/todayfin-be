import { NextFunction, Request, Response } from 'express'
import { conn } from '@/config'

export async function verifyPostAuthor(req: Request, res: Response, next: NextFunction) {
    const row = await (await conn).query('select * from Post where _id=?', req.params.postId)
    req.post = row[0]
    if (req.post.authorId === req.user._id) next()
    else throw new Error('Authorization Error')
}
