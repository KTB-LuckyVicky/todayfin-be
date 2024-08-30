import * as db from './models/connector'
import API from './api'
import { logger } from './utils/logger'
import { Server } from 'socket.io'
import * as http from 'http'
import { ChatModel } from '@/models'
import mongoose from 'mongoose'
;(async () => {
    await db.connect()
    const api = new API()
    const server = http.createServer(api.app)
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000', // 프론트엔드 주소
            methods: ['GET', 'POST'],
            credentials: true,
        },
    })

    api.listen()
    server.listen(5001, () => {
        logger.info(`Http server is running on port 5001`)
    })

    io.on('connection', socket => {
        logger.info('socket connected')

        socket.on('joinChat', async newsId => {
            socket.join(newsId)
            logger.info(`Socket joined room: ${newsId}`)
            console.log(newsId)
            const newsObjectId = new mongoose.Types.ObjectId(newsId)

            const messages = await ChatModel.find({ newsObjectId }).sort({ createdAt: 1 })
            socket.emit('messageList', messages)
        })

        socket.on('message', async msg => {
            const { authorId, newsId, content, createdAt } = msg
            console.log(newsId)
            const newsObjectId = new mongoose.Types.ObjectId(newsId)
            console.log(newsObjectId)
            const chatMessage = new ChatModel({
                authorId,
                newsId,
                content,
                createdAt,
            })
            await chatMessage.save()
            logger.info(`Message received in room ${newsId}: ${content}`)
            io.to(newsId).emit('message', content)
        })

        socket.on('disconnect', () => {
            logger.info('socket disconnected')
        })
    })

    async function shutdown() {
        logger.info('gracefully shutdown')
        await Promise.all([api.close, server.close()])

        io.close(() => {
            logger.info('socket.io server closed')
        })
        await db.close()
        logger.info('shutdown complete')
        process.exit()
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
})()
