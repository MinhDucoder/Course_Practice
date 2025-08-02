import jwt from 'jsonwebtoken' 
import dotenv from 'dotenv'
import RefreshTokenModel from '../model/RefreshToken.js' 
dotenv.config()

export default async function checkToken(req, res, next) {
  // 1. Bypass login/register: dùng req.path cho chuẩn
  const path = req.path.toLowerCase();
  if (path === '/auth/login' || path === '/auth/register') {
    return next();
  }

  // 2. Lấy token từ header Authorization: "Bearer <token>"
  const token = req.cookies?.accessToken
            || req.headers.authorization?.split(' ')[1]
  const refreshToken = req.cookies?.refreshToken
  if (!token) {
    if(!refreshToken){
      console.log('No refreshToken found')
      return res.status(401).render('errors/401')
    }

    const stored = await RefreshTokenModel.findOne({token: refreshToken})
    if(!stored){
        return res.status(401).render('errors/401')
    }
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET)

        const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn : '15m'})
        const newRefreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn : '7d'})

        res.cookies('accessToken', newAccessToken,{
            httpOnly: true, maxAge: 15*60*100
        })
        res.cookies('refreshToken', newRefreshToken,{
            httpOnly: true, maxAge: 7*24*3600*1000
        })
    } catch (error) {
        console.log(error)
        return res.status(401).render('errors/401')
    }
  }

  try {
    // 3. Verify token
    const jwtObject = jwt.verify(token, process.env.JWT_SECRET);
    // 4. Kiểm tra hết hạn
    const isExpired = Date.now() >= jwtObject.exp * 1000;
    if (isExpired) {
      return res.status(401).json({ message: 'Token is expired' });
    }

    // 5. Gán thông tin user vào req, nếu cần
    req.user = jwtObject;
    return next();

  } catch (err) {
    
  }
}
