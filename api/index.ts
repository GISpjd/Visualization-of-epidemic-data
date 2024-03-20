import express, { Express, Router, Request, Response, NextFunction } from 'express'
import axios from 'axios'

const app: Express = express();

//解决跨域问题
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
})
const router: Router = express.Router();
app.use('/api', router)

router.get('/list', async (req: Request, res: Response) => {
    const result = await axios.get('https://c.m.163.com/ug/api/wuhan/app/data/list-total?t=342166027082')
    res.json({
        // data: result.data
        //根据数据结构提前解构
        ...result.data.data
    })
})

app.listen(3333, () => {
    console.log('success server http://localhost:3333')
})