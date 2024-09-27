import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

export class Community extends TimeStamps {
    public _id: number

    public title: string

    public content: string

    public createdAt: Date

    public updatedAt: Date

    public authorId: number
}
