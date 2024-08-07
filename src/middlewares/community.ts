import { NextFunction, Request, Response } from 'express'
import { conn } from '@/config'
import { Community } from '@/models/community'

export async function verifyPostAuthor(req: Request, res: Response, next: NextFunction) {
    const [rows] = await (await conn).query('select * from Post where _id=?', req.params.postId)
    const posts: Community[] = rows as Community[]
    req.post = posts[0]
    if (req.post.authorId === req.user._id) next()
    else throw new Error('Authorization Error')
}
