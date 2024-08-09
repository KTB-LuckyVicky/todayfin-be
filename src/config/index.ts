import { config } from 'dotenv'
import * as mysql from 'mysql2/promise'

config({ path: `.env` })

export const conn = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
})

export const { DB_URI, DB_NAME, NODE_ENV } = process.env

export const PORT = Number.parseInt(process.env.PORT || '5000')

export const SECRET_KEY = process.env.SECRET || 'secret'
