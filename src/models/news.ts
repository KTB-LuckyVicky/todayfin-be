import mongoose, { PaginateOptions } from 'mongoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { getModelForClass, prop, ReturnModelType, plugin } from '@typegoose/typegoose'
import mongoosePaginate from 'mongoose-paginate-v2'

@plugin(mongoosePaginate)
export class News extends TimeStamps {
    static paginate: mongoose.PaginateModel<typeof News>['paginate']

    public _id: mongoose.Types.ObjectId

    @prop()
    public title: string

    @prop()
    public title_trans: string // 제목 번역

    @prop()
    public category: string // 카테고리

    @prop()
    public article: string //원문

    @prop()
    public article_trans: string

    @prop()
    public url: string

    @prop()
    public urlToImage: string // 기사 사진

    @prop()
    public publishedAt: string

    @prop()
    public source: string // 신문사 or Google News

    @prop()
    public author: string // 기자 or 신문사

    @prop()
    public embedding: object // 임베딩 벡터

    public toJSON(): object {
        return {
            _id: this._id,
            title: this.title,
            title_trans: this.title_trans,
            category: this.category,
            article: this.article,
            article_trans: this.article_trans,
            url: this.url,
            urlToImage: this.urlToImage,
            publishedAt: this.publishedAt,
            source: this.source,
            author: this.author,
            embedding: this.embedding,
        }
    }3

    public static async findById(this: ReturnModelType<typeof News>, newsId: string): Promise<News> {
        const news = await this.findOne({ _id: newsId })
        if (news) {
            return news
        } else {
            throw new Error('NewsNotFound')
        }
    }

    public static async findByDate(
        this: ReturnModelType<typeof News>,
        date: string,
        page: number,
        limit: number,
    ): Promise<mongoose.PaginateResult<mongoose.PaginateDocument<News, object, PaginateOptions>>> {
        return await this.paginate(
            { publishedAt: { $regex: `^${date}` } },
            {
                page: page,
                limit: limit,
            },
        )
    }

    public static async findByDateAndCategory(
        this: ReturnModelType<typeof News>,
        date: string,
        category: string,
        page: number,
        limit: number,
    ): Promise<mongoose.PaginateResult<mongoose.PaginateDocument<News, object, PaginateOptions>>> {
        return await this.paginate(
            { publishedAt: { $regex: `^${date}` }, category: category },
            {
                page: page,
                limit: limit,
            },
        )
    }
}

export const NewsModel = getModelForClass(News, {
    schemaOptions: {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
})
