import mongoose from 'mongoose'
import { DB_URI, DB_NAME } from '@/config'
import { logger } from '@/utils/logger'

export async function connect() {
    try {
        await mongoose.connect(DB_URI!, { dbName: DB_NAME })
        logger.info(`successfully connect MongoDB. DB_NAME=${DB_NAME}`)
    } catch (err) {
        throw new Error('DB connection error')
    }
}

export async function close() {
    try {
        await mongoose.connection.close(false)
        logger.info(`successfully close MongoDB connection. DB_NAME=${DB_NAME}`)
    } catch (err) {
        throw new Error('DB closing error')
    }
}
