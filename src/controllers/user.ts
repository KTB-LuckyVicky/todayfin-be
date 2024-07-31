import express, { Router, Request, Response } from 'express'
import { conn } from '@/config'
import asyncify from 'asyncify-express'

const router: Router = asyncify(express.Router())

router.get('/healthcheck', async (req: Request, res: Response) => {
    return res.status(200)
})

router.post('/signup', async (req: Request, res: Response) => {
    const params = [req.body.oauthProvider, req.body.oauthId, req.body.nickname, req.body.name, req.body.password, req.body.category]
    try {
        ;(await conn).query('insert into User (oauthProvider, oauthId, nickname, name, passwd, category)', params)
    } catch (error) {
        throw new Error('SignUp is failed')
    }
    res.status(200)
})
// TODO : 나머지 기능 추가
/*
router.post('/signin', async (req: Request, res: Response) => {
    const params = [req.body.oauthId, req.body.passwd]
    try {
        ;(await conn).query('insert into User (oauthProvider, oauthId, nickname, name, passwd, category)', params)
    } catch (error) {
        throw new Error('SignUp is failed')
    }
    res.status(200)
})

router.get('/detail', async (req: Request, res: Response) => {
    const params = req.body.oauthId
    try {
        ;(await conn).query('select * from User')
    } catch (error) {
        throw new Error('SignUp is failed')
    }
    res.status(200)
})
*/
export default router
