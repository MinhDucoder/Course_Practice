import jwt from 'jsonwebtoken'

const authorizeRoles = function(...allowRoles){
    return (req, res, next) => {
        //neu chua login
        if(!req.user){
            res.status(401).redirect('/auth/login')
        }
        //kiem tra role
        if(!allowRoles.includes(req.user.roles)){        
            if (req.accepts('html')) {
                return res.status(403).render('errors/403', {
                layout: 'main',
                title: 'Bạn không có quyền truy cập'
                });
            }
            return res.status(403).json({ message: 'Forbidden: bạn không có quyền.' });
        }
        //Accept
        next()
    }
}


export default authorizeRoles