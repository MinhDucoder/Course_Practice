import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import User from '../app/model/User.js'
import bcrypt from 'bcrypt'

export default function configPassport() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'username',    
        passwordField: 'password', 
        session: false             
      },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ email: username })
          if (!user) {
            return done(null, false, { message: 'Email không tồn tại' })
          }
          const match = await bcrypt.compare(password, user.password)
          if (!match) {
            return done(null, false, { message: 'Mật khẩu không chính xác' })
          }
          // nếu thành công, trả về user
          return done(null, user)
        } catch (err) {
          return done(err)
        }
      }
    )
  )
}
