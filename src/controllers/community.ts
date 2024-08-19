import express, { Router, Request, Response } from 'express'
import { conn } from '@/config'
import { verifyPostAuthor } from '@/middlewares/community'
import { verifyUser } from '@/middlewares/user'

const router: Router = express.Router()

router.use(verifyUser)

router.post('/', async (req: Request, res: Response) => {
    const params = [req.body.title, req.body.content, req.user._id]
    try {
        ;(await conn).query('insert into Post (title, content, authorId) values (?, ?, ?)', params)
    } catch (err) {
        throw new Error('Post fail')
    }
    res.sendStatus(204)
})

router.get('/', async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.size || 20)
    const offset = (page - 1) * limit
    const posts = await (await conn).query('select * from Post limit ? offset ?', [limit, offset])

    res.status(200).json({
        posts: posts,
        meta: {
            page,
            limit,
        },
    })
})

router.get('/:postId', async (req: Request, res: Response) => {
    const post = await (await conn).query('select * from Post where _id = ?', req.params.postId)
    res.json(post[0])
})

router.put('/:postId', verifyPostAuthor, async (req: Request, res: Response) => {
    const params = [req.body.title, req.body.content, req.params.postId]
    try {
        ;(await conn).query('update Post set title=?, content=? where _id=?', params)
    } catch (error) {
        throw new Error('Post update fail')
    }
    res.sendStatus(204)
})

router.delete('/:postId', verifyPostAuthor, async (req: Request, res: Response) => {
    try {
        ;(await conn).query('delete from Post where _id=?', req.post._id)
    } catch (error) {
        throw new Error('Delete fail')
    }
    res.sendStatus(200)
})

export default router
