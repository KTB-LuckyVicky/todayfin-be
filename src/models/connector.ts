import mongoose from 'mongoose'
import {DB_URI, DB_NAME, pool} from "../config";
import { logger} from "../utils/logger";

export async function connect() {
    try {
        await mongoose.connect(DB_URI, {dbName: DB_NAME})
        const connection = await pool.getConnection()
        connection.release()
        logger.info(`successfully connect DB`)
    } catch (err) {
        throw new Error('DB connection error')
    }
}

export async function close() {
    try {
        await mongoose.connection.close(false)
        await pool.end()
        logger.info(`successfully close DB`)
    } catch (err) {
        throw new Error('DB closing error')
    }
}