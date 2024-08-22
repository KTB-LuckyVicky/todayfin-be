import express, { Router, Request, Response } from 'express'
import { conn } from '@/config'
import jwt from 'jsonwebtoken'
import { verifyUser } from '@/middlewares/user'
import crypto from 'crypto'

const router: Router = express.Router()

const createSalt = async () => {
    return crypto.randomBytes(32).toString('base64')
}
const createHashPasswd = async (password: string, salt: string) => {
    const hash = crypto.pbkdf2Sync(password, salt, 10169, 32, 'sha512')
    return hash.toString('base64')
}

router.get('/healthcheck', async (req: Request, res: Response) => {
    return res.status(200).send('ok')
})

router.post('/signup', async (req: Request, res: Response) => {
    const salt = await createSalt()
    const hash = await createHashPasswd(req.body.password, salt)
    const category = JSON.stringify(req.body.category)
    const params = [req.body.oauthProvider, req.body.oauthId, req.body.nickname, req.body.name, hash, salt, category]
    try {
        ;(await conn).query(
            'insert into User (oauthProvider, oauthId, nickname, name, password, salt, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
            params,
        )
    } catch (error) {
        throw new Error('SignUp is failed')
    }
    res.sendStatus(201)
})

router.post('/signin', async (req: Request, res: Response) => {
    const row = await (await conn).query('select * from User where oauthId=?', [req.body.oauthId])
    if (row != null) {
        const user = row[0]
        const salt = user.salt
        const storedHash = user.password

        const inputHash = await createHashPasswd(req.body.password, salt)
        if (inputHash === storedHash) {
            const token = jwt.sign({ oauthId: user.oauthId }, 'secret', { expiresIn: '1h' })
            res.status(200).json({ jwt: token })
        } else {
            res.sendStatus(401)
        }
    } else {
        throw new Error('Can not find user')
    }
})

router.get('/detail', verifyUser, async (req: Request, res: Response) => {
    res.status(200).json({
        oauthId: req.user.oauthId,
        nickname: req.user.nickname,
        name: req.user.name,
        category: req.user.category,
    })
})

router.put('/detail', verifyUser, async (req: Request, res: Response) => {
    const hash = await createHashPasswd(req.body.password, req.user.salt)
    const category = JSON.stringify(req.body.category)
    const params = [req.body.nickname, hash, category, req.user._id]
    try {
        ;(await conn).query('update User set nickname=?, password=?, category=? where _id=?', params)
    } catch (err) {
        throw new Error('User update fail')
    }
    res.sendStatus(204)
})

export default router
