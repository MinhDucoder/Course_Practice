// src/app/controller/MeController.js
import Course from '../model/Course.js'
import mongoose from 'mongoose'
import CourseRepository from '../repository/Course.js'
import User from '../model/User.js'

class MeController {

  storeCourse(req, res, next){
    Promise.all([Course.find().sortable(req).lean(), Course.countDocumentsDeleted()])
            .then( ([course, deletedCount]) => {
              res.render('me/store-course',{
                deletedCount,
                course
              })
            })
            .catch( () => {})
  }
  trashCourse(req, res, next){
    Course.findDeleted().lean()
               .then(course => {
                    res.render('me/trash-course', {course})
                })
                .catch(next)
  }

  async addCourse(req, res, next) {
    try {
      const count = await CourseRepository.generateCourse(1000);
      // bạn có thể flash message: đã tạo x course
      // rồi redirect về trang quản lý khóa học
      return res.redirect('/me/store/course');
    } catch (error) {
      // ghi log để debug
      console.error('Seed error:', error);
      // báo lỗi cho client hoặc render trang lỗi
      return next(error);
    }
  }

  //GET : /me/profile
  async showProfile(req, res, next) {
    const userId = new mongoose.Types.ObjectId(req.user.id)
    try {
      const userProfile = await User.findById(userId).lean();
      if (!userProfile) {
        return res.status(404).send('User not found');
      }
      res.render('me/account', { user: userProfile });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return next(error);
    }
  }

  //GET : /me/account
  async showFormResetPassword(req, res, next) {
    res.send('hello')
  }

  //POST : /me/upload/avatar
  uploadAvatar(req, res) {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file được gửi." });
    }
    const avatarPath = `/uploads/avatar/${req.file.filename}`;
    res.render('me/account', { avatarPath });
  }


}

export default  MeController
