import jwt from 'jsonwebtoken'
import RefreshTokenModel from '../model/RefreshToken.js'
import env from 'dotenv'
env.config()

class RefreshToken{
    async refreshToken(req, res){
        const {refreshToken} = req.cookies
        if(!refreshToken){
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
}

export default RefreshToken