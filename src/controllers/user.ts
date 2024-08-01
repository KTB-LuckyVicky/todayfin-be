import express, { Router, Request, Response, NextFunction } from 'express'
import { conn } from '@/config'
import asyncify from 'asyncify-express'
import jwt from 'jsonwebtoken'
import { verifyUser } from '@/middlewares/user'

const router: Router = asyncify(express.Router())

router.get('/healthcheck', async (req: Request, res: Response) => {
    return res.status(200).send('ok')
})

router.post('/signup', async (req: Request, res: Response) => {
    const params = [req.body.oauthProvider, req.body.oauthId, req.body.nickname, req.body.name, req.body.password]
    // TODO: 비밀번호 암호화
    try {
        ;(await conn).query('insert into User (oauthProvider, oauthId, nickname, name, password) VALUES (?, ?, ?, ?, ?)', params)
    } catch (error) {
        throw new Error('SignUp is failed')
    }
    res.status(201).send('ok')
})

router.post('/signin', async (req: Request, res: Response) => {
    const params = [req.body.oauthId, req.body.password]
    try {
        const [row] = await (await conn).query('select * from User where oauthId=? and password=?', params)
        if (row != null) {
            const user = row[0]
            const token = jwt.sign({ oauthId: user.oauthId }, 'secret', { expiresIn: '1h' })
            res.status(200).json({ jwt: token })
        } else {
            throw new Error('Can not find user')
        }
    } catch (error) {
        throw new Error('SignUp is failed')
    }
    res.status(200)
})

router.get('/detail', verifyUser, async (req: Request, res: Response) => {
    res.status(200).json({
        oauthId: req.user.oauthId,
        nickname: req.user.nickname,
        name: req.user.name,
        password: req.user.password,
    })
})

router.put('/detail', verifyUser, async (req: Request, res: Response) => {
    const params = [req.body.nickname, req.body.password]
    try {
        ;(await conn).query('update User set nickname=?, password=?', params)
    } catch (err) {
        throw new Error('User update fail')
    }
    res.status(200).json({
        oauthProvider: req.user.oauthProvider,
        oauthId: req.user.oauthId,
        nickname: req.user.nickname,
        name: req.user.name,
        password: req.user.password,
    })
})

export default router
