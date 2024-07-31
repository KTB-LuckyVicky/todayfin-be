import express from 'express'
import http from 'http'
import { logger } from '@/utils/logger'
import { NODE_ENV, PORT } from '@/config'
import controllers from '@/controllers'
import cors from 'cors'

export default class API {
    app: express.Application
    server: http.Server

    constructor() {
        this.app = express()
        //this.server = http.createServer(this.app)
        this.setController()
        this.setPreMiddleware()
    }
    setPreMiddleware() {
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
    }
    setController() {
        this.app.use('/user', controllers.user)
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
