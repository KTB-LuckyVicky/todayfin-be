import { config } from 'dotenv'
import * as maria from 'mariadb'

config({ path: `.env` })

export const conn = maria.createConnection({
    host: process.env.MARIADB_HOST,
    port: Number(process.env.MARIADB_PORT),
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
})

export const { DB_URI, DB_NAME, NODE_ENV } = process.env

export const PORT = Number.parseInt(process.env.PORT || '5000')

export const SECRET_KEY = process.env.SECRET || 'secret'
