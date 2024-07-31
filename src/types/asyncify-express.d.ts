// src/types/asyncify-express.d.ts
declare module 'asyncify-express' {
    import { Router } from 'express'

    function asyncify(router: Router): Router
    export default asyncify
}
