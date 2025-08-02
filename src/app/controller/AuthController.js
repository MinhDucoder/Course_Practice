import { validationResult } from 'express-validator'
import User from '../model/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import refreshTokenModel from '../model/RefreshToken.js'
import { token } from 'morgan'
import env from 'dotenv'
import RefreshToken from '../model/RefreshToken.js'

env.config()
class AuthController {
  /**
   * GET /auth/login
   * Render login form
   */
  showLoginForm(req, res) {
    res.render('auth/login', {
      layout: 'auth',
      title: 'Đăng Nhập',
      data: {},
      errors: []
    });
  }

  /**
   * POST /auth/login
   * Authenticate user and issue JWT
   */
  async login(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).render('auth/login', {
        layout: 'auth',
        title: 'Đăng Nhập',
        errors: errors.array(),
        data: { email: req.body.email }
      })
    }

    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(401).render('auth/login', {
          layout: 'auth',
          title: 'Đăng Nhập',
          errors: [{ msg: 'Email không tồn tại' }],
          data: { email }
        })
      }

      const matched = await bcrypt.compare(password, user.password)
      if (!matched) {
        return res.status(401).render('auth/login', {
          layout: 'auth',
          title: 'Đăng Nhập',
          errors: [{ msg: 'Mật khẩu không chính xác' }],
          data: { email }
        })
      }

      const payload = { id: user._id, name: user.name, email: user.email, roles: user.roles }
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
      const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })

      await refreshTokenModel.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000)
      })

      res.cookie('accessToken', accessToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 3600 * 1000
      })
      res.cookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 3600 * 1000
      })

      return res.redirect('/')
    } catch (err) {
      return next(err)
    }
  }

  /**
   * GET /auth/register
   * Render registration form
   */
  showRegisterForm(req, res) {
    res.render('auth/login', {
      layout: 'auth',
      title: 'Đăng Ký',
      data: {},
      errors: []
    })
  }

  /**
   * POST /auth/register
   * Validate input, create user, and issue JWT
   */
  async register(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).render('auth/login', {
        layout: 'auth',
        title: 'Đăng Ký',
        errors: errors.array(),
        data: { name: req.body.name, email: req.body.email }
      });
    }

    try {
      const { name, email, password } = req.body
      // Check existing
      const exists = await User.exists({ email })
      if (exists) {
        return res.status(409).render('auth/login', {
          layout: 'auth',
          title: 'Đăng Ký',
          errors: [{ msg: 'Email đã được sử dụng' }],
          data: { name, email }
        })
      }

      // Hash password
      const salt = await bcrypt.genSalt(12)
      const hashed = await bcrypt.hash(password, salt)
      const user = new User({ name, email, password: hashed })
      await user.save()

      // Generate JWT
      const payload = { id: user._id, name: user.name, email: user.email, roles: user.roles }
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })

      await refreshTokenModel.create({
        userID: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7*24*3600*1000)
      })

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
      })

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
      })

      return res.redirect('/')
    } catch (err) {
      next(err)
    }
  }

  /**
   * POST /auth/logout
   * Clear JWT cookie
   */
  async logout(req, res) {
    const { refreshToken } = req.cookies
    if(refreshToken){
      await RefreshToken.deleteOne({token: refreshToken})
    }
    res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .redirect('/auth/login')
  }
}

export default AuthController
