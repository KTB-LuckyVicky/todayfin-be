import mongoose from 'mongoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { getModelForClass, prop } from '@typegoose/typegoose'
import { User, News } from '@/models'

export class Chat extends TimeStamps {
    public _id: mongoose.Types.ObjectId

    @prop({ required: true, ref: User })
    public authorId: number

    @prop({ required: true, ref: News })
    public newsId: mongoose.Types.ObjectId

    @prop({ required: true })
    public content: string

    @prop()
    public createdAt: Date
}

export const ChatModel = getModelForClass(Chat)
