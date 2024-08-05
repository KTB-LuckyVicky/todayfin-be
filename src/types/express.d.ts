import { User } from '@/models/user'
import { Community } from '@/models/community'

declare global {
    namespace Express {
        interface Request {
            _routeWhitelists: { body: string[] }
            _routeBlacklists: { body: string[] }
            user: User
            post: Community
        }
        interface Response {
            meta: {
                requestId: string
                path?: string
                method?: string
                error?: Error
            }
        }
    }
}