import { config } from 'dotenv'
import * as mysql from 'mysql2/promise'

config({ path: `.env` })

const password = process.env.PASSWORD

export const pool = mysql.createPool( {
    host: "localhost",
    port: 3306,
    user: "root",
    password: password,
    database: "TodayFin",
})

export const { DB_URI, DB_NAME, NODE_ENV } = process.env

export const PORT = Number.parseInt(process.env.PORT || '5000')
