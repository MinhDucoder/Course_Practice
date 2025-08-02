import express from 'express'
import MeController from '../app/controller/MeController.js';
import upLoadImg from '../app/middlewares/upLoadImg.js';
import multer from 'multer'
const meRoute = express.Router();

const controller = new MeController();

const upload = upLoadImg('avatar')

meRoute.get('/add', controller.addCourse)
meRoute.get('/account', controller.showProfile)
meRoute.get('/store/course', controller.storeCourse)
meRoute.get('/trash/course', controller.trashCourse)
meRoute.post('/upload/avatar', upload.single('avatar')  , controller.uploadAvatar)

export default meRoute;
        