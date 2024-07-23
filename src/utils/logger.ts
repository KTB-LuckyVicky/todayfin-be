import winston from 'winston'
import winstonDaily from 'winston-daily-rotate-file'
import join from 'path'
import {existsSync, mkdirSync} from 'fs'
// import expressWinston from 'express-winston'

const logDir: string = join(__dirname,'../../logs') // 경로 할당

if(!existsSync(logDir)){ //logs 디렉토리 존재하지 않을 경우 생성
    mkdirSync(logDir)
}

/*
    Log Level
    error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
*/

const winstonOption = {
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.prettyPrint(),
    ),
    transport: [
        new winstonDaily({ //error 레벨 로그
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: '%DATE%.error.log',
            maxFiles: 90,
            json: false,
        }),
        new winstonDaily({ //
            level: 'debug',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: '%DATE%.error.log',
            maxFiles: 90,
            json: false,
        }),
        new winston.transports.Console(),
    ],
}

//TODO: 이 부분 더 알아오기
/*
const loggerMiddleware = expressWinston.logger({
    ...winstonOption,
    requestWhitelist: ['headers.origin', 'body', 'query'],
    responseWhitelist: ['body', 'statusCode'],
    bodyBlacklist: ['password', 'clientSecret', 'token', 'jwt', 'jwtPayload'],
    headerBlacklist: ['authorization'],
    ignoreRoute: function (req, res) {
        return false
    },
    level: function (req, res) {
        if (res.statusCode >= 500) {
            return 'error'
        } else if (res.statusCode >= 400) {
            return 'warn'
        }
        return 'info'
    },
    meta: true,
    dynamicMeta: function (req, res) {
        return res.meta
    },
})
 */

export const logger = winston.createLogger(winstonOption)
