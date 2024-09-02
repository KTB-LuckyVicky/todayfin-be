import 'reflect-metadata'
import express, { Router, Request, Response } from 'express'
import { NewsModel } from '@/models/news'
import { verifyUser } from '@/middlewares/user'
import { conn } from '@/config'

const router: Router = express.Router()

router.post('/date', async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.size || 6)
    const date = req.body.date
    const result = await NewsModel.findByDate(date, page, limit)

    const newsResult = result.docs.map(news => ({ ...news.toJSON() }))
    res.status(200).json({
        news: newsResult,
        page: {
            totalDocs: result.totalDocs,
            totalPages: result.totalPages,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            page: result.page,
            limit: result.limit,
        },
    })
})

router.get('/:newsId', verifyUser, async (req: Request, res: Response) => {
    const news = await NewsModel.findById(req.params.newsId)
    const params = [req.params.newsId, req.params.newsId, req.params.newsId, req.user._id]

    ;(await conn).query(
        "UPDATE User SET log = IF(log IS NULL, JSON_ARRAY(?), IF(JSON_SEARCH(log, 'one', ?) IS NULL, JSON_ARRAY_APPEND(log, '$', ?), log)) WHERE _id = ?",
        params,
    )
    res.status(200).json({
        _id: news._id,
        title: news.title,
        title_trans: news.title_trans,
        category: news.category,
        article: news.article,
        article_trans: news.article_trans,
        url: news.url,
        urlToImage: news.urlToImage,
        publishedAt: news.publishedAt,
        source: news.source,
        author: news.author,
        embedding: news.embedding,
    })
})

router.post('/date/:category', async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.size || 6)
    const date = req.body.date
    const category = req.params.category
    const result = await NewsModel.findByDateAndCategory(date, category, page, limit)

    const newsResult = result.docs.map(news => ({ ...news.toJSON() }))
    res.status(200).json({
        news: newsResult,
        page: {
            totalDocs: result.totalDocs,
            totalPages: result.totalPages,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            page: result.page,
            limit: result.limit,
        },
    })
})

router.get('/:newsId/article', verifyUser, async (req: Request, res: Response) => {
    const news = await NewsModel.findById(req.params.newsId)
    res.status(200).json({
        article: news.article,
    })
})

export default router
