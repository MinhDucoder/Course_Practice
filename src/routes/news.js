import Express from 'express'
import NewsController from '../app/controller/NewsController.js'

const newsRouter = Express.Router()
const newController = new NewsController()

newsRouter.get('/', newController.index)

export default newsRouter