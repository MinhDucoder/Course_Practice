import express from 'express'
import AuthController from '../app/controller/AuthController.js'
import passport from 'passport'
import RefreshToken from  '../app/controller/TokenController.js'

const refreshController = new RefreshToken()

const authRoute = express.Router()
const controller = new AuthController()

authRoute.get('/login', controller.showLoginForm)
authRoute.post('/login', controller.login)
authRoute.get('/register', controller.showRegisterForm)
authRoute.post('/register', controller.register)

authRoute.post('/token/refresh', refreshController.refreshToken)

authRoute.get('/logout', controller.logout)



export default authRoute