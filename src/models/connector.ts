import mongoose from 'mongoose'
import { DB_URI, DB_NAME, conn } from '@/config'
import { logger } from '@/utils/logger'

export async function connect() {
    try {
        await mongoose.connect(DB_URI!, { dbName: DB_NAME })
        logger.info(`successfully connect MongoDB. DB_NAME=${DB_NAME}`)
    } catch (err) {
        throw new Error('DB connection error')
    }
    try {
        const connection = await conn
        logger.info(`Successfully connect MySQL DB.`)
    } catch (err) {
        throw new Error('MySQL DB connection failed')
    }
}

export async function close() {
    try {
        await mongoose.connection.close(false)
        logger.info(`successfully close DB`)
    } catch (err) {
        throw new Error('DB closing error')
    }
}
