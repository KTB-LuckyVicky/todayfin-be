import express from 'express'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { logger, loggerMiddleware } from '@/utils/logger'
import { NODE_ENV, PORT } from '@/config'
import controllers from '@/controllers'
import middlewares from '@/middlewares'
import cors from 'cors'
import { ChatModel } from '@/models'

export default class API {
    app: express.Application
    server: https.Server
    io: SocketIOServer

    constructor() {
        this.app = express()
        this.server = http.createServer(this.app)
        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: 'https://todayfin.site',
                methods: ['GET', 'POST'],
            },
        })
        this.setPreMiddleware()
        this.setController()
        this.setPostMiddleware()
        this.setupSocketIO()
    }

    setPreMiddleware() {
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(loggerMiddleware)
    }

    setController() {
        this.app.use('/user', controllers.user)
        this.app.use('/community', controllers.community)
        this.app.use('/news', controllers.news)
    }

    setPostMiddleware() {
        this.app.use(middlewares.error)
    }

    setupSocketIO() {
        this.io.on('connection', socket => {
            logger.info('socket connected')

            socket.on('joinChat', async newsId => {
                socket.join(newsId)
                logger.info(`Socket joined room: ${newsId}`)

                const messages = await ChatModel.find({ newsId }).sort({ createdAt: 1 })
                socket.emit('messageList', messages)
            })

            socket.on('message', async msg => {
                const { authorId, newsId, content, createdAt } = msg
                const chatMessage = new ChatModel({
                    authorId,
                    newsId,
                    content,
                    createdAt,
                })
                await chatMessage.save()
                logger.info(`Message received in room ${newsId}: ${content}`)
                this.io.to(newsId).emit('message', content)
            })

            socket.on('disconnect', () => {
                logger.info('socket disconnected')
            })
        })
    }

    public listen() {
        this.server.listen(PORT, () => {
            logger.info(`🚀 App listening on the port: ${PORT} ENV: ${NODE_ENV}`)
        })
    }

    public async close(): Promise<void> {
        return new Promise(resolve => {
            this.io.close(() => {
                logger.info('socket server close')
            })
            this.server.close(() => {
                resolve()
            })
        })
    }
}
