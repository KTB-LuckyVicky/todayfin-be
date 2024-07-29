import express from 'express'
import http from 'http'
import {logger} from './utils/logger'
import { NODE_ENV, PORT } from './config'

export default class API {
    app: express.Application
    server: http.Server

    constructor() {
        this.app = express()
        this.server = http.createServer(this.app)
    }

    public listen() {
        this.server = this.app.listen(PORT, () => {
            logger.info(`🚀 App listening on the port: ${PORT} ENV: ${NODE_ENV}`)
        })
    }

    public async close(): Promise<void> {
        return new Promise((resolve) => {
            this.server.close(()=> {
                resolve()
            })
        })
    }
}
