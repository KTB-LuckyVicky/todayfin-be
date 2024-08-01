import express from 'express'
import http from 'http'
import { logger, loggerMiddleware } from '@/utils/logger'
import { NODE_ENV, PORT } from '@/config'
import controllers from '@/controllers'
import middlewares from '@/middlewares'
import cors from 'cors'

export default class API {
    app: express.Application
    server: http.Server

    constructor() {
        this.app = express()
        this.setPreMiddleware()
        this.setController()
        this.setPostMiddleware()
    }
    setPreMiddleware() {
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(loggerMiddleware)
    }
    setController() {
        this.app.use('/user', controllers.user)
    }

    setPostMiddleware() {
        this.app.use(middlewares.error)
    }

    public listen() {
        this.server = this.app.listen(PORT, () => {
            logger.info(`🚀 App listening on the port: ${PORT} ENV: ${NODE_ENV}`)
        })
    }

    public async close(): Promise<void> {
        return new Promise(resolve => {
            this.server.close(() => {
                resolve()
            })
        })
    }
}
