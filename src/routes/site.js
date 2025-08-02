import Express from 'express'
import SiteController from '../app/controller/SiteController.js'

const siteController = new SiteController()
const siteRoute = Express.Router()

siteRoute.get('/', siteController.index)

export default siteRoute