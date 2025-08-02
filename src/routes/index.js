import newsRouter from './news.js'
import siteRoute   from './site.js'
import courseRoute from './course.js'
import meRoute from './me.js'
import authRoute from './auth.js'
import authorizeRoles from '../app/middlewares/authorizeRoles.js'

function route(app) {
  app.use('/auth', authRoute)
  app.use('/site',   siteRoute);
  app.use('/me', authorizeRoles('admin'), meRoute)
  app.use('/course', authorizeRoles('admin'), courseRoute)
  app.use('/',       siteRoute)
}

export default route;
