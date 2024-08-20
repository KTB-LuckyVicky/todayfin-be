import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

export class User extends TimeStamps {
    public _id: number

    public oauthProvider: string

    public oauthId: string

    public nickname: string

    public name: string

    public password: string

    public salt: string

    public log: JSON

    public category: JSON
}
