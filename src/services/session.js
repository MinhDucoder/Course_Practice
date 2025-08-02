
import dotenv from 'dotenv'
import session from 'express-session'
import Sequelize from 'sequelize'
import connectSessionSequelize from 'connect-session-sequelize'

dotenv.config()

const configSession = (app) => {
    const SequelizeStore = connectSessionSequelize(session.Store)

    const sequelize = new Sequelize(
        process.env.DB_SQL_NAME,
        process.env.DB_SQL_USERNAME,
        process.env.DB_SQL_PASSWORD,
        {
            host: process.env.DB_SQL_HOST || 'localhost',
            dialect: 'mysql',
            logging: false,
        }
    )

    const sessionStore = new SequelizeStore({
        db: sequelize,
    })

    app.use(
        session({
            secret: process.env.SESSION_SECRET || 'keyboard cat',
            resave: false,
            saveUninitialized: false,
            store: sessionStore,
            cookie: {
                maxAge: 24 * 60 * 60 * 1000 
            }
        })
    )

    // Sync session table nếu chưa tồn tại
    sessionStore.sync()
}

export default configSession
